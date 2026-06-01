import { Link, useNavigate } from 'react-router-dom'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import useAuthStore from '../store/authStore'
import API from '../utils/axios'
import { useState } from 'react'

const ChatBox = ({ propertyId, ownerId, ownerName }) => {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Don't show chat to property owner
  if (!user || user._id === ownerId) return null

  const handleStartChat = async () => {
    setLoading(true)
    try {
      const { data } = await API.post('/chat/start', {
        propertyId,
        ownerId,
      })
      navigate(`/chat/${data.roomId}`)
    } catch (error) {
      console.error('Error starting chat:', error)
      alert('Unable to start chat. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleStartChat}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy/90 text-white py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-70"
    >
      <IoChatbubbleEllipsesOutline size={16} />
      {loading ? 'Starting Chat...' : 'Chat with Owner'}
    </button>
  )
}

export default ChatBox