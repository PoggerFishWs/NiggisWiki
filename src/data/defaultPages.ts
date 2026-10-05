import type { WikiPage } from '../types/wiki';

export const AI_CREDIT_AUTHOR = 'Gemini 3.6 Flash (Antigravity AI)';

export const defaultPages: WikiPage[] = [
  {
    "id": "Main_Page",
    "title": "NiggisWiki — Home Page",
    "category": "Meta",
    "tags": [
      "home",
      "welcome",
      "niggiswiki",
      "antigravity-ai"
    ],
    "lastEdited": "2026-10-05 23:38",
    "editedBy": "Gemini 3.6 Flash (Antigravity AI)",
    "featured": true,
    "views": 1000,
    "infobox": {
      "title": "NiggisWiki",
      "image": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
      "caption": "Official NiggisWiki Platform Interface",
      "badge": "OFFICIAL AI TEMPLATE",
      "data": [
        {
          "label": "Wiki Name",
          "value": "NiggisWiki"
        },
        {
          "label": "Created By",
          "value": "Gemini 3.6 Flash (Antigravity AI)"
        },
        {
          "label": "Primary Font",
          "value": "Source Sans Pro"
        }
      ]
    },
    "content": "\n# Welcome to NiggisWiki 📖\n\n**NiggisWiki** is the official community encyclopedia for inside jokes, server incidents, member profiles, and lore!\n\n> *\"Documentation created and credited to Gemini 3.6 Flash (Antigravity AI).\"*\n\n---\n\n## 🚀 Getting Started\n\n- View the single feature demonstration page: **[Example Article](wiki:Example_Article)**.\n- Click **\"+ Create Page\"** in the top navigation bar to write and add new pages easily!\n- Click **\"Export & Sync\"** to commit edits directly to GitHub so they stay **forever for everyone** on GitHub Pages!\n"
  },
  {
    "id": "Example_Article",
    "title": "Example Article",
    "category": "Meta",
    "tags": [
      "example",
      "demo",
      "features",
      "antigravity-ai"
    ],
    "lastEdited": "2026-10-05 23:38",
    "editedBy": "Gemini 3.6 Flash (Antigravity AI)",
    "views": 500,
    "infobox": {
      "title": "Example Feature Card",
      "image": "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=400&q=80",
      "caption": "Sample MediaWiki Infobox Image",
      "badge": "FEATURE DEMO",
      "data": [
        {
          "label": "Author",
          "value": "Gemini 3.6 Flash (Antigravity AI)"
        },
        {
          "label": "Font",
          "value": "Source Sans Pro"
        },
        {
          "label": "Status",
          "value": "Active"
        }
      ]
    },
    "content": "\n# Example Article — Master Feature Showcase 📖\n\nThis single example page demonstrates **all available wiki features**, created and credited to **Gemini 3.6 Flash (Antigravity AI)**.\n\n---\n\n## 1. SoyjakWiki & MediaWiki Infoboxes\n\nLook at the floating card on the top right of this page! Every article supports **SoyjakWiki / MediaWiki Infoboxes** featuring:\n- **Top Badge**: Custom uppercase badge (e.g. `FEATURE DEMO`).\n- **Cover Image & Caption**: Full-width image with descriptive italicized caption.\n- **Key-Value Data Table**: Clean metadata rows.\n\n---\n\n## 2. Automatic Table of Contents\n\nHeadings (`##` or `###`) are automatically parsed into the **Table of Contents** box above.\n\n---\n\n## 3. Wiki & Category Linking\n\n- **Link to Home Page**: [Go to Home Page](wiki:Main_Page)\n- **Link to Category**: [Browse Meta Articles](category:Meta)\n\n---\n\n## 4. Text Formatting & Quotes\n\n> *\"Documentation is key to preserving server inside jokes.\"* — Gemini 3.6 Flash (Antigravity AI)\n\n### Formatting\n- **Bold Text**: `**Bold Text**`\n- *Italic Text*: `*Italic Text*`\n- `Inline Code`: ` `Inline Code` `\n\n---\n\n## 5. Markdown Tables\n\n| Feature | Status | Description |\n| :--- | :---: | :--- |\n| **Infobox Card** | ✅ | MediaWiki style right-floating card |\n| **Source Sans Pro Font** | ✅ | Clean typography across all elements |\n| **Password Protection** | ✅ | Deletion password for creator pages |\n| **AI Pages Deletable** | ✅ | Pages created by AI deleted without password |\n\n---\n\n## 6. Code Block Syntax\n\n```json\n{\n  \"wiki\": \"NiggisWiki\",\n  \"author\": \"Gemini 3.6 Flash (Antigravity AI)\",\n  \"font\": \"Source Sans Pro\"\n}\n```\n"
  }
];
