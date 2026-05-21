'use client';

import React, { useState } from 'react';
import { Route, X, PlusCircle, AlertTriangle, BookOpen, Layers } from 'lucide-react';
import { CourseIcon } from '@/components/CourseIcon';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Carrier {
    id: string;
    carrierId: string;
    name: string;
    description: string;
    createdAt?: any;
}

export interface CarrierForm {
    carrierId: string;
    name: string;
    description: string;
}

export type ModalMode = 'closed' | 'add' | 'edit' | 'delete' | 'deleteAll' | 'view';

export const BLANK: CarrierForm = { carrierId: '', name: '', description: '' };

// ─── AddEdit Modal ────────────────────────────────────────────────────────────

interface AddEditCarrierModalProps {
    mode: 'add' | 'edit';
    form: CarrierForm;
    setForm: (form: CarrierForm) => void;
    addTab?: 'single' | 'bulk';
    setAddTab?: (tab: 'single' | 'bulk') => void;
    bulkForms?: CarrierForm[];
    setBulkForms?: (forms: CarrierForm[]) => void;
    onClose: () => void;
    onSubmit: () => void;
    isLoading: boolean;
    error: string | null;
}

export function AddEditCarrierModal({
    mode,
    form,
    setForm,
    addTab: propAddTab,
    setAddTab: propSetAddTab,
    bulkForms: propBulkForms,
    setBulkForms: propSetBulkForms,
    onClose,
    onSubmit,
    isLoading,
    error
}: AddEditCarrierModalProps) {
    const [localAddTab, setLocalAddTab] = useState<'single' | 'bulk'>('single');
    const [localBulkForms, setLocalBulkForms] = useState<CarrierForm[]>([{ carrierId: '', name: '', description: '' }]);

    const addTab = propAddTab !== undefined ? propAddTab : localAddTab;
    const setAddTab = propSetAddTab !== undefined ? propSetAddTab : setLocalAddTab;

    const bulkForms = propBulkForms !== undefined ? propBulkForms : localBulkForms;
    const setBulkForms = propSetBulkForms !== undefined ? propSetBulkForms : setLocalBulkForms;

    const isSingleValid = form.carrierId.trim() !== '' && form.name.trim() !== '' && form.description.trim() !== '';
    const isBulkValid = bulkForms.every(bf => bf.carrierId.trim() !== '' && bf.name.trim() !== '' && bf.description.trim() !== '');
    const isValid = mode === 'edit' ? isSingleValid : (addTab === 'single' ? isSingleValid : isBulkValid);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 flex-shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-transparent dark:bg-transparent flex items-center justify-center">
                            <CourseIcon courseName="carrier" size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#202124] dark:text-white leading-tight">
                                {mode === 'edit' ? 'Edit Carrier Path' : 'Add Carrier Path'}
                            </h3>
                            <p className="text-xs text-[#5f6368] dark:text-gray-400">Configure carrier path details</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-[#5f6368] transition-colors"><X size={20} /></button>
                </div>

                {/* Tabs (Add only) */}
                {mode === 'add' && (
                    <div className="flex border-b border-gray-200 dark:border-gray-800 px-6 pt-4 bg-gray-50 dark:bg-[#121212]">
                        <button className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${addTab === 'single' ? 'border-primary text-primary' : 'border-transparent text-[#5f6368] hover:text-[#202124] dark:hover:text-white'}`} onClick={() => setAddTab('single')}>
                            Add a Carrier
                        </button>
                        <button className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ml-4 ${addTab === 'bulk' ? 'border-primary text-primary' : 'border-transparent text-[#5f6368] hover:text-[#202124] dark:hover:text-white'}`} onClick={() => setAddTab('bulk')}>
                            Add Bulk
                        </button>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 mx-6 mt-4 rounded-lg text-sm font-medium flex items-center">
                        <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {(mode === 'edit' || (mode === 'add' && addTab === 'single')) && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#202124] dark:text-gray-300 mb-1">Carrier ID</label>
                                <input type="text" value={form.carrierId} onChange={e => setForm({ ...form, carrierId: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2d2d2d] text-[#202124] dark:text-white focus:ring-2 focus:ring-primary outline-none transition"
                                    placeholder="e.g. CARR-001" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#202124] dark:text-gray-300 mb-1">Carrier Name</label>
                                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2d2d2d] text-[#202124] dark:text-white focus:ring-2 focus:ring-primary outline-none transition"
                                    placeholder="e.g. Primary US Route" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#202124] dark:text-gray-300 mb-1">Description</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2d2d2d] text-[#202124] dark:text-white focus:ring-2 focus:ring-primary outline-none transition min-h-[100px] resize-y"
                                    placeholder="Brief description of the carrier path..." />
                            </div>
                        </div>
                    )}

                    {mode === 'add' && addTab === 'bulk' && (
                        <div className="space-y-8">
                            {bulkForms.map((bf, i) => (
                                <div key={i} className="relative p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#2d2d2d]/30">
                                    <div className="absolute top-2 right-4 text-xs font-bold text-gray-400">#{i + 1}</div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-[#202124] dark:text-gray-300 mb-1">Carrier ID</label>
                                                <input type="text" value={bf.carrierId} onChange={e => { const n = [...bulkForms]; n[i].carrierId = e.target.value; setBulkForms(n); }}
                                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2d2d2d] text-[#202124] dark:text-white focus:ring-2 focus:ring-primary outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-[#202124] dark:text-gray-300 mb-1">Carrier Name</label>
                                                <input type="text" value={bf.name} onChange={e => { const n = [...bulkForms]; n[i].name = e.target.value; setBulkForms(n); }}
                                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2d2d2d] text-[#202124] dark:text-white focus:ring-2 focus:ring-primary outline-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[#202124] dark:text-gray-300 mb-1">Description</label>
                                            <textarea value={bf.description} onChange={e => { const n = [...bulkForms]; n[i].description = e.target.value; setBulkForms(n); }}
                                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2d2d2d] text-[#202124] dark:text-white focus:ring-2 focus:ring-primary outline-none min-h-[60px] resize-y" />
                                        </div>
                                    </div>
                                    {bulkForms.length > 1 && (
                                        <button onClick={() => setBulkForms(bulkForms.filter((_, j) => j !== i))}
                                            className="absolute -top-3 -right-3 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 text-red-600 rounded-full p-1 shadow-sm transition-colors">
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button onClick={() => setBulkForms([...bulkForms, { carrierId: '', name: '', description: '' }])}
                                className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary rounded-xl text-[#5f6368] hover:text-primary transition-colors flex items-center justify-center font-medium">
                                <PlusCircle size={18} className="mr-2" /> Add another carrier
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#121212] flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-[#5f6368] dark:text-gray-400 hover:text-[#202124] dark:hover:text-white font-medium transition-colors">
                        Cancel
                    </button>
                    <button onClick={onSubmit} disabled={!isValid || isLoading}
                        className={`px-6 py-2 font-medium rounded-lg shadow-sm transition-all flex items-center justify-center min-w-[140px] ${isValid && !isLoading ? 'bg-primary hover:bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : mode === 'edit' ? 'Save Changes' : 'Create Carrier'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────

interface DeleteCarrierModalProps {
    mode: 'delete' | 'deleteAll';
    carrier: Carrier | null;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export function DeleteCarrierModal({ mode, carrier, onClose, onConfirm, isLoading }: DeleteCarrierModalProps) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm bg-black/50 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl w-full max-w-md shadow-2xl p-6 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={32} className="text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-[#202124] dark:text-white mb-2">
                    {mode === 'deleteAll' ? 'Clear All Carrier Paths?' : 'Delete Carrier Path?'}
                </h3>
                <p className="text-[#5f6368] dark:text-gray-400 mb-6">
                    {mode === 'deleteAll'
                        ? <>Are you sure you want to delete <span className="font-bold text-red-600 dark:text-red-400">ALL</span> carrier paths? This cannot be undone.</>
                        : <>Are you sure you want to delete <span className="font-bold text-[#202124] dark:text-white">"{carrier?.name}"</span>? This cannot be undone.</>
                    }
                </p>
                <div className="flex justify-center gap-3">
                    <button onClick={onClose} className="px-6 py-2 border border-gray-300 dark:border-gray-700 text-[#5f6368] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] rounded-lg font-medium transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={isLoading}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center min-w-[120px] ${isLoading ? 'bg-red-400 cursor-not-allowed text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}>
                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── View Modal ───────────────────────────────────────────────────────────────

interface ViewCarrierModalProps {
    carrier: Carrier;
    courses?: any[];
    specializations?: any[];
    onClose: () => void;
}

export function ViewCarrierModal({ carrier, courses = [], specializations = [], onClose }: ViewCarrierModalProps) {
    const linkedCourses = courses.filter(c => c.carrierIds?.includes(carrier.id));
    const linkedSpecs = specializations.filter(s => s.carrierIds?.includes(carrier.id));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white dark:bg-[#111] rounded-2xl w-[80vw] max-h-[88vh] shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-transparent dark:bg-transparent flex items-center justify-center flex-shrink-0">
                            <CourseIcon courseName="carrier" size={35} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5">Carrier Path</p>
                            <h2 className="text-lg font-bold text-[#202124] dark:text-white leading-tight">{carrier.name}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-[#2d2d2d] rounded-lg font-mono font-bold text-[#5f6368] dark:text-gray-300">
                            {carrier.carrierId}
                        </span>
                        <span className="text-xs px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg font-semibold text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/40">Active</span>
                        <button onClick={onClose} className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2d2d2d] text-[#5f6368] transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-800 min-h-full">
                        {/* Left */}
                        <div className="lg:col-span-2 p-8 space-y-10">
                            <section>
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-3">Carrier Overview</h3>
                                <p className="text-base text-[#3c4043] dark:text-gray-300 leading-7">{carrier.description}</p>
                            </section>
                            <section>
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-4 flex items-center gap-2">
                                    <BookOpen size={14} /> Linked Courses ({linkedCourses.length})
                                </h3>
                                <div className="space-y-2">
                                    {linkedCourses.length > 0 ? linkedCourses.map(c => (
                                        <div key={c.id} className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a1a1a] hover:border-primary/30 transition-colors">
                                            <div className="w-8 h-8 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <CourseIcon courseName={c.name} size={22} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-[#202124] dark:text-white">{c.name}</p>
                                                <p className="text-[11px] text-[#80868b] font-mono">{c.courseId}</p>
                                            </div>
                                        </div>
                                    )) : <p className="text-sm text-gray-400 italic">No courses linked yet.</p>}
                                </div>
                            </section>
                        </div>

                        {/* Right */}
                        <div className="p-8 space-y-10 bg-gray-50/40 dark:bg-[#0d0d0d]">
                            <section>
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-4">Overview</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                                        <p className="text-2xl font-black text-[#202124] dark:text-white">{linkedCourses.length}</p>
                                        <p className="text-[10px] uppercase tracking-wider text-[#80868b] mt-1 flex items-center justify-center gap-1"><BookOpen size={11} /> Courses</p>
                                    </div>
                                    <div className="p-4 bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                                        <p className="text-2xl font-black text-[#202124] dark:text-white">{linkedSpecs.length}</p>
                                        <p className="text-[10px] uppercase tracking-wider text-[#80868b] mt-1 flex items-center justify-center gap-1"><Layers size={11} /> Specialties</p>
                                    </div>
                                </div>
                            </section>
                            <section>
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#80868b] mb-4 flex items-center gap-2">
                                    <Layers size={14} /> Linked Specialties
                                </h3>
                                {linkedSpecs.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {linkedSpecs.map(s => (
                                            <span key={s.id} className="text-xs px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg text-[#3c4043] dark:text-gray-300 font-medium">{s.name}</span>
                                        ))}
                                    </div>
                                ) : <p className="text-sm text-gray-400 italic">No specialties connected.</p>}
                            </section>
                            <div className="pt-6 border-t border-dashed border-gray-200 dark:border-gray-800">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#80868b]">System Generated</p>
                                <p className="text-[10px] font-mono mt-1 text-gray-400">
                                    {carrier.createdAt?.seconds ? new Date(carrier.createdAt.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Just now'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
