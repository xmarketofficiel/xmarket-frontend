'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone,
  Calendar,
  Shield,
  Edit,
  Trash2,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { useUser } from '../../../contexts/UserContext';
import { useToast } from '../../../contexts/ToastContext';
import { api } from '../../../lib/apiEndpoints';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  whatsappNumber: string;
  isVerified: boolean;
  profileImageUrl: string | null;
  createdAt: string;
  averageRating: number;
  totalRatings: number;
  itemsCount?: number;
  messagesCount?: number;
}

export default function AdminUsersPage() {
  const { user, loading } = useUser();
  const { addToast } = useToast();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, verified, unverified
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin(user))) {
      router.push('/admin');
      return;
    }

    if (user && isAdmin(user)) {
      loadUsers();
    }
  }, [user, loading, router]);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, filterStatus]);

  const isAdmin = (user: any) => {
    return user?.email === 'admin@example.com' || user?.role === 'admin' || user?.isAdmin === true;
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      // Note: You'll need to implement a proper admin users endpoint
      // For now, this will use regular user data
      const response = await api.users.getAllUsers?.() || { data: [] };
      
      // Mock data for demonstration
      const mockUsers: AdminUser[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          whatsappNumber: '+1234567890',
          isVerified: true,
          profileImageUrl: null,
          createdAt: '2024-01-15T10:30:00Z',
          averageRating: 4.5,
          totalRatings: 12,
          itemsCount: 5,
          messagesCount: 48
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          whatsappNumber: '+1234567891',
          isVerified: false,
          profileImageUrl: null,
          createdAt: '2024-02-20T14:15:00Z',
          averageRating: 0,
          totalRatings: 0,
          itemsCount: 2,
          messagesCount: 15
        },
        {
          id: '3',
          name: 'Admin User',
          email: 'admin@example.com',
          whatsappNumber: '+1234567892',
          isVerified: true,
          profileImageUrl: null,
          createdAt: '2024-01-01T00:00:00Z',
          averageRating: 5.0,
          totalRatings: 1,
          itemsCount: 0,
          messagesCount: 100
        }
      ];

      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
      addToast('Failed to load users', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.whatsappNumber.includes(query)
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => {
        if (filterStatus === 'verified') return user.isVerified;
        if (filterStatus === 'unverified') return !user.isVerified;
        return true;
      });
    }

    setFilteredUsers(filtered);
  };

  const handleVerifyUser = async (userId: string, verify: boolean) => {
    try {
      // Implement verification API call
      await api.users.verifyUser?.(userId, verify);
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isVerified: verify } : user
      ));
      
      addToast(`User ${verify ? 'verified' : 'unverified'} successfully`, 'success');
    } catch (error) {
      console.error('Failed to update user verification:', error);
      addToast('Failed to update user verification', 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await api.users.deleteUser?.(userId);
      setUsers(users.filter(user => user.id !== userId));
      addToast('User deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete user:', error);
      addToast('Failed to delete user', 'error');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading || loadingUsers) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
                <p className="text-gray-600">Manage all registered users</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.profileImageUrl ? (
                            <img className="h-10 w-10 rounded-full object-cover" src={user.profileImageUrl} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {user.whatsappNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.isVerified ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <UserX className="h-3 w-3 mr-1" />
                            Pending
                          </span>
                        )}
                      </div>
                      {user.averageRating > 0 && (
                        <div className="text-sm text-gray-500 mt-1">
                          ⭐ {user.averageRating} ({user.totalRatings} reviews)
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{user.itemsCount} items</div>
                      <div>{user.messagesCount} messages</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {user.isVerified ? (
                        <button
                          onClick={() => handleVerifyUser(user.id, false)}
                          className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                          title="Remove Verification"
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVerifyUser(user.id, true)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Verify User"
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && !loadingUsers && (
          <div className="text-center py-12">
            <div className="text-gray-500">No users found matching your criteria.</div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-16 w-16">
                    {selectedUser.profileImageUrl ? (
                      <img className="h-16 w-16 rounded-full object-cover" src={selectedUser.profileImageUrl} alt="" />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xl font-medium text-gray-600">
                          {selectedUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedUser.name}</h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <div className="flex items-center mt-1">
                      {selectedUser.isVerified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified User
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending Verification
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {selectedUser.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {selectedUser.whatsappNumber}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Activity Stats</h4>
                    <div className="space-y-2 text-sm">
                      <div>Items Posted: <span className="font-medium">{selectedUser.itemsCount}</span></div>
                      <div>Messages Sent: <span className="font-medium">{selectedUser.messagesCount}</span></div>
                      <div>Average Rating: <span className="font-medium">
                        {selectedUser.averageRating > 0 ? `⭐ ${selectedUser.averageRating}` : 'No ratings yet'}
                      </span></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Account Information</h4>
                  <div className="text-sm text-gray-600">
                    <div>Joined: {formatDate(selectedUser.createdAt)}</div>
                    <div>User ID: {selectedUser.id}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
