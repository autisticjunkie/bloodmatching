/**
 * useChat Hook
 * 
 * A simple React hook for chat functionality.
 * Handles fetching conversations, messages, and sending messages.
 * 
 * Usage:
 *   const { conversations, messages, sendMessage, selectConversation } = useChat()
 */

import { useState, useEffect, useCallback } from "react"
import useSWR from "swr"

// ============================================
// TYPES
// ============================================

interface Participant {
  id: string
  name: string
  avatarUrl: string | null
  bloodType?: string | null
}

interface BloodRequest {
  id: string
  bloodType: string
  urgency: string
  hospitalName: string
  status: string
}

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar: string | null
  isFromCurrentUser: boolean
  isRead: boolean
  createdAt: string
}

interface Conversation {
  id: string
  matchId: string
  otherParticipant: Participant
  bloodRequest: BloodRequest | null
  lastMessage: string | null
  lastMessageAt: string
  unreadCount: number
}

// Fetcher function for SWR
const fetcher = (url: string) =>
  fetch(url).then((res) => res.json())

// ============================================
// HOOK: useConversations
// ============================================

/**
 * Hook to fetch user's conversations
 */
export function useConversations() {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean
    conversations: Conversation[]
  }>("/api/conversations", fetcher, {
    refreshInterval: 10000, // Poll every 10 seconds
  })

  return {
    conversations: data?.conversations || [],
    isLoading,
    isError: error || !data?.success,
    refresh: mutate,
  }
}

// ============================================
// HOOK: useMessages
// ============================================

/**
 * Hook to fetch messages for a specific conversation
 */
export function useMessages(conversationId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean
    messages: Message[]
  }>(
    conversationId ? `/api/conversations/${conversationId}/messages` : null,
    fetcher,
    {
      refreshInterval: 3000, // Poll every 3 seconds for new messages
    }
  )

  return {
    messages: data?.messages || [],
    isLoading,
    isError: error || (data && !data.success),
    refresh: mutate,
  }
}

// ============================================
// HOOK: useChat (Combined)
// ============================================

/**
 * Main chat hook combining conversations and messages
 */
export function useChat() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)

  // Fetch conversations
  const {
    conversations,
    isLoading: conversationsLoading,
    refresh: refreshConversations,
  } = useConversations()

  // Fetch messages for selected conversation
  const {
    messages,
    isLoading: messagesLoading,
    refresh: refreshMessages,
  } = useMessages(selectedConversationId)

  // Get selected conversation details
  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  ) || null

  // Select a conversation
  const selectConversation = useCallback((conversationId: string) => {
    setSelectedConversationId(conversationId)
  }, [])

  // Send a message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!selectedConversationId || !content.trim()) {
        return { success: false, error: "No conversation selected or empty message" }
      }

      setIsSending(true)
      try {
        const response = await fetch(
          `/api/conversations/${selectedConversationId}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
          }
        )

        const data = await response.json()

        if (data.success) {
          // Refresh messages to show new message
          refreshMessages()
          refreshConversations()
        }

        return { success: data.success, error: data.message }
      } catch (error) {
        console.error("Error sending message:", error)
        return { success: false, error: "Failed to send message" }
      } finally {
        setIsSending(false)
      }
    },
    [selectedConversationId, refreshMessages, refreshConversations]
  )

  // Start a new conversation from a match
  const startConversation = useCallback(
    async (matchId: string) => {
      try {
        const response = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matchId }),
        })

        const data = await response.json()

        if (data.success && data.conversation) {
          await refreshConversations()
          setSelectedConversationId(data.conversation.id)
          return { success: true, conversationId: data.conversation.id }
        }

        return { success: false, error: data.message }
      } catch (error) {
        console.error("Error starting conversation:", error)
        return { success: false, error: "Failed to start conversation" }
      }
    },
    [refreshConversations]
  )

  // Calculate total unread count
  const totalUnread = conversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0
  )

  return {
    // Conversations
    conversations,
    conversationsLoading,
    selectedConversation,
    selectedConversationId,
    selectConversation,
    startConversation,
    refreshConversations,

    // Messages
    messages,
    messagesLoading,
    refreshMessages,

    // Send
    sendMessage,
    isSending,

    // Stats
    totalUnread,
  }
}

// ============================================
// HOOK: useUnreadCount
// ============================================

/**
 * Simple hook to just get unread message count
 */
export function useUnreadCount() {
  const { conversations } = useConversations()
  
  return conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)
}

export default useChat
