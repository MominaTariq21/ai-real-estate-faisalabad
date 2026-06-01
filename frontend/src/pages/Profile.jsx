import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineChatAlt2 } from 'react-icons/hi'
import { MdOutlineVerified } from 'react-icons/md'
import { FiEdit2, FiLogOut } from 'react-icons/fi'
import useAuthStore from '../store/authStore'
import API from '../utils/axios'

const Profile = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('profile') // profile | messages
  const [myMessages, setMyMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(false)

  if (!user) {
    navigate('/login')
    return null
  }

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMyMessages()
    }
  }, [activeTab])

  const fetchMyMessages = async () => {
    try {
      setLoadingMessages(true)
      const { data } = await API.get('/contact/my-messages')
      setMyMessages(data.messages || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc]">

      {/* Header */}
      <div className="bg-navy text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Account</p>
          <h1 className="text-3xl font-bold">My Profile</h1>

          {/* Tabs */}
          <div className="flex gap-4 mt-5">
            <button
              onClick={() => setActiveTab('profile')}
              className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
                activeTab === 'profile' ? 'bg-gold text-navy' : 'text-white/60 hover:text-white'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
                activeTab === 'messages' ? 'bg-gold text-navy' : 'text-white/60 hover:text-white'
              }`}
            >
              <HiOutlineChatAlt2 size={16} />
              My Messages
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ── PROFILE TAB ── */}
        {activeTab === 'profile' && (
          <div className="grid md:grid-cols-3 gap-6">

            {/* Left — Profile Card */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-3xl"
                  style={{ backgroundColor: '#1A2744' }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-navy font-bold text-lg">{user.name}</h2>
                <p className="text-gray-400 text-sm mt-0.5">{user.email}</p>
                <span className="inline-block bg-gold/10 text-gold text-xs px-3 py-1 rounded-full mt-2 capitalize font-medium">
                  {user.role}
                </span>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <MdOutlineVerified size={14} className="text-gold" />
                  <span className="text-xs text-gray-400">Verified Account</span>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-2">
                <button
                  onClick={() => navigate('/my-properties')}
                  className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2"
                >
                  🏠 My Properties
                </button>
                <button
                  onClick={() => navigate('/add-property')}
                  className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2"
                >
                  ➕ Add Property
                </button>
                <button
                  onClick={() => navigate('/properties')}
                  className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2"
                >
                  🔍 Browse Properties
                </button>
                <button
                  onClick={() => setActiveTab('messages')}
                  className="w-full text-left px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-2"
                >
                  💬 My Messages
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
                >
                  <FiLogOut size={14} /> Logout
                </button>
              </div>
            </div>

            {/* Right — Profile Details */}
            <div className="md:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-base font-bold text-navy">Personal Information</h3>
                  <button
                    onClick={() => setEditing(!editing)}
                    className="flex items-center gap-1.5 text-xs text-gold border border-gold/30 px-3 py-1.5 rounded-lg hover:bg-gold/5 transition-colors"
                  >
                    <FiEdit2 size={12} /> {editing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Full Name</label>
                    <div className="relative">
                      <HiOutlineUser size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        defaultValue={user.name}
                        disabled={!editing}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-gold disabled:opacity-60 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Email</label>
                    <div className="relative">
                      <HiOutlineMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        defaultValue={user.email}
                        disabled
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none opacity-60"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Phone</label>
                    <div className="relative">
                      <HiOutlinePhone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        defaultValue={user.phone}
                        disabled={!editing}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-gold disabled:opacity-60 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Role</label>
                    <input
                      type="text"
                      defaultValue={user.role}
                      disabled
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none opacity-60 capitalize"
                    />
                  </div>

                  {editing && (
                    <button className="w-full btn-gold py-3 rounded-xl text-sm font-semibold">
                      Save Changes
                    </button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { num: '0', label: 'Properties Listed' },
                  { num: '0', label: 'Favorites Saved' },
                  { num: myMessages.length || '0', label: 'Messages' },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                    <div className="text-2xl font-bold text-navy">{s.num}</div>
                    <div className="text-gray-400 text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── MY MESSAGES TAB ── */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-navy mb-4">My Contact Messages</h2>

            {loadingMessages ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
              </div>
            ) : myMessages.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="text-5xl mb-3">💬</div>
                <h3 className="text-navy font-bold">No Messages Yet</h3>
                <p className="text-gray-400 text-sm mt-1">
                  You haven't sent any contact messages yet
                </p>
              </div>
            ) : (
              myMessages.map(msg => (
                <div key={msg._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                  {/* User Message */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gold font-semibold text-sm">{msg.subject}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        msg.status === 'replied'
                          ? 'bg-green-100 text-green-600'
                          : msg.status === 'read'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {msg.status === 'replied' ? '✅ Replied' : msg.status === 'read' ? '👁 Read' : '🕐 Pending'}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-3">
                      <p className="text-xs text-gray-400 mb-1">Your message:</p>
                      <p className="text-sm text-gray-600">{msg.message}</p>
                      <p className="text-xs text-gray-300 mt-2">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Admin Reply */}
                    {msg.adminReply && (
                      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4">
                        <p className="text-xs text-gold font-semibold mb-1">Admin Reply:</p>
                        <p className="text-sm text-gray-700">{msg.adminReply}</p>
                        <p className="text-xs text-gray-300 mt-2">
                          {new Date(msg.repliedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default Profile
