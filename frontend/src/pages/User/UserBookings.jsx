import React, { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../../services/bookingApi';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, Trash2, Loader, Users, AlertCircle } from 'lucide-react';

const UserBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    const fetchBookings = async () => {
        setLoading(true);
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
        if (!window.confirm('Cancel this reservation?')) return;
        try {
            await cancelBooking(id);
            toast.success('Reservation cancelled');
            fetchBookings();
        } catch (err) {
            toast.error('Cancellation failed');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED':
                return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Approved</span>;
            case 'REJECTED':
                return <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Rejected</span>;
            case 'CANCELLED':
                return <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Cancelled</span>;
            case 'PENDING':
                return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Pending Review</span>;
            default:
                return <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{status}</span>;
        }
    };

    const STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];
    const filtered = statusFilter ? bookings.filter(b => b.status === statusFilter) : bookings;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        My <span className="text-blue-600">Reservations</span>
                    </h1>
                    <p className="text-lg text-slate-500 mt-2 font-medium">Track and manage your campus facility bookings.</p>
                </div>
                <div className="bg-blue-50 text-blue-700 px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5" /> {bookings.length} Booking{bookings.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
                <button
                    onClick={() => setStatusFilter('')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${!statusFilter ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                >
                    All
                </button>
                {STATUSES.map(s => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${statusFilter === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader className="w-10 h-10 animate-spin text-blue-600" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-xl font-bold text-slate-400">
                        {statusFilter ? `No ${statusFilter.toLowerCase()} bookings.` : 'No reservations yet.'}
                    </p>
                    <p className="text-slate-400 mt-2 text-sm">Browse the catalogue to book a resource.</p>
                </div>
            ) : (
                <div className="space-y-5">
                    {filtered.map(booking => (
                        <div
                            key={booking.id}
                            className="group bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Decorative bg icon */}
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Calendar className="w-24 h-24" />
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-5 justify-between">
                                {/* Left: info */}
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        {getStatusBadge(booking.status)}
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                            Resource ID: <span className="text-blue-600">{booking.resourceId}</span>
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-medium text-slate-600 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                            <span>
                                                {new Date(booking.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            <span>Ends: {new Date(booking.endTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                        </div>
                                    </div>

                                    {booking.purpose && (
                                        <div className="bg-slate-50 p-4 rounded-2xl text-sm border border-slate-100 flex items-start gap-3 mb-3">
                                            <span className="font-black text-[10px] uppercase tracking-widest text-slate-400 mt-0.5 flex-shrink-0">PURPOSE:</span>
                                            <span className="font-medium italic text-slate-600">{booking.purpose}</span>
                                        </div>
                                    )}

                                    {booking.expectedAttendees > 0 && (
                                        <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                                            <Users className="w-3.5 h-3.5" />
                                            Expected attendees: <strong className="text-slate-700">{booking.expectedAttendees}</strong>
                                        </p>
                                    )}

                                    {/* Show rejection reason clearly */}
                                    {booking.status === 'REJECTED' && booking.rejectionReason && (
                                        <div className="mt-3 bg-red-50 border border-red-100 rounded-2xl p-3 flex items-start gap-2 text-sm text-red-700">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            <span><strong>Reason: </strong>{booking.rejectionReason}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Right: actions */}
                                <div className="flex-shrink-0 flex md:flex-col gap-2">
                                    {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                                        <button
                                            onClick={() => handleCancel(booking.id)}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-xl font-bold transition-all text-sm"
                                        >
                                            <Trash2 className="w-4 h-4" /> Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserBookings;