import React, { useState, useEffect } from 'react';
import { getResources } from '../../services/catalogueApi';
import ResourceCard from '../../components/Catalogue/ResourceCard';
import { Search, Filter, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ResourceList = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const data = await getResources({ search, page, size: 9 });
            setResources(data.content);
            setTotalPages(data.totalPages);
        } catch (err) {
            toast.error('Failed to load resources');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        fetchResources();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 text-center">Facilities Catalogue</h1>
                <p className="text-lg text-gray-500 text-center max-w-2xl mx-auto">
                    Explore and book world-class learning spaces, laboratories, and specialized facilities across the campus.
                </p>
            </header>

            <form onSubmit={handleSearch} className="mb-10 relative max-w-2xl mx-auto">
                <input
                    type="text"
                    placeholder="Search by facility name, type, or location..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 shadow-sm text-lg transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Search
                </button>
            </form>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium italic">Scanning the campus for available spaces...</p>
                </div>
            ) : (
                <>
                    {resources.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <p className="text-xl text-gray-500">No resources found matching your search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                        ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300' 
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
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
    );
};

export default ResourceList;
