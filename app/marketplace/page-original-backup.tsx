"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import SearchBar from "../../components/SearchBar";
import CategoryFilter from "../../components/CategoryFilter";
import Feed from "../../components/Feed";
import { api } from "../../lib/apiEndpoints";
import { Item } from "../../types";
import { usePullToRefresh } from "../../hooks/usePullToRefresh";
import Link from "next/link";

const ITEMS_PER_PAGE = 12; // Better grid layout with 12 items

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [displayedItems, setDisplayedItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [pendingSalesCount, setPendingSalesCount] = useState(0);
  
  const { user } = useUser();

  // Load pending sales count for notifications
  useEffect(() => {
    const fetchPendingSalesCount = async () => {
      if (!user) {
        setPendingSalesCount(0);
        return;
      }

      try {
        // Use the same API as the pending sales page for consistency
        const response = await api.items.getPendingSales();
        const pendingSales = response.data || [];
        setPendingSalesCount(Array.isArray(pendingSales) ? pendingSales.length : 0);
      } catch (error) {
        setPendingSalesCount(0);
      }
    };

    fetchPendingSalesCount();
    
    // Update every 30 seconds
    const interval = setInterval(fetchPendingSalesCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Load categories from backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.items.getCategories();
        const backendCategories = response.data;

        // Backend now returns full category objects with id, name, icon, description
        const mappedCategories = Array.isArray(backendCategories) 
          ? backendCategories.map((category: any) => ({
              id: category.name, // Use name for backward compatibility with filtering
              name: category.name,
              icon: category.icon || "📦", // Use icon from backend
            }))
          : [];

        // Add 'all' category at the beginning
        setCategories([
          { id: "all", name: "All", icon: "📱" },
          ...mappedCategories,
        ]);
      } catch (error) {
        console.error("Failed to load categories:", error);
        // Fallback categories
        setCategories([
          { id: "all", name: "All", icon: "📱" },
          { id: "books", name: "Books", icon: "📚" },
          { id: "electronics", name: "Electronics", icon: "💻" },
          { id: "furniture", name: "Furniture", icon: "🪑" },
          { id: "clothing", name: "Clothing", icon: "👕" },
          { id: "sports", name: "Sports", icon: "⚽" },
          { id: "vehicles", name: "Vehicles", icon: "�" },
          { id: "home & garden", name: "Home & Garden", icon: "🏡" },
          { id: "other", name: "Other", icon: "📦" },
        ]);
      }
    };

    loadCategories();
  }, []);

  // Helper function to get category icons
  const getCategoryIcon = (categoryName: string): string => {
    const iconMap: Record<string, string> = {
      electronics: "💻",
      books: "📚",
      furniture: "🪑",
      clothing: "👕",
      sports: "⚽",
      vehicles: "🚗",
      "home & garden": "🏡",
      other: "📦",
    };
    return iconMap[categoryName] || "📦";
  };

  const loadItems = useCallback(
    async (page: number = 1, replaceItems: boolean = true) => {
      setLoading(true);

      try {
        const params: any = {
          page,
          limit: itemsPerPage,
        };

        if (searchQuery.trim()) {
          params.search = searchQuery;
        }

        if (selectedCategory && selectedCategory !== "all") {
          params.category = selectedCategory;
        }

        const response = await api.items.getItems(params);
        const pageItems = response.data.items || [];
        const total = response.data.total || 0;

        setTotalItems(total);

        if (replaceItems) {
          // Replace all items when refreshing or searching
          setDisplayedItems(pageItems);
        } else {
          // Infinite scroll: append new items with strict deduplication
          setDisplayedItems((prev) => {
            const existingIds = new Set(prev.map((item) => item.id));
            const newItems = pageItems.filter(
              (item: Item) => !existingIds.has(item.id)
            );

            // Debug logging in development
            if (
              process.env.NODE_ENV === "development" &&
              newItems.length !== pageItems.length
            ) {
              console.log("Filtered out duplicate items:", {
                pageItems: pageItems.length,
                newItems: newItems.length,
                existing: prev.length,
              });
            }

            return [...prev, ...newItems];
          });
        }

        setHasMore(response.data.hasMore || false);
        setCurrentPage(page);
      } catch (error) {
        console.error("Failed to load items:", error);
        if (replaceItems) {
          setDisplayedItems([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory, searchQuery, itemsPerPage]
  );

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setDisplayedItems([]);
    loadItems(1, true);
  }, [searchQuery, selectedCategory, itemsPerPage]);

  // Initial load - separate effect to avoid dependency issues  
  useEffect(() => {
    loadItems(1, true);
  }, []); // Empty dependency array for initial load only

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      loadItems(nextPage, false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage && !loading) {
      window.scrollTo(0, 0);
      loadItems(page, true);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleRefresh = async () => {
    setCurrentPage(1);
    setDisplayedItems([]);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate refresh delay
    loadItems(1);
  };

  const { isPulling, isRefreshing, pullDistance } = usePullToRefresh({
    onRefresh: handleRefresh,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Pull to refresh indicator */}
      {(isPulling || isRefreshing) && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-[#006666] text-white py-2 transition-transform duration-200"
          style={{
            transform: `translateY(${isPulling 
              ? Math.min(pullDistance - 60, 0) 
              : isRefreshing 
              ? 0 
              : -100}px)`,
          }}
        >
          <div className="flex items-center space-x-2">
            {isRefreshing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Refreshing...</span>
              </>
            ) : (
              <span className="text-sm font-medium">
                {pullDistance > 80 ? "Release to refresh" : "Pull to refresh"}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-40 shadow-sm">
        <div className="px-4 py-4">
          {/* Title and Sales Icon Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
              <p className="text-sm text-gray-600">Discover amazing deals</p>
            </div>
            
            {/* Sales Notification Icon - Always visible for logged in users */}
            {user && (
              <Link
                href="/profile/pending-sales"
                className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                aria-label="Pending Sales"
              >
                <Bell size={20} />
                {pendingSalesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                    {pendingSalesCount > 9 ? '9+' : pendingSalesCount}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* Search Bar and View Controls */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search items, categories, or sellers..."
              />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-[#006666] shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                aria-label="Grid view"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-[#006666] shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-[#006666] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {/* Category Filter - Collapsible */}
          <div className={`transition-all duration-300 overflow-hidden ${
            showFilters ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-800">
              <span className="font-semibold">{totalItems}</span>{" "}
              {totalItems === 1 ? "result" : "results"} for "{searchQuery}"
            </div>
            {totalItems > 0 && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Feed with Enhanced Layout */}
      <div className="px-4 pt-4 pb-20">
        <Feed
          items={displayedItems}
          loading={loading}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
}
