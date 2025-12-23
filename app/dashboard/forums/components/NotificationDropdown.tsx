"use client";

import { useEffect, useState } from 'react';
import { Bell, MessageCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
    id: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    post: {
        id: string;
        title: string;
        category: {
            name: string;
            icon: string;
        };
    };
}

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/notifications/forum');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        // Mark as read
        try {
            await fetch('/api/notifications/forum/mark-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId: notification.id })
            });
        } catch (error) {
            console.error('Error marking as read:', error);
        }

        // Navigate to post
        router.push(`/dashboard/forums/post/${notification.post.id}`);
        setIsOpen(false);
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/api/notifications/forum/mark-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="position-relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-light rounded-circle p-2 position-relative shadow-sm"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="position-fixed top-0 start-0 w-100 h-100"
                            style={{ zIndex: 1040 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="position-absolute top-100 end-0 mt-2 bg-white rounded-4 shadow-lg border"
                            style={{ width: '320px', maxHeight: '400px', zIndex: 1050 }}
                        >
                            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                                <h6 className="fw-bold m-0">Notificaciones</h6>
                                <button onClick={() => setIsOpen(false)} className="btn btn-sm btn-light rounded-circle p-1">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="overflow-auto" style={{ maxHeight: '300px' }}>
                                {loading ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="text-center py-4 text-muted">
                                        <Bell size={32} className="mb-2 opacity-50" />
                                        <p className="small m-0">No hay notificaciones</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => handleNotificationClick(notif)}
                                            className={`p-3 border-bottom cursor-pointer hover-bg-light ${!notif.isRead ? 'bg-primary-subtle' : ''}`}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="d-flex align-items-start gap-2">
                                                <div className="fs-4">{notif.post.category.icon}</div>
                                                <div className="flex-grow-1">
                                                    <p className="small fw-bold m-0 text-dark">
                                                        Alguien respondió en {notif.post.category.name}
                                                    </p>
                                                    <p className="extra-small text-muted m-0 text-truncate">
                                                        {notif.post.title}
                                                    </p>
                                                    <small className="extra-small text-muted">
                                                        {new Date(notif.createdAt).toLocaleDateString('es-ES', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </small>
                                                </div>
                                                {!notif.isRead && (
                                                    <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px' }} />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {notifications.length > 0 && unreadCount > 0 && (
                                <div className="p-2 border-top">
                                    <button
                                        onClick={markAllAsRead}
                                        className="btn btn-sm btn-link text-primary w-100 text-decoration-none"
                                    >
                                        Marcar todas como leídas
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
