import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineChat, HiOutlineArrowRight } from 'react-icons/hi'
import useAuthStore from '../store/authStore'
import API from '../utils/axios'

const Inbox = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchConversations()
  }, [user])

  const fetchConversations = async () => {
    try {
      const { data } = await API.get('/chat/conversations')
      setConversations(data.conversations || [])
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getOtherParticipant = (conversation) => {
    const other = conversation.participants?.find(p => p._id !== user._id)
    return other || { name: 'User', email: '' }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc]">

      {/* Header */}
      <div className="bg-navy text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Messages</p>
          <h1 className="text-3xl font-bold">Inbox</h1>
          <p className="text-white/50 text-sm mt-1">Your conversations with property owners and buyers</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {conversations.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-navy font-bold text-xl mb-2">No Messages Yet</h3>
            <p className="text-gray-400 text-sm mb-6">
              Start a conversation by contacting property owners
            </p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 btn-gold px-6 py-3 rounded-xl text-sm"
            >
              Browse Properties <HiOutlineArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => {
              const otherUser = getOtherParticipant(conv)
              const unreadCount = conv.unreadCount || 0
              
              return (
                <Link
                  key={conv._id}
                  to={`/chat/${conv.roomId}`}
                  className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all card-hover"
                >
                  {/* Avatar */}
                  <div className="w-14 h-14 bg-navy rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {otherUser.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-navy font-bold text-sm truncate">
                        {otherUser.name}
                      </h3>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(conv.lastMessageTime).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {conv.propertyTitle}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                  </div>

                  {/* Unread Badge */}
                  {unreadCount > 0 && (
                    <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center text-navy text-xs font-bold flex-shrink-0">
                      {unreadCount}
                    </div>
                  )}

                  <HiOutlineChat className="text-gray-300 flex-shrink-0" size={18} />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Inbox