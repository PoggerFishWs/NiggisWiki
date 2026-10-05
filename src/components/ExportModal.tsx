import React, { useState } from 'react';
import { Download, Upload, Copy, Check, X, FileText, Sparkles, GitCommit, CheckCircle2 } from 'lucide-react';
import type { WikiPage } from '../types/wiki';

interface ExportModalProps {
  pages: WikiPage[];
  onImportPages: (imported: WikiPage[]) => void;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  pages,
  onImportPages,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'github'>('export');
  
  // GitHub REST API Commit state
  const [repoOwner, setRepoOwner] = useState(localStorage.getItem('gh_owner') || '');
  const [repoName, setRepoName] = useState(localStorage.getItem('gh_repo') || 'NiggisWiki');
  const [ghToken, setGhToken] = useState(localStorage.getItem('gh_token') || '');
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitStatus, setCommitStatus] = useState<string | null>(null);

  const jsonContent = JSON.stringify(pages, null, 2);

  const tsCodeContent = `import type { WikiPage } from '../types/wiki';

export const AI_CREDIT_AUTHOR = 'Gemini 3.6 Flash (Antigravity AI)';

export const defaultPages: WikiPage[] = ${jsonContent};
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(tsCodeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([tsCodeContent], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `defaultPages.ts`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (Array.isArray(parsed)) {
        onImportPages(parsed);
        alert(`Successfully imported ${parsed.length} wiki pages!`);
        onClose();
      } else {
        alert('Invalid format: JSON must be an array of WikiPage objects.');
      }
    } catch (err) {
      alert('Error parsing JSON! Please check your syntax.');
    }
  };

  // Direct GitHub API Commit Function to make edits stay FOREVER on GitHub!
  const handleDirectGitHubCommit = async () => {
    if (!repoOwner || !repoName || !ghToken) {
      alert('Please fill out your GitHub Username, Repository Name, and Personal Access Token!');
      return;
    }

    setIsCommitting(true);
    setCommitStatus('Connecting to GitHub API...');

    try {
      localStorage.setItem('gh_owner', repoOwner);
      localStorage.setItem('gh_repo', repoName);
      localStorage.setItem('gh_token', ghToken);

      const filePath = 'src/data/defaultPages.ts';
      const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

      // 1. Get current file sha
      setCommitStatus('Fetching existing repository file sha...');
      const getRes = await fetch(apiUrl, {
        headers: { Authorization: `token ${ghToken}` }
      });

      let sha = '';
      if (getRes.ok) {
        const getData = await getRes.json();
        sha = getData.sha;
      }

      // 2. Base64 encode updated defaultPages.ts
      const base64Content = btoa(unescape(encodeURIComponent(tsCodeContent)));

      // 3. Commit updated file to repository
      setCommitStatus('Committing updated pages to GitHub repository...');
      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `token ${ghToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Update NiggisWiki pages (${pages.length} total articles)`,
          content: base64Content,
          sha: sha || undefined
        })
      });

      if (putRes.ok) {
        setCommitStatus('SUCCESS! Edits committed directly to GitHub. GitHub Pages will re-deploy automatically in 60s!');
      } else {
        const errData = await putRes.json();
        setCommitStatus(`GitHub API Error: ${errData.message || 'Failed to commit file.'}`);
      }
    } catch (err: any) {
      setCommitStatus(`Error: ${err.message || 'Network failure connecting to GitHub.'}`);
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} style={{ color: 'var(--accent-color)' }} />
            Wiki Data Export & Permanent GitHub Edits
          </h3>
          <button className="btn-secondary" style={{ padding: '4px 8px' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
          <button
            className={`btn-secondary ${activeTab === 'export' ? 'active' : ''}`}
            onClick={() => setActiveTab('export')}
          >
            <Download size={14} /> Download Code
          </button>

          <button
            className={`btn-secondary ${activeTab === 'github' ? 'active' : ''}`}
            onClick={() => setActiveTab('github')}
          >
            <GitCommit size={14} /> Global GitHub API Sync
          </button>

          <button
            className={`btn-secondary ${activeTab === 'import' ? 'active' : ''}`}
            onClick={() => setActiveTab('import')}
          >
            <Upload size={14} /> Import JSON
          </button>
        </div>

        {activeTab === 'export' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Download or copy the generated <code>defaultPages.ts</code> file below. Replace <code>src/data/defaultPages.ts</code> in your code to make all current <strong>{pages.length}</strong> pages permanent for everyone on GitHub!
            </p>
            <textarea
              readOnly
              value={tsCodeContent}
              style={{
                width: '100%',
                height: '240px',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                backgroundColor: 'var(--code-bg)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '10px',
                resize: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={handleCopy}>
                {copied ? <Check size={15} style={{ color: '#10b981' }} /> : <Copy size={15} />}
                {copied ? 'Copied Code!' : 'Copy Code'}
              </button>
              <button className="btn-primary" onClick={handleDownloadFile}>
                <Download size={15} /> Download defaultPages.ts
              </button>
            </div>
          </div>
        )}

        {activeTab === 'github' && (
          <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} /> How Edits Stay Forever Everywhere on GitHub
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                By connecting your GitHub Personal Access Token below, you can commit edits directly from the browser! The GitHub API will update <code>src/data/defaultPages.ts</code> in your repo, and GitHub Actions will automatically redeploy the wiki globally!
              </p>
              <div style={{ marginTop: '8px', padding: '8px 10px', background: 'var(--badge-bg)', borderRadius: '4px', fontSize: '0.78rem', color: 'var(--badge-text)', fontWeight: 700 }}>
                ⚠️ <strong>Note:</strong> Your GitHub repository must contain the full NiggisWiki project code (<code>index.html</code>, <code>package.json</code>, <code>src/</code>, <code>.github/workflows/deploy.yml</code>). If your repo is currently empty, push your full project folder first!
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="form-group">
                <label>GitHub Username / Owner</label>
                <input
                  type="text"
                  className="editor-input"
                  placeholder="e.g. username"
                  value={repoOwner}
                  onChange={(e) => setRepoOwner(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Repository Name</label>
                <input
                  type="text"
                  className="editor-input"
                  placeholder="NiggisWiki"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>GitHub Personal Access Token (repo scope)</label>
              <input
                type="password"
                className="editor-input"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={ghToken}
                onChange={(e) => setGhToken(e.target.value)}
              />
            </div>

            {commitStatus && (
              <div style={{
                padding: '10px',
                borderRadius: '6px',
                backgroundColor: commitStatus.includes('SUCCESS') ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: commitStatus.includes('SUCCESS') ? '#10b981' : 'var(--text-main)'
              }}>
                {commitStatus}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button
                className="btn-primary"
                onClick={handleDirectGitHubCommit}
                disabled={isCommitting}
              >
                <GitCommit size={15} /> {isCommitting ? 'Committing to GitHub...' : 'Commit & Save Edits Forever'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Paste previously exported NiggisWiki JSON array below to update or load pages instantly:
            </p>
            <textarea
              placeholder="Paste JSON array here..."
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              style={{
                width: '100%',
                height: '200px',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                backgroundColor: 'var(--code-bg)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '10px'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={handleImportSubmit}>
                <Upload size={15} /> Load Pages
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
