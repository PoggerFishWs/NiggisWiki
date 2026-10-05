import React, { useState } from 'react';
import { Lock, Key, X, ShieldAlert } from 'lucide-react';

interface EditorPasswordModalProps {
  onUnlock: (passwordInput: string) => boolean;
  onClose: () => void;
}

export const EditorPasswordModal: React.FC<EditorPasswordModalProps> = ({
  onUnlock,
  onClose
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const success = onUnlock(passwordInput);
    if (success) {
      onClose();
    } else {
      setErrorMessage('❌ Incorrect password! Access denied.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-color)' }}>
            <Lock size={20} /> Editor Password Required
          </h3>
          <button className="btn-secondary" style={{ padding: '4px 8px' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Creating and editing pages is password-protected. Please enter the <strong>Editor Access Password</strong> to unlock editing:
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Key size={14} /> Password:
            </label>
            <input
              type="password"
              className="editor-input"
              placeholder="Enter Editor Password..."
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              autoFocus
              required
            />
          </div>

          {errorMessage && (
            <div style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldAlert size={16} /> {errorMessage}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Unlock Editor
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
