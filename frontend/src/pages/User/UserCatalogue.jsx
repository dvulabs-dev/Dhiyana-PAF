import React, { useState, useEffect } from 'react';
import { getResources, CAMPUS_BUILDINGS, CAMPUS_FLOORS } from '../../services/catalogueApi';
import ResourceCard from '../../components/Catalogue/ResourceCard';
import { Search, Loader, Building2, Layers, SlidersHorizontal } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserCatalogue = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cascading filter state
    const [building, setBuilding] = useState('');
    const [floor,    setFloor]    = useState('');
    const [search,   setSearch]   = useState('');
    const [type,     setType]     = useState('');

    const availableFloors = building ? (CAMPUS_FLOORS[building] || []) : [];

    const RESOURCE_TYPES = ['LECTURE_HALL', 'CLASSROOM', 'LAB', 'MEETING_ROOM'];

    const fetchResources = async () => {
        setLoading(true);
        try {
            const params = {
                status: 'ACTIVE',
                page: 0,
                size: 100,
                search: search || undefined,
                type:   type   || undefined,
                // pass building/floor through "location" search since backend uses regex on location
            };
            // Backend already searches location field with regex; use search to match building/floor
            if (building && !search) params.search = building;
            if (floor && building) params.search = building + ' · ' + floor;
            if (search) params.search = search;

            const data = await getResources(params);
            let list = data.content || [];

            // Client-side refine for type
            if (type) list = list.filter(r => r.type === type);

            setResources(list);
        } catch {
            toast.error('Failed to load resources');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    // Reset floor when building changes
    const handleBuildingChange = (val) => {
        setBuilding(val);
        setFloor('');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchResources();
    };

    const clearAll = () => {
        setBuilding('');
        setFloor('');
        setSearch('');
        setType('');
        setTimeout(fetchResources, 0);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                    Campus <span className="text-blue-600">Facilities</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Find and book lecture halls, labs, PC rooms, and library study rooms across all campus buildings.
                </p>
            </div>

            {/* Filter panel */}
            <form onSubmit={handleSearch} className="bg-white border border-slate-100 rounded-3xl shadow-sm p-5 mb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Building */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                            <Building2 className="w-3.5 h-3.5" /> Building
                        </label>
                        <select
                            value={building}
                            onChange={e => handleBuildingChange(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:bg-white focus:border-blue-500"
                        >
                            <option value="">All Buildings</option>
                            {CAMPUS_BUILDINGS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>

                    {/* Floor (cascades from building) */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                            <Layers className="w-3.5 h-3.5" /> Floor
                        </label>
                        <select
                            value={floor}
                            onChange={e => setFloor(e.target.value)}
                            disabled={!building}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:bg-white focus:border-blue-500 disabled:opacity-40"
                        >
                            <option value="">All Floors</option>
                            {availableFloors.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>

                    {/* Type */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                            <SlidersHorizontal className="w-3.5 h-3.5" /> Type
                        </label>
                        <select
                            value={type}
                            onChange={e => setType(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:bg-white focus:border-blue-500"
                        >
                            <option value="">All Types</option>
                            {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t.replaceAll('_', ' ')}</option>)}
                        </select>
                    </div>

                    {/* Search */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                            <Search className="w-3.5 h-3.5" /> Keyword
                        </label>
                        <input
                            type="text"
                            placeholder="Room code, name..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:bg-white focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-4 justify-end">
                    <button type="button" onClick={clearAll}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50">
                        Clear
                    </button>
                    <button type="submit"
                        className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition">
                        Search
                    </button>
                </div>
            </form>

            {/* Results count */}
            {!loading && (
                <p className="text-sm text-slate-400 mb-6">
                    {resources.length} resource{resources.length !== 1 ? 's' : ''} found
                    {building ? ` in ${building}` : ''}
                    {floor ? `, ${floor}` : ''}
                </p>
            )}

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader className="w-10 h-10 animate-spin text-blue-600" />
                </div>
            ) : resources.length === 0 ? (
                <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-xl font-semibold text-slate-500">No available resources found.</p>
                    <button onClick={clearAll} className="mt-4 text-blue-600 text-sm font-bold hover:underline">Clear filters</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resources.map(resource => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserCatalogue;
