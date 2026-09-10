'use client';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';

interface TicketCreationProps {
  onTicketCreated?: (ticketId: number) => void;
  onCancel?: () => void;
}

export default function TicketCreation({ onTicketCreated, onCancel }: TicketCreationProps) {
  const { user, accessToken } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    if (!user?.id) {
      setMessage('You must be logged in to create a ticket');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/support/create-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Ticket created successfully!');
        setFormData({ subject: '', message: '' });
        if (onTicketCreated && data.ticketId) {
          onTicketCreated(data.ticketId);
        }
      } else {
        setMessage(data.error || 'Failed to create ticket');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-[#121528] rounded-lg p-4 sm:p-6 md:p-6 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-6 md:flex-nowrap">
        <h2 className="text-xl sm:text-2xl font-bold text-white min-w-0">Create Support Ticket</h2>
        {onCancel && (
          <button onClick={onCancel} className="inline-flex items-center justify-center text-sm text-gray-400 hover:text-white underline min-h-[44px] md:min-h-0">
            Cancel
          </button>
        )}
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded text-[13px] sm:text-base ${
            message.includes('successfully') ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-3 py-3 md:py-2 bg-gray-700 border border-gray-600 rounded-md text-base md:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description of the issue"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-3 md:py-2 bg-gray-700 border border-gray-600 rounded-md text-base md:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Please provide detailed information about your issue..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 min-h-[48px] md:min-h-0 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isSubmitting ? 'Creating Ticket...' : 'Create Ticket'}
        </button>
      </form>
    </div>
  );
}
