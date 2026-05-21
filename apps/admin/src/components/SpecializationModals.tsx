'use client';
import React, { useState, useEffect, useRef } from 'react';
import { X, Trash2, AlertTriangle, PlusCircle, ChevronDown, Check, Layers, User, HelpCircle, BookOpen, GraduationCap, Route } from 'lucide-react';
import { CourseIcon } from '@/components/CourseIcon';

export interface Course { id: string; courseId: string; name: string; description: string; }
export interface Carrier { id: string; carrierId: string; name: string; }
export interface Skill { id: string; name: string; }

export interface Specialization {
    id: string;
    specializationId: string;
    name: string;
    description: string;
    courseIds: string[];
    courseDescription: string;
    whatYouWillLearn: string[];
    skills: string[];
    instructors: { name: string; education: string; courseCount: number }[];
    faqs: { question: string; answer: string }[];
    carrierIds: string[];
    createdAt: any;
}

export type ModalMode = 'closed' | 'add' | 'edit' | 'delete' | 'deleteAll' | 'view';

export interface SpecializationForm {
    name: string;
    description: string;
    courseIds: string[];
    courseDescription: string;
    whatYouWillLearn: string[];
    skills: string[];
    instructors: { name: string; education: string; courseCount: number }[];
    faqs: { question: string; answer: string }[];
    carrierIds: string[];
}

// ─── Shared Components ─────────────────────────────────────────────────────────

export function MultiSelectDropdown({
    items, selectedIds, onToggle, placeholder
}: {
    items: { id: string; name: string; secondary?: string }[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    placeholder: string;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.secondary?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="relative" ref={ref}>
            <button type="button" onClick={() => setOpen(!open)} className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-[#5f6368] hover:border-primary transition-colors">
                <span>{placeholder} ({selectedIds.length} selected)</span>
                <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 rounded-xl shadow-2xl z-50 max-h-60 flex flex-col py-2">
                    <div className="px-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                        <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-[#202124] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                    <div className="overflow-y-auto flex-1 py-1">
                        {filtered.length === 0 && <p className="text-center text-xs text-[#80868b] py-4">No results found</p>}
                        {filtered.map(item => (
                            <button key={item.id} type="button" onClick={() => onToggle(item.id)} className="w-full flex justify-between items-center px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors">
                                <div className="text-left">
                                    <span className="font-medium text-[#202124] dark:text-white block">{item.name}</span>
                                    {item.secondary && <span className="text-[10px] text-[#80868b] font-mono">{item.secondary}</span>}
                                </div>
                                {selectedIds.includes(item.id) && <Check size={15} className="text-green-500 flex-shrink-0 ml-2" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function Chips({ ids, items, onRemove, fallbackItems }: { ids: string[]; items: { id: string; name: string }[]; onRemove: (id: string) => void; fallbackItems?: string[] }) {
    if (!ids.length) return null;
    return (
        <div className="flex flex-wrap gap-2 mt-3 mb-1">
            {ids.map((id, idx) => {
                const name = items.find(x => x.id === id)?.name || (fallbackItems ? fallbackItems[idx] : id);
                return (
                    <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-medium border border-blue-100 dark:border-blue-800/50">
                        {name}
                        <button type="button" onClick={() => onRemove(id)} className="hover:text-red-500 transition-colors ml-1"><X size={14} /></button>
                    </span>
                );
            })}
        </div>
    );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

interface AddEditProps {
    mode: ModalMode;
    form: SpecializationForm;
    setForm: (f: SpecializationForm) => void;
    courses: Course[];
    carriers: Carrier[];
    dbSkills: Skill[];
    onClose: () => void;
    onSubmit: () => void;
    isLoading: boolean;
    error: string | null;
    onAddSkillToDb?: (skillName: string) => Promise<Skill | null>;
}

export function AddEditSpecializationModal({ mode, form, setForm, courses, carriers, dbSkills, onClose, onSubmit, isLoading, error, onAddSkillToDb }: AddEditProps) {
    const isEdit = mode === 'edit';
    const [newSkillName, setNewSkillName] = useState('');
    const [isAddingSkill, setIsAddingSkill] = useState(false);

    const toggleCourse = (id: string) => setForm({ ...form, courseIds: form.courseIds.includes(id) ? form.courseIds.filter(x => x !== id) : [...form.courseIds, id] });
    const toggleCarrier = (id: string) => setForm({ ...form, carrierIds: form.carrierIds.includes(id) ? form.carrierIds.filter(x => x !== id) : [...form.carrierIds, id] });
    const toggleSkill = (name: string) => setForm({ ...form, skills: form.skills.includes(name) ? form.skills.filter(x => x !== name) : [...form.skills, name] });

    const handleAddCustomSkill = async () => {
        if (!newSkillName.trim() || !onAddSkillToDb) return;
        setIsAddingSkill(true);
        const newSkill = await onAddSkillToDb(newSkillName);
        setIsAddingSkill(false);
        if (newSkill) {
            if (!form.skills.includes(newSkill.name)) {
                setForm({ ...form, skills: [...form.skills, newSkill.name] });
            }
            setNewSkillName('');
        }
    };

    const valid = form.name.trim() !== '' && form.description.trim() !== '';

    const inp = "w-full px-4 py-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm text-[#202124] dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600";
    const label = "block text-xs font-bold uppercase tracking-wider text-[#80868b] mb-2";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
            <div className="bg-[#f8f9fa] dark:bg-[#0a0a0a] rounded-xl w-full max-w-7xl shadow-2xl flex flex-col h-full max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 flex-shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-transparent dark:bg-transparent flex items-center justify-center">
                            <CourseIcon courseName={form.name} fallback="specialization" size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#202124] dark:text-white leading-tight">{isEdit ? 'Edit Specialization' : 'Create Specialization'}</h3>
                            <p className="text-xs text-[#5f6368] dark:text-gray-400">ID is auto-generated by the system</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-[#5f6368] transition-colors"><X size={20} /></button>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                    {/* Left Panel */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 md:border-r border-gray-200 dark:border-gray-800">
                        <div className="space-y-6 max-w-xl mx-auto">
                            <div>
                                <label className={label}>Specialization Details</label>
                                <div className="space-y-4 p-5 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800">
                                    <input className={inp} placeholder="Specialization Name (e.g. Advanced Web Development)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                    <textarea rows={4} className={`${inp} resize-y min-h-[100px]`} placeholder="Specialization Introduction / Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className={label}>Carrier Path Linking</label>
                                <div className="p-5 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800">
                                    <MultiSelectDropdown items={carriers.map(c => ({ id: c.id, name: c.name, secondary: c.carrierId }))} selectedIds={form.carrierIds} onToggle={toggleCarrier} placeholder="Search & Select Carriers" />
                                    <Chips ids={form.carrierIds} items={carriers} onRemove={toggleCarrier} />
                                </div>
                            </div>

                            <div>
                                <label className={label}>Course Linking</label>
                                <div className="space-y-4 p-5 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800">
                                    <MultiSelectDropdown items={courses.map(c => ({ id: c.id, name: c.name, secondary: c.courseId }))} selectedIds={form.courseIds} onToggle={toggleCourse} placeholder="Search & Select Courses" />
                                    <Chips ids={form.courseIds} items={courses} onRemove={toggleCourse} />
                                    <textarea rows={3} className={`${inp} resize-y min-h-[80px]`} placeholder="Description of how these courses fit into the specialization..." value={form.courseDescription} onChange={e => setForm({ ...form, courseDescription: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/50 dark:bg-[#121212]/50">
                        <div className="space-y-8 max-w-xl mx-auto">

                            {/* What You Will Learn */}
                            <div>
                                <label className={label}>What You Will Learn</label>
                                <div className="space-y-3">
                                    {form.whatYouWillLearn.map((item, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input className={`${inp} py-2.5`} placeholder="Learning outcome..." value={item} onChange={e => { const arr = [...form.whatYouWillLearn]; arr[idx] = e.target.value; setForm({ ...form, whatYouWillLearn: arr }); }} />
                                            <button onClick={() => setForm({ ...form, whatYouWillLearn: form.whatYouWillLearn.filter((_, i) => i !== idx) })} className="px-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => setForm({ ...form, whatYouWillLearn: [...form.whatYouWillLearn, ''] })} className="flex items-center gap-2 text-sm text-primary font-medium hover:underline p-1"><PlusCircle size={16} /> Add Learning Outcome</button>
                                </div>
                            </div>

                            {/* Skills */}
                            <div>
                                <label className={label}>Skills You Will Gain</label>
                                <div className="p-5 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800">
                                    <div className="flex gap-2 mb-4">
                                        <div className="flex-1 relative">
                                            {dbSkills.length > 0 ? (
                                                <MultiSelectDropdown items={dbSkills} selectedIds={form.skills.map(s => { const match = dbSkills.find(db => db.name === s); return match ? match.id : s; })} onToggle={(id) => { const skill = dbSkills.find(s => s.id === id); if (skill) toggleSkill(skill.name); }} placeholder="Select from existing skills..." />
                                            ) : (
                                                <p className="text-sm text-gray-500 py-2">No skills in database yet. Add custom ones below.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 items-center mb-2">
                                        <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
                                        <span className="text-xs text-gray-400 uppercase font-semibold">Or Add New</span>
                                        <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
                                    </div>

                                    <div className="flex gap-2">
                                        <input type="text" className={`${inp} py-2.5 flex-1`} placeholder="New skill name..." value={newSkillName} onChange={e => setNewSkillName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomSkill(); } }} />
                                        <button onClick={handleAddCustomSkill} disabled={!newSkillName.trim() || isAddingSkill} className="px-4 bg-gray-100 dark:bg-[#2d2d2d] hover:bg-gray-200 dark:hover:bg-[#3a3a3a] text-[#202124] dark:text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                                            {isAddingSkill ? 'Adding...' : 'Add Skill'}
                                        </button>
                                    </div>

                                    {form.skills.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <p className="text-xs text-gray-500 mb-2">Selected Skills ({form.skills.length})</p>
                                            <div className="flex flex-wrap gap-2">
                                                {form.skills.map(skill => (
                                                    <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-lg text-xs font-medium border border-purple-100 dark:border-purple-800/50">
                                                        {skill}
                                                        <button type="button" onClick={() => toggleSkill(skill)} className="hover:text-red-500 transition-colors ml-1"><X size={14} /></button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Instructors */}
                            <div>
                                <label className={label}>Instructors</label>
                                <div className="space-y-3">
                                    {form.instructors.map((inst, idx) => (
                                        <div key={idx} className="p-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 relative group">
                                            <button onClick={() => setForm({ ...form, instructors: form.instructors.filter((_, i) => i !== idx) })} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                                                <input className={`${inp} py-2.5`} placeholder="Instructor Name" value={inst.name} onChange={e => { const arr = [...form.instructors]; arr[idx].name = e.target.value; setForm({ ...form, instructors: arr }); }} />
                                                <input className={`${inp} py-2.5`} placeholder="Education (e.g. Ph.D, MSc)" value={inst.education} onChange={e => { const arr = [...form.instructors]; arr[idx].education = e.target.value; setForm({ ...form, instructors: arr }); }} />
                                                <input type="number" className={`${inp} py-2.5 sm:col-span-2`} placeholder="Number of courses taught" value={inst.courseCount || ''} onChange={e => { const arr = [...form.instructors]; arr[idx].courseCount = parseInt(e.target.value) || 0; setForm({ ...form, instructors: arr }); }} />
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => setForm({ ...form, instructors: [...form.instructors, { name: '', education: '', courseCount: 0 }] })} className="flex items-center gap-2 text-sm text-primary font-medium hover:underline p-1"><PlusCircle size={16} /> Add Instructor</button>
                                </div>
                            </div>

                            {/* FAQs */}
                            <div>
                                <label className={label}>Frequently Asked Questions</label>
                                <div className="space-y-3">
                                    {form.faqs.map((faq, idx) => (
                                        <div key={idx} className="p-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 relative group">
                                            <button onClick={() => setForm({ ...form, faqs: form.faqs.filter((_, i) => i !== idx) })} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                            <div className="space-y-3 mt-1">
                                                <input className={`${inp} py-2.5 font-medium`} placeholder="Question?" value={faq.question} onChange={e => { const arr = [...form.faqs]; arr[idx].question = e.target.value; setForm({ ...form, faqs: arr }); }} />
                                                <textarea rows={2} className={`${inp} resize-y min-h-[60px]`} placeholder="Answer..." value={faq.answer} onChange={e => { const arr = [...form.faqs]; arr[idx].answer = e.target.value; setForm({ ...form, faqs: arr }); }} />
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => setForm({ ...form, faqs: [...form.faqs, { question: '', answer: '' }] })} className="flex items-center gap-2 text-sm text-primary font-medium hover:underline p-1"><PlusCircle size={16} /> Add FAQ</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-800 flex-shrink-0 z-10 relative">
                    {isLoading && (
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-transparent">
                            <div className="h-full bg-primary w-1/2 animate-indeterminate" />
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            {error && <div className="inline-flex items-center gap-2 p-2 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-sm border border-red-100 dark:border-red-800"><AlertTriangle size={16} />{error}</div>}
                        </div>
                        <div className="flex gap-3">
                            <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-[#5f6368] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] font-medium transition-colors">Cancel</button>
                            <button onClick={onSubmit} disabled={isLoading || !valid} className={`px-8 py-2.5 rounded-xl font-bold min-w-[160px] flex items-center justify-center transition-all shadow-sm ${isLoading || !valid ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-600 text-white hover:shadow-md'}`}>
                                {isLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : isEdit ? 'Update Specialization' : 'Create Specialization'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────

export function DeleteSpecializationModal({ mode, specialization, onClose, onConfirm, isLoading }: { mode: ModalMode; specialization: Specialization | null; onClose: () => void; onConfirm: () => void; isLoading: boolean }) {
    const isAll = mode === 'deleteAll';
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl w-full max-w-md shadow-2xl p-8">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-5 mx-auto"><Trash2 size={32} className="text-red-500" /></div>
                <h3 className="text-2xl font-bold text-[#202124] dark:text-white text-center mb-3">{isAll ? 'Clear All Specializations?' : 'Delete Specialization?'}</h3>
                <p className="text-[#5f6368] dark:text-gray-400 text-center text-sm mb-8 leading-relaxed">
                    {isAll ? 'This permanently deletes all specializations. Cannot be undone.' : <>Delete <strong>"{specialization?.name}"</strong>? This action is permanent and removes all associated linkages.</>}
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={onClose} className="py-3 rounded-xl font-semibold text-[#5f6368] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors">Cancel</button>
                    <button onClick={onConfirm} disabled={isLoading} className="py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center">
                        {isLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Yes, Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── View Modal ───────────────────────────────────────────────────────────────

export function ViewSpecializationModal({ specialization, courses, carriers, onClose }: { specialization: Specialization; courses: Course[]; carriers: Carrier[]; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white dark:bg-[#111] rounded-2xl w-[80vw] max-h-[88vh] shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800">

                {/* Header Bar */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-transparent dark:bg-transparent flex items-center justify-center flex-shrink-0">
                            <CourseIcon courseName={specialization.name} fallback="specialization" size={35} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5">Specialization</p>
                            <h2 className="text-lg font-bold text-[#202124] dark:text-white leading-tight">{specialization.name}</h2>
                            <p className="text-sm text-[#5f6368] font-sans mt-0.5">{specialization.specializationId}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
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
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-3">Introduction</h3>
                                <p className="text-base text-[#3c4043] dark:text-gray-300 leading-7">{specialization.description}</p>
                            </section>

                            {/* Linked Courses */}
                            <section>
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-4 flex items-center gap-2">
                                    <BookOpen size={14} /> Linked Courses ({specialization.courseIds?.length || 0})
                                </h3>
                                {specialization.courseDescription && (
                                    <p className="text-sm text-[#5f6368] dark:text-gray-400 mb-4 p-4 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800 leading-relaxed">{specialization.courseDescription}</p>
                                )}
                                <div className="space-y-2">
                                    {specialization.courseIds?.length > 0 ? specialization.courseIds.map(id => {
                                        const c = courses.find(x => x.id === id);
                                        return (
                                            <div key={id} className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a1a1a] hover:border-primary/30 transition-colors">
                                                <div className="w-8 h-8 bg-transparent dark:bg-transparent text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center flex-shrink-0"><CourseIcon courseName={c?.name || ''} size={20} /></div>
                                                <div>
                                                    <p className="text-sm font-semibold text-[#202124] dark:text-white">{c?.name || 'Unknown Course'}</p>
                                                    <p className="text-[11px] text-[#80868b] font-mono">{c?.courseId || id}</p>
                                                </div>
                                            </div>
                                        );
                                    }) : <p className="text-sm text-gray-400 italic">No courses linked yet.</p>}
                                </div>
                            </section>

                            {/* What You Will Learn */}
                            {specialization.whatYouWillLearn?.filter(Boolean).length > 0 && (
                                <section>
                                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-4">What You Will Learn</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {specialization.whatYouWillLearn.filter(Boolean).map((item, i) => (
                                            <div key={i} className="flex gap-3 items-start p-3.5 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800">
                                                <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm text-[#3c4043] dark:text-gray-300 leading-relaxed">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* FAQs */}
                            {specialization.faqs?.filter(f => f.question && f.answer).length > 0 && (
                                <section>
                                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-4 flex items-center gap-2">
                                        <HelpCircle size={14} /> Frequently Asked Questions
                                    </h3>
                                    <div className="space-y-3">
                                        {specialization.faqs.filter(f => f.question && f.answer).map((faq, i) => (
                                            <div key={i} className="p-5 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-[#1a1a1a]">
                                                <p className="text-sm font-semibold text-[#202124] dark:text-white mb-2">{faq.question}</p>
                                                <p className="text-sm text-[#5f6368] dark:text-gray-400 leading-relaxed">{faq.answer}</p>
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
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                                        <p className="text-2xl font-black text-[#202124] dark:text-white">{specialization.courseIds?.length || 0}</p>
                                        <p className="text-[10px] uppercase tracking-wider text-[#80868b] mt-1 flex items-center justify-center gap-1"><BookOpen size={11} /> Courses</p>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                                        <p className="text-2xl font-black text-[#202124] dark:text-white">{specialization.carrierIds?.length || 0}</p>
                                        <p className="text-[10px] uppercase tracking-wider text-[#80868b] mt-1 flex items-center justify-center gap-1"><Route size={11} /> Carriers</p>
                                    </div>
                                </div>
                            </section>

                            {/* Connected Carriers */}
                            <section>
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-4 flex items-center gap-2">
                                    <Route size={14} /> Connected Carriers
                                </h3>
                                {specialization.carrierIds?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {specialization.carrierIds.map(id => {
                                            const c = carriers.find(x => x.id === id);
                                            return <span key={id} className="text-xs px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg text-[#3c4043] dark:text-gray-300 font-medium">{c?.name || id}</span>;
                                        })}
                                    </div>
                                ) : <p className="text-sm text-gray-400 italic">No carriers connected.</p>}
                            </section>

                            {/* Skills */}
                            {specialization.skills?.length > 0 && (
                                <section>
                                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-4">Skills You Will Gain</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {specialization.skills.map((s, i) => (
                                            <span key={i} className="text-xs font-semibold px-3 py-1.5 bg-[#e8f0fe] dark:bg-blue-900/20 text-[#1a73e8] dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-800/30">{s}</span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Instructors */}
                            {specialization.instructors?.filter(i => i.name).length > 0 && (
                                <section>
                                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-4 flex items-center gap-2">
                                        <User size={14} /> Instructors
                                    </h3>
                                    <div className="space-y-3">
                                        {specialization.instructors.filter(i => i.name).map((inst, i) => (
                                            <div key={i} className="flex gap-3 p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-[#1a1a1a]">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#2d2d2d] flex items-center justify-center text-[#80868b] flex-shrink-0"><User size={20} /></div>
                                                <div>
                                                    <p className="text-sm font-semibold text-[#202124] dark:text-white">{inst.name}</p>
                                                    {inst.education && <p className="text-[11px] font-bold text-primary uppercase tracking-wider mt-0.5">{inst.education}</p>}
                                                    {inst.courseCount > 0 && <p className="text-xs text-[#80868b] flex items-center gap-1 mt-1"><BookOpen size={11} /> {inst.courseCount} Course{inst.courseCount !== 1 ? 's' : ''}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* System Footer */}
                            <div className="pt-6 border-t border-dashed border-gray-200 dark:border-gray-800">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#80868b]">System Generated</p>
                                <p className="text-[10px] font-mono mt-1 text-gray-400">{specialization.createdAt?.seconds ? new Date(specialization.createdAt.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Just now'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

