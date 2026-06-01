import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { HiOutlineArrowLeft, HiOutlinePaperAirplane } from 'react-icons/hi'
import { BsCheckAll } from 'react-icons/bs'
import useAuthStore from '../store/authStore'
import API from '../utils/axios'

const Chat = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [conversation, setConversation] = useState(null)
  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    initializeChat()
    setupSocket()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [roomId, user])

  const initializeChat = async () => {
    try {
      setLoading(true)

      // Get conversations to find current one
      const convResponse = await API.get('/chat/conversations')
      const currentConv = convResponse.data.conversations?.find(c => c.roomId === roomId)
      if (currentConv) setConversation(currentConv)

      // Get messages
      const messagesResponse = await API.get(`/chat/messages/${roomId}`)
      setMessages(messagesResponse.data.messages || [])
    } catch (error) {
      console.error('Error initializing chat:', error)
    } finally {
      setLoading(false)
    }
  }

  const setupSocket = () => {
    if (socketRef.current?.connected) return

    const newSocket = io('http://localhost:5000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    newSocket.on('connect', () => {
      setIsConnected(true)
      newSocket.emit('join_room', roomId)
    })

    newSocket.on('disconnect', () => setIsConnected(false))

    newSocket.on('receive_message', (data) => {
      setMessages(prev => {
        const exists = prev.some(msg =>
          msg._id === data._id ||
          (msg.message === data.message &&
            (msg.sender === data.sender || msg.sender?._id === data.sender) &&
            msg.createdAt === data.createdAt)
        )
        if (exists) return prev
        return [...prev, data]
      })

      // Mark as read if received from other person
      const senderId = data.sender?._id || data.sender
      if (senderId !== user._id && socketRef.current) {
        socketRef.current.emit('mark_read', { roomId, userId: user._id })
      }
    })

    socketRef.current = newSocket
  }

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ✅ FIXED: Extract receiverId properly from populated participants
  const getReceiverId = () => {
    if (conversation?.participants) {
      const other = conversation.participants.find(p => {
        const pId = p._id || p  // handle both object and string
        return pId.toString() !== user._id.toString()
      })
      return other?._id || other
    }

    // Fallback: check from messages
    if (messages.length > 0) {
      const msg = messages[0]
      const senderId = msg.sender?._id || msg.sender
      const receiverId = msg.receiver?._id || msg.receiver
      return senderId?.toString() === user._id.toString() ? receiverId : senderId
    }

    return null
  }

  const sendMessage = () => {
    if (!message.trim() || !socketRef.current) return

    const receiverId = getReceiverId()

    if (!receiverId) {
      alert('Unable to determine chat recipient. Please refresh the page.')
      return
    }

    if (!conversation?.propertyId) {
      alert('Property information missing. Please refresh.')
      return
    }

    const msgData = {
      roomId,
      message: message.trim(),
      sender: user._id,
      receiver: receiverId?._id || receiverId,
      propertyId: conversation.propertyId?._id || conversation.propertyId,
      senderName: user.name,
      timestamp: new Date().toISOString(),
    }

    socketRef.current.emit('send_message', msgData)
    setMessage('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getOtherParticipantName = () => {
    if (conversation?.participants) {
      const other = conversation.participants.find(p => {
        const pId = p._id || p
        return pId.toString() !== user._id.toString()
      })
      return other?.name || 'Property Owner'
    }
    return 'Property Chat'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">

      {/* Header */}
      <div className="bg-navy text-white px-4 py-4 flex items-center gap-3 sticky top-16 z-40">
        <button
          onClick={() => navigate('/inbox')}
          className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <HiOutlineArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-navy font-bold text-sm">
            {getOtherParticipantName().charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-white font-semibold text-sm">
              {getOtherParticipantName()}
            </div>
            {conversation?.propertyTitle && (
              <div className="text-white/50 text-xs">
                Regarding: {conversation.propertyTitle.substring(0, 30)}...
              </div>
            )}
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-white/50 text-xs">
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 space-y-3">

        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">💬</div>
            <h3 className="text-navy font-bold">Start the Conversation</h3>
            <p className="text-gray-400 text-sm mt-1">
              Send a message to connect with the property owner
            </p>
          </div>
        )}

        {messages.map((msg, idx) => {
          const senderId = msg.sender?._id || msg.sender
          const isMyMessage = senderId?.toString() === user._id?.toString()
          const senderName = msg.sender?.name || msg.senderName || 'User'

          return (
            <div
              key={msg._id || idx}
              className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
            >
              {!isMyMessage && (
                <div className="w-7 h-7 bg-navy rounded-lg flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1">
                  {senderName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className={`max-w-xs lg:max-w-md ${isMyMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                {!isMyMessage && (
                  <span className="text-xs text-gray-400 mb-1 ml-1">{senderName}</span>
                )}

                <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                  isMyMessage
                    ? 'bg-navy text-white rounded-tr-sm'
                    : 'bg-white text-gray-700 border border-gray-100 rounded-tl-sm shadow-sm'
                }`}>
                  {msg.message}
                </div>

                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-xs text-gray-300">
                    {formatTime(msg.createdAt || msg.timestamp)}
                  </span>
                  {isMyMessage && (
                    <BsCheckAll size={14} className={msg.isRead ? 'text-gold' : 'text-gray-300'} />
                  )}
                </div>
              </div>
            </div>
          )
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 sticky bottom-0">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 gap-2 focus-within:border-gold transition-colors">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none resize-none placeholder-gray-400"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="w-11 h-11 bg-navy hover:bg-navy/90 disabled:opacity-40 text-white rounded-2xl flex items-center justify-center transition-colors flex-shrink-0"
          >
            <HiOutlinePaperAirplane size={18} className="rotate-90" />
          </button>
        </div>
        <p className="text-center text-xs text-gray-300 mt-2">
          Press Enter to send
        </p>
      </div>

    </div>
  )
}

export default Chat
