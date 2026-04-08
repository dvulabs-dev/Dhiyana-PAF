import React, { useState } from 'react';
import { Bell, Check, Trash2, Clock, Inbox } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationPanel = () => {
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    return (
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
                            {notifications.length === 0 ? (
                                <div className="p-10 flex flex-col items-center justify-center text-center opacity-40">
                                    <Inbox className="w-12 h-12 mb-2" />
                                    <p className="text-sm font-medium">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {notifications.map((n) => (
                                        <div 
                                            key={n.id} 
                                            className={`p-4 hover:bg-gray-50 transition-colors relative group ${!n.read ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className={`text-sm font-bold ${!n.read ? 'text-blue-900' : 'text-gray-900'}`}>
                                                    {n.title}
                                                </h4>
                                                {!n.read && (
                                                    <button 
                                                        onClick={() => markAsRead(n.id)}
                                                        className="text-blue-600 hover:text-blue-800 p-1 rounded-lg hover:bg-blue-100 transition-colors"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                                                {n.message}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                                <Clock className="w-3 h-3" />
                                                {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : 'just now'}
                                            </div>
                                            {!n.read && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-full my-4"></div>
                                            )}
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
    );
};

export default NotificationPanel;
