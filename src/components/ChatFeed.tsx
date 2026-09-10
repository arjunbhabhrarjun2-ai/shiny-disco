'use client';
import { useState, useEffect, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface Message {
  id: number;
  ticketId: number;
  sender: 'user' | 'admin';
  message: string;
  createdAt: string;
}

interface Ticket {
  id: number;
  username: string;
  email: string;
  subject: string;
  problem: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatFeedProps {
  ticketId: number;
}

export default function ChatFeed({ ticketId }: ChatFeedProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/support/get-messages?ticketId=${ticketId}`);
      const data = await response.json();
      if (response.ok) {
        setMessages(data.messages);
        setTicket(data.ticket);
      }
    } catch (error) {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/support/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, sender: 'user', message: newMessage.trim() }),
      });
      if (response.ok) {
        setNewMessage('');
        await fetchMessages();
      }
    } catch (error) {
      // ignore
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    intervalRef.current = setInterval(fetchMessages, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [ticketId]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 gap-2">
        <AiOutlineLoading3Quarters className="animate-spin" style={{ color: '#3B82F6' }} size={18} />
        <span className="text-sm" style={{ color: '#9CA3AF' }}>Loading chat...</span>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm" style={{ color: '#F43F5E' }}>Ticket not found</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-[70vh] min-h-[420px] md:h-[520px] md:min-h-0"
    >
      {/* Ticket info */}
      <div
        className="pb-4 mb-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h4 className="text-[15px] md:text-sm font-medium text-white mb-1 md:mb-0.5 break-words">{ticket.subject}</h4>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 md:gap-2">
          <span className="text-xs" style={{ color: '#6B7280' }}>Ticket #{ticket.id}</span>
          <span className="text-xs" style={{ color: '#4B5563' }}>·</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={
              ticket.status === 'Open'
                ? { background: 'rgba(16,185,129,0.1)', color: '#10B981' }
                : ticket.status === 'Resolved'
                  ? { background: 'rgba(59,130,246,0.1)', color: '#60A5FA' }
                  : { background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }
            }
          >
            {ticket.status}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
        {messages.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm" style={{ color: '#6B7280' }}>
              No messages yet. Start the conversation.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[85%] sm:max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl min-w-0 break-words"
                style={
                  message.sender === 'user'
                    ? { background: '#3B82F6', borderRadius: '16px 16px 4px 16px' }
                    : { background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px 16px 16px 4px' }
                }
              >
                <p className="text-[15px] md:text-sm text-white leading-relaxed whitespace-pre-wrap break-words">
                  {message.message}
                </p>
                <p
                  className="text-[11px] md:text-xs mt-1.5 md:mt-1"
                  style={{ color: message.sender === 'user' ? 'rgba(255,255,255,0.6)' : '#4B5563' }}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2 flex-shrink-0">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={isSending}
          className="flex-1 min-w-0 px-4 py-2.5 min-h-[44px] md:min-h-0 text-base md:text-sm transition-all duration-200"
          style={{
            background: '#111827',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            color: '#F9FAFB',
            outline: 'none',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        />
        <button
          type="submit"
          disabled={isSending || !newMessage.trim()}
          className="btn-primary px-4 py-2.5 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 rounded-lg text-white flex items-center justify-center"
          style={{ opacity: (isSending || !newMessage.trim()) ? 0.5 : 1, cursor: (isSending || !newMessage.trim()) ? 'not-allowed' : 'pointer' }}
        >
          {isSending
            ? <AiOutlineLoading3Quarters className="animate-spin" size={14} />
            : <FaPaperPlane size={13} />
          }
        </button>
      </form>
    </div>
  );
}
