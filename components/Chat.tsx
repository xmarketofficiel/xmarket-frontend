"use client";

import React, { useState } from "react";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Conversation, Message } from "../types";
import Image from 'next/image';
import { useUser } from "../contexts/UserContext";
import { useUI } from "../contexts/UIContext";
import { getItemImageUrl } from "../lib/imageUtils";

interface ChatProps {
  conversation: Conversation;
  onBack: () => void;
}

export default function Chat({ conversation, onBack }: ChatProps) {
  const router = useRouter();
  const { user } = useUser();
  const { setHideNavbar } = useUI();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(conversation.messages);

  const otherParticipant = conversation.participants.find(
    (p) => p.id !== user?.id
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: `m${Date.now()}`,
      senderId: String(user.id),
      sender: user,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Hide navbar while chat is open
  React.useEffect(() => {
    setHideNavbar(true);
    return () => setHideNavbar(false);
  }, [setHideNavbar]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center space-x-3">
        <button
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="w-10 h-10 bg-[#006666] rounded-full flex items-center justify-center text-white font-semibold">
          {otherParticipant?.name?.charAt(0) || 'U'}
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h1 className="font-semibold text-gray-900">
              {otherParticipant?.name?.split(" ")[0] || 'Unknown'}
            </h1>
            {otherParticipant?.verified && (
              <CheckCircle size={16} className="text-[#006666]" />
            )}
          </div>
          <p className="text-sm text-gray-600">{otherParticipant?.program}</p>
        </div>
      </div>

      {/* Item Context (if applicable) */}
      {conversation.item && (
        <div className="bg-white border-b border-gray-200 p-3">
          <div className="flex items-center space-x-3 text-sm">
            <Image
              src={getItemImageUrl(conversation.item)}
              alt={conversation.item.title}
              width={40}
              height={40}
              className="rounded-lg object-cover"
            />
            <div>
              <p className="font-medium text-gray-900">
                {conversation.item.title}
              </p>
              <p className="text-[#006666] font-semibold">
                {new Intl.NumberFormat("en-US").format(
                  typeof conversation.item.price === 'string' 
                    ? parseFloat(conversation.item.price) 
                    : conversation.item.price
                )}{" "}
                DH
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isFromCurrentUser = message.senderId === user?.id;
          const showDate =
            index === 0 ||
            formatDate(messages[index - 1].timestamp) !==
              formatDate(message.timestamp);

          return (
            <div key={message.id}>
              {/* Date Separator */}
              {showDate && (
                <div className="text-center my-4">
                  <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
              )}

              {/* Message */}
              <div
                className={`flex ${
                  isFromCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    isFromCurrentUser
                      ? "bg-[#006666] text-white"
                      : "bg-white text-gray-900 border border-gray-200"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isFromCurrentUser ? "text-[#006666]/70" : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#006666] focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-[#006666] text-white p-2 rounded-full hover:bg-[#005555] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
