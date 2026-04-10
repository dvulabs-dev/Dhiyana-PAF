import React, { useState } from 'react';
import { Bell, Check, Trash2, Clock, Inbox, X } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationPanel = () => {
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    const activeNotifications = notifications.filter(n => !n.read);

    const handleNotificationClick = (n) => {
        setSelectedNotification(n);
        setIsOpen(false);
    };

    const handleReadAndCloseModal = () => {
        if (selectedNotification && !selectedNotification.read) {
            markAsRead(selectedNotification.id);
        }
        setSelectedNotification(null);
    };

    return (
        <>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                >
                    <Bell className="w-6 h-6" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                {isOpen && (
                    <>
                        <div 
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        ></div>
                        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all animate-in fade-in zoom-in duration-200">
                            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Bell className="w-4 h-4 text-blue-600" />
                                    Notifications
                                </h3>
                                <span className="text-[10px] uppercase font-black tracking-widest text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                    {unreadCount} New
                                </span>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {activeNotifications.length === 0 ? (
                                    <div className="p-10 flex flex-col items-center justify-center text-center opacity-40">
                                        <Inbox className="w-12 h-12 mb-2" />
                                        <p className="text-sm font-medium">No new notifications</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {activeNotifications.map((n) => (
                                            <div 
                                                key={n.id} 
                                                onClick={() => handleNotificationClick(n)}
                                                className="p-4 hover:bg-gray-50 transition-colors relative group bg-blue-50/30 cursor-pointer"
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="text-sm font-bold text-blue-900">
                                                        {n.title}
                                                    </h4>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            markAsRead(n.id);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800 p-1 rounded-lg hover:bg-blue-100 transition-colors"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2 leading-relaxed line-clamp-2">
                                                    {n.message}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                                    <Clock className="w-3 h-3" />
                                                    {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : 'just now'}
                                                </div>
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-full my-4"></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-3 border-t border-gray-50 bg-gray-50/50 text-center">
                                <button className="text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors px-4 py-2 rounded-xl hover:bg-blue-50">
                                    View all notifications
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* FULL NOTIFICATION MODAL popup */}
            {selectedNotification && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={handleReadAndCloseModal}
                    ></div>
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
                        <div className="p-6 bg-blue-50/50 border-b border-blue-100/50 flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 text-lg leading-tight">{selectedNotification.title}</h3>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-tight mt-1">
                                        <Clock className="w-3 h-3" />
                                        {selectedNotification.createdAt ? new Date(selectedNotification.createdAt).toLocaleString() : 'Just now'}
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={handleReadAndCloseModal}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                                {selectedNotification.message}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={handleReadAndCloseModal}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                Acknowledge & Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NotificationPanel;
