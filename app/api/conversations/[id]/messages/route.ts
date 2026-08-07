// Messages API Routes
// GET /api/conversations/[id]/messages - Get messages in a conversation
// POST /api/conversations/[id]/messages - Send a new message

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

type RouteParams = { params: Promise<{ id: string }> }

// GET - Fetch messages in a conversation
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: conversationId } = await params
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    // Verify user is part of the conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    })

    if (!conversation) {
      return NextResponse.json(
        { success: false, message: "Conversation not found" },
        { status: 404 }
      )
    }

    if (conversation.participant1Id !== user.id && conversation.participant2Id !== user.id) {
      return NextResponse.json(
        { success: false, message: "Not authorized to view this conversation" },
        { status: 403 }
      )
    }

    // Get messages with pagination
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const before = searchParams.get("before") // Cursor for pagination

    const where: Record<string, unknown> = {
      conversationId,
    }

    if (before) {
      where.createdAt = { lt: new Date(before) }
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        receiverId: user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    // Reverse to get oldest first for chat display
    const sortedMessages = messages.reverse()

    return NextResponse.json({
      success: true,
      messages: sortedMessages,
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      { success: false, message: "Error fetching messages" },
      { status: 500 }
    )
  }
}

// POST - Send a new message
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: conversationId } = await params
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    // Verify user is part of the conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    })

    if (!conversation) {
      return NextResponse.json(
        { success: false, message: "Conversation not found" },
        { status: 404 }
      )
    }

    if (conversation.participant1Id !== user.id && conversation.participant2Id !== user.id) {
      return NextResponse.json(
        { success: false, message: "Not authorized to send messages in this conversation" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { content } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Message content is required" },
        { status: 400 }
      )
    }

    // Determine receiver
    const receiverId =
      conversation.participant1Id === user.id
        ? conversation.participant2Id
        : conversation.participant1Id

    // Create the message and update conversation
    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId,
          senderId: user.id,
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

    return NextResponse.json({
      success: true,
      message,
    })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json(
      { success: false, message: "Error sending message" },
      { status: 500 }
    )
  }
}
