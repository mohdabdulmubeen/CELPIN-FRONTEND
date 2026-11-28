import React, { useState } from 'react';
import { X, Mail, Send, ExternalLink } from 'lucide-react';

interface ContactMailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TO_EMAIL = 'contact@celpin.in';

export const ContactMailModal: React.FC<ContactMailModalProps> = ({ isOpen, onClose }) => {
  const [fromEmail, setFromEmail] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const buildGmailUrl = () => {
    const subject = ticketSubject.trim() || 'Support Ticket';
    const bodyLines = [
      fromEmail.trim() ? `From: ${fromEmail.trim()}` : '',
      '',
      ticketMessage.trim()
    ]
      .filter((line, idx) => idx !== 0 || line !== '')
      .join('\n');

    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      TO_EMAIL
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines)}`;
  };

  const buildMailtoUrl = () => {
    const subject = ticketSubject.trim() || 'Support Ticket';
    const body = `${fromEmail.trim() ? `From: ${fromEmail.trim()}\n\n` : ''}${ticketMessage.trim()}`;
    return `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleGmailClick = () => {
    setError('');
    setTimeout(() => onClose(), 150);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-mail-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card text-foreground shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h3 id="contact-mail-modal-title" className="text-base font-bold text-foreground">
                Send a Ticket
              </h3>
              <p className="text-xs text-muted-foreground">Reach Celpin support via Gmail</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-4">
          {/* To Email */}
          <div>
            <label htmlFor="ticket-to-email" className="block text-xs font-semibold text-muted-foreground mb-1.5">
              To Email
            </label>
            <input
              id="ticket-to-email"
              type="email"
              value={TO_EMAIL}
              readOnly
              className="w-full rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* From Email */}
          <div>
            <label htmlFor="ticket-from-email" className="block text-xs font-semibold text-muted-foreground mb-1.5">
              From Email <span className="text-red-500">*</span>
            </label>
            <input
              id="ticket-from-email"
              type="email"
              required
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Ticket Subject */}
          <div>
            <label htmlFor="ticket-subject" className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Ticket Subject <span className="text-red-500">*</span>
            </label>
            <input
              id="ticket-subject"
              type="text"
              required
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              placeholder="e.g., Booking issue, Workspace inquiry..."
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Ticket Details */}
          <div>
            <label htmlFor="ticket-message" className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Ticket Details <span className="text-red-500">*</span>
            </label>
            <textarea
              id="ticket-message"
              rows={4}
              required
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              placeholder="Enter your ticket details or message..."
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-red-500">{error}</p>
          )}

          {/* Actions */}
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href={buildGmailUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleGmailClick}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 shadow-sm transition-all cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>Send via Gmail</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80" />
            </a>

            <a
              href={buildMailtoUrl()}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Or open in default mail app</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
