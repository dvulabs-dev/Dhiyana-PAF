import React, { useState } from 'react';
import { createBooking } from '../../services/bookingApi';
import { toast } from 'react-hot-toast';
import { X, Calendar, Clock, FileText } from 'lucide-react';

const BookingModal = ({ resource, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        startTime: '',
        endTime: '',
        purpose: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createBooking({
                resourceId: resource.id,
                startTime: formData.startTime,
                endTime: formData.endTime,
                purpose: formData.purpose
            });
            toast.success('Booking requested successfully!');
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Booking failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Request Booking</h2>
                        <p className="text-blue-100 text-sm">For: {resource.name}</p>
                    </div>
                    <button onClick={onClose} className="hover:bg-blue-700 p-2 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-blue-500" /> Start Time
                        </label>
                        <input
                            type="datetime-local"
                            required
                            className="w-full px-4 py-2.5 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                            value={formData.startTime}
                            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-blue-500" /> End Time
                        </label>
                        <input
                            type="datetime-local"
                            required
                            className="w-full px-4 py-2.5 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                            value={formData.endTime}
                            onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-blue-500" /> Purpose of Use
                        </label>
                        <textarea
                            required
                            rows="3"
                            placeholder="e.g., Study session, Team meeting, Workshop..."
                            className="w-full px-4 py-2.5 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                            value={formData.purpose}
                            onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md disabled:bg-blue-300 transform active:scale-95"
                        >
                            {submitting ? 'Processing Request...' : 'Confirm Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
