/**
 * Messages API endpoints
 * Split from apiEndpoints.ts for better code splitting and performance
 */

import apiClient, { ApiResponse } from "../api";
import { Conversation, Message } from "../../types";

// Interfaces for messages
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ===== MESSAGES API =====
export const messagesApi = {
  getConversations: (): Promise<ApiResponse<Conversation[]>> => {
    return apiClient.get("/messages/conversations");
  },

  getConversation: (
    conversationId: string
  ): Promise<ApiResponse<Conversation>> => {
    return apiClient.get(`/messages/conversations/${conversationId}`);
  },

  getMessages: (
    conversationId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<ApiResponse<PaginatedResponse<Message>>> => {
    return apiClient.get(`/messages/conversations/${conversationId}/messages`, params);
  },

  sendMessage: (
    conversationId: string,
    content: string
  ): Promise<ApiResponse<Message>> => {
    return apiClient.post(`/messages/conversations/${conversationId}/messages`, { content });
  },

  createConversation: (
    participantId: string,
    itemId?: string
  ): Promise<ApiResponse<Conversation>> => {
    return apiClient.post("/messages/conversations", { participantId, itemId });
  },

  markAsRead: (conversationId: string): Promise<ApiResponse<void>> => {
    return apiClient.post(`/messages/conversations/${conversationId}/read`);
  },

  deleteConversation: (conversationId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(`/messages/conversations/${conversationId}`);
  },
};