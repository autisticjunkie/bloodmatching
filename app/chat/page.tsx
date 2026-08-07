"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Droplet,
  Send,
  ArrowLeft,
  Search,
  MoreVertical,
  Phone,
  Info,
  Clock,
  MapPin,
  Building2,
  CheckCheck,
  Check,
  Menu,
  X,
} from "lucide-react"

// Mock conversations data
const conversations = [
  {
    id: 1,
    participant: {
      name: "Chinedu Okafor",
      avatar: "/images/donor-portrait-1.jpg",
      role: "donor",
      bloodType: "O+",
      isOnline: true,
    },
    request: {
      id: "REQ-001",
      bloodType: "O+",
      urgency: "critical",
      hospital: "Lagos University Teaching Hospital",
      location: "Lagos, Lagos State",
    },
    lastMessage: {
      text: "Yes, I can come to the hospital today. What time works best?",
      timestamp: "10:45 AM",
      isFromMe: false,
      isRead: true,
    },
    unreadCount: 0,
  },
  {
    id: 2,
    participant: {
      name: "Emeka Nwosu",
      avatar: "/images/donor-portrait-2.jpg",
      role: "donor",
      bloodType: "O+",
      isOnline: false,
    },
    request: {
      id: "REQ-001",
      bloodType: "O+",
      urgency: "critical",
      hospital: "Lagos University Teaching Hospital",
      location: "Lagos, Lagos State",
    },
    lastMessage: {
      text: "Thank you for reaching out! Let me check my schedule.",
      timestamp: "Yesterday",
      isFromMe: false,
      isRead: true,
    },
    unreadCount: 0,
  },
  {
    id: 3,
    participant: {
      name: "Ngozi Eze",
      avatar: undefined as string | undefined,
      role: "donor",
      bloodType: "A-",
      isOnline: true,
    },
    request: {
      id: "REQ-002",
      bloodType: "A-",
      urgency: "high",
      hospital: "Lagos University Teaching Hospital",
      location: "Lagos, Lagos State",
    },
    lastMessage: {
      text: "I donated last month, but I should be eligible again next week.",
      timestamp: "Yesterday",
      isFromMe: false,
      isRead: false,
    },
    unreadCount: 2,
  },
  {
    id: 4,
    participant: {
      name: "Tunde Adeyemi",
      avatar: undefined as string | undefined,
      role: "donor",
      bloodType: "A-",
      isOnline: false,
    },
    request: {
      id: "REQ-002",
      bloodType: "A-",
      urgency: "high",
      hospital: "Lagos University Teaching Hospital",
      location: "Lagos, Lagos State",
    },
    lastMessage: {
      text: "Hello, I saw your blood request and would like to help.",
      timestamp: "2 days ago",
      isFromMe: false,
      isRead: true,
    },
    unreadCount: 0,
  },
]

// Mock messages for the active conversation
const mockMessages = [
  {
    id: 1,
    text: "Hello! I saw that you need O+ blood urgently. I am a registered donor and would like to help.",
    timestamp: "10:15 AM",
    isFromMe: false,
    isRead: true,
  },
  {
    id: 2,
    text: "Thank you so much for reaching out! Yes, we urgently need O+ blood for a patient at Lagos University Teaching Hospital.",
    timestamp: "10:20 AM",
    isFromMe: true,
    isRead: true,
  },
  {
    id: 3,
    text: "I understand. I last donated 4 months ago so I should be eligible. Is there any specific documentation I need to bring?",
    timestamp: "10:25 AM",
    isFromMe: false,
    isRead: true,
  },
  {
    id: 4,
    text: "Please bring your IC and donor card if you have one. The blood bank is open from 8 AM to 5 PM. You can go directly to the hospital's blood donation center on Level 2.",
    timestamp: "10:32 AM",
    isFromMe: true,
    isRead: true,
  },
  {
    id: 5,
    text: "Perfect, I have both. I can come in this afternoon around 2 PM if that works.",
    timestamp: "10:38 AM",
    isFromMe: false,
    isRead: true,
  },
  {
    id: 6,
    text: "That would be wonderful! I will inform the blood bank staff to expect you. Thank you so much for your willingness to help.",
    timestamp: "10:40 AM",
    isFromMe: true,
    isRead: true,
  },
  {
    id: 7,
    text: "Yes, I can come to the hospital today. What time works best?",
    timestamp: "10:45 AM",
    isFromMe: false,
    isRead: true,
  },
]

function getUrgencyBadge(urgency: string) {
  switch (urgency) {
    case "critical":
      return <Badge className="bg-red-600 text-white hover:bg-red-600">Critical</Badge>
    case "high":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Urgent</Badge>
    case "medium":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Medium</Badge>
    default:
      return <Badge variant="secondary">Normal</Badge>
  }
}

export default function ChatPage() {
  const [activeConversation, setActiveConversation] = useState(conversations[0])
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showConversationList, setShowConversationList] = useState(true)
  const [showRequestInfo, setShowRequestInfo] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: messages.length + 1,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isFromMe: true,
      isRead: false,
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.request.bloodType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Conversation List Sidebar */}
      <div
        className={cn(
          "flex w-full flex-col border-r border-border bg-card md:w-80 lg:w-96",
          showConversationList ? "flex" : "hidden md:flex"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link href="/requester/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Droplet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">Messages</span>
          </Link>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/requester/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className="border-b border-border p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => {
                setActiveConversation(conversation)
                setShowConversationList(false)
              }}
              className={cn(
                "flex w-full items-start gap-3 border-b border-border p-4 text-left transition-colors hover:bg-muted/50",
                activeConversation.id === conversation.id && "bg-muted/50"
              )}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={conversation.participant.avatar} alt={conversation.participant.name} />
                  <AvatarFallback>
                    {conversation.participant.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                {conversation.participant.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">
                    {conversation.participant.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {conversation.lastMessage.timestamp}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <Badge variant="outline" className="h-5 px-1.5 text-xs font-medium">
                    {conversation.participant.bloodType}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {conversation.request.id}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {conversation.lastMessage.isFromMe && "You: "}
                  {conversation.lastMessage.text}
                </p>
              </div>
              {conversation.unreadCount > 0 && (
                <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                  {conversation.unreadCount}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={cn(
          "flex flex-1 flex-col",
          !showConversationList ? "flex" : "hidden md:flex"
        )}
      >
        {/* Chat Header */}
        <div className="flex h-16 items-center justify-between border-b border-border bg-card px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowConversationList(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={activeConversation.participant.avatar} alt={activeConversation.participant.name} />
                <AvatarFallback>
                  {activeConversation.participant.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              {activeConversation.participant.isOnline && (
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-green-500" />
              )}
            </div>
            <div>
              <h2 className="font-medium text-foreground">
                {activeConversation.participant.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                {activeConversation.participant.isOnline ? "Online" : "Offline"} • {activeConversation.participant.bloodType} Donor
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" title="Call">
              <Phone className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              title="Request Info"
              onClick={() => setShowRequestInfo(!showRequestInfo)}
            >
              <Info className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Request Info Bar (Collapsible) */}
        {showRequestInfo && (
          <div className="border-b border-border bg-muted/30 p-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Request:</span>
                <span className="font-medium">{activeConversation.request.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplet className="h-4 w-4 text-primary" />
                <span className="font-bold text-primary">{activeConversation.request.bloodType}</span>
                {getUrgencyBadge(activeConversation.request.urgency)}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{activeConversation.request.hospital}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{activeConversation.request.location}</span>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto max-w-3xl space-y-4">
            {/* Date Separator */}
            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium text-muted-foreground">Today</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isFromMe ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 sm:max-w-[70%]",
                    message.isFromMe
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md bg-muted text-foreground"
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div
                    className={cn(
                      "mt-1 flex items-center justify-end gap-1 text-xs",
                      message.isFromMe ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}
                  >
                    <span>{message.timestamp}</span>
                    {message.isFromMe && (
                      message.isRead ? (
                        <CheckCheck className="h-3.5 w-3.5" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t border-border bg-card p-4">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="icon"
              className="h-10 w-10 shrink-0"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
          <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-muted-foreground">
            Messages are private between you and the donor. Please keep communication respectful.
          </p>
        </div>
      </div>

      {/* Mobile: No conversation selected state */}
      {showConversationList && (
        <div className="hidden flex-1 items-center justify-center bg-muted/20 md:flex">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Droplet className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-foreground">Select a conversation</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a conversation from the list to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
