'use client';
import React, { useState, useEffect } from 'react';
import { LayoutGrid, Plus, MoreVertical, Edit2, Trash2, Eye, Route, BookOpen, Layers, CheckCircle, Search } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { NoResultsFound } from '@/components/NoResultsFound';
import { CourseIcon } from '@/components/CourseIcon';

import { AddEditCategoryModal, DeleteCategoryModal, ViewCategoryModal, BLANK_CATEGORY } from '@/components/CategoryModals';
import type { Category, CategoryModalMode, SingleCategoryForm } from '@/components/CategoryModals';

// Modals from other tabs for nested item management
import { AddEditModal as AddEditCourseModal, DeleteModal as DeleteCourseModal, ViewModal as ViewCourseModal } from '@/components/CourseModals';
import type { ModalMode as CourseModalMode } from '@/components/CourseModals';

const BLANK_COURSE = { courseId: '', name: '', description: '', carrierIds: [], whatYouWillLearn: [], skills: [], instructors: [], faqs: [] };

import { AddEditCarrierModal, DeleteCarrierModal, ViewCarrierModal, BLANK as BLANK_CARRIER } from '@/components/CarrierModals';
import type { ModalMode as CarrierModalMode } from '@/components/CarrierModals';

import { AddEditSpecializationModal, DeleteSpecializationModal, ViewSpecializationModal } from '@/components/SpecializationModals';
import type { ModalMode as SpecModalMode } from '@/components/SpecializationModals';

const API = (process.env.NEXT_PUBLIC_API_URL ?? '');
const CATEGORY_API = `${API}/api/inspire/category`;
const SPEC_API = `${API}/api/inspire/specialization`;
const COURSES_API = `${API}/api/inspire/course`;
const CARRIERS_API = `${API}/api/inspire/carrier`;
const BOOKS_API = `${API}/api/inspire/books`;

const SkeletonBlock = () => (
    <div className="mb-6 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 animate-pulse">
        <div className="flex justify-between items-center mb-6">
            <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            <div className="h-6 w-6 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-gray-50 dark:bg-[#121212] rounded-xl border border-gray-100 dark:border-gray-800"></div>
            <div className="h-24 bg-gray-50 dark:bg-[#121212] rounded-xl border border-gray-100 dark:border-gray-800"></div>
            <div className="h-24 bg-gray-50 dark:bg-[#121212] rounded-xl border border-gray-100 dark:border-gray-800"></div>
        </div>
    </div>
);

export default function CategoryTab() {
    // ─── Data State ───
    const [categories, setCategories] = useState<Category[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [carriers, setCarriers] = useState<any[]>([]);
    const [specializations, setSpecializations] = useState<any[]>([]);
    const [allBooks, setAllBooks] = useState<any[]>([]);
    const [dbSkills, setDbSkills] = useState<any[]>([]);

    // ─── UI State ───
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [exiting, setExiting] = useState(false);

    // ─── Category Modal State ───
    const [categoryModal, setCategoryModal] = useState<CategoryModalMode>('closed');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [categoryForm, setCategoryForm] = useState<SingleCategoryForm>(BLANK_CATEGORY);

    // ─── Nested Modal States ───
    const [courseModal, setCourseModal] = useState<CourseModalMode>('closed');
    const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
    const [courseForm, setCourseForm] = useState<any>(BLANK_COURSE);

    const [carrierModal, setCarrierModal] = useState<CarrierModalMode>('closed');
    const [selectedCarrier, setSelectedCarrier] = useState<any | null>(null);
    const [carrierForm, setCarrierForm] = useState<any>(BLANK_CARRIER);

    const [specModal, setSpecModal] = useState<SpecModalMode>('closed');
    const [selectedSpec, setSelectedSpec] = useState<any | null>(null);
    const [specForm, setSpecForm] = useState<any>({ name: '', description: '', courseIds: [], courseDescription: '', whatYouWillLearn: [], skills: [], instructors: [], faqs: [], carrierIds: [] });

    useEffect(() => { load(); }, []);

    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (!(e.target as Element).closest('.ctx-menu')) setActiveMenu(null);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const load = async () => {
        setIsLoading(true);
        try {
            const [catR, cr, carr, sr, bkR, skR] = await Promise.all([
                fetch(`${CATEGORY_API}/view`),
                fetch(`${COURSES_API}/view`),
                fetch(`${CARRIERS_API}/view`),
                fetch(`${SPEC_API}/view`),
                fetch(`${BOOKS_API}/view`),
                fetch(`${SPEC_API}/skill/view`),
            ]);

            let catData: any = null;
            let fetchedBooks: any[] = [];
            if (bkR.ok) { const d = await bkR.json(); if (d.success) { fetchedBooks = d.data || []; setAllBooks(fetchedBooks); } }
            if (catR.ok) { catData = await catR.json(); if (catData.success) setCategories(catData.data); }
            if (cr.ok) { 
                const d = await cr.json(); 
                if (d.success) {
                    const coursesWithCount = d.data.map((course: any) => ({
                        ...course,
                        bookCount: fetchedBooks.filter(b => b.courseId === course.id).length
                    }));
                    setCourses(coursesWithCount);
                } 
            }
            if (carr.ok) { const d = await carr.json(); if (d.success) setCarriers(d.data); }
            if (sr.ok) { const d = await sr.json(); if (d.success) setSpecializations(d.data); }
            if (skR.ok) { const d = await skR.json(); if (d.success) setDbSkills(d.data); }

            // Auto select the first category initially if none is selected
            if (catData?.success && catData.data.length > 0 && !selectedCategoryId) {
                setSelectedCategoryId(catData.data[0].id);
            }
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    const showToast = (msg: string) => {
        setToast(msg); setExiting(false);
        setTimeout(() => { setExiting(true); setTimeout(() => setToast(null), 500); }, 3000);
    };

    const handleAddSkillToDb = async (skillName: string) => {
        try {
            const res = await fetch(`${API}/api/inspire/specialization/skill/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: skillName })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setDbSkills([...dbSkills, data.data]);
                    return data.data;
                }
            }
        } catch { /* ignore */ }
        return null;
    };

    // ─── Category Handlers ───
    const openAddCategory = () => { setCategoryForm(BLANK_CATEGORY); setError(null); setCategoryModal('add'); };

    const openEditCategory = (c: Category) => {
        setSelectedCategory(c);
        setCategoryForm({
            categoryId: c.categoryId || '', name: c.name || '', description: c.description || '',
            carrierIds: c.carrierIds || [], specializationIds: c.specializationIds || [], courseIds: c.courseIds || [],
            whatYouWillLearn: c.whatYouWillLearn || [''], skills: c.skills || [], partners: c.partners || [], faqs: c.faqs || []
        });
        setError(null); setCategoryModal('edit'); setActiveMenu(null);
    };

    const handleCategorySubmit = async () => {
        setIsActionLoading(true); setError(null);
        try {
            const cleanForm = { ...categoryForm, whatYouWillLearn: categoryForm.whatYouWillLearn.filter(x => x.trim() !== ''), faqs: categoryForm.faqs.filter(x => x.question.trim() !== '') };
            const url = categoryModal === 'edit' && selectedCategory ? `${CATEGORY_API}/${selectedCategory.id}` : `${CATEGORY_API}/create`;
            const method = categoryModal === 'edit' ? 'PUT' : 'POST';

            const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cleanForm) });
            const d = await r.json();

            if (d.success) {
                if (categoryModal === 'edit' && selectedCategory) {
                    setCategories(categories.map(c => c.id === selectedCategory.id ? { ...c, ...d.data } : c));
                    showToast('Category updated!');
                } else {
                    setCategories([d.data, ...categories]);
                    setSelectedCategoryId(d.data.id); // auto select new
                    showToast('Category created!');
                }
                setCategoryModal('closed');
            } else { setError(d.message); }
        } catch (e: any) { setError(e.message); }
        finally { setIsActionLoading(false); }
    };

    const handleCategoryDelete = async () => {
        setIsActionLoading(true);
        try {
            const r = await fetch(`${CATEGORY_API}/${selectedCategory?.id}`, { method: 'DELETE' });
            const d = await r.json();
            if (d.success) {
                const newCats = categories.filter(c => c.id !== selectedCategory?.id);
                setCategories(newCats);
                if (selectedCategoryId === selectedCategory?.id) {
                    setSelectedCategoryId(newCats.length > 0 ? newCats[0].id : null);
                }
                setCategoryModal('closed');
                showToast('Category deleted!');
            }
        } catch { } finally { setIsActionLoading(false); }
    };

    // ─── Nested Modals Openers ───
    const openNestedView = (type: string, item: any) => {
        setActiveMenu(null);
        if (type === 'course') { setSelectedCourse(item); setCourseModal('view'); }
        if (type === 'carrier') { setSelectedCarrier(item); setCarrierModal('view'); }
        if (type === 'spec') { setSelectedSpec(item); setSpecModal('view'); }
    };

    const openNestedEdit = (type: string, item: any) => {
        setActiveMenu(null);
        if (type === 'course') { setSelectedCourse(item); setCourseForm({ ...item, carrierIds: item.carrierIds || [], whatYouWillLearn: item.whatYouWillLearn || [], skills: item.skills || [], instructors: item.instructors || [], faqs: item.faqs || [] }); setCourseModal('edit'); }
        if (type === 'carrier') { setSelectedCarrier(item); setCarrierForm({ ...item }); setCarrierModal('edit'); }
        if (type === 'spec') { setSelectedSpec(item); setSpecForm({ ...item, courseIds: item.courseIds || [], whatYouWillLearn: item.whatYouWillLearn || [], skills: item.skills || [], instructors: item.instructors || [], faqs: item.faqs || [], carrierIds: item.carrierIds || [] }); setSpecModal('edit'); }
    };

    const openNestedDelete = (type: string, item: any) => {
        setActiveMenu(null);
        if (type === 'course') { setSelectedCourse(item); setCourseModal('delete'); }
        if (type === 'carrier') { setSelectedCarrier(item); setCarrierModal('delete'); }
        if (type === 'spec') { setSelectedSpec(item); setSpecModal('delete'); }
    };

    // ─── Nested Modals Submit Handlers ───
    const handleNestedCourseSubmit = async () => {
        setIsActionLoading(true); setError(null);
        try {
            const cleanForm = { ...courseForm, whatYouWillLearn: courseForm.whatYouWillLearn.filter((x: string) => x.trim() !== ''), faqs: courseForm.faqs.filter((x: any) => x.question.trim() !== '') };
            const r = await fetch(`${COURSES_API}/${selectedCourse?.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cleanForm) });
            const d = await r.json();
            if (d.success) {
                setCourses(courses.map(c => c.id === selectedCourse?.id ? { ...c, ...d.data } : c));
                showToast('Course updated!');
                setCourseModal('closed');
            } else setError(d.message);
        } catch (e: any) { setError(e.message); } finally { setIsActionLoading(false); }
    };

    const handleNestedCourseDelete = async () => {
        setIsActionLoading(true);
        try {
            const r = await fetch(`${COURSES_API}/${selectedCourse?.id}`, { method: 'DELETE' });
            if ((await r.json()).success) {
                setCourses(courses.filter(c => c.id !== selectedCourse?.id));
                setCourseModal('closed'); showToast('Course deleted!');
            }
        } catch { } finally { setIsActionLoading(false); }
    };

    const handleNestedCarrierSubmit = async () => {
        setIsActionLoading(true); setError(null);
        try {
            const r = await fetch(`${CARRIERS_API}/${selectedCarrier?.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(carrierForm) });
            const d = await r.json();
            if (d.success) {
                setCarriers(carriers.map(c => c.id === selectedCarrier?.id ? { ...c, ...d.data } : c));
                showToast('Carrier updated!');
                setCarrierModal('closed');
            } else setError(d.message);
        } catch (e: any) { setError(e.message); } finally { setIsActionLoading(false); }
    };

    const handleNestedCarrierDelete = async () => {
        setIsActionLoading(true);
        try {
            const r = await fetch(`${CARRIERS_API}/${selectedCarrier?.id}`, { method: 'DELETE' });
            if ((await r.json()).success) {
                setCarriers(carriers.filter(c => c.id !== selectedCarrier?.id));
                setCarrierModal('closed'); showToast('Carrier deleted!');
            }
        } catch { } finally { setIsActionLoading(false); }
    };

    const handleNestedSpecSubmit = async () => {
        setIsActionLoading(true); setError(null);
        try {
            const cleanForm = { ...specForm, whatYouWillLearn: specForm.whatYouWillLearn.filter((x: string) => x.trim() !== ''), faqs: specForm.faqs.filter((x: any) => x.question.trim() !== '') };
            const r = await fetch(`${SPEC_API}/${selectedSpec?.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cleanForm) });
            const d = await r.json();
            if (d.success) {
                setSpecializations(specializations.map(s => s.id === selectedSpec?.id ? { ...s, ...d.data } : s));
                showToast('Specialization updated!');
                setSpecModal('closed');
            } else setError(d.message);
        } catch (e: any) { setError(e.message); } finally { setIsActionLoading(false); }
    };

    const handleNestedSpecDelete = async () => {
        setIsActionLoading(true);
        try {
            const r = await fetch(`${SPEC_API}/${selectedSpec?.id}`, { method: 'DELETE' });
            if ((await r.json()).success) {
                setSpecializations(specializations.filter(s => s.id !== selectedSpec?.id));
                setSpecModal('closed'); showToast('Specialization deleted!');
            }
        } catch { } finally { setIsActionLoading(false); }
    };


    // ─── Shared UI Helpers ───
    const DottedMenu = ({ id, onMenuView, onMenuEdit, onMenuDelete, isTop = false }: any) => (
        <div className={`ctx-menu relative group flex items-center ${isTop ? 'ml-3' : ''}`}>
            <button
                onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === id ? null : id); }}
                className={`p-1.5 rounded-full transition-opacity ${isTop ? 'opacity-0 group-hover:opacity-100 hover:bg-[#3d3d3d] text-gray-300' : 'hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-[#80868b]'}`}
            >
                <MoreVertical size={16} />
            </button>
            {activeMenu === id && (
                <div className="absolute right-0 top-8 w-36 bg-white dark:bg-[#2d2d2d] border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-50 py-1" onClick={e => e.stopPropagation()}>
                    <button onClick={onMenuView} className="w-full text-left px-4 py-2 text-xs text-[#202124] dark:text-white hover:bg-gray-50 dark:hover:bg-[#3a3a3a] flex items-center gap-2"><Eye size={14} className="text-[#80868b]" />View</button>
                    <button onClick={onMenuEdit} className="w-full text-left px-4 py-2 text-xs text-[#202124] dark:text-white hover:bg-gray-50 dark:hover:bg-[#3a3a3a] flex items-center gap-2"><Edit2 size={14} className="text-[#80868b]" />Edit</button>
                    <button onClick={onMenuDelete} className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"><Trash2 size={14} />Delete</button>
                </div>
            )}
        </div>
    );

    const filteredCats = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.categoryId.toLowerCase().includes(searchQuery.toLowerCase()));

    const selectedCat = filteredCats.find(c => c.id === selectedCategoryId);
    const catCourses = selectedCat ? courses.filter(c => selectedCat.courseIds?.includes(c.id)) : [];
    const catCarriers = selectedCat ? carriers.filter(c => selectedCat.carrierIds?.includes(c.id)) : [];
    const catSpecs = selectedCat ? specializations.filter(s => selectedCat.specializationIds?.includes(s.id)) : [];

    return (
        <div className="p-8 w-full min-h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {toast && (
                <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl shadow-2xl transition-all duration-300 transform ${exiting ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                    <CheckCircle size={18} className="text-green-400 dark:text-green-600" />
                    <span className="text-sm font-semibold">{toast}</span>
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-[#202124] dark:text-white flex items-center gap-2">
                        Categories
                    </h2>
                    <p className="text-sm text-[#5f6368] dark:text-gray-400 mt-0.5">Parent groupings for organizational structure</p>
                </div>
                <div className="flex items-center gap-3">
                    <SearchBar placeholder="Search categories..." value={searchQuery} onSearch={setSearchQuery} />
                    <button onClick={openAddCategory} className="px-5 py-2.5 bg-primary hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm flex items-center gap-2">
                        <Plus size={18} /> New Category
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div><SkeletonBlock /><SkeletonBlock /></div>
            ) : categories.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-500 mb-6">
                        <LayoutGrid size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-[#202124] dark:text-white mb-2">No Categories Found</h3>
                    <p className="text-[#5f6368] dark:text-gray-400 text-center max-w-sm mb-8 text-sm leading-relaxed">Categories group together carriers, specializations, and courses to build a high-level catalog structure.</p>
                    <button onClick={openAddCategory} className="px-6 py-3 bg-primary hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                        <Plus size={18} /> Create Category
                    </button>
                </div>
            ) : filteredCats.length === 0 ? (
                <NoResultsFound searchTerm={searchQuery} onClear={() => setSearchQuery('')} />
            ) : (
                <div className="space-y-6">
                    {/* Category Scrollable Header Tabs */}
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                        {filteredCats.map(cat => (
                            <button 
                                key={cat.id}
                                onClick={() => setSelectedCategoryId(cat.id)} 
                                className={`px-6 py-3 rounded-full whitespace-nowrap font-semibold transition-all shadow-sm flex items-center gap-2 border text-sm ${selectedCategoryId === cat.id ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-[#1a1a1a] text-[#5f6368] dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-primary/50'}`}
                            >
                                <LayoutGrid size={16} /> {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Active Category Content Body */}
                    {selectedCat && (
                        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col p-8 animate-in fade-in duration-300">
                            {/* Header inside body */}
                            <div className="flex justify-between items-start mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#202124] dark:text-white">{selectedCat.name}</h3>
                                    <p className="text-sm font-mono text-[#80868b] mt-1">{selectedCat.categoryId}</p>
                                    <p className="text-sm text-[#5f6368] dark:text-gray-400 mt-2 max-w-2xl">{selectedCat.description || 'No description provided.'}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="hidden md:flex gap-4 mr-2 text-xs font-semibold text-[#80868b] bg-gray-50 dark:bg-[#121212] px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800">
                                        <span className="flex items-center gap-1.5"><Route size={14} className="text-purple-400" /> {catCarriers.length} Carriers</span>
                                        <span className="flex items-center gap-1.5"><Layers size={14} className="text-orange-400" /> {catSpecs.length} Specs</span>
                                        <span className="flex items-center gap-1.5"><BookOpen size={14} className="text-blue-400" /> {catCourses.length} Courses</span>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-[#2d2d2d] rounded-full">
                                        <DottedMenu
                                            id={`cat-main-${selectedCat.id}`}
                                            onMenuView={() => { setSelectedCategory(selectedCat); setCategoryModal('view'); }}
                                            onMenuEdit={() => openEditCategory(selectedCat)}
                                            onMenuDelete={() => { setSelectedCategory(selectedCat); setCategoryModal('delete'); }}
                                            isTop={false}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-10">
                                {/* Carriers Grid */}
                                {catCarriers.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-[#80868b] mb-4 flex items-center gap-2"><Route size={16} className="text-purple-500" /> Carrier Paths</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {catCarriers.map(c => (
                                                <div key={c.id} className="p-4 bg-gray-50 dark:bg-[#121212] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex justify-between group">
                                                    <div className="min-w-0 pr-4 flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 shadow-sm"><CourseIcon courseName={c.name} fallback="carrier" size={20} /></div>
                                                        <div>
                                                            <p className="text-sm font-bold text-[#202124] dark:text-white break-words whitespace-normal">{c.name}</p>
                                                            <p className="text-xs text-gray-500 font-mono mt-1">{c.carrierId}</p>
                                                        </div>
                                                    </div>
                                                    <DottedMenu id={`carrier-${c.id}`} onMenuView={() => openNestedView('carrier', c)} onMenuEdit={() => openNestedEdit('carrier', c)} onMenuDelete={() => openNestedDelete('carrier', c)} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Specializations Grid */}
                                {catSpecs.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-[#80868b] mb-4 flex items-center gap-2"><Layers size={16} className="text-orange-500" /> Specializations</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {catSpecs.map(s => (
                                                <div key={s.id} className="p-4 bg-gray-50 dark:bg-[#121212] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex justify-between group">
                                                    <div className="min-w-0 pr-4 flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 shadow-sm"><CourseIcon courseName={s.name} fallback="specialization" size={20} /></div>
                                                        <div>
                                                            <p className="text-sm font-bold text-[#202124] dark:text-white break-words whitespace-normal">{s.name}</p>
                                                            <p className="text-xs text-gray-500 font-mono mt-1">{s.specializationId || s.specId}</p>
                                                        </div>
                                                    </div>
                                                    <DottedMenu id={`spec-${s.id}`} onMenuView={() => openNestedView('spec', s)} onMenuEdit={() => openNestedEdit('spec', s)} onMenuDelete={() => openNestedDelete('spec', s)} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Courses Grid */}
                                {catCourses.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-[#80868b] mb-4 flex items-center gap-2"><BookOpen size={16} className="text-blue-500" /> Courses</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {catCourses.map(c => (
                                                <div key={c.id} className="p-4 bg-gray-50 dark:bg-[#121212] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex justify-between group">
                                                    <div className="min-w-0 pr-4 flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 shadow-sm"><CourseIcon courseName={c.name} fallback="course" size={20} /></div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-[#202124] dark:text-white break-words whitespace-normal">{c.name}</p>
                                                            <p className="text-xs text-gray-500 font-mono mt-1">{c.courseId}</p>
                                                        </div>
                                                    </div>
                                                    <DottedMenu id={`course-${c.id}`} onMenuView={() => openNestedView('course', c)} onMenuEdit={() => openNestedEdit('course', c)} onMenuDelete={() => openNestedDelete('course', c)} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {catCarriers.length === 0 && catSpecs.length === 0 && catCourses.length === 0 && (
                                    <div className="text-center py-10 text-sm text-gray-500 italic border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                                        <p className="mb-2 text-lg">No items associated yet.</p>
                                        <p>Edit this category to link Carrier Paths, Specializations, and Courses.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Main Category Modals */}
            {categoryModal === 'add' || categoryModal === 'edit' ? (
                <AddEditCategoryModal mode={categoryModal} form={categoryForm} setForm={setCategoryForm} carriers={carriers} specializations={specializations} courses={courses} onClose={() => setCategoryModal('closed')} onSubmit={handleCategorySubmit} isLoading={isActionLoading} error={error} />
            ) : categoryModal === 'delete' && selectedCategory ? (
                <DeleteCategoryModal category={selectedCategory} onClose={() => setCategoryModal('closed')} onConfirm={handleCategoryDelete} isLoading={isActionLoading} />
            ) : categoryModal === 'view' && selectedCategory ? (
                <ViewCategoryModal category={selectedCategory} carriers={carriers} specializations={specializations} courses={courses} onClose={() => setCategoryModal('closed')} />
            ) : null}

            {/* Nested Item Modals */}
            {courseModal === 'view' && selectedCourse && <ViewCourseModal course={selectedCourse} carriers={carriers} specializations={specializations} books={allBooks.filter(b => b.courseId === selectedCourse.id)} onClose={() => setCourseModal('closed')} />}
            {courseModal === 'edit' && selectedCourse && <AddEditCourseModal mode="edit" form={courseForm} setForm={setCourseForm} carriers={carriers} dbSkills={dbSkills} onAddSkillToDb={handleAddSkillToDb} onClose={() => setCourseModal('closed')} onSubmit={handleNestedCourseSubmit} isLoading={isActionLoading} error={error} />}
            {courseModal === 'delete' && selectedCourse && <DeleteCourseModal mode="delete" course={selectedCourse} onClose={() => setCourseModal('closed')} onConfirm={handleNestedCourseDelete} isLoading={isActionLoading} />}

            {carrierModal === 'view' && selectedCarrier && <ViewCarrierModal carrier={selectedCarrier} courses={courses} specializations={specializations} onClose={() => setCarrierModal('closed')} />}
            {carrierModal === 'edit' && selectedCarrier && <AddEditCarrierModal mode="edit" form={carrierForm} setForm={setCarrierForm} onClose={() => setCarrierModal('closed')} onSubmit={handleNestedCarrierSubmit} isLoading={isActionLoading} error={error} />}
            {carrierModal === 'delete' && selectedCarrier && <DeleteCarrierModal mode="delete" carrier={selectedCarrier} onClose={() => setCarrierModal('closed')} onConfirm={handleNestedCarrierDelete} isLoading={isActionLoading} />}

            {specModal === 'view' && selectedSpec && <ViewSpecializationModal specialization={selectedSpec} carriers={carriers} courses={courses} onClose={() => setSpecModal('closed')} />}
            {specModal === 'edit' && selectedSpec && <AddEditSpecializationModal mode="edit" form={specForm} setForm={setSpecForm} courses={courses} carriers={carriers} dbSkills={dbSkills} onAddSkillToDb={handleAddSkillToDb} onClose={() => setSpecModal('closed')} onSubmit={handleNestedSpecSubmit} isLoading={isActionLoading} error={error} />}
            {specModal === 'delete' && selectedSpec && <DeleteSpecializationModal mode="delete" specialization={selectedSpec} onClose={() => setSpecModal('closed')} onConfirm={handleNestedSpecDelete} isLoading={isActionLoading} />}

        </div>
    );
}
