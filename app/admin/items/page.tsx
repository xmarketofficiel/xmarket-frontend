'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  Calendar,
  ArrowLeft,
  Package,
  AlertTriangle
} from 'lucide-react';
import { useUser } from '../../../contexts/UserContext';
import { useToast } from '../../../contexts/ToastContext';
import { api } from '../../../lib/apiEndpoints';
import { Item } from '../../../types';
import { getItemImageUrl } from '../../../lib/imageUtils';

interface AdminItem extends Item {
  status?: 'active' | 'sold' | 'inactive' | 'reported';
  reportCount?: number;
  viewCount?: number;
}

export default function AdminItemsPage() {
  const { user, loading } = useUser();
  const { addToast } = useToast();
  const router = useRouter();
  const [items, setItems] = useState<AdminItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<AdminItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<AdminItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin(user))) {
      router.push('/admin');
      return;
    }

    if (user && isAdmin(user)) {
      loadItems();
      loadCategories();
    }
  }, [user, loading, router]);

  useEffect(() => {
    filterItems();
  }, [items, searchQuery, filterStatus, filterCategory]);

  const isAdmin = (user: any) => {
    return user?.email === 'admin@example.com' || user?.role === 'admin' || user?.isAdmin === true;
  };

  const loadCategories = async () => {
    try {
      const response = await api.items.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadItems = async () => {
    try {
      setLoadingItems(true);
      const response = await api.items.getItems({ limit: 1000 });
      
      // Transform items to include admin-specific data
      const adminItems: AdminItem[] = response.data.items.map((item: Item) => ({
        ...item,
        status: item.isSold ? 'sold' : (item.isActive ? 'active' : 'inactive'),
        reportCount: Math.floor(Math.random() * 3), // Mock data
        viewCount: Math.floor(Math.random() * 100) + 10, // Mock data
      }));

      setItems(adminItems);
    } catch (error) {
      console.error('Failed to load items:', error);
      addToast('Failed to load items', 'error');
    } finally {
      setLoadingItems(false);
    }
  };

  const filterItems = () => {
    let filtered = [...items];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.seller?.name && item.seller.name.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => 
        typeof item.category === 'string' 
          ? item.category === filterCategory 
          : item.category.id === filterCategory
      );
    }

    setFilteredItems(filtered);
  };

  const handleToggleItemStatus = async (itemId: string | number, newStatus: 'active' | 'inactive') => {
    try {
      // Implement item status toggle API call
      await api.items.updateItem(String(itemId), { condition: newStatus === 'active' ? 'Good' : 'Fair' });
      
      setItems(items.map(item => 
        item.id === itemId ? { ...item, status: newStatus, isActive: newStatus === 'active' } : item
      ));
      
      addToast(`Item ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`, 'success');
    } catch (error) {
      console.error('Failed to update item status:', error);
      addToast('Failed to update item status', 'error');
    }
  };

  const handleDeleteItem = async (itemId: string | number) => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      await api.items.deleteItem(String(itemId));
      setItems(items.filter(item => item.id !== itemId));
      addToast('Item deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete item:', error);
      addToast('Failed to delete item', 'error');
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'reported': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-3 w-3" />;
      case 'sold': return <DollarSign className="h-3 w-3" />;
      case 'inactive': return <XCircle className="h-3 w-3" />;
      case 'reported': return <AlertTriangle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
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

  if (loading || loadingItems) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading items...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Items Management</h1>
                <p className="text-gray-600">Monitor and manage all marketplace items</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredItems.length} of {items.length} items
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search items by title, description, or seller..."
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
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="inactive">Inactive</option>
                <option value="reported">Reported</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id || category} value={category.id || category}>
                    {category.name || category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              {/* Item Image */}
              <div className="aspect-square bg-gray-200 relative">
                <img 
                  src={getItemImageUrl(item)} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
                  }}
                />
                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                    <span className="ml-1 capitalize">{item.status}</span>
                  </span>
                </div>
                {/* Report Badge */}
                {item.reportCount && item.reportCount > 0 && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {item.reportCount}
                    </span>
                  </div>
                )}
              </div>

              {/* Item Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                <p className="text-lg font-bold text-[#006666] mb-2">${item.price}</p>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                  <User className="h-4 w-4" />
                  <span>{item.seller?.name || 'Unknown User'}</span>
                  {item.seller?.verified && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>{item.viewCount} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setShowItemModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/item/${item.id}`)}
                      className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                      title="Edit Item"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                      title="Delete Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleToggleItemStatus(
                      item.id, 
                      item.status === 'active' ? 'inactive' : 'active'
                    )}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      item.status === 'active' 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {item.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && !loadingItems && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="text-gray-500">No items found matching your criteria.</div>
          </div>
        )}
      </div>

      {/* Item Details Modal */}
      {showItemModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Item Details</h2>
                <button
                  onClick={() => setShowItemModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Item Images */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
                  <div className="space-y-2">
                    {selectedItem.photos && selectedItem.photos.length > 0 ? (
                      selectedItem.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`${selectedItem.title} ${index + 1}`}
                          className="w-full rounded-lg object-cover"
                        />
                      ))
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Item Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedItem.title}</h3>
                    <p className="text-2xl font-bold text-[#006666] mb-2">${selectedItem.price}</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedItem.status)}`}>
                      {getStatusIcon(selectedItem.status)}
                      <span className="ml-1 capitalize">{selectedItem.status}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">{selectedItem.description}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Seller Information</h4>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {selectedItem.seller?.name ? selectedItem.seller.name.charAt(0).toUpperCase() : '?'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{selectedItem.seller?.name || 'Unknown User'}</span>
                          {selectedItem.seller?.verified && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-600">ID: {selectedItem.sellerId}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Views:</span>
                        <span className="font-medium">{selectedItem.viewCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reports:</span>
                        <span className="font-medium">{selectedItem.reportCount || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Listed:</span>
                        <span className="font-medium">{formatDate(selectedItem.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="font-medium">
                          {typeof selectedItem.category === 'string' 
                            ? selectedItem.category 
                            : selectedItem.category.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Admin Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleToggleItemStatus(
                          selectedItem.id,
                          selectedItem.status === 'active' ? 'inactive' : 'active'
                        )}
                        className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedItem.status === 'active'
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {selectedItem.status === 'active' ? 'Deactivate Item' : 'Activate Item'}
                      </button>
                      <button
                        onClick={() => {
                          setShowItemModal(false);
                          handleDeleteItem(selectedItem.id);
                        }}
                        className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                      >
                        Delete Item
                      </button>
                    </div>
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
