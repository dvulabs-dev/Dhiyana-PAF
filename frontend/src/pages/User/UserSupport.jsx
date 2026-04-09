import React, { useState, useEffect } from 'react';
import { getMyTickets } from '../../services/ticketingApi';
import TicketForm from '../../components/Ticketing/TicketForm';
import { toast } from 'react-hot-toast';
import { ShieldAlert, Plus, MessageSquare, Clock, CheckCircle2, AlertTriangle, Loader } from 'lucide-react';

const UserSupport = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const fetchTickets = async () => {
        try {
            const data = await getMyTickets();
            setTickets(data);
        } catch (err) {
            toast.error('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'OPEN': return <AlertTriangle className="w-6 h-6 text-amber-500" />;
            case 'IN_PROGRESS': return <Clock className="w-6 h-6 text-blue-500 animate-pulse" />;
            case 'RESOLVED': return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
            case 'CLOSED': return <CheckCircle2 className="w-6 h-6 text-slate-400" />;
            default: return <MessageSquare className="w-6 h-6 text-slate-400" />;
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16">
                <div className="mx-auto bg-amber-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <ShieldAlert className="w-12 h-12 text-amber-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                    Maintenance <span className="text-amber-500">Support</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                    Report issues with campus facilities, track resolution status, and get assistance instantly.
                </p>
            </div>

            <div className="flex justify-center mb-12">
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black tracking-widest uppercase hover:bg-amber-500 transition-all shadow-xl hover:shadow-amber-500/30 transform hover:-translate-y-1"
                >
                    <Plus className="w-6 h-6" /> File New Report
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                     <Loader className="w-10 h-10 animate-spin text-amber-500" />
                </div>
            ) : tickets.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-xl font-bold text-slate-400">Great! No active maintenance tickets.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 bg-slate-50">
                        <h2 className="text-2xl font-black text-slate-900">Your Reports</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {tickets.map(ticket => (
                            <div key={ticket.id} className="p-8 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                <div className="flex gap-6 items-start">
                                    <div className="mt-1 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                                        {getStatusIcon(ticket.status)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{ticket.title}</h3>
                                        <p className="text-slate-500 font-medium line-clamp-2 md:line-clamp-1 max-w-2xl">{ticket.description}</p>
                                        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-semibold">
                                            <span className={`px-3 py-1 rounded-lg ${
                                                ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-800' :
                                                ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                                ticket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                                                'bg-slate-200 text-slate-800'
                                            }`}>
                                                Status: {ticket.status}
                                            </span>
                                            <span className="text-slate-400">ID: #{ticket.id.substring(0,8)}</span>
                                            <span className="text-slate-400">Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8">
                            <h2 className="text-3xl font-black text-slate-900 mb-6">New Maintenance Report</h2>
                            <TicketForm 
                                onClose={() => setShowForm(false)} 
                                onSuccess={() => {
                                    setShowForm(false);
                                    fetchTickets();
                                }} 
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserSupport;