import React, { useState } from 'react';
import { MapPin, Users, Tag } from 'lucide-react';
import BookingModal from '../Booking/BookingModal';

const ResourceCard = ({ resource }) => {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800';
            case 'OUT_OF_SERVICE': return 'bg-red-100 text-red-800';
            case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-48 overflow-hidden relative">
                    <img 
                        src={resource.imageUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600'} 
                        alt={resource.name}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(resource.status)} shadow-sm`}>
                            {resource.status}
                        </span>
                    </div>
                </div>
                
                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-800 truncate">{resource.name}</h3>
                        <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                            {resource.type}
                        </span>
                    </div>
                    
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                        {resource.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                        <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            {resource.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2 text-gray-400" />
                            Up to {resource.capacity} people
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setIsBookingModalOpen(true)}
                        className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        Book Now
                    </button>
                </div>
            </div>

            {isBookingModalOpen && (
                <BookingModal 
                    resource={resource} 
                    onClose={() => setIsBookingModalOpen(false)}
                    onSuccess={() => {/* Maybe refresh list or show toast */}}
                />
            )}
        </>
    );
};

export default ResourceCard;
