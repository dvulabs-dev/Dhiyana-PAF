import React, { useState, useEffect } from 'react';
import { getMyTickets } from '../../services/ticketingApi';
import { toast } from 'react-hot-toast';
import { ClipboardList, Plus, Clock, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

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
            case 'OPEN': return <Clock className="w-5 h-5 text-blue-500" />;
            case 'IN_PROGRESS': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'RESOLVED': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            default: return <ClipboardList className="w-5 h-5 text-gray-500" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'URGENT': return 'bg-red-600 text-white';
            case 'HIGH': return 'bg-orange-100 text-orange-800';
            case 'MEDIUM': return 'bg-blue-100 text-blue-800';
            case 'LOW': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Tickets</h1>
                    <p className="text-gray-500">Report issues and track maintenance requests.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    <Plus className="w-5 h-5" />
                    New Ticket
                </button>
            </header>

            {loading ? (
                <div className="text-center py-20 italic text-gray-400">Loading tickets...</div>
            ) : (
                <div className="space-y-4">
                    {tickets.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <ClipboardList className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No tickets found. Everything looks good!</p>
                        </div>
                    ) : (
                        tickets.map((ticket) => (
                            <div key={ticket.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            {getStatusIcon(ticket.status)}
                                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{ticket.status}</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">{ticket.title}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-1 mb-4">{ticket.description}</p>
                                        <div className="flex items-center gap-6 text-xs text-gray-400 font-medium">
                                            <div className="flex items-center gap-1">
                                                <MessageSquare className="w-3.5 h-3.5" />
                                                {ticket.comments.length} Comments
                                            </div>
                                            <div>Reported: {new Date(ticket.createdAt).toLocaleDateString()}</div>
                                            {ticket.resourceId && <div>Resource: {ticket.resourceId}</div>}
                                        </div>
                                    </div>
                                    <div className="h-full flex items-center pl-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
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
