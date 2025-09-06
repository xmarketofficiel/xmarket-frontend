'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Package,
  MessageSquare,
  Calendar,
  ArrowLeft,
  Download,
  Filter,
  Eye,
  Activity
} from 'lucide-react';
import { useUser } from '../../../contexts/UserContext';
import { api } from '../../../lib/apiEndpoints';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalUsers: number;
    totalItems: number;
    totalMessages: number;
    revenueGrowth: number;
    userGrowth: number;
    itemGrowth: number;
    messageGrowth: number;
  };
  chartData: {
    labels: string[];
    revenue: number[];
    users: number[];
    items: number[];
  };
  topCategories: {
    name: string;
    count: number;
    percentage: number;
  }[];
  recentActivity: {
    date: string;
    type: string;
    description: string;
    value?: number;
  }[];
}

export default function AdminAnalyticsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    if (!loading && (!user || !isAdmin(user))) {
      router.push('/admin');
      return;
    }

    if (user && isAdmin(user)) {
      loadAnalytics();
    }
  }, [user, loading, router, timeRange]);

  const isAdmin = (user: any) => {
    return user?.email === 'admin@example.com' || user?.role === 'admin' || user?.isAdmin === true;
  };

  const loadAnalytics = async () => {
    try {
      setLoadingAnalytics(true);
      
      // Load real data from APIs
      const [itemsResponse] = await Promise.allSettled([
        api.items.getItems({ limit: 1000 })
      ]);

      // Mock analytics data - in real app, this would come from dedicated analytics API
      const mockData: AnalyticsData = {
        overview: {
          totalRevenue: 45280,
          totalUsers: 1247,
          totalItems: itemsResponse.status === 'fulfilled' ? itemsResponse.value.data.total : 328,
          totalMessages: 5643,
          revenueGrowth: 12.5,
          userGrowth: 8.3,
          itemGrowth: 15.7,
          messageGrowth: 23.1
        },
        chartData: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          revenue: [3200, 4100, 3800, 4500, 4200, 4800, 5200],
          users: [45, 62, 58, 71, 69, 84, 89],
          items: [23, 31, 28, 34, 32, 38, 41]
        },
        topCategories: [
          { name: 'Electronics', count: 124, percentage: 35.2 },
          { name: 'Books', count: 89, percentage: 25.3 },
          { name: 'Furniture', count: 67, percentage: 19.0 },
          { name: 'Clothing', count: 45, percentage: 12.8 },
          { name: 'Other', count: 27, percentage: 7.7 }
        ],
        recentActivity: [
          { date: '2024-08-30', type: 'user', description: 'New user registered', value: 1 },
          { date: '2024-08-30', type: 'item', description: 'Item posted', value: 1 },
          { date: '2024-08-30', type: 'sale', description: 'Item sold', value: 299 },
          { date: '2024-08-29', type: 'message', description: 'Messages exchanged', value: 15 },
          { date: '2024-08-29', type: 'user', description: 'User verified', value: 1 }
        ]
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const exportData = () => {
    // Implement data export functionality
    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(
      'Date,Revenue,Users,Items\n' +
      analyticsData?.chartData.labels.map((label, index) => 
        `${label},${analyticsData.chartData.revenue[index]},${analyticsData.chartData.users[index]},${analyticsData.chartData.items[index]}`
      ).join('\n') || ''
    )}`;
    
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'analytics_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || loadingAnalytics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-gray-500">Failed to load analytics data.</div>
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
                <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-gray-600">Monitor platform performance and insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <button
                onClick={exportData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analyticsData.overview.totalRevenue)}
                </p>
                <div className={`flex items-center mt-1 text-sm ${analyticsData.overview.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analyticsData.overview.revenueGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {formatPercentage(analyticsData.overview.revenueGrowth)}
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalUsers}</p>
                <div className={`flex items-center mt-1 text-sm ${analyticsData.overview.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analyticsData.overview.userGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {formatPercentage(analyticsData.overview.userGrowth)}
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalItems}</p>
                <div className={`flex items-center mt-1 text-sm ${analyticsData.overview.itemGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analyticsData.overview.itemGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {formatPercentage(analyticsData.overview.itemGrowth)}
                </div>
              </div>
              <Package className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalMessages}</p>
                <div className={`flex items-center mt-1 text-sm ${analyticsData.overview.messageGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analyticsData.overview.messageGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {formatPercentage(analyticsData.overview.messageGrowth)}
                </div>
              </div>
              <MessageSquare className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Main Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedMetric('revenue')}
                  className={`px-3 py-1 text-sm rounded-lg ${selectedMetric === 'revenue' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setSelectedMetric('users')}
                  className={`px-3 py-1 text-sm rounded-lg ${selectedMetric === 'users' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Users
                </button>
                <button
                  onClick={() => setSelectedMetric('items')}
                  className={`px-3 py-1 text-sm rounded-lg ${selectedMetric === 'items' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  Items
                </button>
              </div>
            </div>
            
            {/* Simple Chart Visualization */}
            <div className="h-64 flex items-end space-x-2">
              {analyticsData.chartData.labels.map((label, index) => {
                const data = selectedMetric === 'revenue' 
                  ? analyticsData.chartData.revenue 
                  : selectedMetric === 'users' 
                    ? analyticsData.chartData.users 
                    : analyticsData.chartData.items;
                
                const maxValue = Math.max(...data);
                const height = (data[index] / maxValue) * 200;
                
                return (
                  <div key={label} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
                      style={{ height: `${height}px` }}
                      title={`${label}: ${data[index]}`}
                    />
                    <div className="text-xs text-gray-600 mt-2">{label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
            <div className="space-y-4">
              {analyticsData.topCategories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{category.name}</div>
                      <div className="text-sm text-gray-600">{category.count} items</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {category.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {analyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'user' ? 'bg-blue-100' :
                    activity.type === 'item' ? 'bg-green-100' :
                    activity.type === 'sale' ? 'bg-orange-100' :
                    'bg-purple-100'
                  }`}>
                    {activity.type === 'user' ? <Users className="h-4 w-4 text-blue-600" /> :
                     activity.type === 'item' ? <Package className="h-4 w-4 text-green-600" /> :
                     activity.type === 'sale' ? <DollarSign className="h-4 w-4 text-orange-600" /> :
                     <MessageSquare className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{activity.description}</div>
                    <div className="text-xs text-gray-600">{activity.date}</div>
                  </div>
                  {activity.value && (
                    <div className="text-sm font-medium text-gray-900">
                      {activity.type === 'sale' ? formatCurrency(activity.value) : activity.value}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {((analyticsData.overview.totalItems / analyticsData.overview.totalUsers) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Items per User Ratio</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {(analyticsData.overview.totalRevenue / analyticsData.overview.totalItems).toFixed(0)}
              </div>
              <div className="text-sm text-gray-600">Average Item Value</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {(analyticsData.overview.totalMessages / analyticsData.overview.totalUsers).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Messages per User</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
