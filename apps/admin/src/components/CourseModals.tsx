'use client';
import React from 'react';
import { X, Trash2, AlertTriangle, PlusCircle, ChevronDown, Check } from 'lucide-react';

export interface Carrier { id: string; carrierId: string; name: string; description: string; }
export interface Course { id: string; courseId: string; name: string; description: string; carrierIds: string[]; bookCount: number; createdAt: any; }
export type ModalMode = 'closed' | 'add' | 'edit' | 'delete' | 'deleteAll' | 'view';
export type AddTab = 'single' | 'bulk';
export interface SingleForm { courseId: string; name: string; description: string; carrierIds: string[]; }
export interface BulkEntry { courseId: string; name: string; description: string; carrierIds: string[]; }

// ─── Carrier Chips ───────────────────────────────────────────────────────────
export function CarrierChips({ ids, carriers, onRemove }: { ids: string[]; carriers: Carrier[]; onRemove: (id: string) => void }) {
    if (!ids.length) return null;
    return (
        <div className="flex flex-wrap gap-2 mb-2">
            {ids.map(id => {
                const c = carriers.find(x => x.id === id);
                return (
                    <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold border border-green-200 dark:border-green-800">
                        {c?.name || id}
                        <button onClick={() => onRemove(id)} className="hover:text-red-500 transition-colors"><X size={12} /></button>
                    </span>
                );
            })}
        </div>
    );
}

// ─── Carrier Dropdown ────────────────────────────────────────────────────────
export function CarrierDropdown({ carriers, selected, onToggle }: { carriers: Carrier[]; selected: string[]; onToggle: (id: string) => void }) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);
    return (
        <div className="relative" ref={ref}>
            <button type="button" onClick={() => setOpen(!open)} className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-[#5f6368] hover:border-primary transition-colors">
                <span>Select Carrier to Add a Course to</span>
                <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 rounded-xl shadow-2xl z-50 max-h-52 overflow-y-auto py-1">
                    {carriers.length === 0 && <p className="text-center text-xs text-[#80868b] py-4">No carriers found</p>}
                    {carriers.map(c => (
                        <button key={c.id} type="button" onClick={() => onToggle(c.id)} className="w-full flex justify-between items-center px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-[#2d2d2d] transition-colors">
                            <span className="font-medium text-[#202124] dark:text-white">{c.name}</span>
                            {selected.includes(c.id) && <Check size={15} className="text-green-500" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Single / Edit Form ───────────────────────────────────────────────────────
export function SingleForm({ form, onChange, carriers, onToggleCarrier }: { form: SingleForm; onChange: (f: SingleForm) => void; carriers: Carrier[]; onToggleCarrier: (id: string) => void }) {
    const inp = "w-full px-4 py-3 bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm text-[#202124] dark:text-white dark:caret-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600";
    return (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-semibold text-[#202124] dark:text-white mb-2">Select Carrier to Add a Course to</label>
                <CarrierChips ids={form.carrierIds} carriers={carriers} onRemove={onToggleCarrier} />
                <CarrierDropdown carriers={carriers} selected={form.carrierIds} onToggle={onToggleCarrier} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-[#202124] dark:text-white mb-2">Course ID</label>
                    <input className={inp} placeholder="e.g. CS101" value={form.courseId} onChange={e => onChange({ ...form, courseId: e.target.value })} />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-[#202124] dark:text-white mb-2">Course Name</label>
                    <input className={inp} placeholder="Introduction to CS" value={form.name} onChange={e => onChange({ ...form, name: e.target.value })} />
                </div>
            </div>
            <div>
                <label className="block text-sm font-semibold text-[#202124] dark:text-white mb-2">Course Description</label>
                <textarea rows={4} className={`${inp} resize-none`} placeholder="Brief overview..." value={form.description} onChange={e => onChange({ ...form, description: e.target.value })} />
            </div>
        </div>
    );
}

// ─── Bulk Form ────────────────────────────────────────────────────────────────
export function BulkFormSection({ bulkForms, setBulkForms, carriers }: { bulkForms: BulkEntry[]; setBulkForms: (f: BulkEntry[]) => void; carriers: Carrier[] }) {
    const inp = "w-full px-4 py-2.5 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-lg outline-none text-sm text-[#202124] dark:text-white dark:caret-white placeholder:text-gray-400 dark:placeholder:text-gray-600";
    const toggle = (idx: number, cid: string) => {
        const b = bulkForms.map((f, i) => i !== idx ? f : { ...f, carrierIds: f.carrierIds.includes(cid) ? f.carrierIds.filter(x => x !== cid) : [...f.carrierIds, cid] });
        setBulkForms(b);
    };
    const update = (idx: number, field: keyof BulkEntry, val: string) => setBulkForms(bulkForms.map((f, i) => i !== idx ? f : { ...f, [field]: val }));
    return (
        <div className="space-y-4">
            {bulkForms.map((form, idx) => (
                <div key={idx} className="p-5 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50/30 dark:bg-[#121212]/30 space-y-3 relative">
                    <button className="absolute top-4 right-4 text-[#80868b] hover:text-red-500" onClick={() => setBulkForms(bulkForms.filter((_, i) => i !== idx))}><Trash2 size={14} /></button>
                    <div>
                        <label className="block text-xs font-semibold text-[#202124] dark:text-white mb-1.5">Select Carriers</label>
                        <CarrierChips ids={form.carrierIds} carriers={carriers} onRemove={(cid) => toggle(idx, cid)} />
                        <CarrierDropdown carriers={carriers} selected={form.carrierIds} onToggle={(cid) => toggle(idx, cid)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input placeholder="Course ID" value={form.courseId} onChange={e => update(idx, 'courseId', e.target.value)} className={inp} />
                        <input placeholder="Course Name" value={form.name} onChange={e => update(idx, 'name', e.target.value)} className={inp} />
                    </div>
                    <textarea rows={2} placeholder="Description" value={form.description} onChange={e => update(idx, 'description', e.target.value)} className={`${inp} resize-none`} />
                </div>
            ))}
            <button onClick={() => setBulkForms([...bulkForms, { courseId: '', name: '', description: '', carrierIds: [] }])} className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-[#5f6368] hover:border-primary hover:text-primary flex items-center justify-center gap-2 font-medium transition-all">
                <PlusCircle size={16} /> Add Another Entry
            </button>
        </div>
    );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
interface AddEditProps {
    mode: ModalMode; tab: AddTab; setTab: (t: AddTab) => void;
    form: SingleForm; setForm: (f: SingleForm) => void;
    bulkForms: BulkEntry[]; setBulkForms: (f: BulkEntry[]) => void;
    carriers: Carrier[]; onClose: () => void;
    onSubmit: () => void; isLoading: boolean; error: string | null;
}
export function AddEditModal({ mode, tab, setTab, form, setForm, bulkForms, setBulkForms, carriers, onClose, onSubmit, isLoading, error }: AddEditProps) {
    const toggleCarrier = (id: string) => setForm({ ...form, carrierIds: form.carrierIds.includes(id) ? form.carrierIds.filter(x => x !== id) : [...form.carrierIds, id] });
    const isEdit = mode === 'edit';
    const valid = isEdit || tab === 'single'
        ? form.courseId && form.name && form.description && form.carrierIds.length > 0
        : bulkForms.every(f => f.courseId && f.name && f.description && f.carrierIds.length > 0);
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#111]/50">
                    <h3 className="text-xl font-bold text-[#202124] dark:text-white">{isEdit ? 'Edit Course' : 'Add Course'}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-[#5f6368]"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {!isEdit && (
                        <div className="flex p-1 bg-gray-100 dark:bg-[#111] rounded-xl mb-6">
                            {(['single', 'bulk'] as AddTab[]).map(t => (
                                <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-white dark:bg-[#2d2d2d] shadow-sm text-primary' : 'text-[#5f6368]'}`}>
                                    {t === 'single' ? 'Add a Course' : 'Add Bulk Courses'}
                                </button>
                            ))}
                        </div>
                    )}
                    {(isEdit || tab === 'single')
                        ? <SingleForm form={form} onChange={setForm} carriers={carriers} onToggleCarrier={toggleCarrier} />
                        : <BulkFormSection bulkForms={bulkForms} setBulkForms={setBulkForms} carriers={carriers} />
                    }
                </div>
                <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                    {error && <div className="flex items-center gap-2 p-3 mb-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg text-xs border border-red-100 dark:border-red-800"><AlertTriangle size={14} />{error}</div>}
                    <div className="flex justify-end gap-3">
                        <button onClick={onClose} className="px-5 py-2 rounded-lg text-[#5f6368] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] font-medium">Cancel</button>
                        <button onClick={onSubmit} disabled={isLoading || !valid} className={`px-8 py-2 rounded-lg font-bold min-w-[140px] flex items-center justify-center transition-all ${isLoading || !valid ? 'bg-gray-200 text-[#80868b] cursor-not-allowed' : 'bg-primary hover:bg-blue-600 text-white'}`}>
                            {isLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : isEdit ? 'Update Course' : 'Create Course'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
export function DeleteModal({ mode, course, onClose, onConfirm, isLoading }: { mode: ModalMode; course: Course | null; onClose: () => void; onConfirm: () => void; isLoading: boolean }) {
    const isAll = mode === 'deleteAll';
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl w-full max-w-md shadow-2xl p-8">
                <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-5 mx-auto"><Trash2 size={28} className="text-red-500" /></div>
                <h3 className="text-xl font-bold text-[#202124] dark:text-white text-center mb-2">{isAll ? 'Clear All Courses?' : 'Delete Course?'}</h3>
                <p className="text-[#5f6368] text-center text-sm mb-8">{isAll ? 'This permanently deletes all courses. Cannot be undone.' : `Delete "${course?.name}"? This action is permanent.`}</p>
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
export function ViewModal({ course, carriers, onClose }: { course: Course; carriers: Carrier[]; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                <div className="flex justify-end p-4 border-b border-gray-100">
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-[#5f6368]"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-12">
                    <div className="max-w-xl mx-auto">
                        <div className="text-center border-b border-gray-100 pb-8 mb-8">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-3">Course Specification</p>
                            <h1 className="text-4xl font-black text-[#202124] tracking-tight mb-4">{course.name}</h1>
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-xs px-3 py-1 bg-gray-50 rounded-full border border-gray-100 font-mono font-bold text-primary">{course.courseId}</span>
                                <span className="text-xs px-3 py-1 bg-green-50 rounded-full border border-green-100 font-bold text-green-600">Active</span>
                            </div>
                        </div>
                        <div className="mb-8">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#80868b] mb-4 flex items-center gap-3">
                                <span className="flex-1 h-px bg-gray-100" /> Course Overview <span className="flex-1 h-px bg-gray-100" />
                            </h4>
                            <p className="text-lg text-[#3c4043] leading-relaxed font-serif italic text-center">"{course.description}"</p>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#80868b] border-b pb-2 mb-3">Assigned Carriers</h4>
                                <div className="flex flex-wrap gap-2">
                                    {course.carrierIds.map(id => {
                                        const c = carriers.find(x => x.id === id);
                                        return <span key={id} className="text-xs px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-md text-[#5f6368] font-medium">{c?.name || id}</span>;
                                    })}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#80868b] border-b pb-2 mb-3">Metrics</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm"><span className="text-[#80868b]">Carrier Paths</span><span className="font-bold text-[#202124]">{course.carrierIds.length}</span></div>
                                    <div className="flex justify-between text-sm"><span className="text-[#80868b]">Books Linked</span><span className="font-bold text-[#202124]">{course.bookCount || 0}</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-16 pt-6 border-t border-dashed border-gray-100 flex justify-between items-end opacity-30">
                            <div><p className="text-[9px] font-bold uppercase">System Generated</p><p className="text-[9px] font-mono">{new Date().toISOString()}</p></div>
                            <div className="w-14 h-14 border-4 border-gray-200 rounded-full flex items-center justify-center"><span className="text-[7px] font-black uppercase text-center -rotate-12">Inspire<br />Admin</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
