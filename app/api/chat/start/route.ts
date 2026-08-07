/**
 * Start Chat API
 * POST /api/chat/start
 * 
 * Starts a conversation with a matched donor.
 * If a conversation already exists for the match, returns that one.
 * 
 * Request body:
 *   - matchId: The match ID to start a conversation for
 * 
 * Response:
 *   - success: boolean
 *   - conversationId: The conversation ID to redirect to
 */

import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { startConversation } from "@/lib/chat"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Please log in to start a conversation" },
        { status: 401 }
      )
    }

    // Get match ID from request
    const body = await request.json()
    const { matchId } = body

    if (!matchId) {
      return NextResponse.json(
        { success: false, message: "Match ID is required" },
        { status: 400 }
      )
    }

    // Start or get existing conversation
    const result = await startConversation(matchId, user.id)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      conversationId: result.conversation?.id,
      message: result.message,
    })
  } catch (error) {
    console.error("Error in start chat API:", error)
    return NextResponse.json(
      { success: false, message: "Failed to start conversation" },
      { status: 500 }
    )
  }
}
