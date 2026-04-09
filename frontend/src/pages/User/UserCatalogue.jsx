import React, { useState, useEffect } from 'react';
import { getResources } from '../../services/catalogueApi';
import ResourceCard from '../../components/Catalogue/ResourceCard';
import { Search, Loader, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserCatalogue = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchResources = async () => {
        try {
            const data = await getResources();
            // Default users usually only see ACTIVE resources or at least no provisioning options
            setResources(data.filter(r => r.status === 'ACTIVE'));
        } catch (err) {
            toast.error('Failed to load resources');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const filteredResources = resources.filter(res =>
        res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                    Campus <span className="text-blue-600">Facilities</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Discover and book lecture halls, labs, and equipment instantly. Premium resources at your fingertips.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search spaces, gear, locations..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span>Real-time availability</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader className="w-10 h-10 animate-spin text-blue-600" />
                </div>
            ) : filteredResources.length === 0 ? (
                <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-xl font-semibold text-slate-500">No available resources found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredResources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserCatalogue;
