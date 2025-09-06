'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MessageSquare, 
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Trash2,
  AlertTriangle,
  Clock,
  Users,
  MoreVertical,
  Flag
} from 'lucide-react';
import { useUser } from '../../../contexts/UserContext';
import { useToast } from '../../../contexts/ToastContext';

interface Conversation {
  id: string;
  participants: string[];
  participantNames: string[];
  itemId?: string;
  itemTitle?: string;
  lastMessage: string;
  lastMessageTime: string;
  messageCount: number;
  status: 'active' | 'archived' | 'flagged' | 'spam';
  priority: 'low' | 'normal' | 'high';
  isRead: boolean;
  reportedBy?: string[];
  reportReason?: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'system';
  isReported: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    participants: ['user1', 'user2'],
    participantNames: ['John Doe', 'Jane Smith'],
    itemId: 'item1',
    itemTitle: 'MacBook Pro 13"',
    lastMessage: 'Is this still available?',
    lastMessageTime: '2024-01-15T10:30:00Z',
    messageCount: 5,
    status: 'active',
    priority: 'normal',
    isRead: true
  },
  {
    id: '2',
    participants: ['user3', 'user4'],
    participantNames: ['Mike Johnson', 'Sarah Wilson'],
    itemId: 'item2',
    itemTitle: 'iPhone 14 Pro',
    lastMessage: 'Can we meet tomorrow?',
    lastMessageTime: '2024-01-15T09:15:00Z',
    messageCount: 12,
    status: 'active',
    priority: 'normal',
    isRead: false
  },
  {
    id: '3',
    participants: ['user5', 'user6'],
    participantNames: ['David Brown', 'Lisa Davis'],
    itemId: 'item3',
    itemTitle: 'Gaming Chair',
    lastMessage: 'This is spam content!',
    lastMessageTime: '2024-01-15T08:45:00Z',
    messageCount: 3,
    status: 'flagged',
    priority: 'high',
    isRead: false,
    reportedBy: ['user6'],
    reportReason: 'Inappropriate content'
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    conversationId: '1',
    senderId: 'user1',
    senderName: 'John Doe',
    content: 'Hi, is this MacBook still available?',
    timestamp: '2024-01-15T10:00:00Z',
    type: 'text',
    isReported: false
  },
  {
    id: '2',
    conversationId: '1',
    senderId: 'user2',
    senderName: 'Jane Smith',
    content: 'Yes, it is! Are you interested?',
    timestamp: '2024-01-15T10:15:00Z',
    type: 'text',
    isReported: false
  },
  {
    id: '3',
    conversationId: '1',
    senderId: 'user1',
    senderName: 'John Doe',
    content: 'Is this still available?',
    timestamp: '2024-01-15T10:30:00Z',
    type: 'text',
    isReported: false
  }
];

export default function AdminMessagesPage() {
  const { user, loading } = useUser();
  const { addToast } = useToast();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showConversationDetails, setShowConversationDetails] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin(user))) {
      router.push('/admin');
      return;
    }

    if (user && isAdmin(user)) {
      loadConversations();
    }
  }, [user, loading, router]);

  const isAdmin = (user: any) => {
    return user?.email === 'admin@example.com' || user?.role === 'admin' || user?.isAdmin === true;
  };

  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      // In a real app, load from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConversations(mockConversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      addToast('Failed to load conversations', 'error');
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      // In a real app, load messages from API
      const conversationMessages = mockMessages.filter(m => m.conversationId === conversationId);
      setMessages(conversationMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      addToast('Failed to load messages', 'error');
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
    setShowConversationDetails(false);

    // Mark as read if unread
    if (!conversation.isRead) {
      setConversations(prev => prev.map(c => 
        c.id === conversation.id ? { ...c, isRead: true } : c
      ));
    }
  };

  const handleArchiveConversation = (conversationId: string) => {
    setConversations(prev => prev.map(c => 
      c.id === conversationId ? { ...c, status: 'archived' } : c
    ));
    addToast('Conversation archived', 'success');
  };

  const handleDeleteConversation = (conversationId: string) => {
    if (confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }
      addToast('Conversation deleted', 'success');
    }
  };

  const handleResolveFlag = (conversationId: string) => {
    setConversations(prev => prev.map(c => 
      c.id === conversationId ? { ...c, status: 'active', reportedBy: [], reportReason: '' } : c
    ));
    addToast('Flag resolved', 'success');
  };

  const handleMarkAsSpam = (conversationId: string) => {
    setConversations(prev => prev.map(c => 
      c.id === conversationId ? { ...c, status: 'spam' } : c
    ));
    addToast('Marked as spam', 'success');
  };

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = 
      conversation.participantNames.some(name => 
        name.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      conversation.itemTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || conversation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      case 'spam': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'normal': return 'text-gray-600';
      case 'low': return 'text-gray-400';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Messages & Conversations</h1>
                <p className="text-gray-600">Monitor and moderate user conversations</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{conversations.length} conversations</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="flex h-[800px]">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Search and Filter */}
              <div className="p-4 border-b border-gray-200 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="flagged">Flagged</option>
                  <option value="spam">Spam</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {loadingConversations ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-500">Loading conversations...</p>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No conversations found
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationSelect(conversation)}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                      } ${!conversation.isRead ? 'bg-blue-25' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">
                              {conversation.participantNames.join(' & ')}
                            </h3>
                            {!conversation.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          {conversation.itemTitle && (
                            <p className="text-sm text-gray-500">
                              Item: {conversation.itemTitle}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}>
                            {conversation.status}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate mb-2">
                        {conversation.lastMessage}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(conversation.lastMessageTime).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-3 w-3" />
                          <span>{conversation.messageCount}</span>
                          {conversation.status === 'flagged' && (
                            <Flag className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      </div>

                      {conversation.reportReason && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                          <span className="text-red-600 font-medium">Report: </span>
                          <span className="text-red-700">{conversation.reportReason}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Messages View */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-semibold text-gray-900">
                          {selectedConversation.participantNames.join(' & ')}
                        </h2>
                        {selectedConversation.itemTitle && (
                          <p className="text-sm text-gray-600">
                            Regarding: {selectedConversation.itemTitle}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowConversationDetails(!showConversationDetails)}
                          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <div className="relative">
                          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons for Flagged Conversations */}
                    {selectedConversation.status === 'flagged' && (
                      <div className="mt-3 flex items-center space-x-2">
                        <button
                          onClick={() => handleResolveFlag(selectedConversation.id)}
                          className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full hover:bg-green-200 transition-colors"
                        >
                          Resolve Flag
                        </button>
                        <button
                          onClick={() => handleMarkAsSpam(selectedConversation.id)}
                          className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full hover:bg-yellow-200 transition-colors"
                        >
                          Mark as Spam
                        </button>
                        <button
                          onClick={() => handleDeleteConversation(selectedConversation.id)}
                          className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === selectedConversation.participants[0] 
                            ? 'justify-start' 
                            : 'justify-end'
                        }`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === selectedConversation.participants[0]
                            ? 'bg-gray-200 text-gray-900'
                            : 'bg-blue-600 text-white'
                        }`}>
                          <div className="text-xs opacity-75 mb-1">
                            {message.senderName}
                          </div>
                          <div className="text-sm">
                            {message.content}
                          </div>
                          <div className="text-xs opacity-75 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Conversation Details Sidebar */}
                  {showConversationDetails && (
                    <div className="w-80 border-l border-gray-200 p-4 bg-gray-50">
                      <h3 className="font-semibold text-gray-900 mb-4">Conversation Details</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Status</label>
                          <p className="text-sm text-gray-600">{selectedConversation.status}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Participants</label>
                          <p className="text-sm text-gray-600">
                            {selectedConversation.participantNames.join(', ')}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Message Count</label>
                          <p className="text-sm text-gray-600">{selectedConversation.messageCount}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Last Activity</label>
                          <p className="text-sm text-gray-600">
                            {new Date(selectedConversation.lastMessageTime).toLocaleString()}
                          </p>
                        </div>
                        {selectedConversation.reportReason && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">Report Reason</label>
                            <p className="text-sm text-red-600">{selectedConversation.reportReason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a conversation to view messages</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
