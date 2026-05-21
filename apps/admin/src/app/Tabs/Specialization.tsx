'use client';
import React, { useState, useEffect } from 'react';
import { Layers, Plus, MoreVertical, Edit2, Trash2, Eye, CheckCircle, Route, BookOpen } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { NoResultsFound } from '@/components/NoResultsFound';
import { AddEditSpecializationModal, DeleteSpecializationModal, ViewSpecializationModal } from '@/components/SpecializationModals';
import { CourseIcon } from '@/components/CourseIcon';
import type { Specialization, Course, Carrier, Skill, ModalMode, SpecializationForm } from '@/components/SpecializationModals';

const API = (process.env.NEXT_PUBLIC_API_URL ?? '');
const SPEC_API = `${API}/api/inspire/specialization`;
const COURSES_API = `${API}/api/inspire/course`;
const CARRIERS_API = `${API}/api/inspire/carrier`;

const SkeletonCard = () => (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800 p-4 animate-pulse">
        <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800"></div>
            <div className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800"></div>
        </div>
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
        <div className="h-3 w-1/4 bg-gray-100 dark:bg-gray-800 rounded mb-4"></div>
        <div className="space-y-2 mb-4">
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
            <div className="h-2 w-5/6 bg-gray-100 dark:bg-gray-800 rounded"></div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-50 dark:border-gray-800">
            <div className="h-3 w-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-3 w-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
    </div>
);

const BLANK_FORM: SpecializationForm = {
    name: '',
    description: '',
    courseIds: [],
    courseDescription: '',
    whatYouWillLearn: [],
    skills: [],
    instructors: [],
    faqs: [],
    carrierIds: []
};

const filterData = (data: Specialization[], query: string) => {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter(d => 
        d.name.toLowerCase().includes(q) || 
        (d.specializationId || '').toLowerCase().includes(q)
    );
};

export default function SpecializationTab() {
    const [specializations, setSpecializations] = useState<Specialization[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [carriers, setCarriers] = useState<Carrier[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [modal, setModal] = useState<ModalMode>('closed');
    const [selected, setSelected] = useState<Specialization | null>(null);
    const [form, setForm] = useState<SpecializationForm>(BLANK_FORM);
    
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [exiting, setExiting] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    useEffect(() => { load(); }, []);

    useEffect(() => {
        const h = (e: MouseEvent) => { if (!(e.target as Element).closest('.spec-menu')) setActiveMenu(null); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const load = async () => {
        setIsLoading(true);
        try {
            const [sr, cr, carr, skr] = await Promise.all([
                fetch(`${SPEC_API}/view`), 
                fetch(`${COURSES_API}/view`),
                fetch(`${CARRIERS_API}/view`),
                fetch(`${SPEC_API}/skill/view`)
            ]);
            
            if (sr.ok) { const d = await sr.json(); if (d.success) setSpecializations(d.data); }
            if (cr.ok) { const d = await cr.json(); if (d.success) setCourses(d.data); }
            if (carr.ok) { const d = await carr.json(); if (d.success) setCarriers(d.data); }
            if (skr.ok) { const d = await skr.json(); if (d.success) setSkills(d.data); }
        } catch (e) {
            console.error(e);
        } finally { 
            setIsLoading(false); 
        }
    };

    const showToast = (msg: string) => {
        setToast(msg); setExiting(false);
        setTimeout(() => { setExiting(true); setTimeout(() => setToast(null), 500); }, 3000);
    };

    const handleAddSkillToDb = async (skillName: string): Promise<Skill | null> => {
        try {
            const r = await fetch(`${SPEC_API}/skill/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: skillName })
            });
            const d = await r.json();
            if (d.success) {
                const newSkill = d.data;
                setSkills(prev => [...prev, newSkill].sort((a,b) => a.name.localeCompare(b.name)));
                return newSkill;
            } else {
                setError(d.message);
                return null;
            }
        } catch (e: any) {
            setError(e.message);
            return null;
        }
    };

    const openAdd = () => { setModal('add'); setForm(BLANK_FORM); setError(null); };
    
    const openEdit = (s: Specialization) => { 
        setSelected(s); 
        setForm({
            name: s.name || '',
            description: s.description || '',
            courseIds: s.courseIds || [],
            courseDescription: s.courseDescription || '',
            whatYouWillLearn: s.whatYouWillLearn || [],
            skills: s.skills || [],
            instructors: s.instructors || [],
            faqs: s.faqs || [],
            carrierIds: s.carrierIds || []
        }); 
        setError(null); 
        setModal('edit'); 
        setActiveMenu(null); 
    };
    
    const openDelete = (s: Specialization) => { setSelected(s); setModal('delete'); setActiveMenu(null); };
    const openView = (s: Specialization) => { setSelected(s); setModal('view'); setActiveMenu(null); };

    const handleSubmit = async () => {
        setIsActionLoading(true); setError(null);
        try {
            // Filter out empty entries from arrays before submitting
            const cleanForm = {
                ...form,
                whatYouWillLearn: form.whatYouWillLearn.filter(x => x.trim() !== ''),
                instructors: form.instructors.filter(x => x.name.trim() !== ''),
                faqs: form.faqs.filter(x => x.question.trim() !== '')
            };

            const url = modal === 'edit' && selected ? `${SPEC_API}/${selected.id}` : `${SPEC_API}/create`;
            const method = modal === 'edit' ? 'PUT' : 'POST';

            const r = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanForm)
            });
            const d = await r.json();
            
            if (d.success) { 
                if (modal === 'edit' && selected) {
                    setSpecializations(specializations.map(s => s.id === selected.id ? { ...s, ...d.data } : s)); 
                    showToast('Specialization updated!');
                } else {
                    setSpecializations([d.data, ...specializations]); 
                    showToast('Specialization created!');
                }
                setModal('closed'); 
            } else {
                setError(d.message);
            }
        } catch (e: any) { 
            setError(e.message); 
        } finally { 
            setIsActionLoading(false); 
        }
    };

    const handleDelete = async () => {
        setIsActionLoading(true);
        try {
            const url = modal === 'deleteAll' ? `${SPEC_API}/deleteAll` : `${SPEC_API}/${selected?.id}`;
            const r = await fetch(url, { method: 'DELETE' });
            const d = await r.json();
            if (d.success) {
                modal === 'deleteAll' ? setSpecializations([]) : setSpecializations(specializations.filter(s => s.id !== selected?.id));
                setModal('closed'); 
                showToast(modal === 'deleteAll' ? 'All specializations cleared!' : 'Specialization deleted!');
            }
        } catch { /* ignore */ } finally { setIsActionLoading(false); }
    };

    const ContextMenu = ({ spec }: { spec: Specialization }) => (
        <div className="spec-menu relative">
            <button onClick={() => setActiveMenu(activeMenu === spec.id ? null : spec.id)} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-[#80868b] transition-opacity">
                <MoreVertical size={16} />
            </button>
            {activeMenu === spec.id && (
                <div className="absolute right-0 top-8 w-48 bg-white dark:bg-[#2d2d2d] border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl z-50 py-1">
                    <button onClick={() => openView(spec)} className="w-full text-left px-4 py-2 text-sm text-[#202124] dark:text-white hover:bg-gray-50 dark:hover:bg-[#3a3a3a] flex items-center gap-2"><Eye size={14} className="text-[#80868b]" />View Specialization</button>
                    <button onClick={() => openEdit(spec)} className="w-full text-left px-4 py-2 text-sm text-[#202124] dark:text-white hover:bg-gray-50 dark:hover:bg-[#3a3a3a] flex items-center gap-2"><Edit2 size={14} className="text-[#80868b]" />Edit Specialization</button>
                    <button onClick={() => openDelete(spec)} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"><Trash2 size={14} />Delete Specialization</button>
                </div>
            )}
        </div>
    );

    const filtered = filterData(specializations, searchQuery);

    return (
        <div className="p-8 w-full min-h-full relative animate-in fade-in slide-in-from-bottom-4 duration-500">
            {toast && (
                <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-2.5 px-4 py-2.5 bg-white dark:bg-[#1e1e1e] border border-green-200 dark:border-green-800 rounded-lg shadow-lg transition-all duration-500 ${exiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
                    <span className="w-1 h-6 rounded-full bg-green-500 flex-shrink-0" />
                    <CheckCircle size={14} className="text-green-500" />
                    <span className="text-xs font-medium text-[#202124] dark:text-white">{toast}</span>
                </div>
            )}

            {specializations.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center mb-6">
                        <Layers size={38} className="text-blue-500 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-[#202124] dark:text-white mb-2">No specializations yet</h3>
                    <p className="text-[#5f6368] dark:text-gray-400 text-sm max-w-sm mb-8">Your specializations list is empty. Create your first specialization to connect carriers and courses.</p>
                    <button onClick={openAdd} className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg shadow-sm transition-colors">
                        <Plus size={18} /> Add Specialization
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-[#202124] dark:text-white">Specializations</h2>
                            <p className="text-sm text-[#5f6368] dark:text-gray-400 mt-0.5">Manage groups of courses that build specific skills</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex justify-end flex-1">
                                <SearchBar placeholder="Search specializations..." value={searchQuery} onSearch={setSearchQuery} />
                            </div>
                            <button onClick={() => setModal('deleteAll')} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1a1a] text-[#5f6368] border border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all">
                                <Trash2 size={16} /> Clear All
                            </button>
                            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium shadow-sm transition-colors">
                                <Plus size={16} /> Add Specialization
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : filtered.length === 0 ? (
                        <NoResultsFound searchTerm={searchQuery} onClear={() => setSearchQuery('')} />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filtered.map(spec => (
                                <div key={spec.id} className="bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 rounded-xl p-4 flex flex-col group transition-all duration-200 shadow-sm hover:shadow-md">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="w-10 h-10 bg-transparent dark:bg-transparent rounded-lg flex items-center justify-center">
                                            <CourseIcon courseName={spec.name} fallback="specialization" size={28} />
                                        </div>
                                        <ContextMenu spec={spec} />
                                    </div>
                                    <h3 className="text-sm font-bold text-[#202124] dark:text-white truncate mb-1" title={spec.name}>{spec.name}</h3>
                                    <div className="mb-2"><span className="text-[10px] font-mono font-bold text-primary bg-[#e8f0fe] dark:bg-blue-900/20 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-800/50">{spec.specializationId}</span></div>
                                    <p className="text-xs text-[#5f6368] dark:text-gray-400 line-clamp-3 mb-4 flex-1">{spec.description}</p>
                                    
                                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-50 dark:border-gray-800">
                                        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#80868b]" title="Linked Carriers">
                                            <Route size={13} className="flex-shrink-0" />
                                            {spec.carrierIds?.length || 0}
                                        </span>
                                        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
                                        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#80868b]" title="Linked Courses">
                                            <BookOpen size={13} className="flex-shrink-0" />
                                            {spec.courseIds?.length || 0}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {(modal === 'add' || modal === 'edit') && <AddEditSpecializationModal mode={modal} form={form} setForm={setForm} courses={courses} carriers={carriers} dbSkills={skills} onClose={() => setModal('closed')} onSubmit={handleSubmit} isLoading={isActionLoading} error={error} onAddSkillToDb={handleAddSkillToDb} />}
            {(modal === 'delete' || modal === 'deleteAll') && <DeleteSpecializationModal mode={modal} specialization={selected} onClose={() => setModal('closed')} onConfirm={handleDelete} isLoading={isActionLoading} />}
            {modal === 'view' && selected && <ViewSpecializationModal specialization={selected} courses={courses} carriers={carriers} onClose={() => setModal('closed')} />}
        </div>
    );
}
