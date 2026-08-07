// Conversations API Routes
// GET /api/conversations - Get all conversations for current user
// POST /api/conversations - Create a new conversation

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

// GET - Fetch user's conversations
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    // Find conversations where user is a participant
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { participant1Id: user.id },
          { participant2Id: user.id },
        ],
      },
      include: {
        participant1: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            role: true,
            donorProfile: {
              select: {
                bloodType: true,
              },
            },
          },
        },
        participant2: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            role: true,
            donorProfile: {
              select: {
                bloodType: true,
              },
            },
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
          orderBy: {
            createdAt: "desc",
          },
          take: 1, // Get last message
        },
      },
      orderBy: {
        lastMessageAt: "desc",
      },
    })

    // Format conversations with unread count
    const formattedConversations = await Promise.all(
      conversations.map(async (conv) => {
        // Get unread message count
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            receiverId: user.id,
            isRead: false,
          },
        })

        // Determine the other participant
        const otherParticipant =
          conv.participant1Id === user.id ? conv.participant2 : conv.participant1

        return {
          id: conv.id,
          otherParticipant,
          match: conv.match,
          lastMessage: conv.messages[0] || null,
          lastMessageAt: conv.lastMessageAt,
          unreadCount,
        }
      })
    )

    return NextResponse.json({
      success: true,
      conversations: formattedConversations,
    })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json(
      { success: false, message: "Error fetching conversations" },
      { status: 500 }
    )
  }
}

// POST - Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { matchId } = body

    if (!matchId) {
      return NextResponse.json(
        { success: false, message: "Match ID is required" },
        { status: 400 }
      )
    }

    // Get the match
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        request: true,
        conversation: true,
      },
    })

    if (!match) {
      return NextResponse.json(
        { success: false, message: "Match not found" },
        { status: 404 }
      )
    }

    // Check if conversation already exists
    if (match.conversation) {
      return NextResponse.json({
        success: true,
        message: "Conversation already exists",
        conversation: match.conversation,
      })
    }

    // Verify user is part of the match
    if (match.donorId !== user.id && match.request.requesterId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Not authorized to create conversation for this match" },
        { status: 403 }
      )
    }

    // Create the conversation
    const conversation = await prisma.conversation.create({
      data: {
        matchId,
        participant1Id: match.request.requesterId,
        participant2Id: match.donorId,
      },
      include: {
        participant1: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        participant2: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: "Conversation created",
      conversation,
    })
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json(
      { success: false, message: "Error creating conversation" },
      { status: 500 }
    )
  }
}
