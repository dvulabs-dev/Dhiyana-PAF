import React, { useEffect, useMemo, useState } from 'react';
import { UserPlus, Shield, Briefcase, Loader, Users, Search, Ticket, Wrench } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createStaffAccount, getAdminOverview, getAllUsersForAdmin } from '../../services/authAdminApi';

const AdminPanel = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'TECHNICIAN'
    });
    const [saving, setSaving] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [users, setUsers] = useState([]);
    const [overview, setOverview] = useState({
        totalUsers: 0,
        staffUsers: 0,
        totalTickets: 0,
        openTickets: 0,
        inProgressTickets: 0
    });
    const [query, setQuery] = useState('');

    const loadAdminData = async () => {
        setLoadingData(true);
        try {
            const [overviewData, userData] = await Promise.all([
                getAdminOverview(),
                getAllUsersForAdmin()
            ]);
            setOverview(overviewData);
            setUsers(Array.isArray(userData) ? userData : []);
        } catch (err) {
            toast.error('Failed to load admin controls.');
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        loadAdminData();
    }, []);

    const filteredUsers = useMemo(() => {
        const needle = query.trim().toLowerCase();
        if (!needle) return users;

        return users.filter((user) => {
            const roleText = (user.roles || []).join(' ').toLowerCase();
            return (
                (user.name || '').toLowerCase().includes(needle) ||
                (user.email || '').toLowerCase().includes(needle) ||
                roleText.includes(needle)
            );
        });
    }, [users, query]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await createStaffAccount(formData);
            toast.success('Staff member account created.');
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'TECHNICIAN'
            });
            loadAdminData();
        } catch (err) {
            const apiMessage = err?.response?.data?.error;
            toast.error(apiMessage || 'Failed to create staff account.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 md:p-8 bg-gradient-to-b from-slate-50 to-white min-h-[calc(100vh-10rem)]">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="px-8 py-7 bg-slate-900 text-white border-b border-slate-800">
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="w-6 h-6 text-blue-400" />
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Admin Control Center</h1>
                        </div>
                        <p className="text-slate-300 text-sm font-medium">
                            Manage users, monitor operations, and create staff accounts from one place.
                        </p>
                    </div>
                </div>

                <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Users</span>
                            <Users className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="mt-3 text-3xl font-black text-slate-900">{overview.totalUsers}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Staff</span>
                            <Wrench className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="mt-3 text-3xl font-black text-slate-900">{overview.staffUsers}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Tickets</span>
                            <Ticket className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="mt-3 text-3xl font-black text-slate-900">{overview.totalTickets}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Open</span>
                            <Ticket className="w-4 h-4 text-amber-500" />
                        </div>
                        <p className="mt-3 text-3xl font-black text-slate-900">{overview.openTickets}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400">In Progress</span>
                            <Loader className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="mt-3 text-3xl font-black text-slate-900">{overview.inProgressTickets}</p>
                    </div>
                </section>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-1 rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
                            <h2 className="text-lg font-black text-slate-900">Create Staff Member</h2>
                            <p className="text-xs text-slate-500 font-medium mt-1">Only manager and technician roles are allowed.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 transition-all"
                                    placeholder="Staff member name"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 transition-all"
                                    placeholder="staff@campus.edu"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Temporary Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 transition-all"
                                    placeholder="Minimum 6 characters"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Staff Role</label>
                                <div className="relative">
                                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 transition-all"
                                    >
                                        <option value="TECHNICIAN">TECHNICIAN</option>
                                        <option value="MANAGER">MANAGER</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-1">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-wider hover:bg-blue-600 disabled:bg-slate-400 transition-colors"
                            >
                                {saving ? <Loader className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                                {saving ? 'Creating...' : 'Create Staff Account'}
                            </button>
                        </div>
                        </form>
                    </div>

                    <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-black text-slate-900">User Directory</h2>
                                <p className="text-xs text-slate-500 font-medium mt-1">View all users and role memberships.</p>
                            </div>
                            <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search user, email, role"
                                    className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {loadingData ? (
                            <div className="p-10 flex items-center justify-center">
                                <Loader className="w-8 h-8 animate-spin text-blue-600" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs">
                                        <tr>
                                            <th className="text-left px-6 py-3 font-black">Name</th>
                                            <th className="text-left px-6 py-3 font-black">Email</th>
                                            <th className="text-left px-6 py-3 font-black">Roles</th>
                                            <th className="text-left px-6 py-3 font-black">Created</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-slate-900">{user.name || 'N/A'}</td>
                                                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {(user.roles || []).map((role) => (
                                                            <span key={`${user.id}-${role}`} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                                                {role}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredUsers.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-10 text-center text-slate-400 font-medium">
                                                    No users found for this search.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
