"use client";

import Image from "next/image";
import { Edit, Trash2, Eye, MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Item } from "../types";
import { getItemImageUrl, PLACEHOLDER_IMAGE } from "../lib/imageUtils";
import { useToast } from "../contexts/ToastContext";
import { api } from "../lib/apiEndpoints";
import ConfirmationModal from "./ConfirmationModal";

interface UserItemCardProps {
  item: Item;
  onItemDeleted: (itemId: string | number) => void;
  onItemUpdated?: (item: Item) => void;
}

export default function UserItemCard({ item, onItemDeleted, onItemUpdated }: UserItemCardProps) {
  const { addToast } = useToast();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Safety check - return null if item is invalid
  if (!item || !item.id) {
    console.warn('UserItemCard: Invalid item passed:', item);
    return null;
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDeleteItem = async () => {
    setIsDeleting(true);
    try {
      await api.items.deleteItem(String(item.id));
      addToast('Item deleted successfully', 'success');
      onItemDeleted(item.id);
      setShowConfirmDelete(false);
    } catch (error) {
      console.error('Failed to delete item:', error);
      addToast('Failed to delete item. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
      setShowDropdown(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDropdown(false);
    setShowConfirmDelete(true);
  };

  const handleEditItem = () => {
    // Navigate to edit page
    window.location.href = `/items/${item.id}/edit`;
    setShowDropdown(false);
  };

  const handleViewItem = () => {
    // Navigate to item detail page
    window.location.href = `/items/${item.id}`;
    setShowDropdown(false);
  };

  const getStatusBadge = () => {
    if (item.isSold) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Sold
        </span>
      );
    }
    if (!item.isActive) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Inactive
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Active
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Item Image */}
      <div className="relative aspect-square">
        <Image
          src={getItemImageUrl(item)}
          alt={item.title || 'Item image'}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = PLACEHOLDER_IMAGE;
          }}
        />
        
        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          {getStatusBadge()}
        </div>

        {/* Actions Dropdown */}
        <div className="absolute top-2 right-2" ref={dropdownRef}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
            disabled={isDeleting}
          >
            <MoreVertical size={16} className="text-gray-600" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button
                  onClick={handleViewItem}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Eye size={16} className="mr-3" />
                  View Details
                </button>
                
                <button
                  onClick={handleEditItem}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit size={16} className="mr-3" />
                  Edit Item
                </button>
                
                <hr className="my-1" />
                
                <button
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} className="mr-3" />
                  Delete Item
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Item Details */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 text-sm mb-1 overflow-hidden" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {item.title}
        </h3>
        
        <p className="text-lg font-bold text-[#006666] mb-2">
          {typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{item.condition}</span>
        </div>
        
        {item.description && (
          <p className="text-sm text-gray-600 mt-2 overflow-hidden" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {item.description}
          </p>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDeleteItem}
        title="Delete Item"
        message={`Are you sure you want to delete "${item.title}"? This action cannot be undone and will remove the item along with all associated data including favorites, reports, and interests.`}
        confirmText="Delete Item"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
