import React, { useState } from 'react';
import { marked } from 'marked';
import { Edit3, Clock, Tag, MessageSquare, Eye, User, BookOpen, Trash2, Lock, ShieldCheck } from 'lucide-react';
import type { WikiPage } from '../types/wiki';

interface ArticleViewProps {
  page: WikiPage;
  onEdit: () => void;
  onDelete: (page: WikiPage) => void;
  onNavigateWiki: (pageId: string) => void;
  onSelectCategory: (cat: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  page,
  onEdit,
  onDelete,
  onNavigateWiki,
  onSelectCategory
}) => {
  const [activeTab, setActiveTab] = useState<'article' | 'talk' | 'history'>('article');

  const renderMarkdown = (content: string) => {
    let processed = content;
    
    processed = processed.replace(/\[([^\]]+)\]\(wiki:([^\)]+)\)/g, (match, title, id) => {
      return `<a href="#/wiki/${id}" class="wiki-internal-link" data-wiki-id="${id}">${title}</a>`;
    });

    processed = processed.replace(/\[([^\]]+)\]\(category:([^\)]+)\)/g, (match, title, cat) => {
      return `<a href="#/category/${cat}" class="wiki-category-link" data-cat="${cat}">${title}</a>`;
    });

    return marked.parse(processed) as string;
  };

  const extractTOC = (content: string) => {
    const headingLines = content.split('\n').filter(line => line.startsWith('## ') || line.startsWith('### '));
    return headingLines.map((line, idx) => {
      const isH3 = line.startsWith('### ');
      const text = line.replace(/^###?\s+/, '').trim();
      return { id: `heading-${idx}`, text, level: isH3 ? 3 : 2 };
    });
  };

  const tocList = extractTOC(page.content);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const wikiLink = target.closest('[data-wiki-id]');
    if (wikiLink) {
      e.preventDefault();
      const id = wikiLink.getAttribute('data-wiki-id');
      if (id) onNavigateWiki(id);
      return;
    }

    const catLink = target.closest('[data-cat]');
    if (catLink) {
      e.preventDefault();
      const cat = catLink.getAttribute('data-cat');
      if (cat) onSelectCategory(cat);
      return;
    }
  };

  return (
    <div className="content-area" onClick={handleContainerClick}>
      {/* Wiki Action Tabs Bar */}
      <div className="wiki-tabs-bar">
        <button
          className={`wiki-tab ${activeTab === 'article' ? 'active' : ''}`}
          onClick={() => setActiveTab('article')}
        >
          <BookOpen size={14} />
          Article
        </button>

        <button
          className={`wiki-tab ${activeTab === 'talk' ? 'active' : ''}`}
          onClick={() => setActiveTab('talk')}
        >
          <MessageSquare size={14} />
          Discussion (Talk)
        </button>

        <button
          className={`wiki-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Clock size={14} />
          History
        </button>

        <div className="wiki-tab-actions">
          <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.85rem' }} onClick={onEdit}>
            <Edit3 size={14} />
            Edit Article
          </button>

          {!page.isProtected && page.id !== 'Main_Page' && page.id !== 'Example_Article' ? (
            <button
              className="btn-secondary"
              style={{ padding: '5px 12px', fontSize: '0.85rem', color: '#ef4444', borderColor: '#ef4444' }}
              onClick={() => onDelete(page)}
              title="Delete Article"
            >
              <Trash2 size={14} />
              Delete Page
            </button>
          ) : (
            <span
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px'
              }}
              title="Master page is protected and undeletable"
            >
              <Lock size={12} /> Protected Master Page
            </span>
          )}
        </div>
      </div>

      {/* Main Tab: Article View */}
      {activeTab === 'article' && (
        <article className="article-body-grid">
          {/* Article Title & Meta */}
          <div className="article-header">
            <h1 className="article-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {page.title}
              {page.isProtected && <ShieldCheck size={20} style={{ color: 'var(--accent-color)' }} title="Protected Page" />}
            </h1>
            <div className="article-meta-line">
              <span><User size={13} style={{ display: 'inline', marginRight: 4 }} /> Credit: <strong>{page.editedBy}</strong></span>
              <span><Clock size={13} style={{ display: 'inline', marginRight: 4 }} /> Modified: <strong>{page.lastEdited}</strong></span>
              {page.views && (
                <span><Eye size={13} style={{ display: 'inline', marginRight: 4 }} /> Views: <strong>{page.views.toLocaleString()}</strong></span>
              )}
            </div>
          </div>

          {/* MediaWiki Infobox (Floats Right) */}
          {page.infobox && (
            <aside className="wiki-infobox">
              <div className="infobox-header-title">{page.infobox.title}</div>
              {page.infobox.badge && <div className="infobox-badge">{page.infobox.badge}</div>}
              {page.infobox.image && (
                <div className="infobox-img-wrapper">
                  <img src={page.infobox.image} alt={page.infobox.title} className="infobox-image" />
                  {page.infobox.caption && <div className="infobox-caption">{page.infobox.caption}</div>}
                </div>
              )}
              <table className="infobox-table">
                <tbody>
                  {page.infobox.data.map((item, idx) => (
                    <tr key={idx}>
                      <th>{item.label}</th>
                      <td>{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </aside>
          )}

          {/* Table of Contents Box */}
          {tocList.length > 1 && (
            <div className="wiki-toc">
              <div className="toc-header">
                Contents [hide]
              </div>
              <ul className="toc-list">
                {tocList.map((item, idx) => (
                  <li key={idx} className="toc-item" style={{ paddingLeft: item.level === 3 ? '16px' : '0' }}>
                    <span style={{ color: 'var(--text-muted)', marginRight: 6 }}>{idx + 1}</span>
                    <a href={`#${item.text.toLowerCase().replace(/\s+/g, '-')}`}>{item.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Render Markdown Content */}
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(page.content) }}
          />

          {/* Categories & Tags Footer */}
          <div className="article-categories">
            <span className="category-label"><Tag size={14} style={{ display: 'inline', marginRight: 4 }} /> Categories:</span>
            <span
              className="category-tag"
              onClick={() => onSelectCategory(page.category)}
            >
              {page.category}
            </span>
            {page.tags.map((tag) => (
              <span key={tag} className="category-tag" style={{ opacity: 0.85 }}>
                #{tag}
              </span>
            ))}
          </div>
        </article>
      )}

      {/* Discussion / Talk Tab */}
      {activeTab === 'talk' && (
        <div style={{ padding: '20px 0' }}>
          <h2>Talk: {page.title}</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Community discussion thread for <strong>{page.title}</strong>.
          </p>
          <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '8px', marginTop: '16px' }}>
            <h4>💬 Discussion Notes</h4>
            <div style={{ marginTop: '12px', fontSize: '0.9rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
              <strong>@{page.editedBy}:</strong> Created and verified page structure.
            </div>
          </div>
        </div>
      )}

      {/* Revision History Tab */}
      {activeTab === 'history' && (
        <div style={{ padding: '20px 0' }}>
          <h2>Revision History of {page.title}</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>
            Revision log of edits made to this page.
          </p>
          <table style={{ width: '100%', marginTop: '16px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--header-bg)', textAlign: 'left' }}>
                <th style={{ padding: '8px 12px', border: '1px solid var(--border-color)' }}>Date/Time</th>
                <th style={{ padding: '8px 12px', border: '1px solid var(--border-color)' }}>Author</th>
                <th style={{ padding: '8px 12px', border: '1px solid var(--border-color)' }}>Summary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px 12px', border: '1px solid var(--border-subtle)' }}>{page.lastEdited}</td>
                <td style={{ padding: '8px 12px', border: '1px solid var(--border-subtle)' }}>{page.editedBy}</td>
                <td style={{ padding: '8px 12px', border: '1px solid var(--border-subtle)' }}>Created/Updated page content</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
