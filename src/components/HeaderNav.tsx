import React, { useState, useRef, useEffect } from 'react';
import { Search, Palette, PlusCircle, Download, Sliders, Lock, Unlock, Key, ShieldAlert } from 'lucide-react';
import type { WikiPage, ThemeMode, CustomThemeConfig } from '../types/wiki';

interface HeaderNavProps {
  pages: WikiPage[];
  pendingCount: number;
  onSelectPage: (id: string) => void;
  onOpenCreate: () => void;
  onOpenExport: () => void;
  onOpenAdminPanel: () => void;
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  customConfig: CustomThemeConfig;
  onCustomConfigChange: (config: CustomThemeConfig) => void;
  isEditorUnlocked: boolean;
  onLockEditor: () => void;
  onChangeEditorPassword: (newPass: string) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  pages,
  pendingCount,
  onSelectPage,
  onOpenCreate,
  onOpenExport,
  onOpenAdminPanel,
  currentTheme,
  onThemeChange,
  customConfig,
  onCustomConfigChange,
  isEditorUnlocked,
  onLockEditor,
  onChangeEditorPassword
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showPassSettings, setShowPassSettings] = useState(false);
  const [newPassInput, setNewPassInput] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredPages = searchQuery.trim() === '' ? [] : pages.filter(page => 
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveNewPass = () => {
    if (!newPassInput.trim()) {
      alert('Password cannot be empty!');
      return;
    }
    onChangeEditorPassword(newPassInput.trim());
    alert('✅ Admin Password updated successfully!');
    setShowPassSettings(false);
    setNewPassInput('');
  };

  return (
    <>
      <header className="top-header">
        {/* Clickable Logo Image & Brand */}
        <div 
          className="brand-section" 
          onClick={() => onSelectPage('Main_Page')}
          title="Click to go to Home Page"
        >
          <img src="./logo.svg" alt="NiggisWiki Logo" className="logo-img" />
          <div className="brand-title">NiggisWiki</div>
          <span className="brand-subtitle">Community Wiki</span>
        </div>

        {/* Global Instant Search */}
        <div className="search-box-wrapper" ref={searchRef}>
          <Search className="search-icon-inside" size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Search articles, lore, incidents..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />

          {isOpen && filteredPages.length > 0 && (
            <div className="search-results-dropdown">
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  className="search-result-item"
                  onClick={() => {
                    onSelectPage(page.id);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <div className="search-result-title">{page.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Category: <strong>{page.category}</strong> • Edited by: {page.editedBy}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Admin Panel Button (When Unlocked) */}
          {isEditorUnlocked ? (
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                className="btn-primary"
                style={{ padding: '6px 12px', fontSize: '0.85rem', backgroundColor: 'var(--accent-color)' }}
                onClick={onOpenAdminPanel}
                title="Open Admin Control Panel & Moderation Queue"
              >
                <ShieldAlert size={15} />
                Admin Panel {pendingCount > 0 && <span style={{ background: '#ef4444', color: '#fff', padding: '1px 6px', borderRadius: '10px', fontSize: '0.75rem' }}>{pendingCount}</span>}
              </button>

              <button
                className="btn-secondary"
                style={{ padding: '6px 10px', fontSize: '0.8rem', color: '#10b981', borderColor: '#10b981' }}
                onClick={onLockEditor}
                title="Click to Lock Admin Access"
              >
                <Unlock size={14} /> Admin
              </button>

              <button
                className="btn-secondary"
                style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                onClick={() => setShowPassSettings(!showPassSettings)}
                title="Change Admin Password"
              >
                <Key size={14} />
              </button>
            </div>
          ) : (
            <button
              className="btn-secondary"
              style={{ padding: '6px 10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}
              onClick={onOpenAdminPanel}
              title="Admin Login & Moderation Queue"
            >
              <Lock size={14} /> Admin Login {pendingCount > 0 && <span style={{ background: '#ef4444', color: '#fff', padding: '1px 6px', borderRadius: '10px', fontSize: '0.72rem' }}>{pendingCount}</span>}
            </button>
          )}

          {/* Theme Picker Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Palette size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              value={currentTheme}
              onChange={(e) => {
                const val = e.target.value as ThemeMode;
                onThemeChange(val);
                if (val === 'custom-gradient') {
                  setShowColorPicker(true);
                } else {
                  setShowColorPicker(false);
                }
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1.5px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="classic-white">📄 Classical White</option>
              <option value="dark-mode">🌙 Dark Mode</option>
              <option value="crimson-red">🔴 Crimson Red</option>
              <option value="cyber-blue">🔵 Cyber Blue</option>
              <option value="pitch-black">🖤 Pitch Black</option>
              <option value="custom-gradient">🌈 Custom Hex / Gradient</option>
            </select>

            {currentTheme === 'custom-gradient' && (
              <button
                className="btn-secondary"
                style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                onClick={() => setShowColorPicker(!showColorPicker)}
                title="Customize Hex Colors"
              >
                <Sliders size={14} /> Colors
              </button>
            )}
          </div>

          <button className="btn-secondary" onClick={onOpenExport} title="Export / Backup Pages">
            <Download size={15} />
            Export & Sync
          </button>

          <button className="btn-primary" onClick={onOpenCreate}>
            <PlusCircle size={15} />
            + Submit Page
          </button>
        </div>
      </header>

      {/* Password Setting Dropdown Bar */}
      {showPassSettings && isEditorUnlocked && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '2px solid var(--border-color)',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.85rem',
          fontWeight: 700
        }}>
          <span>🔑 Update Admin Access Password:</span>
          <input
            type="password"
            className="editor-input"
            placeholder="New Admin Password"
            value={newPassInput}
            onChange={(e) => setNewPassInput(e.target.value)}
            style={{ width: '220px', padding: '6px 10px' }}
          />
          <button className="btn-primary" style={{ padding: '6px 12px' }} onClick={handleSaveNewPass}>
            Save Password
          </button>
          <button className="btn-secondary" style={{ padding: '6px 12px' }} onClick={() => setShowPassSettings(false)}>
            Cancel
          </button>
        </div>
      )}

      {/* Custom Gradient & Hex Color Picker Bar */}
      {currentTheme === 'custom-gradient' && showColorPicker && (
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '2px solid var(--border-color)',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          fontSize: '0.85rem',
          fontWeight: 700,
          flexWrap: 'wrap'
        }}>
          <span style={{ color: 'var(--accent-color)', fontWeight: 800 }}>🎨 Custom Hex Colors:</span>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Accent Color:
            <input
              type="color"
              value={customConfig.accentColor}
              onChange={(e) => onCustomConfigChange({ ...customConfig, accentColor: e.target.value })}
              style={{ width: '32px', height: '24px', cursor: 'pointer', border: 'none', borderRadius: '4px' }}
            />
            <code>{customConfig.accentColor}</code>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Background Start:
            <input
              type="color"
              value={customConfig.gradientStart}
              onChange={(e) => onCustomConfigChange({ ...customConfig, gradientStart: e.target.value })}
              style={{ width: '32px', height: '24px', cursor: 'pointer', border: 'none', borderRadius: '4px' }}
            />
            <code>{customConfig.gradientStart}</code>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Background End:
            <input
              type="color"
              value={customConfig.gradientEnd}
              onChange={(e) => onCustomConfigChange({ ...customConfig, gradientEnd: e.target.value })}
              style={{ width: '32px', height: '24px', cursor: 'pointer', border: 'none', borderRadius: '4px' }}
            />
            <code>{customConfig.gradientEnd}</code>
          </label>
        </div>
      )}
    </>
  );
};
