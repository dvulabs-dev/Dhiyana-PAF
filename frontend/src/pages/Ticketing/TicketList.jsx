import React, { useState, useEffect } from 'react';
import { getAssignedTickets, getAllTickets } from '../../services/ticketingApi';
import { toast } from 'react-hot-toast';
import { ClipboardList, Plus, Clock, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/Common/PageHeader';
import { useAuth } from '../../context/AuthContext';
import TicketDetailModal from '../../components/Ticketing/TicketDetailModal';

const TicketList = () => {
    const { hasRole } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicketId, setSelectedTicketId] = useState(null);

    const fetchTickets = async () => {
        try {
            const data = hasRole('ADMIN') ? await getAllTickets() : await getAssignedTickets();
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
            case 'OPEN': return <Clock className="w-5 h-5 text-blue-500" />;
            case 'IN_PROGRESS': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'RESOLVED': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            default: return <ClipboardList className="w-5 h-5 text-gray-500" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'URGENT': return 'bg-red-600 text-white';
            case 'HIGH': return 'bg-orange-600 text-white';
            case 'MEDIUM': return 'bg-blue-600 text-white';
            case 'LOW': return 'bg-slate-600 text-white';
            default: return 'bg-slate-600 text-white';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
            <PageHeader 
                title="Maintenance Hub"
                description="Track facility incidents, report infrastructure faults, and monitor resolution updates from campus technicians."
                actions={
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                        <Plus className="w-5 h-5" />
                        File Incident Report
                    </button>
                }
            />

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 italic text-slate-400">
                    <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    Loading incidents...
                </div>
            ) : (
                <div className="space-y-6">
                    {tickets.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm group">
                            <ClipboardList className="w-16 h-16 text-slate-100 mx-auto mb-4 group-hover:text-blue-50 transition-colors" />
                            <p className="text-slate-500 text-lg font-medium italic">No active incidents found. Campus infrastructure is stable.</p>
                        </div>
                    ) : (
                        tickets.map((ticket) => (
                            <div key={ticket.id} className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 cursor-pointer">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-4">
                                            {getStatusIcon(ticket.status)}
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{ticket.status}</span>
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getPriorityColor(ticket.priority)} shadow-sm`}>
                                                {ticket.priority}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-3 italic tracking-tight">{ticket.title}</h3>
                                        <p className="text-slate-500 font-medium text-sm line-clamp-2 mb-6 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            {ticket.description}
                                        </p>
                                        <div className="flex items-center gap-8 text-[10px] text-slate-400 font-black uppercase tracking-[0.15em]">
                                            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                                                {ticket.comments?.length || 0} Log Entries
                                            </div>
                                            <div>Reported: {new Date(ticket.createdAt).toLocaleDateString()}</div>
                                            {ticket.resourceId && (
                                                <div className="text-blue-600 font-black">Asset: {ticket.resourceId}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="h-full flex items-center pl-8 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shadow-lg">
                                            →
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default TicketList;
