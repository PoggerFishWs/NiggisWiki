import React, { useState } from 'react';
import { Save, X, Eye, Code, Bold, Italic, Plus, Trash2, Key, Image as ImageIcon, Send } from 'lucide-react';
import type { WikiPage, InfoboxField } from '../types/wiki';
import { marked } from 'marked';
import { AI_CREDIT_AUTHOR } from '../data/defaultPages';

interface ArticleEditorProps {
  initialPage?: WikiPage | null;
  categoriesList: string[];
  isEditorUnlocked: boolean;
  onSave: (page: WikiPage, autoApprove: boolean) => void;
  onCancel: () => void;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({
  initialPage,
  categoriesList,
  isEditorUnlocked,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState(initialPage?.title || '');
  const [category, setCategory] = useState<string>(initialPage?.category || categoriesList[0] || 'Meta');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [tagsStr, setTagsStr] = useState(initialPage?.tags ? initialPage.tags.join(', ') : '');
  const [editedBy, setEditedBy] = useState(initialPage?.editedBy || AI_CREDIT_AUTHOR);
  const [password, setPassword] = useState(initialPage?.password || '');
  const [content, setContent] = useState(initialPage?.content || '# Article Title\n\nWrite details about this inside joke or event here...');

  // Infobox state
  const [hasInfobox, setHasInfobox] = useState(!!initialPage?.infobox);
  const [infoTitle, setInfoTitle] = useState(initialPage?.infobox?.title || '');
  const [infoBadge, setInfoBadge] = useState(initialPage?.infobox?.badge || '');
  const [infoImage, setInfoImage] = useState(initialPage?.infobox?.image || '');
  const [infoCaption, setInfoCaption] = useState(initialPage?.infobox?.caption || '');
  const [infoFields, setInfoFields] = useState<InfoboxField[]>(
    initialPage?.infobox?.data || [
      { label: 'Role', value: 'Inside Joke' },
      { label: 'Origin Year', value: '2024' }
    ]
  );

  const isAiAuthor = editedBy.includes('Gemini') || editedBy.includes('Antigravity') || editedBy.includes('AI');

  const handleAddField = () => {
    setInfoFields([...infoFields, { label: 'New Key', value: 'Value' }]);
  };

  const handleRemoveField = (index: number) => {
    setInfoFields(infoFields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, key: 'label' | 'value', val: string) => {
    const updated = [...infoFields];
    updated[index][key] = val;
    setInfoFields(updated);
  };

  const insertSyntax = (prefix: string, suffix: string = '') => {
    setContent(prev => prev + `\n${prefix}text${suffix}`);
  };

  // Easy Image Insertion Helper
  const handleInsertImagePrompt = () => {
    const imgUrl = prompt('Enter Image URL (e.g. https://images.unsplash.com/...):');
    if (!imgUrl || !imgUrl.trim()) return;

    const caption = prompt('Enter Image Caption (optional):') || 'Article Image';
    const imageMarkdown = `\n![${caption}](${imgUrl.trim()})\n`;
    setContent(prev => prev + imageMarkdown);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter an article title!');
      return;
    }

    const finalCategory = isCreatingCategory && newCategoryName.trim()
      ? newCategoryName.trim()
      : category;

    const slug = initialPage ? initialPage.id : title.trim().replace(/\s+/g, '_');
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const tagsArr = tagsStr
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    const newPage: WikiPage = {
      id: slug,
      title: title.trim(),
      category: finalCategory,
      tags: tagsArr.length > 0 ? tagsArr : ['general'],
      lastEdited: now,
      editedBy: editedBy.trim() || AI_CREDIT_AUTHOR,
      password: password.trim() || undefined,
      isProtected: initialPage?.isProtected || false,
      content,
      views: initialPage?.views || 1,
      infobox: hasInfobox ? {
        title: infoTitle.trim() || title.trim(),
        badge: infoBadge.trim() || undefined,
        image: infoImage.trim() || undefined,
        caption: infoCaption.trim() || undefined,
        data: infoFields.filter(f => f.label.trim() && f.value.trim())
      } : undefined
    };

    onSave(newPage, isEditorUnlocked);
  };

  return (
    <div className="content-area editor-container">
      <div className="editor-header">
        <h2>{initialPage ? `Editing "${initialPage.title}"` : '📖 Create / Submit Wiki Page'}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={onCancel}>
            <X size={15} /> Cancel
          </button>
          <button className="btn-primary" onClick={handleFormSubmit}>
            {isEditorUnlocked ? <Save size={15} /> : <Send size={15} />}
            {isEditorUnlocked
              ? 'Save & Publish Live'
              : initialPage
              ? 'Submit Edit for Admin Approval'
              : 'Submit Page for Admin Approval'}
          </button>
        </div>
      </div>

      {!isEditorUnlocked && (
        <div style={{ padding: '10px 14px', background: 'var(--badge-bg)', border: '1px solid var(--border-subtle)', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--badge-text)', fontWeight: 700 }}>
          📩 <strong>Non-Admin Mode:</strong> Your {initialPage ? 'proposed edit' : 'page submission'} will be sent to the Admin Moderation Queue for review. Admins with the password can approve and publish it live!
        </div>
      )}

      {/* Main Metadata Form */}
      <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="form-row">
          <div className="form-group">
            <label>Article Title *</label>
            <input
              type="text"
              className="editor-input"
              placeholder="e.g. Inside Joke Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Category *</span>
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                onClick={() => setIsCreatingCategory(!isCreatingCategory)}
              >
                {isCreatingCategory ? 'Select Existing Category' : '+ New Category'}
              </button>
            </label>

            {isCreatingCategory ? (
              <input
                type="text"
                className="editor-input"
                placeholder="Type New Category Name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
            ) : (
              <select
                className="editor-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Author / Credit *</label>
            <input
              type="text"
              className="editor-input"
              placeholder="Your Username"
              value={editedBy}
              onChange={(e) => setEditedBy(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Key size={13} /> Deletion Password {isAiAuthor ? '(AI Pages Deletable Without Password)' : '(Only Creator Can Delete)'}
            </label>
            <input
              type="password"
              className="editor-input"
              placeholder={isAiAuthor ? 'AI Page (No Password Required)' : 'Set Password To Restrict Deletion'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input
            type="text"
            className="editor-input"
            placeholder="e.g. meme, drama, showcase"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
          />
        </div>

        {/* Infobox Builder Card */}
        <div className="infobox-builder-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="checkbox"
                checked={hasInfobox}
                onChange={(e) => setHasInfobox(e.target.checked)}
              />
              Include MediaWiki / SoyjakWiki Infobox
            </label>
          </div>

          {hasInfobox && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              <div className="form-row">
                <div className="form-group">
                  <label>Infobox Title</label>
                  <input
                    type="text"
                    className="editor-input"
                    placeholder={title || 'Infobox Header'}
                    value={infoTitle}
                    onChange={(e) => setInfoTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Top Badge Text</label>
                  <input
                    type="text"
                    className="editor-input"
                    placeholder="e.g. INSIDE JOKE"
                    value={infoBadge}
                    onChange={(e) => setInfoBadge(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Image URL (Optional)</label>
                  <input
                    type="text"
                    className="editor-input"
                    placeholder="https://images.unsplash.com/..."
                    value={infoImage}
                    onChange={(e) => setInfoImage(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Image Caption</label>
                  <input
                    type="text"
                    className="editor-input"
                    placeholder="Photo description"
                    value={infoCaption}
                    onChange={(e) => setInfoCaption(e.target.value)}
                  />
                </div>
              </div>

              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Infobox Data Table Fields</label>
              {infoFields.map((field, idx) => (
                <div key={idx} className="form-row" style={{ alignItems: 'center' }}>
                  <input
                    type="text"
                    className="editor-input"
                    placeholder="Key (e.g. Created By)"
                    value={field.label}
                    onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
                  />
                  <input
                    type="text"
                    className="editor-input"
                    placeholder="Value (e.g. MemberName)"
                    value={field.value}
                    onChange={(e) => handleFieldChange(idx, 'value', e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ color: '#ef4444', padding: '8px' }}
                    onClick={() => handleRemoveField(idx)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary"
                style={{ width: 'fit-content', marginTop: '4px' }}
                onClick={handleAddField}
              >
                <Plus size={14} /> Add Row
              </button>
            </div>
          )}
        </div>

        {/* Toolbar & Split-Screen Markdown Editor */}
        <div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, alignSelf: 'center', color: 'var(--text-muted)', marginRight: '8px' }}>
              Formatting:
            </span>
            <button type="button" className="btn-secondary" style={{ padding: '4px 8px' }} onClick={() => insertSyntax('## ')}>
              <Bold size={14} /> Heading
            </button>
            <button type="button" className="btn-secondary" style={{ padding: '4px 8px' }} onClick={() => insertSyntax('**', '**')}>
              <Bold size={14} /> Bold
            </button>
            <button type="button" className="btn-secondary" style={{ padding: '4px 8px' }} onClick={() => insertSyntax('*', '*')}>
              <Italic size={14} /> Italic
            </button>
            <button type="button" className="btn-secondary" style={{ padding: '4px 8px' }} onClick={handleInsertImagePrompt} title="Insert inline image">
              <ImageIcon size={14} /> Insert Image
            </button>
            <button type="button" className="btn-secondary" style={{ padding: '4px 8px' }} onClick={() => insertSyntax('> ')}>
              Quote
            </button>
            <button type="button" className="btn-secondary" style={{ padding: '4px 8px' }} onClick={() => insertSyntax('```text\n', '\n```')}>
              <Code size={14} /> Code
            </button>
            <button type="button" className="btn-secondary" style={{ padding: '4px 8px' }} onClick={() => insertSyntax('[Link Title](wiki:Page_ID)')}>
              Wiki Link
            </button>
          </div>

          <div className="editor-grid">
            <textarea
              className="editor-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article in Markdown format. Use ![caption](URL) to add images!"
            />

            <div className="editor-preview-box">
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                <Eye size={13} style={{ display: 'inline', marginRight: 4 }} /> Live Article Preview
              </div>
              <div
                className="markdown-content"
                dangerouslySetInnerHTML={{ __html: marked.parse(content) as string }}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
