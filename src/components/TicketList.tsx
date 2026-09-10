'use client';
import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface Ticket {
  id: number;
  subject: string;
  status: 'open' | 'closed';
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  hasUnread: boolean;
  lastMessage: {
    sender: 'user' | 'admin';
    content: string;
    timestamp: string;
  } | null;
}

interface TicketListProps {
  onTicketSelect: (ticketId: number) => void;
  activeTicketId: number | null;
  refreshTrigger?: number;
}

export default function TicketList({ onTicketSelect, activeTicketId, refreshTrigger }: TicketListProps) {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');

  const fetchTickets = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`/api/support/get-tickets?userId=${user.id}`);
      const data = await response.json();
      if (response.ok) setTickets(data.tickets);
    } catch (error) {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseTicket = async (ticketId: number) => {
    try {
      const response = await fetch(`/api/support/${ticketId}/close`, { method: 'PATCH' });
      if (response.ok) await fetchTickets();
    } catch (error) { /* ignore */ }
  };

  const handleReopenTicket = async (ticketId: number) => {
    try {
      const response = await fetch(`/api/support/${ticketId}/reopen`, { method: 'PATCH' });
      if (response.ok) await fetchTickets();
    } catch (error) { /* ignore */ }
  };

  useEffect(() => { fetchTickets(); }, [user?.id, refreshTrigger]);

  const filteredTickets = tickets.filter((t) => filter === 'all' || t.status === filter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 gap-2">
        <AiOutlineLoading3Quarters className="animate-spin" style={{ color: '#3B82F6' }} size={16} />
        <span className="text-sm" style={{ color: '#9CA3AF' }}>Loading tickets...</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#0D1421', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <h2
          className="text-sm font-semibold text-white mb-3"
          style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
        >
          Support Tickets
        </h2>
        <div className="flex flex-wrap gap-2 md:gap-1.5">
          {(['all', 'open', 'closed'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className="flex-1 md:flex-initial inline-flex items-center justify-center px-4 md:px-3 py-2 md:py-1 min-h-[44px] md:min-h-0 rounded-full text-[13px] md:text-xs font-medium transition-all duration-200 capitalize"
              style={
                filter === filterType
                  ? { background: '#3B82F6', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.05)', color: '#6B7280' }
              }
            >
              {filterType}
              {filterType !== 'all' && (
                <span className="ml-1">({tickets.filter((t) => t.status === filterType).length})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[60vh] md:max-h-96 overflow-y-auto">
        {filteredTickets.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm" style={{ color: '#6B7280' }}>
              {filter === 'all' ? 'No support tickets yet.' : `No ${filter} tickets.`}
            </p>
          </div>
        ) : (
          <div>
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 cursor-pointer transition-all duration-150"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  background: activeTicketId === ticket.id
                    ? 'rgba(59,130,246,0.06)'
                    : 'transparent',
                  borderLeft: activeTicketId === ticket.id ? '2px solid #3B82F6' : '2px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (activeTicketId !== ticket.id)
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)';
                }}
                onMouseLeave={(e) => {
                  if (activeTicketId !== ticket.id)
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
                onClick={() => onTicketSelect(ticket.id)}
              >
                <div className="flex flex-col gap-2 mb-2 md:flex-row md:items-start md:justify-between md:gap-0">
                  <div className="flex-1 min-w-0 mr-0 md:mr-3">
                    <h3 className="text-[15px] md:text-sm text-white font-medium break-words md:truncate">{ticket.subject}</h3>
                    <p className="text-[12px] md:text-xs mt-0.5" style={{ color: '#6B7280' }}>
                      #{ticket.id} · {ticket.messageCount} messages
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      className="px-2 py-1 md:py-0.5 rounded-full text-[11px] md:text-xs font-medium"
                      style={
                        ticket.status === 'open'
                          ? { background: 'rgba(16,185,129,0.1)', color: '#10B981' }
                          : { background: 'rgba(255,255,255,0.06)', color: '#6B7280' }
                      }
                    >
                      {ticket.status}
                    </span>
                    {ticket.hasUnread && (
                      <div className="w-2 h-2 rounded-full" style={{ background: '#3B82F6' }} />
                    )}
                  </div>
                </div>

                {ticket.lastMessage && (
                  <p className="text-[12px] md:text-xs truncate mb-2" style={{ color: '#6B7280' }}>
                    {ticket.lastMessage.sender === 'user' ? 'You' : 'Support'}:{' '}
                    {ticket.lastMessage.content}
                  </p>
                )}

                <div className="flex justify-between items-center gap-2">
                  <span className="text-[12px] md:text-xs" style={{ color: '#4B5563' }}>
                    {new Date(ticket.updatedAt).toLocaleDateString()}
                  </span>
                  {ticket.status === 'open' ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCloseTicket(ticket.id); }}
                      className="inline-flex items-center justify-center text-[13px] md:text-xs transition-colors duration-200 min-h-[44px] px-3 -mr-1 rounded-lg md:min-h-0 md:px-0 md:mr-0"
                      style={{ color: '#F43F5E' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#FB7185'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#F43F5E'; }}
                    >
                      Close
                    </button>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleReopenTicket(ticket.id); }}
                      className="inline-flex items-center justify-center text-[13px] md:text-xs transition-colors duration-200 min-h-[44px] px-3 -mr-1 rounded-lg md:min-h-0 md:px-0 md:mr-0"
                      style={{ color: '#60A5FA' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#93C5FD'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#60A5FA'; }}
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
