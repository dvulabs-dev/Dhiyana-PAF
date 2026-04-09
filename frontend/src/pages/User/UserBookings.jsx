import React, { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../../services/bookingApi';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, Trash2, MapPin, Loader, ChevronRight } from 'lucide-react';

const UserBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const data = await getMyBookings();
            setBookings(data);
        } catch (err) {
            toast.error('Failed to load your reservations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id) => {
        if (window.confirm('Cancel this reservation?')) {
            try {
                await cancelBooking(id);
                toast.success('Reservation released');
                fetchBookings();
            } catch (err) {
                toast.error('Cancellation failed');
            }
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'CONFIRMED': return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Active</span>;
            case 'CANCELLED': return <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Cancelled</span>;
            case 'PENDING': return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Pending</span>;
            default: return <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{status}</span>;
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-12 border-b border-slate-200 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">My <span className="text-blue-600">Reservations</span></h1>
                    <p className="text-lg text-slate-500 mt-2 font-medium">Manage your upcoming campus access and facilities.</p>
                </div>
                <div className="mt-4 md:mt-0 bg-blue-50 text-blue-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5" /> All Bookings ({bookings.length})
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                     <Loader className="w-10 h-10 animate-spin text-blue-600" />
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-xl font-bold text-slate-400">No active reservations right now.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.map(booking => (
                        <div key={booking.id} className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                <Calendar className="w-24 h-24" />
                            </div>
                            
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{booking.resourceName}</h3>
                                    {getStatusBadge(booking.status)}
                                </div>
                            </div>
                            
                            <div className="space-y-4 mb-8 bg-slate-50 p-5 rounded-2xl relative z-10 font-medium">
                                <div className="flex items-center text-slate-600 gap-3">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                    <span>
                                        {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="flex items-center text-slate-600 gap-3">
                                    <MapPin className="w-5 h-5 text-rose-400" />
                                    <span>{booking.resourceType || 'Facility Location'}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center relative z-10 pt-4 border-t border-slate-100">
                                <button className="text-slate-400 hover:text-slate-900 font-bold flex items-center gap-1 transition-colors">
                                    Details <ChevronRight className="w-4 h-4" />
                                </button>
                                {booking.status !== 'CANCELLED' && (
                                    <button
                                        onClick={() => handleCancel(booking.id)}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-xl font-bold transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" /> Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserBookings;