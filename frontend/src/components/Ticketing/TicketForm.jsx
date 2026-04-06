import React, { useState } from 'react';
import { createTicket } from '../../services/ticketingApi';
import { toast } from 'react-hot-toast';
import { Layout, PenTool, AlertOctagon, Camera, X } from 'lucide-react';

const TicketForm = ({ resourceId, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        resourceId: resourceId || ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createTicket(formData);
            toast.success('Ticket submitted successfully!');
            if (onSuccess) onSuccess();
            if (onClose) onClose();
        } catch (err) {
            toast.error('Failed to submit ticket');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
                <header className="p-8 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Report an Issue</h2>
                        <p className="text-gray-500 text-sm">Describe the problem encountered.</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Title</label>
                            <input
                                type="text"
                                required
                                placeholder="Brief summary of the issue..."
                                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-0 shadow-sm transition-all text-gray-800"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Severity & Priority</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((priority) => (
                                    <button
                                        key={priority}
                                        type="button"
                                        onClick={() => setFormData({...formData, priority})}
                                        className={`py-3 rounded-2xl font-bold text-sm tracking-wide border-2 transition-all shadow-sm ${
                                            formData.priority === priority 
                                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                            : 'border-transparent bg-gray-50 text-gray-400 hover:bg-gray-100'
                                        }`}
                                    >
                                        {priority}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Details</label>
                            <textarea
                                required
                                rows="4"
                                placeholder="Tell us exactly what happened..."
                                className="w-full px-4 py-3 rounded-3xl border-2 border-gray-50 bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-0 shadow-sm transition-all text-gray-800"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </div>

                        {!resourceId && (
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Affected Resource ID</label>
                                <input
                                    type="text"
                                    placeholder="Resource identifier (optional)..."
                                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-0 shadow-sm transition-all text-gray-800"
                                    value={formData.resourceId}
                                    onChange={(e) => setFormData({...formData, resourceId: e.target.value})}
                                />
                            </div>
                        )}
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-4 bg-gray-900 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl disabled:bg-gray-300 transform active:scale-95"
                        >
                            {submitting ? 'Submitting Report...' : 'Submit Support Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TicketForm;
