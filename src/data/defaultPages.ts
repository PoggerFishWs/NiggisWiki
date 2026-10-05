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
        { label: 'Primary Font', value: 'Source Sans Pro' },
        { label: 'Protection', value: 'Undeletable Master Pages' }
      ]
    },
    content: `
# Welcome to NiggisWiki 📖

**NiggisWiki** is the official community encyclopedia for inside jokes, server incidents, member profiles, and lore!

> *"Documentation created and credited to Gemini 3.6 Flash (Antigravity AI)."*

---

## 🚀 Getting Started

- View the single feature demonstration page: **[Example Article](wiki:Example_Article)**.
- Read the **[GitHub Setup & Sync Tutorial](wiki:GitHub_Sync_Tutorial)** to learn how to keep your wiki edits live forever on GitHub!
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
        { label: 'Protection', value: 'Undeletable Master Example' },
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
- **Link to GitHub Tutorial**: [GitHub Setup Guide](wiki:GitHub_Sync_Tutorial)

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
| **Master Example Protected**| 🔒 | Example page is undeletable |

---

## 6. Code Block Syntax

\`\`\`json
{
  "wiki": "NiggisWiki",
  "author": "Gemini 3.6 Flash (Antigravity AI)",
  "font": "Source Sans Pro",
  "protected": true
}
\`\`\`
`
  },
  {
    id: 'GitHub_Sync_Tutorial',
    title: 'GitHub Setup & Sync Tutorial',
    category: 'Meta',
    tags: ['github', 'tutorial', 'sync', 'hosting', 'antigravity-ai'],
    lastEdited: '2026-10-06 00:35',
    editedBy: AI_CREDIT_AUTHOR,
    views: 850,
    infobox: {
      title: 'GitHub Sync Setup Guide',
      image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=400&q=80',
      caption: 'GitHub Actions & API Integration',
      badge: 'OFFICIAL GUIDE',
      data: [
        { label: 'Guide Author', value: 'Gemini 3.6 Flash (Antigravity AI)' },
        { label: 'Topic', value: 'GitHub Pages & API Commit' },
        { label: 'Difficulty', value: 'Easy (5 Mins)' },
        { label: 'Protection', value: 'Master Tutorial' }
      ]
    },
    content: `
# GitHub Setup & Permanent Live Deployment Guide 🚀

To make **NiggisWiki** live on the web for everyone and ensure edits stay **forever**, follow this 3-step setup guide!

---

## ⚠️ Important: Full Repository Requirement

To host NiggisWiki on **GitHub Pages**, your GitHub repository **MUST contain the full application code** (\`index.html\`, \`package.json\`, \`vite.config.ts\`, \`src/App.tsx\`, \`src/index.css\`, \`.github/workflows/deploy.yml\`), not just \`src/data/defaultPages.ts\`.

---

## 🛠️ Step 1: Push the Full Project Code to GitHub

Open a command terminal inside your project folder (\`c:\\Users\\daand\\Downloads\\NiggisWiki\`) and run these 4 commands:

\`\`\`bash
# 1. Initialize Git repository
git init

# 2. Add all project files (index.html, src/, package.json, .github/)
git add .

# 3. Commit the project
git commit -m "Initial commit of full NiggisWiki project"

# 4. Link your repository & push to GitHub
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
git push -u origin main --force
\`\`\`

*(Alternative: You can also create a new repository on GitHub.com and drag-and-drop all project files/folders directly into GitHub's file uploader!)*

---

## 🌐 Step 2: Enable Free GitHub Pages Hosting

1. Go to your GitHub Repository: **https://github.com/YOUR_USERNAME/YOUR_REPO_NAME**.
2. Click **Settings** (top navigation bar of your repo).
3. Click **Pages** in the left sidebar under *Code and automation*.
4. Under **Build and deployment → Source**, select **GitHub Actions** (NOT "Deploy from a branch").
5. The pre-configured workflow file (\`.github/workflows/deploy.yml\`) will automatically build and publish your site at \`https://<username>.github.io/<repo-name>/\` in ~60 seconds! 🎉

---

## 🔑 Step 3: Enable Instant Browser Commits (Save Edits Forever)

Once the full project is on GitHub, you and your server members can commit edits directly from the browser without opening a code editor!

### A. Create a GitHub Token:
1. Go to **GitHub.com → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)**.
2. Click **"Generate new token (classic)"**.
3. Set Note to \`NiggisWiki Sync\` and check the **\`repo\`** checkbox scope.
4. Click **Generate token** and copy the \`ghp_...\` token.

### B. Commit Edits from Wiki Header:
1. Click **"Export & Sync"** in the top header of NiggisWiki.
2. Select **"Global GitHub API Sync"**.
3. Enter your Username, Repo Name, and Personal Access Token.
4. Click **"Commit & Save Edits Forever"**!

GitHub Actions will detect the updated \`src/data/defaultPages.ts\` and re-deploy the live wiki automatically!
`
  }
];
