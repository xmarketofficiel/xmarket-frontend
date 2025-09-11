export interface UserPrivacySettings {
  showSoldItems: boolean;
  showPurchases: boolean;
  showPhone?: boolean;
}

export interface User {
  id: number | string;
  fullName?: string;
  name?: string; // Deprecated - use fullName
  email?: string;
  whatsappNumber?: string;
  program?: string; // Not used in current backend
  year?: string; // Not used in current backend
  avatar?: string; // Deprecated - use profileImageUrl
  profileImageUrl?: string;
  profilePicture?: string; // Alternative field name
  isVerified?: boolean;
  verified?: boolean; // Deprecated - use isVerified
  anonymous?: boolean;
  createdAt?: string;
  updatedAt?: string;
  averageRating?: string | number;
  totalRatings?: number;
  role?: string;
  status?: string;
  lastLogin?: string;
  privacy?: UserPrivacySettings;
  // Direct privacy fields from backend
  showSoldItems?: boolean;
  showPurchases?: boolean;
}

export interface Item {
  id: number | string;
  title: string;
  description: string;
  price: string | number;
  quantity?: number;
  category: string | Category;
  photos?: string[];
  images?: any[];
  sellerId: number | string;
  seller: User;
  createdAt: string;
  featured?: boolean;
  isSold?: boolean;
  isActive?: boolean;
  viewCount?: number;
  updatedAt?: string;
  condition?: string;
  anonymous?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  sender: User;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  messages: Message[];
  itemId?: string;
  item?: Item;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}