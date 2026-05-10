'use client';

import React, { useState, useEffect } from 'react';
import { Route, Plus, MoreVertical, Edit2, Trash2, X, PlusCircle, AlertTriangle } from 'lucide-react';

// Types
interface Carrier {
    id: string;
    carrierId: string;
    name: string;
    description: string;
}

type ModalMode = 'closed' | 'add' | 'edit' | 'delete';
type AddMode = 'single' | 'bulk';

export default function CarrierPath() {
    // State
    const [carrierPaths, setCarrierPaths] = useState<Carrier[]>([]);
    
    // Modal State
    const [modalMode, setModalMode] = useState<ModalMode>('closed');
    const [addTab, setAddTab] = useState<AddMode>('single');
    const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Form State (Single & Edit)
    const [singleForm, setSingleForm] = useState({ carrierId: '', name: '', description: '' });
    
    // Form State (Bulk)
    const [bulkForms, setBulkForms] = useState([{ carrierId: '', name: '', description: '' }]);

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

    const handleCreateCarrier = () => {
        if (addTab === 'single') {
            const newCarrier: Carrier = { id: Date.now().toString(), ...singleForm };
            setCarrierPaths([...carrierPaths, newCarrier]);
        } else {
            const newCarriers = bulkForms.map((form, index) => ({
                id: (Date.now() + index).toString(),
                ...form
            }));
            setCarrierPaths([...carrierPaths, ...newCarriers]);
        }
        setModalMode('closed');
    };

    const handleEditCarrier = () => {
        if (!selectedCarrier) return;
        const updated = carrierPaths.map(c => c.id === selectedCarrier.id ? { ...c, ...singleForm } : c);
        setCarrierPaths(updated);
        setModalMode('closed');
    };

    const handleDeleteCarrier = () => {
        if (!selectedCarrier) return;
        setCarrierPaths(carrierPaths.filter(c => c.id !== selectedCarrier.id));
        setModalMode('closed');
    };

    // Validation
    const isSingleValid = singleForm.carrierId.trim() !== '' && singleForm.name.trim() !== '' && singleForm.description.trim() !== '';
    const isBulkValid = bulkForms.every(f => f.carrierId.trim() !== '' && f.name.trim() !== '' && f.description.trim() !== '');

    // Render Helpers
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
                <button 
                    onClick={handleOpenAddModal}
                    className="flex items-center px-4 py-2 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                    <Plus size={18} className="mr-2" />
                    Add Carrier Path
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {carrierPaths.map((carrier) => (
                    <div key={carrier.id} className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 relative group">
                        
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-primary">
                                    <Route size={24} />
                                </div>
                                <div className="relative dropdown-container">
                                    <button 
                                        onClick={() => {
                                            setActiveDropdown(activeDropdown === carrier.id ? null : carrier.id);
                                        }}
                                        className="p-1 rounded-md text-[#5f6368] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] transition-colors"
                                    >
                                        <MoreVertical size={20} />
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    {activeDropdown === carrier.id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#2d2d2d] rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-50 py-1">
                                            <button 
                                                onClick={() => handleOpenEditModal(carrier)}
                                                className="w-full text-left px-4 py-2 text-sm text-[#202124] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center"
                                            >
                                                <Edit2 size={16} className="mr-2 text-[#5f6368]" /> Edit Carrier
                                            </button>
                                            <button 
                                                onClick={() => handleOpenDeleteModal(carrier)}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                                            >
                                                <Trash2 size={16} className="mr-2" /> Delete Carrier
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-bold text-[#202124] dark:text-white mb-1 truncate" title={carrier.name}>
                                {carrier.name}
                            </h3>
                            <p className="text-xs font-mono text-primary mb-3 bg-blue-50 dark:bg-blue-900/20 inline-block px-2 py-1 rounded">
                                ID: {carrier.carrierId}
                            </p>
                            <p className="text-[#5f6368] dark:text-gray-400 text-sm line-clamp-2" title={carrier.description}>
                                {carrier.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderAddEditModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#121212]">
                    <h3 className="text-xl font-bold text-[#202124] dark:text-white">
                        {modalMode === 'edit' ? 'Edit Carrier Path' : 'Add Carrier Path'}
                    </h3>
                    <button onClick={() => setModalMode('closed')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-[#5f6368] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Tabs (Only in Add Mode) */}
                {modalMode === 'add' && (
                    <div className="flex border-b border-gray-200 dark:border-gray-800 px-6 pt-4 bg-gray-50 dark:bg-[#121212]">
                        <button 
                            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${addTab === 'single' ? 'border-primary text-primary' : 'border-transparent text-[#5f6368] hover:text-[#202124] dark:hover:text-white'}`}
                            onClick={() => setAddTab('single')}
                        >
                            Add a Carrier
                        </button>
                        <button 
                            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ml-4 ${addTab === 'bulk' ? 'border-primary text-primary' : 'border-transparent text-[#5f6368] hover:text-[#202124] dark:hover:text-white'}`}
                            onClick={() => setAddTab('bulk')}
                        >
                            Add bulk Carrier
                        </button>
                    </div>
                )}

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {(modalMode === 'edit' || (modalMode === 'add' && addTab === 'single')) && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#202124] dark:text-gray-300 mb-1">Carrier ID</label>
                                <input 
                                    type="text" 
                                    value={singleForm.carrierId}
                                    onChange={(e) => setSingleForm({...singleForm, carrierId: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2d2d2d] text-[#202124] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                    placeholder="e.g. CARR-001"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#202124] dark:text-gray-300 mb-1">Carrier Name</label>
                                <input 
                                    type="text" 
                                    value={singleForm.name}
                                    onChange={(e) => setSingleForm({...singleForm, name: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2d2d2d] text-[#202124] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                    placeholder="e.g. Primary US Route"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#202124] dark:text-gray-300 mb-1">Description</label>
                                <textarea 
                                    value={singleForm.description}
                                    onChange={(e) => setSingleForm({...singleForm, description: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2d2d2d] text-[#202124] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition min-h-[100px] resize-y"
                                    placeholder="Brief description of the carrier path..."
                                />
                            </div>
                        </div>
                    )}

                    {modalMode === 'add' && addTab === 'bulk' && (
                        <div className="space-y-8">
                            {bulkForms.map((form, index) => (
                                <div key={index} className="relative p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#2d2d2d]/30">
                                    <div className="absolute top-2 right-4 text-xs font-bold text-gray-400">#{index + 1}</div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-[#202124] dark:text-gray-300 mb-1">Carrier ID</label>
                                                <input 
                                                    type="text" 
                                                    value={form.carrierId}
                                                    onChange={(e) => {
                                                        const newForms = [...bulkForms];
                                                        newForms[index].carrierId = e.target.value;
                                                        setBulkForms(newForms);
                                                    }}
                                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2d2d2d] text-[#202124] dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-[#202124] dark:text-gray-300 mb-1">Carrier Name</label>
                                                <input 
                                                    type="text" 
                                                    value={form.name}
                                                    onChange={(e) => {
                                                        const newForms = [...bulkForms];
                                                        newForms[index].name = e.target.value;
                                                        setBulkForms(newForms);
                                                    }}
                                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2d2d2d] text-[#202124] dark:text-white focus:ring-2 focus:ring-primary outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-[#202124] dark:text-gray-300 mb-1">Description</label>
                                            <textarea 
                                                value={form.description}
                                                onChange={(e) => {
                                                    const newForms = [...bulkForms];
                                                    newForms[index].description = e.target.value;
                                                    setBulkForms(newForms);
                                                }}
                                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2d2d2d] text-[#202124] dark:text-white focus:ring-2 focus:ring-primary outline-none min-h-[60px] resize-y"
                                            />
                                        </div>
                                    </div>
                                    {bulkForms.length > 1 && (
                                        <button 
                                            onClick={() => setBulkForms(bulkForms.filter((_, i) => i !== index))}
                                            className="absolute -top-3 -right-3 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-800 text-red-600 rounded-full p-1 shadow-sm transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            
                            <button 
                                onClick={() => setBulkForms([...bulkForms, { carrierId: '', name: '', description: '' }])}
                                className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary rounded-xl text-[#5f6368] hover:text-primary transition-colors flex items-center justify-center font-medium"
                            >
                                <PlusCircle size={18} className="mr-2" /> Add another carrier
                            </button>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#121212] flex justify-end">
                    <button 
                        onClick={() => setModalMode('closed')}
                        className="px-4 py-2 text-[#5f6368] dark:text-gray-400 hover:text-[#202124] dark:hover:text-white font-medium mr-3 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={modalMode === 'edit' ? handleEditCarrier : handleCreateCarrier}
                        disabled={modalMode === 'edit' ? !isSingleValid : (addTab === 'single' ? !isSingleValid : !isBulkValid)}
                        className={`px-6 py-2 font-medium rounded-lg shadow-sm transition-all duration-200
                            ${(modalMode === 'edit' ? isSingleValid : (addTab === 'single' ? isSingleValid : isBulkValid)) 
                                ? 'bg-primary hover:bg-blue-600 text-white transform active:scale-95' 
                                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                            }
                        `}
                    >
                        {modalMode === 'edit' ? 'Save Changes' : 'Create Carrier'}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderDeleteModal = () => (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm bg-black/50 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl w-full max-w-md shadow-2xl p-6 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={32} className="text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-[#202124] dark:text-white mb-2">Delete Carrier Path?</h3>
                <p className="text-[#5f6368] dark:text-gray-400 mb-6">
                    Are you sure you want to delete <span className="font-bold text-[#202124] dark:text-white">"{selectedCarrier?.name}"</span>? This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-3">
                    <button 
                        onClick={() => setModalMode('closed')}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-700 text-[#5f6368] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2d2d2d] rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleDeleteCarrier}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-sm transition-colors"
                    >
                        Delete Carrier
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-full">
            {carrierPaths.length === 0 ? renderEmptyState() : renderPopulatedState()}
            
            {/* Modals */}
            {(modalMode === 'add' || modalMode === 'edit') && renderAddEditModal()}
            {modalMode === 'delete' && renderDeleteModal()}
        </div>
    );
}
