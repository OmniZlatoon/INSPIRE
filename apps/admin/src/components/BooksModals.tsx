'use client';
import React from 'react';
import { X, Trash2, AlertTriangle, PlusCircle, ChevronDown, Check, Upload, FileText, FileType, Presentation, BookOpen } from 'lucide-react';
import { CourseIcon } from './CourseIcon';
export interface Course { id: string; courseId: string; name: string; }
export interface BookFile { name: string; type: string; size: number; }
export interface Book { id: string; bookId: string; name: string; description: string; author: string; courseId: string; files: BookFile[]; createdAt: any; }
export type ModalMode = 'closed' | 'add' | 'edit' | 'delete' | 'deleteAll' | 'view';
export type AddTab = 'single' | 'bulk';
export interface BookForm { bookId: string; name: string; description: string; author: string; courseId: string; files: File[]; }
export interface BulkBookEntry { bookId: string; name: string; description: string; author: string; courseId: string; files: File[]; }

const ACCEPTED = '.pdf,.doc,.docx,.ppt,.pptx';
const ACCEPTED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];

function fileIcon(type: string) {
    if (type.includes('pdf')) return <FileText size={14} className="text-red-500" />;
    if (type.includes('word') || type.includes('document')) return <FileType size={14} className="text-blue-500" />;
    return <Presentation size={14} className="text-orange-500" />;
}
function fmtSize(bytes: number) { return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`; }

// ─── Course Dropdown ──────────────────────────────────────────────────────────
export function CourseDropdown({ courses, selected, onSelect }: { courses: Course[]; selected: string; onSelect: (id: string) => void }) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
    }, []);
    const sel = courses.find(c => c.id === selected);
    return (
        <div className="relative" ref={ref}>
            <button type="button" onClick={() => setOpen(!open)} className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-[#202124] dark:text-white hover:border-primary transition-colors">
                <span className={sel ? 'text-[#202124] dark:text-white font-medium' : 'text-gray-400 dark:text-gray-600'}>{sel ? sel.name : 'Select a Course...'}</span>
                <ChevronDown size={16} className={`text-[#80868b] transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 rounded-xl shadow-2xl z-50 max-h-52 overflow-y-auto py-1">
                    {courses.length === 0 && <p className="text-center text-xs text-[#80868b] py-4">No courses found</p>}
                    {courses.map(c => (
                        <button key={c.id} type="button" onClick={() => { onSelect(c.id); setOpen(false); }} className="w-full flex justify-between items-center px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors">
                            <span className="font-medium text-[#202124] dark:text-white">{c.name}</span>
                            {selected === c.id && <Check size={15} className="text-green-500" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── File Picker ──────────────────────────────────────────────────────────────
export function FilePicker({ files, onChange }: { files: File[]; onChange: (f: File[]) => void }) {
    const ref = React.useRef<HTMLInputElement>(null);
    const handleFiles = (incoming: FileList | null) => {
        if (!incoming) return;
        const valid = Array.from(incoming).filter(f => ACCEPTED_TYPES.includes(f.type));
        onChange([...files, ...valid]);
    };
    return (
        <div>
            <label className="block text-sm font-semibold text-[#202124] dark:text-white mb-2">Attach Files <span className="text-[10px] font-normal text-[#80868b]">(PDF, DOCX, PPT — max 10 MB each)</span></label>
            <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => ref.current?.click()}>
                <Upload size={20} className="mx-auto text-[#80868b] mb-1" />
                <p className="text-xs text-[#5f6368] dark:text-gray-400">Click or drag files here</p>
                <input ref={ref} type="file" multiple accept={ACCEPTED} className="hidden" onChange={e => handleFiles(e.target.files)} />
            </div>
            {files.length > 0 && (
                <div className="mt-2 space-y-1.5">
                    {files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-[#121212] rounded-lg border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-2 min-w-0">
                                {fileIcon(f.type)}
                                <span className="text-xs font-medium text-[#202124] dark:text-white truncate">{f.name}</span>
                                <span className="text-[10px] text-[#80868b] flex-shrink-0">{fmtSize(f.size)}</span>
                            </div>
                            <button onClick={() => onChange(files.filter((_, j) => j !== i))} className="text-[#80868b] hover:text-red-500 ml-2"><X size={14} /></button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Single Book Form ─────────────────────────────────────────────────────────
export function SingleBookForm({ form, onChange, courses }: { form: BookForm; onChange: (f: BookForm) => void; courses: Course[] }) {
    const inp = "w-full px-4 py-3 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm text-[#202124] dark:text-white dark:caret-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600";
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-[#202124] dark:text-white mb-2">Select Course</label>
                <CourseDropdown courses={courses} selected={form.courseId} onSelect={id => onChange({ ...form, courseId: id })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-[#202124] dark:text-white mb-2">Book ID</label>
                    <input className={inp} placeholder="e.g. BK101" value={form.bookId} onChange={e => onChange({ ...form, bookId: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-[#202124] dark:text-white mb-2">Book Name</label>
                    <input className={inp} placeholder="Introduction to Algebra" value={form.name} onChange={e => onChange({ ...form, name: e.target.value })} />
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-[#202124] dark:text-white mb-2">Author</label>
                <input className={inp} placeholder="e.g. John Doe" value={form.author} onChange={e => onChange({ ...form, author: e.target.value })} />
            </div>
            <div>
                <label className="block text-sm font-semibold text-[#202124] dark:text-white mb-2">Description</label>
                <textarea rows={3} className={`${inp} resize-none`} placeholder="Brief overview of this book..." value={form.description} onChange={e => onChange({ ...form, description: e.target.value })} />
            </div>
            <FilePicker files={form.files} onChange={files => onChange({ ...form, files })} />
        </div>
    );
}

// ─── Bulk Book Form ───────────────────────────────────────────────────────────
export function BulkBookForm({ forms, setForms, courses }: { forms: BulkBookEntry[]; setForms: (f: BulkBookEntry[]) => void; courses: Course[] }) {
    const inp = "w-full px-4 py-2.5 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-lg outline-none text-sm text-[#202124] dark:text-white dark:caret-white placeholder:text-gray-400 dark:placeholder:text-gray-600";
    const upd = (idx: number, field: keyof BulkBookEntry, val: any) => setForms(forms.map((f, i) => i !== idx ? f : { ...f, [field]: val }));
    return (
        <div className="space-y-4">
            {forms.map((form, idx) => (
                <div key={idx} className="p-5 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50/30 dark:bg-[#121212]/30 space-y-3 relative">
                    <button className="absolute top-4 right-4 text-[#80868b] hover:text-red-500" onClick={() => setForms(forms.filter((_, i) => i !== idx))}><Trash2 size={14} /></button>
                    <div>
                        <label className="block text-xs font-semibold text-[#202124] dark:text-white mb-1.5">Course</label>
                        <CourseDropdown courses={courses} selected={form.courseId} onSelect={id => upd(idx, 'courseId', id)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input placeholder="Book ID" value={form.bookId} onChange={e => upd(idx, 'bookId', e.target.value)} className={inp} />
                        <input placeholder="Book Name" value={form.name} onChange={e => upd(idx, 'name', e.target.value)} className={inp} />
                    </div>
                    <input placeholder="Author" value={form.author} onChange={e => upd(idx, 'author', e.target.value)} className={inp} />
                    <textarea rows={2} placeholder="Description" value={form.description} onChange={e => upd(idx, 'description', e.target.value)} className={`${inp} resize-none`} />
                    <FilePicker files={form.files} onChange={files => upd(idx, 'files', files)} />
                </div>
            ))}
            <button onClick={() => setForms([...forms, { bookId: '', name: '', description: '', author: '', courseId: '', files: [] }])} className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-[#5f6368] hover:border-primary hover:text-primary flex items-center justify-center gap-2 font-medium transition-all">
                <PlusCircle size={16} /> Add Another Book
            </button>
        </div>
    );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
interface AddEditProps { mode: ModalMode; tab: AddTab; setTab: (t: AddTab) => void; form: BookForm; setForm: (f: BookForm) => void; bulkForms: BulkBookEntry[]; setBulkForms: (f: BulkBookEntry[]) => void; courses: Course[]; onClose: () => void; onSubmit: () => void; isLoading: boolean; error: string | null; }
export function AddEditModal({ mode, tab, setTab, form, setForm, bulkForms, setBulkForms, courses, onClose, onSubmit, isLoading, error }: AddEditProps) {
    const isEdit = mode === 'edit';
    const singleValid = form.bookId && form.name && form.description && form.author && form.courseId;
    const bulkValid = bulkForms.every(f => f.bookId && f.name && f.description && f.author && f.courseId);
    const valid = isEdit || tab === 'single' ? singleValid : bulkValid;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#111]/50">
                    <h3 className="text-xl font-bold text-[#202124] dark:text-white">{isEdit ? 'Edit Book' : 'Add Book'}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-[#5f6368]"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {!isEdit && (
                        <div className="flex p-1 bg-gray-100 dark:bg-[#111] rounded-xl mb-6">
                            {(['single', 'bulk'] as AddTab[]).map(t => (
                                <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-white dark:bg-[#2d2d2d] shadow-sm text-primary' : 'text-[#5f6368]'}`}>
                                    {t === 'single' ? 'Add a Book' : 'Add Bulk Books'}
                                </button>
                            ))}
                        </div>
                    )}
                    {(isEdit || tab === 'single')
                        ? <SingleBookForm form={form} onChange={setForm} courses={courses} />
                        : <BulkBookForm forms={bulkForms} setForms={setBulkForms} courses={courses} />
                    }
                </div>
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 relative overflow-hidden">
                    {isLoading && (
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-transparent">
                            <div className="h-full bg-green-500 w-1/2 animate-indeterminate" />
                        </div>
                    )}
                    {error && <div className="flex items-center gap-2 p-3 mb-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-xs border border-red-100 dark:border-red-800"><AlertTriangle size={14} />{error}</div>}
                    <div className="flex justify-end gap-3">
                        <button onClick={onClose} className="px-5 py-2 rounded-lg text-[#5f6368] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] font-medium">Cancel</button>
                        <button onClick={onSubmit} disabled={isLoading || !valid} className={`px-8 py-2 rounded-lg font-bold min-w-[140px] flex items-center justify-center transition-all ${isLoading || !valid ? 'bg-gray-200 text-[#80868b] cursor-not-allowed' : 'bg-primary hover:bg-blue-600 text-white'}`}>
                            {isLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : isEdit ? 'Update Book' : 'Create Book'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
export function DeleteModal({ mode, book, onClose, onConfirm, isLoading }: { mode: ModalMode; book: Book | null; onClose: () => void; onConfirm: () => void; isLoading: boolean }) {
    const isAll = mode === 'deleteAll';
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl w-full max-w-md shadow-2xl p-8">
                <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-5 mx-auto"><Trash2 size={28} className="text-red-500" /></div>
                <h3 className="text-xl font-bold text-[#202124] dark:text-white text-center mb-2">{isAll ? 'Clear All Books?' : 'Delete Book?'}</h3>
                <p className="text-[#5f6368] text-center text-sm mb-8">{isAll ? 'This permanently deletes all books. Cannot be undone.' : `Delete "${book?.name}"? This action is permanent.`}</p>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={onClose} className="py-2.5 rounded-xl font-semibold text-[#5f6368] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2d2d2d]">Cancel</button>
                    <button onClick={onConfirm} disabled={isLoading} className="py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 flex items-center justify-center">
                        {isLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Yes, Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── View Modal ───────────────────────────────────────────────────────────────
export function ViewModal({ book, courses, onClose }: { book: Book; courses: Course[]; onClose: () => void }) {
    const course = courses.find(c => c.id === book.courseId);
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white dark:bg-[#111] rounded-2xl w-[80vw] max-h-[88vh] shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800">
                {/* Header Bar */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-transparent text-purple-600 dark:text-purple-400 flex items-center justify-center border-none flex-shrink-0">
                            <CourseIcon courseName={course?.name || ''} size={35} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5">Book Specification</p>
                            <h2 className="text-lg font-bold text-[#202124] dark:text-white leading-tight">{book.name}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-[#2d2d2d] rounded-lg font-mono font-bold text-[#5f6368] dark:text-gray-300 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                            {book.bookId}
                        </span>
                        <span className="text-xs px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg font-semibold text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/40">Active</span>
                        <button onClick={onClose} className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-[#5f6368] transition-colors"><X size={20} /></button>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-800 min-h-full">
                        {/* ── Left / Main Column ── */}
                        <div className="lg:col-span-2 p-8 space-y-10">
                            {/* Introduction */}
                            <section>
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-3">Book Overview</h3>
                                <p className="text-base text-[#3c4043] dark:text-gray-300 leading-7">{book.description}</p>
                            </section>

                            {/* Attached Files */}
                            {book.files && book.files.length > 0 && (
                                <section>
                                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-4">Attached Files</h3>
                                    <div className="space-y-2">
                                        {book.files.map((f, i) => (
                                            <div key={i} className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-lg">
                                                {fileIcon(f.type)}
                                                <span className="text-xs font-medium text-[#202124] dark:text-white flex-1 truncate">{f.name}</span>
                                                <span className="text-[10px] text-[#80868b]">{fmtSize(f.size)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* ── Right / Sidebar Column ── */}
                        <div className="p-8 space-y-10 bg-gray-50/40 dark:bg-[#0d0d0d]">
                            {/* Stats */}
                            <section>
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-4">Overview</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="p-4 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                                        <p className="text-2xl font-black text-[#202124] dark:text-white">{book.files?.length || 0}</p>
                                        <p className="text-[10px] uppercase tracking-wider text-[#80868b] mt-1 flex items-center justify-center gap-1"><BookOpen size={11} /> Attached Files</p>
                                    </div>
                                </div>
                            </section>

                            {/* Author */}
                            <section>
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-2">Author</h3>
                                <p className="text-sm font-semibold text-[#202124] dark:text-white">{book.author || 'Unknown Author'}</p>
                            </section>

                            {/* Associated Course */}
                            <section>
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-2">Associated Course</h3>
                                {course ? (
                                    <span className="inline-block text-xs px-3 py-1.5 bg-[#e8f0fe] dark:bg-blue-900/20 text-[#1a73e8] dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-800/30 font-semibold">{course.name}</span>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No course associated.</p>
                                )}
                            </section>

                            {/* System Footer */}
                            <div className="pt-6 border-t border-dashed border-gray-200 dark:border-gray-800">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#80868b]">System Generated</p>
                                <p className="text-[10px] font-mono mt-1 text-gray-400">{book.createdAt?.seconds ? new Date(book.createdAt.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Just now'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
