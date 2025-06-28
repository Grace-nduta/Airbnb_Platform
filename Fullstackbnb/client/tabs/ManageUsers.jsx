import React from 'react';
import { ShieldCheck, Shield, Ban, Trash2 } from 'lucide-react';

function ManageUsers({ users, changeUserRole, toggleUserStatus, deleteUser, getRoleColor, getStatusColor }) {
    return (
        <div>
            <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">Manage Users</h3>
                <p className="text-gray-600">Promote, demote, suspend, or manage user accounts</p>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                                </td>
                                <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{user.joinDate}</td>
                                <td className="px-6 py-4 space-y-1">
                                    {user.role !== 'Admin' && (
                                        <div className="flex space-x-2">
                                            {user.role === 'Guest' && (
                                                <button onClick={() => changeUserRole(user.id, 'Host')} className="btn-blue text-xs">
                                                    <ShieldCheck className="w-4 h-4 mr-1" /> Promote
                                                </button>
                                            )}
                                            {user.role === 'Host' && (
                                                <>
                                                    <button onClick={() => changeUserRole(user.id, 'Admin')} className="btn-purple text-xs">
                                                        <Shield className="w-4 h-4 mr-1" /> Admin
                                                    </button>
                                                    <button onClick={() => changeUserRole(user.id, 'Guest')} className="btn-gray text-xs">
                                                        <Shield className="w-4 h-4 mr-1" /> Demote
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex space-x-2 mt-2">
                                        <button onClick={() => toggleUserStatus(user.id)} className={`text-xs ${user.status === 'Active' ? 'btn-red' : 'btn-green'}`}>
                                            <Ban className="w-4 h-4 mr-1" /> {user.status === 'Active' ? 'Suspend' : 'Activate'}
                                        </button>
                                        {user.role !== 'Admin' && (
                                            <button onClick={() => deleteUser(user.id)} className="btn-red text-xs">
                                                <Trash2 className="w-4 h-4 mr-1" /> Delete
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ManageUsers;
