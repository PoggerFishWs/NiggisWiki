import type { WikiPage } from '../types/wiki';

export const AI_CREDIT_AUTHOR = 'Gemini 3.6 Flash (Antigravity AI)';

export const defaultPages: WikiPage[] = [
  {
    id: 'Main_Page',
    title: 'NiggisWiki — Home Page',
    category: 'Meta',
    tags: ['home', 'welcome', 'niggiswiki', 'antigravity-ai'],
    lastEdited: '2026-10-05 23:38',
    editedBy: AI_CREDIT_AUTHOR,
    featured: true,
    views: 1000,
    infobox: {
      title: 'NiggisWiki',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      caption: 'Official NiggisWiki Platform Interface',
      badge: 'OFFICIAL AI TEMPLATE',
      data: [
        { label: 'Wiki Name', value: 'NiggisWiki' },
        { label: 'Created By', value: 'Gemini 3.6 Flash (Antigravity AI)' },
        { label: 'Primary Font', value: 'Source Sans Pro' }
      ]
    },
    content: `
# Welcome to NiggisWiki 📖

**NiggisWiki** is the official community encyclopedia for inside jokes, server incidents, member profiles, and lore!

> *"Documentation created and credited to Gemini 3.6 Flash (Antigravity AI)."*

---

## 🚀 Getting Started

- View the single feature demonstration page: **[Example Article](wiki:Example_Article)**.
- Click **"+ Create Page"** in the top navigation bar to write and add new pages easily!
- Click **"Export & Sync"** to commit edits directly to GitHub so they stay **forever for everyone** on GitHub Pages!
`
  },
  {
    id: 'Example_Article',
    title: 'Example Article',
    category: 'Meta',
    tags: ['example', 'demo', 'features', 'antigravity-ai'],
    lastEdited: '2026-10-05 23:38',
    editedBy: AI_CREDIT_AUTHOR,
    views: 500,
    infobox: {
      title: 'Example Feature Card',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=400&q=80',
      caption: 'Sample MediaWiki Infobox Image',
      badge: 'FEATURE DEMO',
      data: [
        { label: 'Author', value: 'Gemini 3.6 Flash (Antigravity AI)' },
        { label: 'Font', value: 'Source Sans Pro' },
        { label: 'Status', value: 'Active' }
      ]
    },
    content: `
# Example Article — Master Feature Showcase 📖

This single example page demonstrates **all available wiki features**, created and credited to **Gemini 3.6 Flash (Antigravity AI)**.

---

## 1. SoyjakWiki & MediaWiki Infoboxes

Look at the floating card on the top right of this page! Every article supports **SoyjakWiki / MediaWiki Infoboxes** featuring:
- **Top Badge**: Custom uppercase badge (e.g. \`FEATURE DEMO\`).
- **Cover Image & Caption**: Full-width image with descriptive italicized caption.
- **Key-Value Data Table**: Clean metadata rows.

---

## 2. Automatic Table of Contents

Headings (\`##\` or \`###\`) are automatically parsed into the **Table of Contents** box above.

---

## 3. Wiki & Category Linking

- **Link to Home Page**: [Go to Home Page](wiki:Main_Page)
- **Link to Category**: [Browse Meta Articles](category:Meta)

---

## 4. Text Formatting & Quotes

> *"Documentation is key to preserving server inside jokes."* — Gemini 3.6 Flash (Antigravity AI)

### Formatting
- **Bold Text**: \`**Bold Text**\`
- *Italic Text*: \`*Italic Text*\`
- \`Inline Code\`: \` \`Inline Code\` \`

---

## 5. Markdown Tables

| Feature | Status | Description |
| :--- | :---: | :--- |
| **Infobox Card** | ✅ | MediaWiki style right-floating card |
| **Source Sans Pro Font** | ✅ | Clean typography across all elements |
| **Password Protection** | ✅ | Deletion password for creator pages |
| **AI Pages Deletable** | ✅ | Pages created by AI deleted without password |

---

## 6. Code Block Syntax

\`\`\`json
{
  "wiki": "NiggisWiki",
  "author": "Gemini 3.6 Flash (Antigravity AI)",
  "font": "Source Sans Pro"
}
\`\`\`
`
  }
];
