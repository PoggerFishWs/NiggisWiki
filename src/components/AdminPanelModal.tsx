import React from 'react';
import { ShieldAlert, Check, X, Trash2, Eye, FileText, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';
import type { WikiPage, PendingPageRequest } from '../types/wiki';

interface AdminPanelModalProps {
  pendingRequests: PendingPageRequest[];
  onApproveRequest: (reqId: string) => void;
  onRejectRequest: (reqId: string) => void;
  onEmergencyReset: () => void;
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  pendingRequests,
  onApproveRequest,
  onRejectRequest,
  onEmergencyReset,
  onClose
}) => {
  const handleConfirmReset = () => {
    if (confirm('⚠️ WARNING: Are you sure you want to perform an Emergency Anti-Grief Reset?\n\nThis will purge all user-submitted pages and reset the wiki back to default!')) {
      onEmergencyReset();
      alert('✅ Wiki successfully reset to default state! All griefing removed.');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px', maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-color)' }}>
            <ShieldAlert size={22} /> Admin Control Panel & Moderation Queue
          </h3>
          <button className="btn-secondary" style={{ padding: '4px 8px' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Pending Moderation Queue Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} /> Pending Approval Queue ({pendingRequests.length})
            </h4>
          </div>

          {pendingRequests.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
              🎉 No pending page creations or edits waiting for approval.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '2px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        backgroundColor: req.type === 'create' ? '#10b981' : '#3b82f6',
                        color: '#ffffff'
                      }}>
                        {req.type === 'create' ? 'NEW PAGE REQUEST' : 'PROPOSED EDIT'}
                      </span>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--link-color)' }}>{req.pageData.title}</strong>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Submitted by <strong>{req.submittedBy}</strong> at {req.submittedAt}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Category: <strong>{req.pageData.category}</strong> | Tags: {req.pageData.tags.join(', ')}
                  </div>

                  <div style={{
                    maxHeight: '120px',
                    overflowY: 'auto',
                    padding: '10px',
                    backgroundColor: 'var(--code-bg)',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontFamily: 'monospace',
                    color: 'var(--text-main)'
                  }}>
                    {req.pageData.content}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <button
                      className="btn-secondary"
                      style={{ color: '#ef4444', borderColor: '#ef4444', padding: '6px 14px' }}
                      onClick={() => onRejectRequest(req.id)}
                    >
                      <X size={15} /> Decline
                    </button>

                    <button
                      className="btn-primary"
                      style={{ padding: '6px 16px' }}
                      onClick={() => onApproveRequest(req.id)}
                    >
                      <Check size={15} /> Approve & Publish Live
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Emergency Anti-Griefing Reset Tool */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '2px solid #ef4444',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h4 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}>
              <AlertTriangle size={18} /> Emergency Anti-Grief Reset
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              If someone spams or griefs the wiki, click here to purge all user edits and restore default clean pages instantly.
            </p>
          </div>

          <button
            className="btn-primary"
            style={{ backgroundColor: '#dc2626', color: '#ffffff', whitespace: 'nowrap' }}
            onClick={handleConfirmReset}
          >
            <RefreshCw size={15} /> Clear All & Reset Wiki
          </button>
        </div>
      </div>
    </div>
  );
};
