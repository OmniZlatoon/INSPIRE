'use client';
import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, MoreVertical, Edit2, Trash2, Eye, LayoutGrid, Table as TableIcon, CheckCircle, BookMarked } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { NoResultsFound } from '@/components/NoResultsFound';
import { AddEditModal, DeleteModal, ViewModal } from '@/components/BooksModals';
import type { Book, Course, ModalMode, AddTab, BookForm, BulkBookEntry } from '@/components/BooksModals';
import { CourseIcon } from '@/components/CourseIcon';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const BOOKS_API = `${API}/api/inspire/books`;
const COURSES_API = `${API}/api/inspire/course`;

// Filtered data based on search
const filterBooks = (books: Book[], query: string) => {
    return books.filter(b =>
        b.name.toLowerCase().includes(query.toLowerCase()) ||
        b.bookId.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase())
    );
};

const BLANK_FORM: BookForm = { bookId: '', name: '', description: '', author: '', courseId: '', files: [] };

export default function BooksManagement() {
    const [books, setBooks] = useState<Book[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [isOffline, setIsOffline] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [modal, setModal] = useState<ModalMode>('closed');
    const [tab, setTab] = useState<AddTab>('single');
    const [selected, setSelected] = useState<Book | null>(null);
    const [form, setForm] = useState<BookForm>(BLANK_FORM);
    const [bulkForms, setBulkForms] = useState<BulkBookEntry[]>([{ ...BLANK_FORM }]);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [exiting, setExiting] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        const h = (e: MouseEvent) => { if (!(e.target as Element).closest('.book-menu')) setActiveMenu(null); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const load = async () => {
        setIsLoading(true);
        try {
            const [br, cr] = await Promise.all([fetch(`${BOOKS_API}/view`), fetch(`${COURSES_API}/view`)]);
            const [bd, cd] = await Promise.all([br.json(), cr.json()]);
            if (bd.success) setBooks(bd.data);
            if (cd.success) setCourses(cd.data);
        } catch { /* offline */ } finally { setIsLoading(false); }
    };

    const showToast = (msg: string) => {
        setToast(msg); setExiting(false);
        setTimeout(() => { setExiting(true); setTimeout(() => setToast(null), 500); }, 3000);
    };

    const buildFormData = (f: BookForm) => {
        const fd = new FormData();
        fd.append('bookId', f.bookId); fd.append('name', f.name);
        fd.append('description', f.description); fd.append('author', f.author);
        fd.append('courseId', f.courseId);
        f.files.forEach(file => fd.append('files', file));
        return fd;
    };

    const openAdd = () => { setModal('add'); setTab('single'); setForm(BLANK_FORM); setBulkForms([{ ...BLANK_FORM }]); setError(null); };
    const openEdit = (b: Book) => { setSelected(b); setForm({ bookId: b.bookId, name: b.name, description: b.description, author: b.author, courseId: b.courseId, files: [] }); setError(null); setModal('edit'); setActiveMenu(null); };
    const openDelete = (b: Book) => { setSelected(b); setModal('delete'); setActiveMenu(null); };
    const openView = (b: Book) => { setSelected(b); setModal('view'); setActiveMenu(null); };

    const handleSubmit = async () => {
        setIsActionLoading(true); setError(null);
        try {
            if (modal === 'edit' && selected) {
                const r = await fetch(`${BOOKS_API}/${selected.id}`, { method: 'PUT', body: buildFormData(form) });
                const d = await r.json();
                if (d.success) { setBooks(books.map(b => b.id === selected.id ? { ...b, ...d.data } : b)); setModal('closed'); showToast('Book updated!'); }
                else setError(d.message);
            } else if (tab === 'single') {
                const r = await fetch(`${BOOKS_API}/create`, { method: 'POST', body: buildFormData(form) });
                const d = await r.json();
                if (d.success) { setBooks([d.data, ...books]); setModal('closed'); showToast('Book created!'); }
                else setError(d.message);
            } else {
                // Bulk: sequential uploads
                const results = [];
                for (const f of bulkForms) {
                    const r = await fetch(`${BOOKS_API}/create`, { method: 'POST', body: buildFormData(f) });
                    const d = await r.json();
                    if (d.success) results.push(d.data);
                    else { setError(d.message); setIsActionLoading(false); return; }
                }
                setBooks([...results, ...books]);
                setModal('closed'); showToast(`${results.length} books added!`);
            }
        } catch (e: any) { setError(e.message); } finally { setIsActionLoading(false); }
    };

    const handleDelete = async () => {
        setIsActionLoading(true);
        try {
            const url = modal === 'deleteAll' ? `${BOOKS_API}/deleteAll` : `${BOOKS_API}/${selected?.id}`;
            const r = await fetch(url, { method: 'DELETE' });
            const d = await r.json();
            if (d.success) {
                modal === 'deleteAll' ? setBooks([]) : setBooks(books.filter(b => b.id !== selected?.id));
                setModal('closed'); showToast(modal === 'deleteAll' ? 'All books cleared!' : 'Book deleted!');
            }
        } catch { /* ignore */ } finally { setIsActionLoading(false); }
    };

    const courseName = (id: string) => courses.find(c => c.id === id)?.name || '—';

    const ContextMenu = ({ book }: { book: Book }) => (
        <div className="book-menu relative">
            <button onClick={() => setActiveMenu(activeMenu === book.id ? null : book.id)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-[#80868b] transition-opacity">
                <MoreVertical size={16} />
            </button>
            {activeMenu === book.id && (
                <div className="absolute right-0 top-8 w-44 bg-white dark:bg-[#2d2d2d] border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-50 py-1">
                    <button onClick={() => openView(book)} className="w-full text-left px-4 py-2 text-sm text-[#202124] dark:text-white hover:bg-gray-50 dark:hover:bg-[#3a3a3a] flex items-center gap-2"><Eye size={14} className="text-[#80868b]" />View Book</button>
                    <button onClick={() => openEdit(book)} className="w-full text-left px-4 py-2 text-sm text-[#202124] dark:text-white hover:bg-gray-50 dark:hover:bg-[#3a3a3a] flex items-center gap-2"><Edit2 size={14} className="text-[#80868b]" />Edit Book</button>
                    <button onClick={() => openDelete(book)} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"><Trash2 size={14} />Delete Book</button>
                </div>
            )}
        </div>
    );

    if (isLoading) return <div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" /></div>;

    return (
        <div className="p-8 w-full min-h-full relative">
            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-2.5 px-4 py-2.5 bg-white dark:bg-[#1e1e1e] border border-green-200 dark:border-green-800 rounded-lg shadow-lg transition-all duration-500 ${exiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                    <span className="w-1 h-6 rounded-full bg-green-500 flex-shrink-0" />
                    <CheckCircle size={14} className="text-green-500" />
                    <span className="text-xs font-medium text-[#202124] dark:text-white">{toast}</span>
                </div>
            )}

            {books.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/10 rounded-full flex items-center justify-center mb-6">
                        <BookOpen size={38} className="text-orange-300 dark:text-orange-700" />
                    </div>
                    <h3 className="text-xl font-bold text-[#202124] dark:text-white mb-2">No books yet</h3>
                    <p className="text-[#5f6368] dark:text-gray-400 text-sm max-w-sm mb-8">Your book library is empty. Upload your first book to get started.</p>
                    <button onClick={openAdd} className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm transition-colors">
                        <Plus size={18} /> Create Book
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-[#202124] dark:text-white">Books Management</h2>
                                <p className="text-sm text-[#5f6368] dark:text-gray-400 mt-0.5">Manage and organise course books & materials</p>
                            </div>
                            <div className="flex bg-gray-100 dark:bg-[#1a1a1a] p-1 rounded-lg">
                                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-[#2d2d2d] shadow-sm text-primary' : 'text-[#80868b]'}`}><LayoutGrid size={17} /></button>
                                <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white dark:bg-[#2d2d2d] shadow-sm text-primary' : 'text-[#80868b]'}`}><TableIcon size={17} /></button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex justify-end flex-1">
                                <SearchBar
                                    placeholder="Search books..."
                                    value={searchQuery}
                                    onSearch={setSearchQuery}
                                />
                            </div>
                            <button onClick={() => setModal('deleteAll')} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1a1a] text-[#5f6368] border border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all">
                                <Trash2 size={16} /> Clear All Books
                            </button>
                            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium shadow-sm transition-colors">
                                <Plus size={16} /> Add Book
                            </button>
                        </div>
                    </div>

                    {filterBooks(books, searchQuery).length === 0 ? (
                        <NoResultsFound
                            searchTerm={searchQuery}
                            onClear={() => setSearchQuery('')}
                        />
                    ) : (
                        viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {filterBooks(books, searchQuery).map(book => (
                                    <div key={book.id} className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 rounded-xl p-4 group transition-all duration-200">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="p-2 bg-transparent rounded-lg"><CourseIcon courseName={courseName(book.courseId)} /></div>
                                            <ContextMenu book={book} />
                                        </div>
                                        <h3 className="text-sm font-semibold text-[#202124] dark:text-white truncate mb-1" title={book.name}>{book.name}</h3>
                                        <p className="text-[10px] font-mono text-orange-600 bg-orange-50 dark:bg-orange-900/15 px-1.5 py-0.5 rounded inline-block mb-1">{book.bookId}</p>
                                        <p className="text-[10px] text-[#80868b] italic mb-2 truncate">{book.author}</p>
                                        <p className="text-xs text-[#5f6368] dark:text-gray-400 line-clamp-2 min-h-[2rem] mb-3" title={book.description}>{book.description}</p>
                                        <div className="flex items-center justify-between pt-2.5 border-t border-gray-50 dark:border-gray-800/50">
                                            <span className="text-[10px] text-[#80868b] font-medium truncate mr-2 flex-1">{courseName(book.courseId)}</span>
                                            <span className="flex items-center gap-1 text-[11px] text-[#80868b] font-medium flex-shrink-0">
                                                <BookMarked size={12} />{book.files?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-[#111] border-b border-gray-200 dark:border-gray-800">
                                        <tr>
                                            {['Book ID', 'Name', 'Author', 'Description', 'Course', 'Files', 'Created At', ''].map((h, i) => (
                                                <th key={i} className={`px-5 py-4 text-[11px] font-bold text-[#202124] dark:text-white uppercase tracking-wider ${i === 5 ? 'text-center' : i === 7 ? 'text-right' : ''}`}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {filterBooks(books, searchQuery).map(book => (
                                            <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-[#212121] transition-colors">
                                                <td className="px-5 py-4 text-sm font-mono text-orange-600">{book.bookId}</td>
                                                <td className="px-5 py-4 text-sm font-medium text-[#202124] dark:text-white">{book.name}</td>
                                                <td className="px-5 py-4 text-sm text-[#5f6368] dark:text-gray-400">{book.author}</td>
                                                <td className="px-5 py-4 text-sm text-[#5f6368] dark:text-gray-400 max-w-[180px] truncate">{book.description}</td>
                                                <td className="px-5 py-4 text-sm text-[#5f6368] dark:text-gray-400 max-w-[120px] truncate">{courseName(book.courseId)}</td>
                                                <td className="px-5 py-4 text-sm text-center font-semibold text-[#5f6368]">{book.files?.length || 0}</td>
                                                <td className="px-5 py-4 text-sm text-[#80868b]">{book.createdAt?.seconds ? new Date(book.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</td>
                                                <td className="px-5 py-4 text-right">
                                                    <ContextMenu book={book} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                </>
            )}

            {(modal === 'add' || modal === 'edit') && <AddEditModal mode={modal} tab={tab} setTab={setTab} form={form} setForm={setForm} bulkForms={bulkForms} setBulkForms={setBulkForms} courses={courses} onClose={() => setModal('closed')} onSubmit={handleSubmit} isLoading={isActionLoading} error={error} />}
            {(modal === 'delete' || modal === 'deleteAll') && <DeleteModal mode={modal} book={selected} onClose={() => setModal('closed')} onConfirm={handleDelete} isLoading={isActionLoading} />}
            {modal === 'view' && selected && <ViewModal book={selected} courses={courses} onClose={() => setModal('closed')} />}
        </div>
    );
}
