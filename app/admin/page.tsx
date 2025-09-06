'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Package, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Shield,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Activity
} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { api } from '../../lib/apiEndpoints';

interface AdminStats {
  totalUsers: number;
  totalItems: number;
  totalMessages: number;
  activeConversations: number;
  revenueThisMonth: number;
  pendingReports: number;
}

export default function AdminDashboard() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalItems: 0,
    totalMessages: 0,
    activeConversations: 0,
    revenueThisMonth: 0,
    pendingReports: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin(user))) {
      router.push('/');
      return;
    }

    if (user && isAdmin(user)) {
      loadAdminStats();
    }
  }, [user, loading, router]);

  const isAdmin = (user: any) => {
    // Check if user is admin - you can implement this based on your user schema
    return user?.email === 'admin@example.com' || user?.role === 'admin' || user?.isAdmin === true;
  };

  const loadAdminStats = async () => {
    try {
      setLoadingStats(true);
      // Load various statistics (implement these endpoints or calculate from existing data)
      const [itemsResponse] = await Promise.allSettled([
        api.items.getItems({ limit: 1000 }) // Get all items to count
      ]);

      if (itemsResponse.status === 'fulfilled') {
        setStats(prev => ({
          ...prev,
          totalItems: itemsResponse.value.data.total || 0
        }));
      }

      // Mock other stats for now - implement actual API calls
      setStats(prev => ({
        ...prev,
        totalUsers: 156,
        totalMessages: 2847,
        activeConversations: 89,
        revenueThisMonth: 12450,
        pendingReports: 5,
      }));
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const navigationCards = [
    {
      title: 'User Management',
      description: 'Manage users, verify accounts, handle bans',
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Items Management',
      description: 'Review items, handle reports, manage categories',
      icon: Package,
      href: '/admin/items',
      color: 'bg-green-500'
    },
    {
      title: 'Analytics',
      description: 'View platform statistics and reports',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-purple-500'
    },
    {
      title: 'Messages',
      description: 'Monitor conversations and handle reports',
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'bg-orange-500'
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings and preferences',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-600'
    }
  ];  if (loading || loadingStats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin(user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <Shield className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to access the admin panel.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                <Activity className="inline h-4 w-4 mr-1" />
                System Online
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.revenueThisMonth}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.title}
                onClick={() => router.push(card.href)}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${card.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm">{card.description}</p>
                <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                  Manage →
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/admin/users?action=verify')}
              className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Verify Users</p>
                  <p className="text-sm text-gray-600">Review pending verifications</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => router.push('/admin/moderation')}
              className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Review Reports</p>
                  <p className="text-sm text-gray-600">Handle user reports</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => router.push('/admin/analytics')}
              className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">View Analytics</p>
                  <p className="text-sm text-gray-600">Check system performance</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
