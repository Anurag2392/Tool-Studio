import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, ShieldCheck, ExternalLink, RefreshCw, X, Key, AlertTriangle } from 'lucide-react';

interface EmailLogEntry {
  id: string;
  type: string;
  userEmail: string;
  userName?: string;
  targetRecipient: string;
  subject: string;
  details: string;
  timestamp: string;
  status: string;
}

interface AdminEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLicenseActivated?: (txnId: string) => void;
}

export const AdminEmailModal: React.FC<AdminEmailModalProps> = ({
  isOpen,
  onClose,
  onLicenseActivated,
}) => {
  const [emails, setEmails] = useState<EmailLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [authorizingTxn, setAuthorizingTxn] = useState<string | null>(null);
  const [activatedTxns, setActivatedTxns] = useState<string[]>([]);

  const fetchEmailLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/email-logs');
      const data = await res.json();
      if (data.logs) {
        setEmails(data.logs);
      }
    } catch (err) {
      // Quiet handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEmailLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuthorizeTxn = async (txnId: string, authLink?: string) => {
    setAuthorizingTxn(txnId);
    try {
      if (authLink) {
        window.open(authLink, '_blank');
      } else {
        const res = await fetch('/api/payment/admin-authorize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionId: txnId, token: 'ADMIN_VERIFIED' }),
        });
        const data = await res.json();
        if (data.success) {
          setActivatedTxns((prev) => [...prev, txnId]);
          if (onLicenseActivated) {
            onLicenseActivated(txnId);
          }
        }
      }
    } catch (err) {
      // Quiet handling
    } finally {
      setAuthorizingTxn(null);
      fetchEmailLogs();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Mail size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white">Admin Email Authorization Inbox</h3>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  support@tool-studio.in
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Live authorization notifications & license approval links
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchEmailLogs}
              disabled={loading}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
              title="Refresh Emails"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-amber-400' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="bg-purple-950/60 border border-purple-800/80 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck size={20} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-extrabold text-amber-300 block">Strict Admin Authorization Workflow</span>
              <p className="text-purple-200 font-medium leading-relaxed">
                All submitted PhonePe payments require explicit validation link access by <strong className="text-white">support@tool-studio.in</strong>. Click "Authorize & Activate License" below to approve payment and enable the user's Pro license.
              </p>
            </div>
          </div>

          {emails.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Mail size={40} className="mx-auto text-slate-600" />
              <p className="text-sm font-bold text-slate-400">No authorization emails dispatched yet.</p>
              <p className="text-xs text-slate-500">When a payment is submitted, authorization emails will appear here instantly.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {emails.map((log) => {
                // Extract transaction ID if present
                const txnMatch = log.subject.match(/Activate License - ([a-zA-Z0-9_-]+)/) || log.subject.match(/(T2026\d+|TXN_\d+|Q10163904_\d+|[a-zA-Z0-9_-]{6,})/);
                const txnId = txnMatch ? (txnMatch[1] || txnMatch[0]) : null;

                // Extract authorization link if present
                const linkMatch = log.details.match(/https?:\/\/[^\s]+/);
                const authUrl = linkMatch ? linkMatch[0] : null;

                const isActivated = txnId && activatedTxns.includes(txnId);

                return (
                  <div
                    key={log.id}
                    className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-md uppercase border border-amber-500/30">
                            TO: {log.targetRecipient}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-white mt-1">{log.subject}</h4>
                      </div>

                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/30 shrink-0">
                        {log.status}
                      </span>
                    </div>

                    <pre className="text-xs font-mono text-slate-300 bg-slate-900/90 p-3 rounded-xl whitespace-pre-wrap break-all leading-relaxed border border-slate-800/60">
                      {log.details}
                    </pre>

                    {authUrl && (
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                        <span className="text-[11px] text-slate-400 font-medium">
                          Admin Validation Link: <strong className="text-amber-300">{txnId || 'Pending'}</strong>
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAuthorizeTxn(txnId || 'TXN', authUrl)}
                            disabled={isActivated || authorizingTxn === txnId}
                            className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                              isActivated
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                                : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                            }`}
                          >
                            {isActivated ? (
                              <>
                                <CheckCircle2 size={14} />
                                <span>License Activated</span>
                              </>
                            ) : authorizingTxn === txnId ? (
                              <>
                                <RefreshCw size={14} className="animate-spin" />
                                <span>Authorizing...</span>
                              </>
                            ) : (
                              <>
                                <Key size={14} />
                                <span>Authorize & Activate License</span>
                              </>
                            )}
                          </button>

                          <a
                            href={authUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1 transition-all"
                          >
                            <ExternalLink size={13} />
                            <span>Open URL</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Target Recipient: <strong className="text-amber-400">support@tool-studio.in</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all cursor-pointer"
          >
            Close Inbox
          </button>
        </div>
      </div>
    </div>
  );
};
