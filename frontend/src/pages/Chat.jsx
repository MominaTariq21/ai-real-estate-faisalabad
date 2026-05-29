import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { io } from 'socket.io-client'
import { HiOutlineArrowLeft, HiOutlinePaperAirplane } from 'react-icons/hi'
import { BsCheckAll } from 'react-icons/bs'
import useAuthStore from '../store/authStore'

const Chat = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Connect to socket
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket'],
    })

    newSocket.on('connect', () => {
      setIsConnected(true)
      newSocket.emit('join_room', roomId)
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
    })

    newSocket.on('receive_message', (data) => {
      setMessages(prev => [...prev, data])
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [roomId, user])

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!message.trim() || !socket) return

    const msgData = {
      room: roomId,
      message: message.trim(),
      sender: user._id,
      senderName: user.name,
      timestamp: new Date().toISOString(),
    }

    socket.emit('send_message', msgData)
    setMessages(prev => [...prev, { ...msgData, isMine: true }])
    setMessage('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">

      {/* Header */}
      <div className="bg-navy text-white px-4 py-4 flex items-center gap-3 sticky top-16 z-40">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <HiOutlineArrowLeft size={16} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gold rounded-xl flex items-center justify-center text-navy font-bold text-sm">
            P
          </div>
          <div>
            <div className="text-white font-semibold text-sm">Property Chat</div>
            <div className="flex items-center gap-1.5">
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

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.isMine || msg.sender === user._id ? 'justify-end' : 'justify-start'}`}
          >
            {/* Other person avatar */}
            {!msg.isMine && msg.sender !== user._id && (
              <div className="w-7 h-7 bg-navy rounded-lg flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1">
                {msg.senderName?.charAt(0).toUpperCase()}
              </div>
            )}

            <div className={`max-w-xs lg:max-w-md ${msg.isMine || msg.sender === user._id ? 'items-end' : 'items-start'} flex flex-col`}>
              {/* Sender name */}
              {!msg.isMine && msg.sender !== user._id && (
                <span className="text-xs text-gray-400 mb-1 ml-1">{msg.senderName}</span>
              )}

              {/* Message bubble */}
              <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                msg.isMine || msg.sender === user._id
                  ? 'bg-navy text-white rounded-tr-sm'
                  : 'bg-white text-gray-700 border border-gray-100 rounded-tl-sm shadow-sm'
              }`}>
                {msg.message}
              </div>

              {/* Time + Read */}
              <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-xs text-gray-300">
                  {formatTime(msg.timestamp)}
                </span>
                {(msg.isMine || msg.sender === user._id) && (
                  <BsCheckAll size={14} className="text-gold" />
                )}
              </div>
            </div>
          </div>
        ))}

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