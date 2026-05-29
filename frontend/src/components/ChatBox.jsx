import { Link } from 'react-router-dom'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import useAuthStore from '../store/authStore'

const ChatBox = ({ propertyId, ownerId, ownerName }) => {
  const { user } = useAuthStore()

  // Don't show chat to property owner
  if (!user || user._id === ownerId) return null

  const roomId = `${propertyId}_${user._id}_${ownerId}`

  return (
    <Link
      to={`/chat/${roomId}`}
      className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy/90 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
    >
      <IoChatbubbleEllipsesOutline size={16} />
      Chat with Owner
    </Link>
  )
}

export default ChatBox