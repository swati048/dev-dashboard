import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  Eye,
  Save,
  X,
  FileText,
  Calendar,
  Tag,
  StickyNote,
  Code,
  List,
  Heading,
  Bold,
  Italic,
} from "lucide-react";
import { useNotesStore } from "../store/useNotesStore";
import { useActivityStore } from "../store/useActivityStore";
import { Button, Card, Input, Modal } from "../components/ui";
import ConfirmDialog from "../components/ConfirmDialog";
import { toast } from "../utils/toast";
import { cn } from "../utils/cn";

const CATEGORIES = [
  { id: "all", label: "All Notes", color: "text-gray-500" },
  { id: "ideas", label: "Ideas", color: "text-purple-500" },
  { id: "meeting", label: "Meetings", color: "text-blue-500" },
  { id: "code", label: "Code", color: "text-green-500" },
  { id: "personal", label: "Personal", color: "text-yellow-500" },
];

const MARKDOWN_EXAMPLES = `# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text*

- List item 1
- List item 2
- List item 3

1. Numbered list
2. Second item
3. Third item

\`inline code\`

\`\`\`javascript
// Code block
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

> Blockquote text

[Link text](https://example.com)

---

Task list:
- [x] Completed task
- [ ] Pending task
`;

// Note List Item Component
function NoteListItem({ note, isActive, onClick, onDelete }) {
  const getRelativeTime = (date) => {
    const now = new Date();
    const noteDate = new Date(date);
    const diffInSeconds = Math.floor((now - noteDate) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return noteDate.toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    return CATEGORIES.find((c) => c.id === category)?.color || "text-gray-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onClick={onClick}
      className={cn(
        "p-4 rounded-lg border cursor-pointer transition-all group",
        isActive
          ? "bg-surface-elevated border-accent"
          : "bg-surface border-app hover:border-accent"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-primary line-clamp-1 flex-1">
          {note.title || "Untitled Note"}
        </h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface rounded text-muted hover:text-danger transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <p className="text-xs text-muted line-clamp-2 mb-2">
        {note.content || "No content"}
      </p>
      <div className="flex items-center justify-between text-xs">
        <span className={cn("flex items-center gap-1", getCategoryColor(note.category))}>
          <Tag size={12} />
          {CATEGORIES.find((c) => c.id === note.category)?.label || "Uncategorized"}
        </span>
        <span className="text-muted">{getRelativeTime(note.updatedAt)}</span>
      </div>
    </motion.div>
  );
}

// Markdown Toolbar
function MarkdownToolbar({ onInsert }) {
  const tools = [
    { icon: Heading, label: "Heading", syntax: "## " },
    { icon: Bold, label: "Bold", syntax: "**text**" },
    { icon: Italic, label: "Italic", syntax: "*text*" },
    { icon: Code, label: "Code", syntax: "`code`" },
    { icon: List, label: "List", syntax: "- " },
  ];

  return (
    <div className="flex items-center gap-1 p-2 border-b border-app bg-surface-elevated">
      {tools.map((tool) => (
        <button
          key={tool.label}
          onClick={() => onInsert(tool.syntax)}
          className="p-2 rounded hover:bg-surface text-muted hover:text-primary transition-colors"
          title={tool.label}
        >
          <tool.icon size={16} />
        </button>
      ))}
    </div>
  );
}

// Main Notes Component
export default function Notes() {
  const notes = useNotesStore((s) => s.notes);
  const addNote = useNotesStore((s) => s.addNote);
  const updateNote = useNotesStore((s) => s.updateNote);
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const addActivity = useActivityStore((s) => s.addActivity);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, note: null });

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "ideas",
  });

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle new note
  const handleNewNote = () => {
    setForm({
      title: "",
      content: "",
      category: "ideas",
    });
    setSelectedNote(null);
    setIsEditing(true);
    setShowPreview(false);
  };

  // Handle select note
  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setForm({
      title: note.title,
      content: note.content,
      category: note.category,
    });
    setIsEditing(false);
    setShowPreview(false);
  };

  // Handle save note
  const handleSaveNote = () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (selectedNote) {
      // Update existing note
      updateNote(selectedNote.id, form);
      setSelectedNote({ ...selectedNote, ...form });
      toast.success("Note updated!");
      addActivity({
        action: "Updated note",
        item: form.title,
        type: "note_created",
      });
    } else {
      // Create new note
      const newNote = addNote(form);
      setSelectedNote(newNote);
      toast.success("Note created!");
      addActivity({
        action: "Created note",
        item: form.title,
        type: "note_created",
      });
    }
    setIsEditing(false);
  };

  // Handle delete note
  const handleDeleteNote = (note) => {
    setDeleteDialog({ open: true, note });
  };

  // Insert markdown syntax
  const handleInsertSyntax = (syntax) => {
    setForm({ ...form, content: form.content + syntax });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Notes</h1>
          <p className="text-muted mt-1">
            Write and organize your notes with markdown support
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowHelp(true)}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <FileText size={18} />
            Markdown Guide
          </Button>
          <Button onClick={handleNewNote} className="flex items-center gap-2">
            <Plus size={18} />
            New Note
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* Sidebar - Notes List */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 overflow-hidden">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={18}
            />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface border border-app text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all",
                  selectedCategory === category.id
                    ? "bg-accent text-white"
                    : "bg-surface-elevated text-muted hover:text-primary border border-app"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            <AnimatePresence>
              {filteredNotes.length === 0 ? (
                <div className="text-center py-12 text-muted">
                  <StickyNote size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No notes found</p>
                  <Button onClick={handleNewNote} size="sm" className="mt-4">
                    Create your first note
                  </Button>
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <NoteListItem
                    key={note.id}
                    note={note}
                    isActive={selectedNote?.id === note.id}
                    onClick={() => handleSelectNote(note)}
                    onDelete={handleDeleteNote}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Content - Editor/Preview */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col overflow-hidden">
          {selectedNote || isEditing ? (
            <Card className="bg-surface border-app flex flex-col h-full overflow-hidden">
              {/* Note Header */}
              <div className="flex items-center justify-between p-4 border-b border-app">
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Note title..."
                      className="text-xl font-bold bg-transparent border-none outline-none text-primary w-full"
                    />
                  ) : (
                    <h2 className="text-xl font-bold text-primary">
                      {selectedNote.title}
                    </h2>
                  )}
                  {isEditing && (
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="mt-2 px-2 py-1 rounded bg-surface-elevated border border-app text-sm text-secondary"
                    >
                      {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={() => setShowPreview(!showPreview)}
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        {showPreview ? <Edit2 size={16} /> : <Eye size={16} />}
                        {showPreview ? "Edit" : "Preview"}
                      </Button>
                      <Button
                        onClick={handleSaveNote}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Save size={16} />
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          if (selectedNote) {
                            setForm({
                              title: selectedNote.title,
                              content: selectedNote.content,
                              category: selectedNote.category,
                            });
                            setIsEditing(false);
                          } else {
                            setSelectedNote(null);
                            setIsEditing(false);
                          }
                        }}
                        variant="secondary"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-hidden">
                {isEditing ? (
                  <div className="h-full flex flex-col">
                    {!showPreview && <MarkdownToolbar onInsert={handleInsertSyntax} />}
                    {showPreview ? (
                      <div className="flex-1 overflow-y-auto p-6 prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {form.content || "*No content*"}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <textarea
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        placeholder="Start writing... (Supports Markdown)"
                        className="flex-1 w-full p-6 bg-transparent border-none outline-none text-primary resize-none font-mono text-sm"
                      />
                    )}
                  </div>
                ) : (
                  <div className="h-full overflow-y-auto p-6 prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                    >
                      {selectedNote.content || "*No content*"}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full text-muted">
              <div className="text-center">
                <FileText size={64} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg mb-2">No note selected</p>
                <p className="text-sm mb-4">
                  Select a note from the list or create a new one
                </p>
                <Button onClick={handleNewNote}>
                  <Plus size={16} className="mr-2" />
                  Create Note
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Markdown Help Modal */}
      <Modal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        title="Markdown Syntax Guide"
        size="2xl"
      >
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {MARKDOWN_EXAMPLES}
          </ReactMarkdown>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, note: null })}
        onConfirm={() => {
          const note = deleteDialog.note;
          if (note) {
            deleteNote(note.id);
            toast.success("Note deleted");
            addActivity({
              action: "Deleted note",
              item: note.title,
              type: "note_created",
            });
            setSelectedNote(null);
            setIsEditing(false);
          }
          setDeleteDialog({ open: false, note: null });
        }}
        title="Delete Note"
        message={`Are you sure you want to delete "${deleteDialog.note?.title || "this note"}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
