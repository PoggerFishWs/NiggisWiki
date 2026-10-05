import React from 'react';
import { Home, Shuffle, FilePlus, Hash, Clock, BookOpen, Download, Sparkles } from 'lucide-react';
import type { WikiPage } from '../types/wiki';

interface SidebarProps {
  pages: WikiPage[];
  activePageId: string;
  categoriesList: string[];
  onSelectPage: (id: string) => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string | null;
  onOpenCreate: () => void;
  onOpenExport: () => void;
  onRandomPage: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  pages,
  activePageId,
  categoriesList,
  onSelectPage,
  onSelectCategory,
  selectedCategory,
  onOpenCreate,
  onOpenExport,
  onRandomPage
}) => {
  const recentPages = [...pages].sort((a, b) => b.lastEdited.localeCompare(a.lastEdited)).slice(0, 5);

  return (
    <aside className="wiki-sidebar">
      {/* Navigation */}
      <div className="sidebar-nav-section">
        <div className="sidebar-heading">Wiki Navigation</div>
        
        <button
          className={`sidebar-link ${activePageId === 'Main_Page' && !selectedCategory ? 'active' : ''}`}
          onClick={() => {
            onSelectCategory('');
            onSelectPage('Main_Page');
          }}
        >
          <Home size={16} />
          Main Page
        </button>

        <button className="sidebar-link" onClick={onRandomPage}>
          <Shuffle size={16} />
          Random Article
        </button>

        <button className="sidebar-link" onClick={onOpenCreate}>
          <FilePlus size={16} />
          + Create New Page
        </button>

        <button className="sidebar-link" onClick={onOpenExport}>
          <Download size={16} />
          Export / Backup Pages
        </button>
      </div>

      {/* Dynamic Categories */}
      <div className="sidebar-nav-section">
        <div className="sidebar-heading">Browse Categories</div>
        
        <button
          className={`sidebar-link ${selectedCategory === '' ? 'active' : ''}`}
          onClick={() => onSelectCategory('')}
        >
          <BookOpen size={16} />
          All Pages
          <span className="category-pill">{pages.length}</span>
        </button>

        {categoriesList.map((cat) => {
          const count = pages.filter(p => p.category === cat).length;
          return (
            <button
              key={cat}
              className={`sidebar-link ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
            >
              <Hash size={16} />
              {cat}
              <span className="category-pill">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Recent Edits */}
      <div className="sidebar-nav-section">
        <div className="sidebar-heading">Recent Edits</div>
        {recentPages.map((page) => (
          <button
            key={page.id}
            className={`sidebar-link ${activePageId === page.id ? 'active' : ''}`}
            onClick={() => {
              onSelectCategory('');
              onSelectPage(page.id);
            }}
          >
            <Clock size={14} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {page.title}
            </span>
          </button>
        ))}
      </div>

      {/* Hosting Info */}
      <div className="sidebar-nav-section" style={{ marginTop: 'auto' }}>
        <div className="sidebar-heading">Free GitHub Hosting</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          Host NiggisWiki for <strong>FREE</strong> on GitHub Pages.
        </div>
        <button
          className="sidebar-link"
          style={{ marginTop: '6px', fontSize: '0.8rem' }}
          onClick={() => {
            onSelectCategory('');
            onSelectPage('How_To_Host_On_GitHub');
          }}
        >
          <Sparkles size={14} />
          Setup Guide
        </button>
      </div>
    </aside>
  );
};
