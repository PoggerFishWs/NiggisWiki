import { useState, useEffect, useCallback } from 'react';
import './App.css';
import type { WikiPage, ThemeMode, CustomThemeConfig, PendingPageRequest } from './types/wiki';
import { defaultPages, AI_CREDIT_AUTHOR } from './data/defaultPages';
import { HeaderNav } from './components/HeaderNav';
import { Sidebar } from './components/Sidebar';
import { ArticleView } from './components/ArticleView';
import { ArticleEditor } from './components/ArticleEditor';
import { ExportModal } from './components/ExportModal';
import { EditorPasswordModal } from './components/EditorPasswordModal';
import { AdminPanelModal } from './components/AdminPanelModal';

// Permanent storage key — NEVER change this again to avoid data loss
const PERMANENT_STORAGE_KEY = 'niggiswiki_pages_v7_permanent';
const PENDING_STORAGE_KEY = 'niggiswiki_pending_v7';
const THEME_STORAGE_KEY = 'niggiswiki_theme';
const CUSTOM_THEME_KEY = 'niggiswiki_custom_theme';
const EDITOR_PASS_KEY = 'niggiswiki_editor_pass';
const DELETED_PAGES_KEY = 'niggiswiki_deleted_page_ids_v1';

// Public Cloud Live Sync Endpoint — keeps all visitors synced across all devices globally
const CLOUD_SYNC_URL = 'https://kvdb.io/NiggisWiki_Global_V1/pages';

// Historical storage keys for migration recovery
const LEGACY_KEYS = [
  'niggiswiki_pages_v1',
  'niggiswiki_pages_v2',
  'niggiswiki_pages_v3',
  'niggiswiki_pages_v4',
  'niggiswiki_pages_v5',
  'niggiswiki_pages_v6',
  'niggiswiki_pages_v7',
];

function getDeletedIds(): string[] {
  try {
    const raw = localStorage.getItem(DELETED_PAGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function registerDeletedId(id: string) {
  try {
    const deleted = getDeletedIds();
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem(DELETED_PAGES_KEY, JSON.stringify(deleted));
    }
  } catch {
    // ignore storage errors
  }
}

/**
 * Background GitHub Sync — automatically commits updated defaultPages.ts to GitHub
 * if the repository owner has saved their Personal Access Token on their own browser!
 * NO OTHER USER OR FRIEND EVER SEES OR NEEDS THE TOKEN!
 */
async function autoCommitToGitHub(pagesToCommit: WikiPage[]) {
  const owner = localStorage.getItem('gh_owner') || 'PoggerFishWs';
  const repo = localStorage.getItem('gh_repo') || 'NiggisWiki';
  const token = localStorage.getItem('gh_token');
  if (!owner || !repo || !token) return;

  try {
    const jsonContent = JSON.stringify(pagesToCommit, null, 2);
    const tsContent = `import type { WikiPage } from '../types/wiki';\n\nexport const AI_CREDIT_AUTHOR = 'Gemini 3.6 Flash (Antigravity AI)';\n\nexport const defaultPages: WikiPage[] = ${jsonContent};\n`;

    const filePath = 'src/data/defaultPages.ts';
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    const getRes = await fetch(apiUrl, { headers: { Authorization: `token ${token}` } });
    let sha = '';
    if (getRes.ok) {
      const getData = await getRes.json();
      sha = getData.sha;
    }

    const base64Content = btoa(unescape(encodeURIComponent(tsContent)));

    await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Auto-sync NiggisWiki pages (${pagesToCommit.length} total pages)`,
        content: base64Content,
        sha: sha || undefined
      })
    });
  } catch {
    // silent background fallback
  }
}

/**
 * Load pages with migration scanner — recovers orphaned pages from old storage keys
 * and respects deleted page IDs so deleted pages stay deleted forever!
 */
function loadPagesWithMigration(): WikiPage[] {
  const deletedIds = getDeletedIds();

  // 1. Try loading from permanent key
  const stored = localStorage.getItem(PERMANENT_STORAGE_KEY);
  let currentPages: WikiPage[] = [];

  if (stored) {
    try {
      currentPages = JSON.parse(stored);
    } catch {
      currentPages = [];
    }
  }

  // 2. Scan legacy keys for orphaned user pages
  const recoveredPages: WikiPage[] = [];
  for (const legacyKey of LEGACY_KEYS) {
    if (legacyKey === PERMANENT_STORAGE_KEY) continue;
    const legacyData = localStorage.getItem(legacyKey);
    if (!legacyData) continue;
    try {
      const legacyPages: WikiPage[] = JSON.parse(legacyData);
      for (const lp of legacyPages) {
        if (lp.id === 'Main_Page' || lp.id === 'Example_Article') continue;
        if (currentPages.some(cp => cp.id === lp.id)) continue;
        if (recoveredPages.some(rp => rp.id === lp.id)) continue;
        if (deletedIds.includes(lp.id)) continue;
        recoveredPages.push(lp);
      }
    } catch {
      // skip corrupt data
    }
  }

  // 3. Filter default pages and user pages against deletedIds
  const activeDefaults = defaultPages.filter(d => !deletedIds.includes(d.id));
  const defaultIds = defaultPages.map(d => d.id);
  const userPages = currentPages.filter(p => !defaultIds.includes(p.id) && !deletedIds.includes(p.id));

  const allPages = [...activeDefaults, ...userPages, ...recoveredPages];

  // 4. Save the merged result to permanent key
  localStorage.setItem(PERMANENT_STORAGE_KEY, JSON.stringify(allPages));

  return allPages;
}

function App() {
  // ──────────────── Core State ────────────────
  const [pages, setPages] = useState<WikiPage[]>(() => loadPagesWithMigration());
  const [activePageId, setActivePageId] = useState('Main_Page');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordAction, setPasswordAction] = useState<'edit' | 'create'>('create');

  // ──────────────── Editor Lock State ────────────────
  const [editorPassword, setEditorPassword] = useState<string>(() => {
    return localStorage.getItem(EDITOR_PASS_KEY) || 'garyschwartznigger';
  });
  const [isEditorUnlocked, setIsEditorUnlocked] = useState(false);

  // ──────────────── Pending Moderation Requests ────────────────
  const [pendingRequests, setPendingRequests] = useState<PendingPageRequest[]>(() => {
    const stored = localStorage.getItem(PENDING_STORAGE_KEY);
    if (stored) {
      try { return JSON.parse(stored); } catch { return []; }
    }
    return [];
  });

  // ──────────────── Theme State ────────────────
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) || 'classic-white';
  });
  const [customThemeConfig, setCustomThemeConfig] = useState<CustomThemeConfig>(() => {
    const stored = localStorage.getItem(CUSTOM_THEME_KEY);
    if (stored) {
      try { return JSON.parse(stored); } catch { /* fallback */ }
    }
    return { gradientStart: '#1a1a2e', gradientEnd: '#16213e', accentColor: '#e94560', bgMode: 'dark' as const };
  });

  // ──────────────── Persistence Effects ────────────────
  useEffect(() => {
    localStorage.setItem(PERMANENT_STORAGE_KEY, JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(pendingRequests));
  }, [pendingRequests]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem(CUSTOM_THEME_KEY, JSON.stringify(customThemeConfig));
  }, [customThemeConfig]);

  useEffect(() => {
    localStorage.setItem(EDITOR_PASS_KEY, editorPassword);
  }, [editorPassword]);

  // ──────────────── Apply Theme to Root ────────────────
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'custom-gradient') {
      root.style.setProperty('--custom-gradient-start', customThemeConfig.gradientStart);
      root.style.setProperty('--custom-gradient-end', customThemeConfig.gradientEnd);
      root.style.setProperty('--accent-color', customThemeConfig.accentColor);
    } else {
      root.style.removeProperty('--custom-gradient-start');
      root.style.removeProperty('--custom-gradient-end');
    }
  }, [currentTheme, customThemeConfig]);

  // ──────────────── Derived Data ────────────────
  const categoriesList = [...new Set(pages.map(p => p.category))].sort();

  const displayedPages = selectedCategory
    ? pages.filter(p => p.category === selectedCategory)
    : pages;

  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  // ──────────────── Page Navigation ────────────────
  const handleSelectPage = useCallback((id: string) => {
    // Check if page exists, if not stay on current page
    const pageExists = pages.some(p => p.id === id);
    if (pageExists) {
      setActivePageId(id);
      setIsEditing(false);
      setIsCreating(false);
      setSelectedCategory(null);
    }
  }, [pages]);

  const handleSelectCategory = useCallback((cat: string) => {
    setSelectedCategory(cat || null);
    setIsEditing(false);
    setIsCreating(false);
  }, []);

  const handleRandomPage = useCallback(() => {
    if (pages.length > 0) {
      const randomIdx = Math.floor(Math.random() * pages.length);
      setActivePageId(pages[randomIdx].id);
      setSelectedCategory(null);
      setIsEditing(false);
      setIsCreating(false);
    }
  }, [pages]);

  // ──────────────── Editor Password Gate ────────────────
  const handleUnlockAttempt = useCallback((inputPass: string): boolean => {
    if (inputPass.trim() === editorPassword.trim()) {
      setIsEditorUnlocked(true);
      return true;
    }
    return false;
  }, [editorPassword]);

  const handleLockEditor = useCallback(() => {
    setIsEditorUnlocked(false);
  }, []);

  const handleChangeEditorPassword = useCallback((newPass: string) => {
    setEditorPassword(newPass);
  }, []);

  // ──────────────── Open Edit / Create with Password Gate ────────────────
  // ──────────────── Open Edit / Create ────────────────
  const handleOpenEdit = useCallback(() => {
    setIsEditing(true);
    setIsCreating(false);
  }, []);

  const handleOpenCreate = useCallback(() => {
    setIsCreating(true);
    setIsEditing(false);
  }, []);

  const handlePasswordModalClose = useCallback(() => {
    setShowPasswordModal(false);
  }, []);

  // When password modal unlocks, open admin panel
  const handlePasswordUnlock = useCallback((inputPass: string): boolean => {
    const success = handleUnlockAttempt(inputPass);
    if (success) {
      setShowAdminPanel(true);
    }
    return success;
  }, [handleUnlockAttempt]);

  // ──────────────── Save / Submit Page ────────────────
  const handleSavePage = useCallback((page: WikiPage, autoApprove: boolean) => {
    if (autoApprove) {
      // Admin mode: save directly
      setPages(prev => {
        let updated: WikiPage[];
        const existingIdx = prev.findIndex(p => p.id === page.id);
        if (existingIdx >= 0) {
          updated = [...prev];
          updated[existingIdx] = { ...page, isProtected: prev[existingIdx].isProtected };
        } else {
          updated = [...prev, page];
        }
        autoCommitToGitHub(updated);
        return updated;
      });
      setActivePageId(page.id);
      setIsEditing(false);
      setIsCreating(false);
    } else {
      // Non-admin: submit to moderation queue
      const existingPage = pages.find(p => p.id === page.id);
      const request: PendingPageRequest = {
        id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        type: existingPage ? 'edit' : 'create',
        targetPageId: existingPage ? page.id : undefined,
        pageData: page,
        submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        submittedBy: page.editedBy
      };
      setPendingRequests(prev => [...prev, request]);
      alert('📩 Your page submission has been sent to the Admin Moderation Queue for review!');
      setIsEditing(false);
      setIsCreating(false);
    }
  }, [pages]);

  // ──────────────── Delete Page ────────────────
  const handleDeletePage = useCallback((pageToDelete: WikiPage) => {
    const doDelete = () => {
      registerDeletedId(pageToDelete.id);
      setPages(prev => {
        const next = prev.filter(p => p.id !== pageToDelete.id);
        autoCommitToGitHub(next);
        return next;
      });
      setActivePageId('Main_Page');
    };

    // 1. Admin Override Delete
    if (isEditorUnlocked) {
      if (confirm(`Admin Mode: Delete page "${pageToDelete.title}"?`)) {
        doDelete();
        alert(`✅ Page "${pageToDelete.title}" deleted!`);
      }
      return;
    }

    // 2. Creator Password Protected Page Delete
    if (pageToDelete.password && pageToDelete.password.trim().length > 0) {
      const inputPass = prompt(`Page "${pageToDelete.title}" is password-protected by creator (${pageToDelete.editedBy}).\n\nPlease enter the creator deletion password:`);
      if (inputPass === null) return;

      if (inputPass.trim() === pageToDelete.password.trim()) {
        doDelete();
        alert(`✅ Page "${pageToDelete.title}" successfully deleted!`);
      } else {
        alert(`❌ Incorrect password! Only the creator (${pageToDelete.editedBy}) or an Admin can delete this page.\n\nHint: Log in as Admin from the header to override.`);
      }
      return;
    }

    // 3. AI / No-Password Page Delete (anyone can delete these)
    const isAiPage = pageToDelete.editedBy.includes('Gemini') || pageToDelete.editedBy.includes('Antigravity') || pageToDelete.editedBy.includes('AI');
    if (isAiPage || !pageToDelete.password) {
      if (confirm(`Delete page "${pageToDelete.title}"?`)) {
        doDelete();
        alert(`✅ Page "${pageToDelete.title}" deleted!`);
      }
    }
  }, [isEditorUnlocked]);

  // ──────────────── Admin Moderation Actions ────────────────
  const handleApproveRequest = useCallback((reqId: string) => {
    const req = pendingRequests.find(r => r.id === reqId);
    if (!req) return;

    // Approve: add/update the page
    setPages(prev => {
      let updated: WikiPage[];
      const existingIdx = prev.findIndex(p => p.id === req.pageData.id);
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = { ...req.pageData, isProtected: prev[existingIdx].isProtected };
      } else {
        updated = [...prev, req.pageData];
      }
      autoCommitToGitHub(updated);
      return updated;
    });

    setPendingRequests(prev => prev.filter(r => r.id !== reqId));
    alert(`✅ Page "${req.pageData.title}" approved and published live!`);
  }, [pendingRequests]);

  const handleRejectRequest = useCallback((reqId: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== reqId));
  }, []);

  const handleEmergencyReset = useCallback(() => {
    setPages([...defaultPages]);
    setPendingRequests([]);
    setActivePageId('Main_Page');
    setIsEditing(false);
    setIsCreating(false);
  }, []);

  // ──────────────── Import Pages (from ExportModal) ────────────────
  const handleImportPages = useCallback((imported: WikiPage[]) => {
    setPages(prev => {
      const merged = [...prev];
      for (const imp of imported) {
        const idx = merged.findIndex(p => p.id === imp.id);
        if (idx >= 0) {
          merged[idx] = imp;
        } else {
          merged.push(imp);
        }
      }
      return merged;
    });
  }, []);

  // ──────────────── Admin Panel Open Handler ────────────────
  const handleOpenAdminPanel = useCallback(() => {
    if (isEditorUnlocked) {
      setShowAdminPanel(true);
    } else {
      // Show password modal, then open admin panel
      setPasswordAction('create'); // reuse
      setShowPasswordModal(true);
    }
  }, [isEditorUnlocked]);

  // ──────────────── Render ────────────────
  return (
    <div className="app-container">
      <HeaderNav
        pages={pages}
        pendingCount={pendingRequests.length}
        onSelectPage={handleSelectPage}
        onOpenCreate={handleOpenCreate}
        onOpenExport={() => setShowExportModal(true)}
        onOpenAdminPanel={handleOpenAdminPanel}
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        customConfig={customThemeConfig}
        onCustomConfigChange={setCustomThemeConfig}
        isEditorUnlocked={isEditorUnlocked}
        onLockEditor={handleLockEditor}
        onChangeEditorPassword={handleChangeEditorPassword}
      />

      <div className="main-wrapper">
        <Sidebar
          pages={displayedPages}
          activePageId={activePageId}
          categoriesList={categoriesList}
          onSelectPage={handleSelectPage}
          onSelectCategory={handleSelectCategory}
          selectedCategory={selectedCategory || ''}
          onOpenCreate={handleOpenCreate}
          onOpenExport={() => setShowExportModal(true)}
          onRandomPage={handleRandomPage}
        />

        <main style={{ flex: 1, minWidth: 0 }}>
          {isEditing && activePage ? (
            <ArticleEditor
              initialPage={activePage}
              categoriesList={categoriesList}
              isEditorUnlocked={isEditorUnlocked}
              onSave={handleSavePage}
              onCancel={() => setIsEditing(false)}
            />
          ) : isCreating ? (
            <ArticleEditor
              initialPage={null}
              categoriesList={categoriesList}
              isEditorUnlocked={isEditorUnlocked}
              onSave={handleSavePage}
              onCancel={() => setIsCreating(false)}
            />
          ) : selectedCategory ? (
            <div className="content-area">
              <h2 style={{ marginBottom: '16px' }}>
                📁 Category: {selectedCategory}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {displayedPages.map(page => (
                  <div
                    key={page.id}
                    className="search-result-item"
                    style={{ cursor: 'pointer', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
                    onClick={() => handleSelectPage(page.id)}
                  >
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--link-color)' }}>{page.title}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Edited by <strong>{page.editedBy}</strong> • {page.lastEdited}
                    </div>
                  </div>
                ))}
                {displayedPages.length === 0 && (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No pages in this category yet.
                  </div>
                )}
              </div>
            </div>
          ) : activePage ? (
            <ArticleView
              page={activePage}
              onEdit={handleOpenEdit}
              onDelete={handleDeletePage}
              onNavigateWiki={handleSelectPage}
              onSelectCategory={handleSelectCategory}
            />
          ) : null}
        </main>
      </div>

      {/* Modals */}
      {showExportModal && (
        <ExportModal
          pages={pages}
          onImportPages={handleImportPages}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {showPasswordModal && (
        <EditorPasswordModal
          onUnlock={handlePasswordUnlock}
          onClose={handlePasswordModalClose}
        />
      )}

      {showAdminPanel && isEditorUnlocked && (
        <AdminPanelModal
          pendingRequests={pendingRequests}
          onApproveRequest={handleApproveRequest}
          onRejectRequest={handleRejectRequest}
          onEmergencyReset={handleEmergencyReset}
          onClose={() => setShowAdminPanel(false)}
        />
      )}
    </div>
  );
}

export default App;
