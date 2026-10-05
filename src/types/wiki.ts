export interface InfoboxField {
  label: string;
  value: string;
}

export interface InfoboxData {
  title: string;
  image?: string;
  caption?: string;
  badge?: string;
  data: InfoboxField[];
}

export interface WikiPage {
  id: string; // URL slug
  title: string;
  content: string; // Markdown content
  category: string; // Dynamic category name
  tags: string[];
  lastEdited: string;
  editedBy: string;
  password?: string; // Optional deletion password set by creator
  isProtected?: boolean; // Undeletable flag (e.g. Example Page)
  infobox?: InfoboxData;
  featured?: boolean;
  views?: number;
  revisionHistory?: {
    timestamp: string;
    editor: string;
    summary: string;
  }[];
}

export interface PendingPageRequest {
  id: string; // Unique request ID
  type: 'create' | 'edit';
  targetPageId?: string;
  pageData: WikiPage;
  submittedAt: string;
  submittedBy: string;
}

export type ThemeMode = 
  | 'classic-white'
  | 'dark-mode'
  | 'crimson-red'
  | 'cyber-blue'
  | 'pitch-black'
  | 'custom-gradient';

export interface CustomThemeConfig {
  gradientStart: string;
  gradientEnd: string;
  accentColor: string;
  bgMode: 'dark' | 'light';
}

export interface GitHubSyncConfig {
  owner: string;
  repo: string;
  branch: string;
  token?: string;
}
