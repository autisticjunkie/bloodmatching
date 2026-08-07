/**
 * Chat Service
 * 
 * Simple chat logic for the Blood Donor Matching System.
 * This service handles:
 * - Starting conversations between requesters and donors
 * - Sending and receiving messages
 * - Marking messages as read
 * - Getting unread message counts
 * 
 * HOW IT WORKS:
 * 1. A requester creates a blood request
 * 2. The system finds matching donors and creates Match records
 * 3. The requester can start a conversation with any matched donor
 * 4. One conversation is linked to one match (and thus one blood request)
 * 5. Both parties can send messages back and forth
 */

import { prisma } from "@/lib/db"

// ============================================
// TYPES
// ============================================

export interface ChatMessage {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar: string | null
  isFromCurrentUser: boolean
  isRead: boolean
  createdAt: Date
}

export interface ChatConversation {
  id: string
  matchId: string
  otherParticipant: {
    id: string
    name: string
    avatarUrl: string | null
    bloodType: string | null
  }
  bloodRequest: {
    id: string
    bloodType: string
    urgency: string
    hospitalName: string
    status: string
  } | null
  lastMessage: string | null
  lastMessageAt: Date
  unreadCount: number
}

// ============================================
// CONVERSATION FUNCTIONS
// ============================================

/**
 * Start a conversation with a matched donor
 * 
 * @param matchId - The ID of the match (donor-request link)
 * @param currentUserId - The ID of the user starting the conversation
 * @returns The conversation object or null if failed
 */
export async function startConversation(
  matchId: string,
  currentUserId: string
): Promise<{ success: boolean; conversation?: { id: string }; message: string }> {
  try {
    // Get the match to verify it exists
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        request: true,
        conversation: true,
      },
    })

    if (!match) {
      return { success: false, message: "Match not found" }
    }

    // Check if user is part of this match
    if (match.donorId !== currentUserId && match.request.requesterId !== currentUserId) {
      return { success: false, message: "You are not part of this match" }
    }

    // If conversation already exists, return it
    if (match.conversation) {
      return {
        success: true,
        conversation: { id: match.conversation.id },
        message: "Conversation already exists",
      }
    }

    // Create new conversation
    // participant1 = requester, participant2 = donor
    const conversation = await prisma.conversation.create({
      data: {
        matchId,
        participant1Id: match.request.requesterId,
        participant2Id: match.donorId,
      },
    })

    return {
      success: true,
      conversation: { id: conversation.id },
      message: "Conversation started",
    }
  } catch (error) {
    console.error("Error starting conversation:", error)
    return { success: false, message: "Failed to start conversation" }
  }
}

/**
 * Get all conversations for a user
 * 
 * @param userId - The user's ID
 * @returns Array of conversations with last message and unread count
 */
export async function getUserConversations(
  userId: string
): Promise<ChatConversation[]> {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { participant1Id: userId },
          { participant2Id: userId },
        ],
      },
      include: {
        participant1: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            donorProfile: { select: { bloodType: true } },
          },
        },
        participant2: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            donorProfile: { select: { bloodType: true } },
          },
        },
        match: {
          include: {
            request: {
              select: {
                id: true,
                bloodType: true,
                urgency: true,
                hospitalName: true,
                status: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: {
        lastMessageAt: "desc",
      },
    })

    // Format each conversation
    const formatted: ChatConversation[] = await Promise.all(
      conversations.map(async (conv) => {
        // Count unread messages
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            receiverId: userId,
            isRead: false,
          },
        })

        // Determine the other participant
        const isParticipant1 = conv.participant1Id === userId
        const other = isParticipant1 ? conv.participant2 : conv.participant1

        return {
          id: conv.id,
          matchId: conv.matchId,
          otherParticipant: {
            id: other.id,
            name: other.name,
            avatarUrl: other.avatarUrl,
            bloodType: other.donorProfile?.bloodType || null,
          },
          bloodRequest: conv.match.request,
          lastMessage: conv.messages[0]?.content || null,
          lastMessageAt: conv.lastMessageAt,
          unreadCount,
        }
      })
    )

    return formatted
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return []
  }
}

/**
 * Get a single conversation by ID
 */
export async function getConversation(
  conversationId: string,
  userId: string
): Promise<ChatConversation | null> {
  try {
    const conv = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participant1: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            donorProfile: { select: { bloodType: true } },
          },
        },
        participant2: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            donorProfile: { select: { bloodType: true } },
          },
        },
        match: {
          include: {
            request: {
              select: {
                id: true,
                bloodType: true,
                urgency: true,
                hospitalName: true,
                status: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    })

    if (!conv) return null

    // Check user is part of conversation
    if (conv.participant1Id !== userId && conv.participant2Id !== userId) {
      return null
    }

    const unreadCount = await prisma.message.count({
      where: {
        conversationId: conv.id,
        receiverId: userId,
        isRead: false,
      },
    })

    const isParticipant1 = conv.participant1Id === userId
    const other = isParticipant1 ? conv.participant2 : conv.participant1

    return {
      id: conv.id,
      matchId: conv.matchId,
      otherParticipant: {
        id: other.id,
        name: other.name,
        avatarUrl: other.avatarUrl,
        bloodType: other.donorProfile?.bloodType || null,
      },
      bloodRequest: conv.match.request,
      lastMessage: conv.messages[0]?.content || null,
      lastMessageAt: conv.lastMessageAt,
      unreadCount,
    }
  } catch (error) {
    console.error("Error fetching conversation:", error)
    return null
  }
}

// ============================================
// MESSAGE FUNCTIONS
// ============================================

/**
 * Get messages in a conversation
 * 
 * @param conversationId - The conversation ID
 * @param userId - Current user's ID (to mark own messages)
 * @param limit - Number of messages to fetch (default 50)
 * @returns Array of messages, oldest first
 */
export async function getMessages(
  conversationId: string,
  userId: string,
  limit: number = 50
): Promise<ChatMessage[]> {
  try {
    // Verify user is part of conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    })

    if (!conversation) return []
    if (conversation.participant1Id !== userId && conversation.participant2Id !== userId) {
      return []
    }

    // Fetch messages
    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "asc" }, // Oldest first
      take: limit,
    })

    // Format messages
    return messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId,
      senderName: msg.sender.name,
      senderAvatar: msg.sender.avatarUrl,
      isFromCurrentUser: msg.senderId === userId,
      isRead: msg.isRead,
      createdAt: msg.createdAt,
    }))
  } catch (error) {
    console.error("Error fetching messages:", error)
    return []
  }
}

/**
 * Send a message in a conversation
 * 
 * @param conversationId - The conversation ID
 * @param senderId - The sender's user ID
 * @param content - The message text
 * @returns The created message or null if failed
 */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Promise<{ success: boolean; message?: ChatMessage; error?: string }> {
  try {
    // Validate content
    if (!content || content.trim().length === 0) {
      return { success: false, error: "Message cannot be empty" }
    }

    // Get conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    })

    if (!conversation) {
      return { success: false, error: "Conversation not found" }
    }

    // Check sender is part of conversation
    if (conversation.participant1Id !== senderId && conversation.participant2Id !== senderId) {
      return { success: false, error: "You are not part of this conversation" }
    }

    // Determine receiver
    const receiverId =
      conversation.participant1Id === senderId
        ? conversation.participant2Id
        : conversation.participant1Id

    // Create message and update conversation timestamp in one transaction
    const [newMessage] = await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId,
          senderId,
          receiverId,
          content: content.trim(),
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      }),
      prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
      }),
    ])

    return {
      success: true,
      message: {
        id: newMessage.id,
        content: newMessage.content,
        senderId: newMessage.senderId,
        senderName: newMessage.sender.name,
        senderAvatar: newMessage.sender.avatarUrl,
        isFromCurrentUser: true,
        isRead: false,
        createdAt: newMessage.createdAt,
      },
    }
  } catch (error) {
    console.error("Error sending message:", error)
    return { success: false, error: "Failed to send message" }
  }
}

/**
 * Mark all messages in a conversation as read
 * 
 * @param conversationId - The conversation ID
 * @param userId - The user marking messages as read
 */
export async function markMessagesAsRead(
  conversationId: string,
  userId: string
): Promise<{ success: boolean; count: number }> {
  try {
    const result = await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    return { success: true, count: result.count }
  } catch (error) {
    console.error("Error marking messages as read:", error)
    return { success: false, count: 0 }
  }
}

/**
 * Get total unread message count for a user
 */
export async function getUnreadCount(userId: string): Promise<number> {
  try {
    return await prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    })
  } catch (error) {
    console.error("Error getting unread count:", error)
    return 0
  }
}

// ============================================
// HELPER: Find or create conversation from match
// ============================================

/**
 * Convenience function to get or create a conversation for a match
 */
export async function getOrCreateConversation(
  matchId: string,
  userId: string
): Promise<{ conversationId: string | null; isNew: boolean }> {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { conversation: true },
  })

  if (!match) {
    return { conversationId: null, isNew: false }
  }

  if (match.conversation) {
    return { conversationId: match.conversation.id, isNew: false }
  }

  const result = await startConversation(matchId, userId)
  return {
    conversationId: result.conversation?.id || null,
    isNew: result.success,
  }
}
