"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Package } from "lucide-react";
import { useUser } from "../../../contexts/UserContext";
import { useToast } from "../../../contexts/ToastContext";
import { api } from "../../../lib/apiEndpoints";
import { Item } from "../../../types";
import UserItemCard from "../../../components/UserItemCard";

export default function MyItemsPage() {
  const { user } = useUser();
  const { addToast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'sold' | 'inactive'>('all');

  useEffect(() => {
    const loadUserItems = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.users.getUserItems(user.id.toString());
        setItems(response.data || []);
      } catch (error) {
        console.error('Failed to load user items:', error);
        addToast('Failed to load your items', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadUserItems();
  }, [user, addToast]);

  const handleItemDeleted = (itemId: string | number) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const filteredItems = items.filter(item => {
    switch (filter) {
      case 'active':
        return item.isActive && !item.isSold;
      case 'sold':
        return item.isSold;
      case 'inactive':
        return !item.isActive && !item.isSold;
      default:
        return true;
    }
  });

  const getFilterCount = (filterType: typeof filter) => {
    switch (filterType) {
      case 'active':
        return items.filter(item => item.isActive && !item.isSold).length;
      case 'sold':
        return items.filter(item => item.isSold).length;
      case 'inactive':
        return items.filter(item => !item.isActive && !item.isSold).length;
      default:
        return items.length;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Please Log In</h1>
          <p className="text-gray-600">You need to be logged in to view your items.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Items</h1>
                <p className="text-gray-600">Manage your listings</p>
              </div>
            </div>
            
            <button
              onClick={() => window.location.href = '/add-item'}
              className="bg-[#006666] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#005555] transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add New Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-none" style={{ overscrollBehaviorX: 'none', touchAction: 'pan-y' }}>
        {/* Filter Tabs */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex space-x-1 p-1">
              {(['all', 'active', 'sold', 'inactive'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    filter === filterType
                      ? 'bg-[#006666] text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)} ({getFilterCount(filterType)})
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006666]"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Package size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'No items yet' : `No ${filter} items`}
              </h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? "You haven't posted any items yet. Start selling by adding your first item!"
                  : `You don't have any ${filter} items at the moment.`
                }
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => window.location.href = '/add-item'}
                  className="bg-[#006666] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#005555] transition-colors"
                >
                  Add Your First Item
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-6 overscroll-none" style={{ overscrollBehaviorX: 'none', touchAction: 'pan-y' }}>
              {filteredItems.map((item) => (
                <UserItemCard
                  key={item.id}
                  item={item}
                  onItemDeleted={handleItemDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
