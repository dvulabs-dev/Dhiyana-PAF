import React, { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../../services/bookingApi';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, Trash2, Info } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const data = await getMyBookings();
            setBookings(data);
        } catch (err) {
            toast.error('Failed to load your bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await cancelBooking(id);
                toast.success('Booking cancelled');
                fetchBookings();
            } catch (err) {
                toast.error('Failed to cancel booking');
            }
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APPROVED': return 'text-green-600 bg-green-50 border-green-200';
            case 'REJECTED': return 'text-red-600 bg-red-50 border-red-200';
            case 'PENDING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'CANCELLED': return 'text-gray-500 bg-gray-50 border-gray-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const formatDateTime = (dateTimeStr) => {
        return new Date(dateTimeStr).toLocaleString([], { 
            dateStyle: 'medium', 
            timeStyle: 'short' 
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
            <PageHeader 
                title="Operation Reservations"
                description="Manage and track your active facility and equipment bookings. Maintain full visibility into approved, pending, and completed schedules."
                actions={
                    <div className="bg-blue-600/10 px-4 py-2 rounded-xl border border-blue-600/20 flex items-center text-blue-400 text-[10px] font-black uppercase tracking-widest leading-none">
                        <Info className="w-4 h-4 mr-2" />
                        Audit Active
                    </div>
                }
            />

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 italic text-slate-400">
                    <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    Loading schedule...
                </div>
            ) : (
                <>
                    {bookings.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
                            <p className="text-slate-500 font-medium">You haven't made any operational bookings yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:border-blue-100 transition-all duration-300">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(booking.status)} shadow-sm`}>
                                                {booking.status}
                                            </span>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Resource: {booking.resourceId}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 text-sm font-medium text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-blue-500" />
                                                {formatDateTime(booking.startTime)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-blue-500" />
                                                Ends: {formatDateTime(booking.endTime)}
                                            </div>
                                        </div>
                                        <div className="mt-5 text-slate-600 bg-slate-50 p-4 rounded-2xl text-sm border border-slate-100 flex items-start gap-3">
                                            <span className="font-black text-[10px] uppercase tracking-widest text-slate-400 mt-0.5">PURPOSE:</span>
                                            <span className="font-medium italic">{booking.purpose}</span>
                                        </div>
                                    </div>

                                    {booking.status === 'PENDING' && (
                                        <button
                                            onClick={() => handleCancel(booking.id)}
                                            className="px-6 py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all flex items-center justify-center font-black text-xs uppercase tracking-widest border border-red-100 shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Abort Request
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyBookings;
