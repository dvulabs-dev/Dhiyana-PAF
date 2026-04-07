import React, { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../../services/bookingApi';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, Trash2, Info } from 'lucide-react';

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
        <div className="max-w-6xl mx-auto px-4 py-10">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
                    <p className="text-gray-500">Track and manage your facility reservations.</p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center text-blue-700 text-sm font-medium">
                    <Info className="w-4 h-4 mr-2" />
                    Pending bookings require admin approval
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center py-20 italic text-gray-400">Loading your schedule...</div>
            ) : (
                <>
                    {bookings.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                            <p className="text-gray-500">You haven't made any bookings yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                            <h3 className="text-lg font-bold text-gray-800">Resource ID: {booking.resourceId}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                {formatDateTime(booking.startTime)}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                                Ends: {formatDateTime(booking.endTime)}
                                            </div>
                                        </div>
                                        <p className="mt-3 text-gray-600 bg-gray-50 p-2 rounded-lg text-sm border border-gray-100">
                                            <span className="font-semibold mr-2 italic">Purpose:</span> {booking.purpose}
                                        </p>
                                    </div>

                                    {booking.status === 'PENDING' && (
                                        <button
                                            onClick={() => handleCancel(booking.id)}
                                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center font-medium border border-transparent hover:border-red-100"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Cancel Request
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
