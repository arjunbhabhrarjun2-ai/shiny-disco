'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt } from 'react-icons/fa';

interface PrivateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (privateKey: string) => Promise<void>;
  email: string;
  error?: string;
  isLoading?: boolean;
  retryCount?: number;
  maxRetries?: number;
}

export default function PrivateKeyModal({
  isOpen,
  onClose,
  onSubmit,
  email,
  error,
  isLoading = false,
  retryCount = 0,
  maxRetries = 3,
}: PrivateKeyModalProps) {
  const [privateKey, setPrivateKey] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (privateKey.trim()) {
      await onSubmit(privateKey.trim());
    }
  };

  const isDisabled = retryCount >= maxRetries;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            style={{ background: '#0D1421', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Header */}
            <div
              className="px-6 py-5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-3 mb-1">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(59,130,246,0.12)' }}
                >
                  <FaShieldAlt className="text-blue-400" size={16} />
                </div>
                <h2
                  className="text-lg font-semibold text-white"
                  style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
                >
                  Verify Private Key
                </h2>
              </div>
              <p className="text-sm mt-2" style={{ color: '#9CA3AF' }}>
                Enter your private key to authenticate for{' '}
                <span className="text-white font-medium">{email}</span>
              </p>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#9CA3AF' }}>
                  Private Key
                </label>
                <textarea
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder="Paste your private key here..."
                  className="w-full p-3 rounded-lg text-white text-sm resize-none transition-all duration-200"
                  style={{
                    background: '#111827',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontFamily: 'var(--font-jetbrains-mono, monospace)',
                    outline: 'none',
                  }}
                  rows={4}
                  disabled={isDisabled || isLoading}
                  required
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                />
              </div>

              {error && (
                <div
                  className="p-3 rounded-lg text-sm"
                  style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: '#FB7185' }}
                >
                  {error}
                  {retryCount > 0 && (
                    <div className="mt-1 text-xs opacity-75">
                      {maxRetries - retryCount} attempt{maxRetries - retryCount !== 1 ? 's' : ''} remaining
                    </div>
                  )}
                </div>
              )}

              {isDisabled && (
                <div
                  className="p-3 rounded-lg text-sm"
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#FCD34D' }}
                >
                  Maximum attempts reached. Please contact support for assistance.
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: '#9CA3AF',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDisabled || isLoading || !privateKey.trim()}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 text-white"
                  style={{
                    background: isDisabled || isLoading || !privateKey.trim()
                      ? 'rgba(59,130,246,0.3)'
                      : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                    cursor: isDisabled || isLoading || !privateKey.trim() ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isLoading ? 'Verifying...' : 'Verify Key'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
