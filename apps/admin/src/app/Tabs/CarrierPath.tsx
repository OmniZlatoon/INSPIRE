'use client';

import React, { useState, useEffect } from 'react';
import { Route, Plus, MoreVertical, Edit2, Trash2, X, PlusCircle, AlertTriangle, CheckCircle, WifiOff, RefreshCcw, BookOpen, Layers, Eye } from 'lucide-react';

import { SearchBar } from '@/components/SearchBar';
import { NoResultsFound } from '@/components/NoResultsFound';
import { CourseIcon } from '@/components/CourseIcon';
import { SuccessMessage } from '@/components/SuccessMessage';

const SkeletonCard = () => (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-[#2E2E2E] p-4 animate-pulse">
        <div className="flex justify-between items-center mb-3">
            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-800"></div>
            <div className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-800"></div>
        </div>
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
        <div className="h-3 w-1/4 bg-gray-100 dark:bg-gray-800 rounded mb-4"></div>
        <div className="space-y-2 mb-4">
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
            <div className="h-2 w-5/6 bg-gray-100 dark:bg-gray-800 rounded"></div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-2.5 border-t border-gray-50 dark:border-[#2E2E2E]">
            <div className="h-3 w-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-3 w-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
    </div>
);

import { AddEditCarrierModal, DeleteCarrierModal, ViewCarrierModal } from '../../components/CarrierModals';
import type { Carrier, ModalMode } from '../../components/CarrierModals';

type AddMode = 'single' | 'bulk';

export default function CarrierPath() {
    // State
    const [carrierPaths, setCarrierPaths] = useState<Carrier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [courseCounts, setCourseCounts] = useState<Record<string, number>>({});
    const [specCounts, setSpecCounts] = useState<Record<string, number>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const [allSpecs, setAllSpecs] = useState<any[]>([]);

    // Modal State
    const [modalMode, setModalMode] = useState<ModalMode>('closed');
    const [modalError, setModalError] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [addTab, setAddTab] = useState<AddMode>('single');
    const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isExiting, setIsExiting] = useState(false);
    const [isOffline, setIsOffline] = useState(false);

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setIsExiting(false);
        setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
                setSuccessMessage(null);
                setIsExiting(false);
            }, 500);
        }, 3000);
    };

    const API_URL = ((process.env.NEXT_PUBLIC_API_URL ?? '') + "/api/inspire/carrier");

    // Filtered data based on search
    const filteredCarriers = carrierPaths.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.carrierId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Fetch initial data
    const fetchCarriers = async () => {
        setIsLoading(true);
        try {
            const COURSE_API = ((process.env.NEXT_PUBLIC_API_URL ?? '') + '/api/inspire/course');
            const SPEC_API = ((process.env.NEXT_PUBLIC_API_URL ?? '') + '/api/inspire/specialization');
            const [carriersRes, coursesRes, specsRes] = await Promise.all([
                fetch(`${API_URL}/view`),
                fetch(`${COURSE_API}/view`),
                fetch(`${SPEC_API}/view`),
            ]);
            const carriersData = await carriersRes.json();
            const coursesData = await coursesRes.json();
            const specsData = await specsRes.json();

            if (carriersData.success) setCarrierPaths(carriersData.data);

            // Build a map: carrierId -> count of courses that include it
            if (coursesData.success) {
                setAllCourses(coursesData.data);
                const counts: Record<string, number> = {};
                for (const course of coursesData.data) {
                    for (const cid of (course.carrierIds || [])) {
                        counts[cid] = (counts[cid] || 0) + 1;
                    }
                }
                setCourseCounts(counts);
            }
            // Build a map: carrierId -> count of specializations linked to it
            if (specsData.success) {
                setAllSpecs(specsData.data);
                const sCount: Record<string, number> = {};
                for (const spec of specsData.data) {
                    for (const cid of (spec.carrierIds || [])) {
                        sCount[cid] = (sCount[cid] || 0) + 1;
                    }
                }
                setSpecCounts(sCount);
            }
        } catch (error) {
            console.error('Error fetching carriers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCarriers();
    }, []);

    // Form State (Single & Edit)
    const [singleForm, setSingleForm] = useState({ carrierId: '', name: '', description: '' });

    // Form State (Bulk)
    const [bulkForms, setBulkForms] = useState([{ carrierId: '', name: '', description: '' }]);

    // Clear modal error on form change or mode switch
    useEffect(() => {
        setModalError(null);
    }, [singleForm, bulkForms, addTab, modalMode]);

    // Close Dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.dropdown-container')) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Handlers
    const handleOpenAddModal = () => {
        setSingleForm({ carrierId: '', name: '', description: '' });
        setBulkForms([{ carrierId: '', name: '', description: '' }]);
        setAddTab('single');
        setModalMode('add');
    };

    const handleOpenEditModal = (carrier: Carrier) => {
        setSelectedCarrier(carrier);
        setSingleForm({ carrierId: carrier.carrierId, name: carrier.name, description: carrier.description });
        setActiveDropdown(null);
        setModalMode('edit');
    };

    const handleOpenDeleteModal = (carrier: Carrier) => {
        setSelectedCarrier(carrier);
        setActiveDropdown(null);
        setModalMode('delete');
    };

    const handleCreateCarrier = async () => {
        setIsActionLoading(true);
        try {
            if (addTab === 'single') {
                const res = await fetch(`${API_URL}/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(singleForm)
                });
                const data = await res.json();
                if (data.success) {
                    setCarrierPaths([data.data, ...carrierPaths]);
                    showSuccess('Carrier created successfully!');
                } else {
                    setModalError(data.message || 'Failed to create carrier');
                    return;
                }
            } else {
                const res = await fetch(`${API_URL}/bulk`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ carriers: bulkForms })
                });
                const data = await res.json();
                if (data.success) {
                    setCarrierPaths([...data.data, ...carrierPaths]);
                    showSuccess('Bulk carriers added successfully!');
                } else {
                    setModalError(data.message || 'Failed to create bulk carriers');
                    return;
                }
            }
            setModalMode('closed');
        } catch (error: any) {
            setModalError('Error: ' + error.message);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleEditCarrier = async () => {
        if (!selectedCarrier) return;
        setIsActionLoading(true);
        try {
            const res = await fetch(`${API_URL}/${selectedCarrier.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(singleForm)
            });
            const data = await res.json();
            if (data.success) {
                const updated = carrierPaths.map(c => c.id === selectedCarrier.id ? { ...c, ...singleForm } : c);
                setCarrierPaths(updated);
                setModalMode('closed');
                showSuccess('Carrier updated successfully!');
            } else {
                setModalError(data.message || 'Failed to update carrier');
            }
        } catch (error: any) {
            setModalError('Error: ' + error.message);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDeleteCarrier = async () => {
        if (!selectedCarrier) return;
        setIsActionLoading(true);
        try {
            const res = await fetch(`${API_URL}/${selectedCarrier.id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                setCarrierPaths(carrierPaths.filter(c => c.id !== selectedCarrier.id));
                setModalMode('closed');
                showSuccess('Carrier deleted successfully!');
            } else {
                setModalError(data.message || 'Failed to delete carrier');
            }
        } catch (error: any) {
            setModalError('Error: ' + error.message);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDeleteAllCarriers = async () => {
        setIsActionLoading(true);
        try {
            const res = await fetch(`${API_URL}/deleteAll`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                setCarrierPaths([]);
                setModalMode('closed');
                showSuccess('All Carrier Paths deleted successfully!');
            } else {
                setModalError(data.message || 'Failed to delete all carriers');
            }
        } catch (error: any) {
            setModalError('Error: ' + error.message);
        } finally {
            setIsActionLoading(false);
        }
    };

    // Validation
    const isSingleValid = singleForm.carrierId.trim() !== '' && singleForm.name.trim() !== '' && singleForm.description.trim() !== '';
    const isBulkValid = bulkForms.every(f => f.carrierId.trim() !== '' && f.name.trim() !== '' && f.description.trim() !== '');



    const renderEmptyState = () => (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
            <div className="w-24 h-24 bg-gray-100 dark:bg-[#2d2d2d] rounded-full flex items-center justify-center mb-6">
                <Route size={48} className="text-[#5f6368] dark:text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-[#202124] dark:text-white mb-2">No Carrier Paths Found</h3>
            <p className="text-[#5f6368] dark:text-gray-400 max-w-md mb-8">
                There are currently no carrier paths configured in the system. Get started by adding a new carrier path.
            </p>
            <button
                onClick={handleOpenAddModal}
                className="flex items-center px-6 py-3 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-sm"
            >
                <Plus size={20} className="mr-2" />
                Add Carrier Path
            </button>
        </div>
    );

    const renderPopulatedState = () => (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-[#202124] dark:text-white">Carrier Paths</h2>
                    <p className="text-[#5f6368] dark:text-gray-400 mt-1">Manage and configure routing carrier paths.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex justify-end flex-1">
                        <SearchBar
                            placeholder="Search carriers..."
                            value={searchQuery}
                            onSearch={setSearchQuery}
                        />
                    </div>
                    <button
                        onClick={() => setModalMode('deleteAll')}
                        className="flex items-center px-4 py-2 bg-white dark:bg-[#1a1a1a] text-[#5f6368] dark:text-gray-300 font-medium rounded-lg transition-colors border border-gray-200 dark:border-[#2E2E2E] hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-800 active:bg-red-100"
                    >
                        <Trash2 size={18} className="mr-2" />
                        Clear Carriers
                    </button>
                    <button
                        onClick={handleOpenAddModal}
                        className="flex items-center px-4 py-2 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
                    >
                        <Plus size={18} className="mr-2" />
                        Add Carrier Path
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : filteredCarriers.length === 0 ? (
                <NoResultsFound
                    searchTerm={searchQuery}
                    onClear={() => setSearchQuery('')}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredCarriers.map((carrier) => (
                        <div key={carrier.id} className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-[#2E2E2E] hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 relative group">

                            <div className="p-4">
                                {/* Top row: icon + menu */}
                                <div className="flex justify-between items-center mb-3">
                                    <div className="p-1 bg-transparent dark:bg-transparent rounded-lg">
                                        <CourseIcon courseName={carrier.name} fallback="carrier" size={24} />
                                    </div>
                                    <div className="relative dropdown-container">
                                        <button
                                            onClick={() => {
                                                setActiveDropdown(activeDropdown === carrier.id ? null : carrier.id);
                                            }}
                                            className="p-1 rounded-md text-[#5f6368] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <MoreVertical size={16} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {activeDropdown === carrier.id && (
                                            <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-[#2d2d2d] rounded-lg shadow-xl border border-gray-100 dark:border-[#2E2E2E] z-50 py-1">
                                                <button
                                                    onClick={() => {
                                                        setSelectedCarrier(carrier);
                                                        setModalMode('view');
                                                        setActiveDropdown(null);
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-sm text-[#202124] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center"
                                                >
                                                    <Eye size={14} className="mr-2 text-[#5f6368]" /> View Carrier
                                                </button>
                                                <button
                                                    onClick={() => handleOpenEditModal(carrier)}
                                                    className="w-full text-left px-3 py-2 text-sm text-[#202124] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center"
                                                >
                                                    <Edit2 size={14} className="mr-2 text-[#5f6368]" /> Edit Carrier
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDeleteModal(carrier)}
                                                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                                                >
                                                    <Trash2 size={14} className="mr-2" /> Delete Carrier
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Name */}
                                <h3 className="text-sm font-semibold text-[#202124] dark:text-white truncate mb-1" title={carrier.name}>
                                    {carrier.name}
                                </h3>

                                {/* ID badge */}
                                <p className="text-[10px] font-mono text-primary bg-blue-50 dark:bg-blue-900/15 inline-block px-1.5 py-0.5 rounded mb-2">
                                    {carrier.carrierId}
                                </p>

                                {/* Description */}
                                <p className="text-[#5f6368] dark:text-gray-400 text-xs line-clamp-2 mb-3" title={carrier.description}>
                                    {carrier.description}
                                </p>

                                {/* Footer: course + spec counts */}
                                <div className="flex items-center justify-end gap-3 pt-2.5 border-t border-gray-50 dark:border-[#2E2E2E]">
                                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#80868b]" title="Linked Courses"><BookOpen size={12} />{courseCounts[carrier.id] || 0}</span>
                                    <div className="w-px h-3.5 bg-gray-200 dark:bg-gray-700"></div>
                                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#80868b]" title="Linked Specializations"><Layers size={12} />{specCounts[carrier.id] || 0}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
    return (
        <div className="p-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-full relative">
            {/* Success Toast */}
            <SuccessMessage message={successMessage} isExiting={isExiting} />

            {carrierPaths.length === 0 && !isLoading ? renderEmptyState() : renderPopulatedState()}

            {/* Modals */}
            {(modalMode === 'add' || modalMode === 'edit') && (
                <AddEditCarrierModal
                    mode={modalMode}
                    form={singleForm}
                    setForm={setSingleForm}
                    addTab={addTab}
                    setAddTab={setAddTab}
                    bulkForms={bulkForms}
                    setBulkForms={setBulkForms}
                    onClose={() => setModalMode('closed')}
                    onSubmit={modalMode === 'edit' ? handleEditCarrier : handleCreateCarrier}
                    isLoading={isActionLoading}
                    error={modalError}
                />
            )}
            {(modalMode === 'delete' || modalMode === 'deleteAll') && (
                <DeleteCarrierModal
                    mode={modalMode}
                    carrier={selectedCarrier}
                    onClose={() => setModalMode('closed')}
                    onConfirm={modalMode === 'deleteAll' ? handleDeleteAllCarriers : handleDeleteCarrier}
                    isLoading={isActionLoading}
                />
            )}
            {modalMode === 'view' && selectedCarrier && (
                <ViewCarrierModal
                    carrier={selectedCarrier}
                    courses={allCourses}
                    specializations={allSpecs}
                    onClose={() => setModalMode('closed')}
                />
            )}
        </div>
    );
}
