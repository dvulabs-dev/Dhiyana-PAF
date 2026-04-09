import React, { useState, useEffect } from 'react';
import { getMyTickets } from '../../services/ticketingApi';
import TicketForm from '../../components/Ticketing/TicketForm';
import TicketDetailModal from '../../components/Ticketing/TicketDetailModal';
import { toast } from 'react-hot-toast';
import { Activity, Plus, MessageSquare, Clock, CheckCircle2, AlertTriangle, Loader, Search, Ticket } from 'lucide-react';

const UserSupport = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);

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
                <div className="mx-auto bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Activity className="w-12 h-12 text-blue-600" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                    Operations <span className="text-blue-600">Hub</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                    Report issues with campus facilities, request operational assistance, and track ticket resolution.
                </p>
            </div>

            <div className="flex justify-center mb-12">
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black tracking-widest uppercase hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-1"
                >
                    <Plus className="w-6 h-6" /> File Operations Ticket
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                     <Loader className="w-10 h-10 animate-spin text-blue-600" />
                </div>
            ) : tickets.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-xl font-bold text-slate-400">Great! No active operations tickets.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 bg-slate-50">
                        <h2 className="text-2xl font-black text-slate-900">Your Tickets</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {tickets.map(ticket => (
                            <div 
                                key={ticket.id} 
                                onClick={() => setSelectedTicketId(ticket.id)}
                                className="p-8 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6 items-start md:items-center justify-between cursor-pointer"
                            >
                                <div className="flex gap-6 items-start w-full">
                                    <div className="mt-1 bg-white p-3 rounded-2xl shadow-sm border border-slate-100 shrink-0">
                                        {getStatusIcon(ticket.status)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">{ticket.title}</h3>
                                            <div className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
                                                <MessageSquare className="w-3.5 h-3.5" /> {ticket.comments?.length || 0}
                                            </div>
                                        </div>
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
                                            <span className="text-slate-400">Reason: {ticket.reason || 'General'}</span>
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
                <TicketForm 
                    onClose={() => setShowForm(false)} 
                    onSuccess={() => {
                        setShowForm(false);
                        fetchTickets();
                    }} 
                />
            )}

            {selectedTicketId && (
                <TicketDetailModal 
                    ticketId={selectedTicketId} 
                    onClose={() => setSelectedTicketId(null)} 
                    onUpdate={fetchTickets}
                />
            )}
        </div>
    );
};

export default UserSupport;