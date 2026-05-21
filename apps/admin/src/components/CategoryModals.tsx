'use client';
import React, { useState, useRef } from 'react';
import { X, Trash2, AlertTriangle, PlusCircle, Check, Layers, User, LayoutGrid, Route, BookOpen, Upload, Calendar } from 'lucide-react';
import { MultiSelectDropdown, Chips } from './CourseModals';
import type { Skill } from './CourseModals';
import { CourseIcon } from '@/components/CourseIcon';

export interface Partner { name: string; date: string; logoUrl: string; }

export interface Category {
    id: string;
    categoryId: string;
    name: string;
    description: string;
    carrierIds: string[];
    specializationIds: string[];
    courseIds: string[];
    whatYouWillLearn: string[];
    skills: string[];
    partners: Partner[];
    faqs: { question: string; answer: string }[];
    createdAt?: any;
}

export type CategoryModalMode = 'closed' | 'add' | 'edit' | 'delete' | 'view';

export interface SingleCategoryForm {
    categoryId: string;
    name: string;
    description: string;
    carrierIds: string[];
    specializationIds: string[];
    courseIds: string[];
    whatYouWillLearn: string[];
    skills: string[];
    partners: Partner[];
    faqs: { question: string; answer: string }[];
}

export const BLANK_CATEGORY: SingleCategoryForm = {
    categoryId: '', name: '', description: '', carrierIds: [], specializationIds: [], courseIds: [],
    whatYouWillLearn: [''], skills: [], partners: [], faqs: [{ question: '', answer: '' }]
};

interface AddEditProps {
    mode: CategoryModalMode;
    form: SingleCategoryForm;
    setForm: (f: SingleCategoryForm) => void;
    carriers: { id: string; name: string; carrierId: string }[];
    specializations: { id: string; name: string; specId: string }[];
    courses: { id: string; name: string; courseId: string }[];
    onClose: () => void;
    onSubmit: () => void;
    isLoading: boolean;
    error: string | null;
    dbSkills: Skill[];
    onAddSkillToDb?: (skillName: string) => Promise<Skill | null>;
}

export function AddEditCategoryModal({ mode, form, setForm, carriers, specializations, courses, dbSkills, onAddSkillToDb, onClose, onSubmit, isLoading, error }: AddEditProps) {
    const isEdit = mode === 'edit';

    // Temporary state for the new partner form
    const [isAddingPartner, setIsAddingPartner] = useState(false);
    const [partnerName, setPartnerName] = useState('');
    const [partnerDate, setPartnerDate] = useState('');
    const [partnerLogoFile, setPartnerLogoFile] = useState<File | null>(null);
    const [partnerLogoPreview, setPartnerLogoPreview] = useState<string>('');
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const [partnerError, setPartnerError] = useState('');

    const toggleCarrier = (id: string) => setForm({ ...form, carrierIds: form.carrierIds.includes(id) ? form.carrierIds.filter(x => x !== id) : [...form.carrierIds, id] });
    const toggleSpecialization = (id: string) => setForm({ ...form, specializationIds: form.specializationIds.includes(id) ? form.specializationIds.filter(x => x !== id) : [...form.specializationIds, id] });
    const toggleCourse = (id: string) => setForm({ ...form, courseIds: form.courseIds.includes(id) ? form.courseIds.filter(x => x !== id) : [...form.courseIds, id] });
    const toggleSkill = (name: string) => setForm({ ...form, skills: form.skills.includes(name) ? form.skills.filter(x => x !== name) : [...form.skills, name] });

    const [newSkillName, setNewSkillName] = useState('');
    const [isAddingSkill, setIsAddingSkill] = useState(false);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPartnerLogoFile(file);
            setPartnerLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSavePartner = async () => {
        setPartnerError('');
        if (!partnerName || !partnerDate) {
            setPartnerError('Name and Date are required.');
            return;
        }

        let logoUrl = '';
        if (partnerLogoFile) {
            setIsUploadingLogo(true);
            try {
                const formData = new FormData();
                formData.append('logo', partnerLogoFile);
                
                const API = `${(process.env.NEXT_PUBLIC_API_URL ?? '')}/api/inspire/category/uploadLogo`;
                const res = await fetch(API, { method: 'POST', body: formData });
                const data = await res.json();
                
                if (!data.success) throw new Error(data.message);
                logoUrl = data.url;
            } catch (err: any) {
                setPartnerError(err.message || 'Error uploading logo');
                setIsUploadingLogo(false);
                return;
            }
            setIsUploadingLogo(false);
        }

        setForm({ ...form, partners: [...form.partners, { name: partnerName, date: partnerDate, logoUrl }] });
        setPartnerName('');
        setPartnerDate('');
        setPartnerLogoFile(null);
        setPartnerLogoPreview('');
        setIsAddingPartner(false);
    };

    const removePartner = (idx: number) => {
        const newP = [...form.partners];
        newP.splice(idx, 1);
        setForm({ ...form, partners: newP });
    };

    const valid = form.name.trim() !== '' && form.description.trim() !== '' && (isEdit ? form.categoryId.trim() !== '' : true);

    const inp = "w-full px-4 py-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm text-[#202124] dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600";
    const label = "block text-xs font-bold uppercase tracking-wider text-[#80868b] mb-2";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
            <div className="bg-[#f8f9fa] dark:bg-[#0a0a0a] rounded-xl w-[90vw] max-w-7xl shadow-2xl flex flex-col h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 flex-shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-transparent dark:bg-transparent flex items-center justify-center">
                            <CourseIcon courseName={form.name} fallback="category" size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#202124] dark:text-white leading-tight">{isEdit ? 'Edit Category' : 'Create Category'}</h3>
                            <p className="text-xs text-[#5f6368] dark:text-gray-400">Organize Carriers, Specializations, and Courses</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-[#5f6368] transition-colors"><X size={20} /></button>
                </div>

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                    {/* Left Panel */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 md:border-r border-gray-200 dark:border-gray-800">
                        <div className="space-y-6 max-w-xl mx-auto">
                            <div>
                                <label className={label}>Category Details</label>
                                <div className="space-y-4 p-5 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800">
                                    <div>
                                        <label className="block text-xs text-[#80868b] mb-1">Category ID</label>
                                        <input className={`${inp} opacity-60 cursor-not-allowed`} placeholder="Auto-Generated" value={isEdit ? form.categoryId : "Auto-Generated"} disabled />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#80868b] mb-1">Category Name</label>
                                        <input className={inp} placeholder="e.g. Technology" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#80868b] mb-1">Description</label>
                                        <textarea rows={4} className={`${inp} resize-none`} placeholder="Brief overview..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            {/* Relationships */}
                            <div>
                                <label className={label}>Associations</label>
                                <div className="space-y-4 p-5 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800">
                                    <div>
                                        <label className="block text-xs text-[#80868b] mb-2 flex items-center gap-1"><Route size={12}/> Connected Carriers</label>
                                        <MultiSelectDropdown items={carriers.map(c => ({ id: c.id, name: c.name, secondary: c.carrierId }))} selectedIds={form.carrierIds} onToggle={toggleCarrier} placeholder="Select Carriers" />
                                        <Chips ids={form.carrierIds} items={carriers} onRemove={toggleCarrier} />
                                    </div>
                                    <hr className="border-gray-100 dark:border-gray-800" />
                                    <div>
                                        <label className="block text-xs text-[#80868b] mb-2 flex items-center gap-1"><Layers size={12}/> Connected Specializations</label>
                                        <MultiSelectDropdown items={specializations.map(c => ({ id: c.id, name: c.name, secondary: c.specId }))} selectedIds={form.specializationIds} onToggle={toggleSpecialization} placeholder="Select Specializations" />
                                        <Chips ids={form.specializationIds} items={specializations} onRemove={toggleSpecialization} />
                                    </div>
                                    <hr className="border-gray-100 dark:border-gray-800" />
                                    <div>
                                        <label className="block text-xs text-[#80868b] mb-2 flex items-center gap-1"><BookOpen size={12}/> Connected Courses</label>
                                        <MultiSelectDropdown items={courses.map(c => ({ id: c.id, name: c.name, secondary: c.courseId }))} selectedIds={form.courseIds} onToggle={toggleCourse} placeholder="Select Courses" />
                                        <Chips ids={form.courseIds} items={courses} onRemove={toggleCourse} />
                                    </div>
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
                                            <input className={inp} placeholder="Learning outcome..." value={item} onChange={e => {
                                                const n = [...form.whatYouWillLearn]; n[idx] = e.target.value; setForm({ ...form, whatYouWillLearn: n });
                                            }} />
                                            <button type="button" onClick={() => {
                                                const n = [...form.whatYouWillLearn]; n.splice(idx, 1); setForm({ ...form, whatYouWillLearn: n });
                                            }} className="p-3 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><X size={18} /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => setForm({ ...form, whatYouWillLearn: [...form.whatYouWillLearn, ''] })} className="flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors py-2"><PlusCircle size={16} /> Add Outcome</button>
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
                                                    <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e8f0fe] dark:bg-blue-900/20 text-[#1a73e8] dark:text-blue-400 rounded-lg text-xs font-medium border border-blue-100 dark:border-blue-800/30">
                                                        {skill} <button type="button" onClick={() => toggleSkill(skill)} className="hover:text-red-500 transition-colors ml-1"><X size={14} /></button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Partners */}
                            <div>
                                <label className={label}>Partners</label>
                                <div className="space-y-3">
                                    {form.partners.map((p, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800">
                                            {p.logoUrl ? (
                                                <img src={p.logoUrl} alt={p.name} className="w-12 h-12 rounded bg-white object-contain border border-gray-100 dark:border-gray-800" />
                                            ) : (
                                                <div className="w-12 h-12 rounded bg-gray-100 dark:bg-[#2d2d2d] flex items-center justify-center text-gray-400"><User size={20}/></div>
                                            )}
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-[#202124] dark:text-white">{p.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{p.date}</p>
                                            </div>
                                            <button type="button" onClick={() => removePartner(idx)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    ))}

                                    {!isAddingPartner ? (
                                        <button type="button" onClick={() => setIsAddingPartner(true)} className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-[#5f6368] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors text-sm font-medium">
                                            <PlusCircle size={16} /> Add Partner
                                        </button>
                                    ) : (
                                        <div className="p-5 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-primary/30 space-y-4">
                                            <h4 className="text-sm font-semibold text-[#202124] dark:text-white">New Partner</h4>
                                            
                                            <div className="flex items-center gap-4">
                                                <label className="flex-shrink-0 cursor-pointer w-16 h-16 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#121212] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] transition-colors relative overflow-hidden">
                                                    {partnerLogoPreview ? (
                                                        <img src={partnerLogoPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                                    ) : (
                                                        <Upload size={18} className="text-gray-400" />
                                                    )}
                                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                                </label>
                                                <div className="text-xs text-gray-500">Upload Logo<br/>(Max 5MB)</div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <input className={inp} placeholder="Partner Name" value={partnerName} onChange={e => setPartnerName(e.target.value)} />
                                                <input type="date" className={inp} value={partnerDate} onChange={e => setPartnerDate(e.target.value)} />
                                            </div>
                                            
                                            {partnerError && <p className="text-xs text-red-500">{partnerError}</p>}
                                            
                                            <div className="flex gap-2 justify-end pt-2">
                                                <button type="button" onClick={() => setIsAddingPartner(false)} className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
                                                <button type="button" onClick={handleSavePartner} disabled={isUploadingLogo} className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2">
                                                    {isUploadingLogo ? 'Uploading...' : 'Save Partner'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* FAQs */}
                            <div>
                                <label className={label}>FAQs</label>
                                <div className="space-y-4">
                                    {form.faqs.map((faq, idx) => (
                                        <div key={idx} className="p-5 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3 relative group">
                                            <button type="button" onClick={() => {
                                                const n = [...form.faqs]; n.splice(idx, 1); setForm({ ...form, faqs: n });
                                            }} className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                                            <input className={inp} placeholder="Question..." value={faq.question} onChange={e => {
                                                const n = [...form.faqs]; n[idx].question = e.target.value; setForm({ ...form, faqs: n });
                                            }} />
                                            <textarea rows={3} className={`${inp} resize-none`} placeholder="Answer..." value={faq.answer} onChange={e => {
                                                const n = [...form.faqs]; n[idx].answer = e.target.value; setForm({ ...form, faqs: n });
                                            }} />
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => setForm({ ...form, faqs: [...form.faqs, { question: '', answer: '' }] })} className="flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors py-2"><PlusCircle size={16} /> Add FAQ</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 sm:p-6 bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 flex-shrink-0 z-10">
                    {error && <span className="text-sm text-red-500 self-center mr-auto flex items-center gap-2 bg-red-50 dark:bg-red-900/10 px-3 py-1.5 rounded-lg"><AlertTriangle size={16} /> {error}</span>}
                    <button type="button" onClick={onClose} disabled={isLoading} className="px-6 py-2.5 text-sm font-semibold text-[#5f6368] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-xl transition-colors">Cancel</button>
                    <button type="button" onClick={onSubmit} disabled={!valid || isLoading} className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 ${valid && !isLoading ? 'bg-[#1a73e8] text-white hover:bg-blue-700 hover:shadow-md' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-400 cursor-not-allowed'}`}>
                        {isLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check size={18} />}
                        {isEdit ? 'Save Changes' : 'Create Category'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────
export function DeleteCategoryModal({ category, onClose, onConfirm, isLoading }: { category: Category; onClose: () => void; onConfirm: () => void; isLoading: boolean }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl w-full max-w-md p-6 shadow-2xl border border-red-100 dark:border-red-900/20">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mb-4"><Trash2 size={24} /></div>
                <h3 className="text-xl font-bold text-[#202124] dark:text-white mb-2">Delete Category?</h3>
                <p className="text-sm text-[#5f6368] dark:text-gray-400 mb-6">Are you sure you want to delete <span className="font-semibold text-[#202124] dark:text-gray-200">"{category.name}"</span>? This action cannot be undone and will not delete associated carriers or courses.</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} disabled={isLoading} className="px-5 py-2.5 text-sm font-semibold text-[#5f6368] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] rounded-xl transition-colors">Cancel</button>
                    <button onClick={onConfirm} disabled={isLoading} className="px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2">
                        {isLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Delete Category'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── View Modal ─────────────────────────────────────────────────────────
export function ViewCategoryModal({ category, carriers, specializations, courses, onClose }: { category: Category; carriers: any[]; specializations: any[]; courses: any[]; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white dark:bg-[#111] rounded-2xl w-[80vw] max-h-[88vh] shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800">
                
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-transparent dark:bg-transparent flex items-center justify-center flex-shrink-0">
                            <CourseIcon courseName={category.name} fallback="category" size={35} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5">Category Structure</p>
                            <h2 className="text-lg font-bold text-[#202124] dark:text-white leading-tight">{category.name}</h2>
                            <p className="text-sm text-[#5f6368] font-sans mt-0.5">{category.categoryId}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-[#5f6368] transition-colors"><X size={20} /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <section>
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-3">Overview</h3>
                                <p className="text-base text-[#3c4043] dark:text-gray-300 leading-7">{category.description}</p>
                            </section>

                            <section>
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-4">What You Will Learn</h3>
                                {category.whatYouWillLearn?.filter(Boolean).length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {category.whatYouWillLearn.filter(Boolean).map((item, i) => (
                                            <div key={i} className="flex gap-3 items-start p-3.5 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800">
                                                <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm text-[#3c4043] dark:text-gray-300 leading-relaxed">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-sm text-gray-400 italic">No content found.</p>}
                            </section>

                            <section>
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-4">Partners</h3>
                                {category.partners?.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {category.partners.map((p, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-[#1a1a1a]">
                                                {p.logoUrl ? (
                                                    <img src={p.logoUrl} alt={p.name} className="w-12 h-12 object-contain rounded" />
                                                ) : <User className="text-gray-400"/>}
                                                <div>
                                                    <p className="text-sm font-semibold text-[#202124] dark:text-white">{p.name}</p>
                                                    <p className="text-xs text-gray-500">{p.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-sm text-gray-400 italic">No partners available.</p>}
                            </section>
                        </div>

                        <div className="space-y-8 bg-gray-50/40 dark:bg-[#0d0d0d] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <section>
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-3"><Route className="inline mr-1" size={14}/> Associated Carriers</h3>
                                {category.carrierIds?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {category.carrierIds.map(id => {
                                            const c = carriers.find(x => x.id === id);
                                            return <span key={id} className="text-xs px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg text-[#3c4043] dark:text-gray-300 font-medium">{c?.name || id}</span>;
                                        })}
                                    </div>
                                ) : <p className="text-sm text-gray-400 italic">None linked.</p>}
                            </section>

                            <section>
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-3"><Layers className="inline mr-1" size={14}/> Specializations</h3>
                                {category.specializationIds?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {category.specializationIds.map(id => {
                                            const s = specializations.find(x => x.id === id);
                                            return <span key={id} className="text-xs px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg text-[#3c4043] dark:text-gray-300 font-medium">{s?.name || id}</span>;
                                        })}
                                    </div>
                                ) : <p className="text-sm text-gray-400 italic">None linked.</p>}
                            </section>
                            
                            <section>
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-3"><BookOpen className="inline mr-1" size={14}/> Courses</h3>
                                {category.courseIds?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {category.courseIds.map(id => {
                                            const s = courses.find(x => x.id === id);
                                            return <span key={id} className="text-xs px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg text-[#3c4043] dark:text-gray-300 font-medium">{s?.name || id}</span>;
                                        })}
                                    </div>
                                ) : <p className="text-sm text-gray-400 italic">None linked.</p>}
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
