'use client';
import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, MoreVertical, Edit2, Trash2, Eye, LayoutGrid, Table as TableIcon, Route, Book as BookIcon, CheckCircle } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { NoResultsFound } from '@/components/NoResultsFound';
import { AddEditModal, DeleteModal, ViewModal } from '../../components/CourseModals';
import type { Course, Carrier, ModalMode, AddTab, SingleForm, BulkEntry } from '../../components/CourseModals';
import { CourseIcon } from '@/components/CourseIcon';

const API = (process.env.NEXT_PUBLIC_API_URL + "/api/inspire" || 'http://localhost:5000/api/inspire');
const COURSE = `${API}/course`;
const CARRIER = `${API}/carrier`;
const BOOKS = `${API}/books`;

// Filtered data based on search
const filterCourses = (courses: Course[], query: string) => {
    return courses.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.courseId.toLowerCase().includes(query.toLowerCase())
    );
};

const BLANK: SingleForm = { courseId: '', name: '', description: '', carrierIds: [] };

export default function CourseOverlook() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [carriers, setCarriers] = useState<Carrier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [isOffline, setIsOffline] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [modal, setModal] = useState<ModalMode>('closed');
    const [tab, setTab] = useState<AddTab>('single');
    const [selected, setSelected] = useState<Course | null>(null);
    const [form, setForm] = useState<SingleForm>(BLANK);
    const [bulkForms, setBulkForms] = useState<BulkEntry[]>([{ ...BLANK }]);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [exiting, setExiting] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        const h = (e: MouseEvent) => { if (!(e.target as Element).closest('.course-menu')) setActiveMenu(null); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const load = async () => {
        setIsLoading(true);
        try {
            const [cr, ca] = await Promise.all([
                fetch(`${COURSE}/view`),
                fetch(`${CARRIER}/view`)
                // fetch(`${BOOKS}/view`)
            ]);
            const cd = await cr.json();
            const cad = await ca.json();
            // const bd = await br.json();

            if (cd.success) { // && bd.success) {
                //  const books = []; // bd.data || [];
                const coursesWithCount = cd.data.map((course: any) => ({
                    ...course,
                    //  bookCount: books.filter((b: any) => b.courseId === course.id).length
                }));
                setCourses(coursesWithCount);
            }
            if (cad.success) setCarriers(cad.data);
        } catch { /* offline */ } finally { setIsLoading(false); }
    };

    const showToast = (msg: string) => {
        setToast(msg); setExiting(false);
        setTimeout(() => { setExiting(true); setTimeout(() => setToast(null), 500); }, 3000);
    };

    const openAdd = () => { setModal('add'); setTab('single'); setForm(BLANK); setBulkForms([{ ...BLANK }]); setError(null); };
    const openEdit = (c: Course) => { setSelected(c); setForm({ courseId: c.courseId, name: c.name, description: c.description, carrierIds: c.carrierIds }); setError(null); setModal('edit'); setActiveMenu(null); };
    const openDelete = (c: Course) => { setSelected(c); setModal('delete'); setActiveMenu(null); };
    const openView = (c: Course) => { setSelected(c); setModal('view'); setActiveMenu(null); };

    const handleSubmit = async () => {
        setIsActionLoading(true); setError(null);
        try {
            if (modal === 'edit' && selected) {
                const r = await fetch(`${COURSE}/${selected.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
                const d = await r.json();
                if (d.success) { setCourses(courses.map(c => c.id === selected.id ? d.data : c)); setModal('closed'); showToast('Course updated!'); }
                else setError(d.message);
            } else if (tab === 'single') {
                const r = await fetch(`${COURSE}/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
                const d = await r.json();
                if (d.success) { setCourses([d.data, ...courses]); setModal('closed'); showToast('Course created!'); }
                else setError(d.message);
            } else {
                const r = await fetch(`${COURSE}/bulk`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ courses: bulkForms }) });
                const d = await r.json();
                if (d.success) { setCourses([...d.data, ...courses]); setModal('closed'); showToast(`${d.data.length} courses added!`); }
                else setError(d.message);
            }
        } catch (e: any) { setError(e.message); } finally { setIsActionLoading(false); }
    };

    const handleDelete = async () => {
        setIsActionLoading(true);
        try {
            if (modal === 'deleteAll') {
                const r = await fetch(`${COURSE}/deleteAll`, { method: 'DELETE' });
                const d = await r.json();
                if (d.success) { setCourses([]); setModal('closed'); showToast('All courses cleared!'); }
            } else if (selected) {
                const r = await fetch(`${COURSE}/${selected.id}`, { method: 'DELETE' });
                const d = await r.json();
                if (d.success) { setCourses(courses.filter(c => c.id !== selected.id)); setModal('closed'); showToast('Course deleted!'); }
            }
        } catch { /* ignore */ } finally { setIsActionLoading(false); }
    };

    const ContextMenu = ({ course }: { course: Course }) => (
        <div className="course-menu relative">
            <button onClick={() => setActiveMenu(activeMenu === course.id ? null : course.id)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-[#80868b] transition-opacity">
                <MoreVertical size={16} />
            </button>
            {activeMenu === course.id && (
                <div className="absolute right-0 top-8 w-44 bg-white dark:bg-[#2d2d2d] border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                    <button onClick={() => openView(course)} className="w-full text-left px-4 py-2 text-sm text-[#202124] dark:text-white hover:bg-gray-50 dark:hover:bg-[#3a3a3a] flex items-center gap-2"><Eye size={14} className="text-[#80868b]" />View Course</button>
                    <button onClick={() => openEdit(course)} className="w-full text-left px-4 py-2 text-sm text-[#202124] dark:text-white hover:bg-gray-50 dark:hover:bg-[#3a3a3a] flex items-center gap-2"><Edit2 size={14} className="text-[#80868b]" />Edit Course</button>
                    <button onClick={() => openDelete(course)} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"><Trash2 size={14} />Delete Course</button>
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

            {courses.length === 0 ? (
                /* ── Empty State ── */
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/10 rounded-full flex items-center justify-center mb-6">
                        <BookOpen size={38} className="text-purple-300 dark:text-purple-700" />
                    </div>
                    <h3 className="text-xl font-bold text-[#202124] dark:text-white mb-2">No courses yet</h3>
                    <p className="text-[#5f6368] dark:text-gray-400 text-sm max-w-sm mb-8">Your course directory is empty. Create your first course to get started.</p>
                    <button onClick={openAdd} className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm transition-colors">
                        <Plus size={18} /> Create Course
                    </button>
                </div>
            ) : (
                <>
                    {/* ── Header ── */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-[#202124] dark:text-white">Course Overlook</h2>
                                <p className="text-sm text-[#5f6368] dark:text-gray-400 mt-0.5">Manage and organise platform courses</p>
                            </div>
                            {/* View toggle */}
                            <div className="flex bg-gray-100 dark:bg-[#1a1a1a] p-1 rounded-lg">
                                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-[#2d2d2d] shadow-sm text-primary' : 'text-[#80868b]'}`}><LayoutGrid size={17} /></button>
                                <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white dark:bg-[#2d2d2d] shadow-sm text-primary' : 'text-[#80868b]'}`}><TableIcon size={17} /></button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex justify-end flex-1">
                                <SearchBar
                                    placeholder="Search courses..."
                                    value={searchQuery}
                                    onSearch={setSearchQuery}
                                />
                            </div>
                            <button onClick={() => setModal('deleteAll')} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1a1a] text-[#5f6368] border border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all">
                                <Trash2 size={16} /> Clear All Courses
                            </button>
                            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium shadow-sm transition-colors">
                                <Plus size={16} /> Add Course
                            </button>
                        </div>
                    </div>

                    {filterCourses(courses, searchQuery).length === 0 ? (
                        <NoResultsFound
                            searchTerm={searchQuery}
                            onClear={() => setSearchQuery('')}
                        />
                    ) : (
                        viewMode === 'grid' ? (
                            /* ── Grid View ── */
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {filterCourses(courses, searchQuery).map(course => (
                                    <div key={course.id} className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 rounded-xl p-4 group transition-all duration-200">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="p-2 bg-transparent dark:transparent-900/15 rounded-lg"><CourseIcon courseName={course.name} /></div>
                                            <ContextMenu course={course} />
                                        </div>
                                        <h3 className="text-sm font-semibold text-[#202124] dark:text-white truncate mb-1" title={course.name}>{course.name}</h3>
                                        <p className="text-[10px] font-mono text-purple-600 bg-purple-50 dark:bg-purple-900/15 px-1.5 py-0.5 rounded inline-block mb-2">{course.courseId}</p>
                                        <p className="text-xs text-[#5f6368] dark:text-gray-400 line-clamp-2 min-h-[2rem] mb-3" title={course.description}>{course.description}</p>
                                        <div className="flex justify-end gap-3 pt-3 border-t border-gray-50 dark:border-gray-800/50">
                                            <span className="flex items-center gap-1 text-[11px] text-[#80868b] font-medium"><Route size={12} />{course.carrierIds?.length || 0}</span>
                                            <span className="flex items-center gap-1 text-[11px] text-[#80868b] font-medium"><BookIcon size={12} />{course.bookCount || 0}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* ── Table View ── */
                            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-[#111] border-b border-gray-200 dark:border-gray-800">
                                        <tr>{['Course ID', 'Course Name', 'Description', 'Carriers', 'Books', 'Created At', ''].map((h, i) => (
                                            <th key={i} className={`px-5 py-4 text-[11px] font-bold text-[#202124] dark:text-white uppercase tracking-wider ${i >= 3 && i <= 4 ? 'text-center' : i === 6 ? 'text-right' : ''}`}>{h}</th>
                                        ))}</tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {filterCourses(courses, searchQuery).map(course => (
                                            <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-[#212121] transition-colors">
                                                <td className="px-5 py-4 text-sm font-mono text-purple-600">{course.courseId}</td>
                                                <td className="px-5 py-4 text-sm font-medium text-[#202124] dark:text-white">{course.name}</td>
                                                <td className="px-5 py-4 text-sm text-[#5f6368] dark:text-gray-400 max-w-[220px] truncate">{course.description}</td>
                                                <td className="px-5 py-4 text-sm text-center font-semibold text-[#5f6368]">{course.carrierIds?.length || 0}</td>
                                                <td className="px-5 py-4 text-sm text-center font-semibold text-[#5f6368]">{course.bookCount || 0}</td>
                                                <td className="px-5 py-4 text-sm text-[#80868b]">{course.createdAt?.seconds ? new Date(course.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</td>
                                                <td className="px-5 py-4 text-right">
                                                    <div className="group inline-block"><ContextMenu course={course} /></div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                </>
            )}

            {/* Modals */}
            {(modal === 'add' || modal === 'edit') && (
                <AddEditModal mode={modal} tab={tab} setTab={setTab} form={form} setForm={setForm} bulkForms={bulkForms} setBulkForms={setBulkForms} carriers={carriers} onClose={() => setModal('closed')} onSubmit={handleSubmit} isLoading={isActionLoading} error={error} />
            )}
            {(modal === 'delete' || modal === 'deleteAll') && (
                <DeleteModal mode={modal} course={selected} onClose={() => setModal('closed')} onConfirm={handleDelete} isLoading={isActionLoading} />
            )}
            {modal === 'view' && selected && (
                <ViewModal course={selected} carriers={carriers} onClose={() => setModal('closed')} />
            )}
        </div>
    );
}
