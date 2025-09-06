// @ts-nocheck
import { User, Item, Category, Conversation, Message } from '../types';
import { mockUsers, mockItems, categories } from '../utils/mockData';

// Mock API response wrapper
interface MockApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
  status?: number;
}

// Mock current user (first user from mockUsers)
const CURRENT_USER = mockUsers[0];

// Helper to simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// @ts-nocheck
/**
 * Mock API Endpoints for development and testing purposes
 * This file provides mock implementations that mirror the real API structure
 */
export const mockApi = {
  auth: {
    login: async (credentials: { email: string; password: string }): Promise<MockApiResponse<{ message: string; user: User }>> => {
      await delay();
      // Simple mock - any email/password combination works
      return {
        data: {
          message: 'Login successful',
          user: CURRENT_USER
        }
      };
    },

    logout: async (): Promise<MockApiResponse<{ message: string }>> => {
      await delay(100);
      return {
        data: { message: 'Logout successful' }
      };
    },

    getCurrentUser: async (): Promise<MockApiResponse<User>> => {
      await delay(200);
      return {
        data: CURRENT_USER
      };
    },

    sendOtp: async (email: string): Promise<MockApiResponse<{ message: string }>> => {
      await delay();
      return {
        data: { message: 'OTP sent to your email' }
      };
    },

    verifyOtp: async (email: string, otp: string): Promise<MockApiResponse<{ message: string; verified: boolean }>> => {
      await delay();
      // Mock - any OTP works
      return {
        data: { message: 'OTP verified successfully', verified: true }
      };
    },

    completeRegistration: async (data: any): Promise<MockApiResponse<{ message: string; user: User }>> => {
      await delay();
      const newUser: User = {
        id: String(mockUsers.length + 1),
        name: data.fullName || 'New User',
        program: 'Unknown Program',
        year: '2024',
        verified: false
      };
      return {
        data: {
          message: 'Registration completed successfully',
          user: newUser
        }
      };
    }
  },

  items: {
    getAll: async (): Promise<MockApiResponse<Item[]>> => {
      await delay();
      return {
        data: mockItems
      };
    },

    getItems: async (params?: any): Promise<MockApiResponse<{ items: Item[]; hasMore: boolean; total: number }>> => {
      await delay();
      let filtered = mockItems;
      
      // Apply category filter
      if (params?.category && params.category !== 'all') {
        filtered = filtered.filter(item => {
          const categoryId = typeof item.category === 'string' ? item.category : item.category.id;
          return categoryId === params.category;
        });
      }
      
      // Apply search filter
      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.seller.name.toLowerCase().includes(searchTerm)
        );
      }
      
      // Pagination
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = filtered.slice(startIndex, endIndex);
      const hasMore = endIndex < filtered.length;
      
      return {
        data: {
          items: paginatedItems,
          hasMore,
          total: filtered.length
        },
        status: 200
      };
    },

    getItem: async (id: string): Promise<MockApiResponse<Item>> => {
      await delay();
      const item = mockItems.find(item => item.id === id);
      if (!item) {
        throw new Error('Item not found');
      }
      return {
        data: item
      };
    },

    getById: async (id: string): Promise<MockApiResponse<Item>> => {
      await delay();
      const item = mockItems.find(item => item.id === id);
      if (!item) {
        throw new Error('Item not found');
      }
      return {
        data: item
      };
    },

    search: async (query: string): Promise<MockApiResponse<Item[]>> => {
      await delay();
      const filtered = mockItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      return {
        data: filtered
      };
    },

    getByCategory: async (categoryId: string): Promise<MockApiResponse<Item[]>> => {
      await delay();
      if (categoryId === 'all') {
        return { data: mockItems };
      }
      const filtered = mockItems.filter(item => item.category.id === categoryId);
      return {
        data: filtered
      };
    },

    getCategories: async (): Promise<MockApiResponse<Category[]>> => {
      await delay(100);
      return {
        data: categories
      };
    },

    create: async (itemData: any): Promise<MockApiResponse<Item>> => {
      await delay();
      const newItem: Item = {
        id: String(mockItems.length + 1),
        title: itemData.title,
        description: itemData.description,
        price: itemData.price,
        category: categories.find(c => c.id === itemData.category) || categories[5],
        photos: itemData.images || [],
        sellerId: CURRENT_USER.id,
        seller: CURRENT_USER,
        createdAt: new Date().toISOString(),
        featured: false
      };
      return {
        data: newItem
      };
    },

    createItem: async (itemData: any): Promise<MockApiResponse<Item>> => {
      await delay();
      const newItem: Item = {
        id: String(mockItems.length + 1),
        title: itemData.title,
        description: itemData.description,
        price: itemData.price,
        category: categories.find(c => c.id === itemData.category) || categories[5],
        photos: itemData.images || [],
        sellerId: CURRENT_USER.id,
        seller: CURRENT_USER,
        createdAt: new Date().toISOString(),
        featured: false
      };
      return {
        data: newItem
      };
    }
  },

  categories: {
    getAll: async (): Promise<MockApiResponse<Category[]>> => {
      await delay(100);
      return {
        data: categories
      };
    },

    getCategories: async (): Promise<MockApiResponse<Category[]>> => {
      await delay(100);
      return {
        data: categories
      };
    }
  },

  messages: {
    getConversations: async (): Promise<MockApiResponse<Conversation[]>> => {
      await delay();
      // Mock conversations
      const mockConversations: Conversation[] = [
        {
          id: '1',
          participants: [CURRENT_USER, mockUsers[1]],
          lastMessage: {
            id: '1',
            content: 'Is the MacBook still available?',
            senderId: mockUsers[1].id,
            sender: mockUsers[1],
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            read: false
          },
          unreadCount: 1,
          messages: []
        },
        {
          id: '2',
          participants: [CURRENT_USER, mockUsers[2]],
          lastMessage: {
            id: '2',
            content: 'Thanks for the quick response!',
            senderId: CURRENT_USER.id,
            sender: CURRENT_USER,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            read: true
          },
          unreadCount: 0,
          messages: []
        }
      ];
      return {
        data: mockConversations
      };
    },

    getMessages: async (conversationId: string): Promise<MockApiResponse<Message[]>> => {
      await delay();
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Hi! I\'m interested in your MacBook.',
          senderId: mockUsers[1].id,
          sender: mockUsers[1],
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          read: true
        },
        {
          id: '2',
          content: 'Great! It\'s in excellent condition. Would you like to see it?',
          senderId: CURRENT_USER.id,
          sender: CURRENT_USER,
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          read: true
        }
      ];
      return {
        data: mockMessages
      };
    },

    sendMessage: async (conversationId: string, content: string): Promise<MockApiResponse<Message>> => {
      await delay();
      const newMessage: Message = {
        id: String(Date.now()),
        content,
        senderId: CURRENT_USER.id,
        sender: CURRENT_USER,
        timestamp: new Date().toISOString(),
        read: false
      };
      return {
        data: newMessage
      };
    }
  },

  favorites: {
    get: async (): Promise<MockApiResponse<string[]>> => {
      await delay(100);
      // Return some mock favorite IDs
      return {
        data: ['1', '3', '5']
      };
    },

    add: async (itemId: string): Promise<MockApiResponse<{ message: string }>> => {
      await delay(100);
      return {
        data: { message: 'Item added to favorites' }
      };
    },

    remove: async (itemId: string): Promise<MockApiResponse<{ message: string }>> => {
      await delay(100);
      return {
        data: { message: 'Item removed from favorites' }
      };
    }
  },

  uploads: {
    uploadImage: async (file: File): Promise<MockApiResponse<{ url: string }>> => {
      await delay(500);
      // Return a placeholder image URL
      return {
        data: {
          url: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800'
        }
      };
    },

    uploadSingle: async (file: File): Promise<MockApiResponse<{ url: string }>> => {
      await delay(500);
      return {
        data: {
          url: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800'
        }
      };
    }
  },

  // Add missing API endpoints
  interests: {
    getUserInterests: async (userId: number): Promise<MockApiResponse<any[]>> => {
      await delay();
      // Return some mock interests
      return {
        data: [
          { itemId: '1', userId },
          { itemId: '3', userId },
          { itemId: '5', userId }
        ]
      };
    },

    showInterest: async (data: any): Promise<MockApiResponse<any>> => {
      await delay();
      return {
        data: {
          id: Date.now(),
          itemId: data.itemId,
          message: data.message,
          createdAt: new Date().toISOString()
        }
      };
    },

    getItemInterests: async (itemId: number): Promise<MockApiResponse<any[]>> => {
      await delay();
      return {
        data: []
      };
    },

    removeInterest: async (id: number): Promise<MockApiResponse<any>> => {
      await delay();
      return {
        data: { message: 'Interest removed successfully' }
      };
    }
  },

  services: {
    getServices: async (params?: any): Promise<MockApiResponse<{ items: any[]; hasMore: boolean; total: number }>> => {
      await delay();
      // Mock services data (empty for now, but with proper structure)
      const mockServices: any[] = [
        {
          id: '1',
          title: 'Computer Repair',
          description: 'Professional computer repair service',
          price: 50,
          category: 'tech-services',
          providerId: CURRENT_USER.id,
          provider: CURRENT_USER
        }
      ];
      
      const limit = params?.limit || 10;
      const items = mockServices.slice(0, limit);
      
      return {
        data: {
          items,
          hasMore: false,
          total: mockServices.length
        }
      };
    }
  },

  users: {
    getProfile: async (): Promise<MockApiResponse<User>> => {
      await delay();
      return {
        data: CURRENT_USER
      };
    },

    getUserItems: async (userId: string, params: any = {}): Promise<MockApiResponse<any>> => {
      await delay();
      const userItems = mockItems.filter(item => item.sellerId === userId);
      return {
        data: {
          items: userItems,
          total: userItems.length,
          page: params.page || 1,
          limit: params.limit || 10,
          hasMore: false
        }
      };
    },

    getUserInterests: async (userId: number): Promise<MockApiResponse<any[]>> => {
      await delay();
      // Mock interests - return some items as favorites
      const interests = mockItems.slice(0, 3).map(item => ({
        id: `${userId}-${item.id}`,
        userId: userId,
        itemId: item.id,
        createdAt: new Date().toISOString()
      }));
      return {
        data: interests
      };
    }
  },

  // Add search API
  search: {
    searchAll: async (query: string, params?: any): Promise<MockApiResponse<any>> => {
      await delay();
      const filteredItems = mockItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      return {
        data: {
          items: filteredItems,
          users: [],
          services: []
        }
      };
    }
  },

  // Add notifications API
  notifications: {
    getNotifications: async (): Promise<MockApiResponse<any[]>> => {
      await delay();
      return {
        data: [
          {
            id: '1',
            title: 'New message',
            message: 'You have a new message about your MacBook',
            read: false,
            createdAt: new Date().toISOString()
          }
        ]
      };
    },

    markAsRead: async (id: string): Promise<MockApiResponse<any>> => {
      await delay();
      return {
        data: { message: 'Notification marked as read' }
      };
    }
  }
};

// Export the mock API as the default export
export default mockApi;
