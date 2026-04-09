import React, { useState, useEffect } from 'react';
import { createResource, getResources } from '../../services/catalogueApi';
import ResourceCard from '../../components/Catalogue/ResourceCard';
import { Search, SlidersHorizontal, Loader, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PageHeader from '../../components/Common/PageHeader';

const RESOURCE_TYPES = [
    'LECTURE_HALL',
    'CLASSROOM',
    'LAB',
    'MEETING_ROOM',
    'AUDITORIUM',
    'EQUIPMENT',
    'SPORTS_FIELD',
];

const RESOURCE_STATUSES = ['ACTIVE', 'OUT_OF_SERVICE', 'MAINTENANCE'];

const ResourceList = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    const [filters, setFilters] = useState({
        search: '',
        type: '',
        minCapacity: '',
        location: '',
        status: '',
    });

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        capacity: 1,
        type: 'LECTURE_HALL',
        status: 'ACTIVE',
        availableFrom: '08:00',
        availableTo: '18:00',
        imageUrl: '',
    });

    const fetchResources = async (targetPage = page) => {
        setLoading(true);
        try {
            const params = {
                page: targetPage,
                size: 9,
                search: filters.search || undefined,
                type: filters.type || undefined,
                minCapacity: filters.minCapacity || undefined,
                location: filters.location || undefined,
                status: filters.status || undefined,
            };
            const data = await getResources(params);
            setResources(data.content);
            setTotalPages(data.totalPages);
        } catch (err) {
            toast.error('Failed to load resources');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources(page);
    }, [page]);

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchResources(0);
    };

    const clearFilters = () => {
        const cleared = { search: '', type: '', minCapacity: '', location: '', status: '' };
        setFilters(cleared);
        setPage(0);
        setTimeout(() => fetchResources(0), 0);
    };

    const handleFormChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreateResource = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.location || !formData.type) {
            toast.error('Name, location and type are required');
            return;
        }

        setSubmitting(true);
        try {
            await createResource({
                ...formData,
                capacity: Number(formData.capacity) || 1,
            });
            toast.success('Resource added to catalogue');
            setShowCreate(false);
            setFormData({
                name: '',
                description: '',
                location: '',
                capacity: 1,
                type: 'LECTURE_HALL',
                status: 'ACTIVE',
                availableFrom: '08:00',
                availableTo: '18:00',
                imageUrl: '',
            });
            setPage(0);
            fetchResources(0);
        } catch (err) {
            toast.error('Could not create resource');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-10 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <PageHeader 
                    title="Facilities & Assets Catalogue"
                    description="Real-time oversight of university infrastructure. Monitor availability, capacity, and operational status of lecture halls, labs, and strategic assets."
                    actions={
                        <button
                            onClick={() => setShowCreate((prev) => !prev)}
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
                        >
                            <Plus className="w-5 h-5" />
                            {showCreate ? 'Close Form' : 'Provision Resource'}
                        </button>
                    }
                />

                {showCreate && (
                    <form onSubmit={handleCreateResource} className="mb-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-800 mb-5">Create Catalogue Resource</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <input className="px-4 py-3 rounded-xl border border-slate-300" placeholder="Resource name" value={formData.name} onChange={(e) => handleFormChange('name', e.target.value)} />
                            <input className="px-4 py-3 rounded-xl border border-slate-300" placeholder="Location" value={formData.location} onChange={(e) => handleFormChange('location', e.target.value)} />
                            <input type="number" min="1" className="px-4 py-3 rounded-xl border border-slate-300" placeholder="Capacity" value={formData.capacity} onChange={(e) => handleFormChange('capacity', e.target.value)} />
                            <select className="px-4 py-3 rounded-xl border border-slate-300" value={formData.type} onChange={(e) => handleFormChange('type', e.target.value)}>
                                {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t.replaceAll('_', ' ')}</option>)}
                            </select>
                            <select className="px-4 py-3 rounded-xl border border-slate-300" value={formData.status} onChange={(e) => handleFormChange('status', e.target.value)}>
                                {RESOURCE_STATUSES.map((s) => <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>)}
                            </select>
                            <input className="px-4 py-3 rounded-xl border border-slate-300" placeholder="Image URL (optional)" value={formData.imageUrl} onChange={(e) => handleFormChange('imageUrl', e.target.value)} />
                            <input type="time" className="px-4 py-3 rounded-xl border border-slate-300" value={formData.availableFrom} onChange={(e) => handleFormChange('availableFrom', e.target.value)} />
                            <input type="time" className="px-4 py-3 rounded-xl border border-slate-300" value={formData.availableTo} onChange={(e) => handleFormChange('availableTo', e.target.value)} />
                            <input className="px-4 py-3 rounded-xl border border-slate-300 md:col-span-2 lg:col-span-3" placeholder="Description" value={formData.description} onChange={(e) => handleFormChange('description', e.target.value)} />
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button disabled={submitting} className="bg-slate-900 text-white px-5 py-3 rounded-xl font-semibold hover:bg-slate-700 transition disabled:opacity-60">
                                {submitting ? 'Saving...' : 'Save Resource'}
                            </button>
                        </div>
                    </form>
                )}

                <form onSubmit={handleSearch} className="mb-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold mb-4">
                        <SlidersHorizontal className="w-5 h-5" />
                        Search & Filter
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="relative lg:col-span-2">
                            <input
                                type="text"
                                placeholder="Search by name, description, location..."
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-400"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        </div>
                        <select className="px-4 py-3 rounded-xl border border-slate-300" value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
                            <option value="">All Types</option>
                            {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t.replaceAll('_', ' ')}</option>)}
                        </select>
                        <input type="number" min="1" placeholder="Min Capacity" className="px-4 py-3 rounded-xl border border-slate-300" value={filters.minCapacity} onChange={(e) => handleFilterChange('minCapacity', e.target.value)} />
                        <input placeholder="Location" className="px-4 py-3 rounded-xl border border-slate-300" value={filters.location} onChange={(e) => handleFilterChange('location', e.target.value)} />
                        <select className="px-4 py-3 rounded-xl border border-slate-300" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                            <option value="">All Statuses</option>
                            {RESOURCE_STATUSES.map((s) => <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>)}
                        </select>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 justify-end">
                        <button type="button" onClick={clearFilters} className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50">Clear</button>
                        <button type="submit" className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-900 font-bold hover:bg-cyan-400">Apply Filters</button>
                    </div>
                </form>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader className="w-12 h-12 text-cyan-600 animate-spin mb-4" />
                        <p className="text-slate-500 font-medium italic">Loading facilities and assets...</p>
                    </div>
                ) : (
                    <>
                        {resources.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                                <p className="text-xl text-slate-500">No resources match your current filters.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                                {resources.map((resource) => (
                                    <ResourceCard key={resource.id} resource={resource} />
                                ))}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center gap-2">
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setPage(index)}
                                        className={`w-10 h-10 rounded-lg font-bold transition-all ${
                                            page === index
                                                ? 'bg-slate-900 text-white shadow-md'
                                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ResourceList;
