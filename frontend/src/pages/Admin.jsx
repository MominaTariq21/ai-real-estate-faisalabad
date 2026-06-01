import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineHome, HiOutlineUsers, HiOutlineChartBar, HiOutlineCog, HiOutlineMail, HiOutlineReply } from 'react-icons/hi'
import { MdOutlineVerified } from 'react-icons/md'
import { FiEye, FiTrash2 } from 'react-icons/fi'
import useAuthStore from '../store/authStore'
import API from '../utils/axios'

const Admin = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [stats, setStats] = useState({ totalProperties: 0, totalUsers: 0, pendingProperties: 0, duplicateProperties: 0 })
  const [recentProperties, setRecentProperties] = useState([])
  const [contacts, setContacts] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [loadingReply, setLoadingReply] = useState(false)
  const [replySent, setReplySent] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    fetchStats()
    fetchContacts()
  }, [user])

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/properties?limit=5')
      setRecentProperties(data.properties || [])
      setStats(prev => ({ ...prev, totalProperties: data.total || 0 }))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchContacts = async () => {
    try {
      const { data } = await API.get('/contact')
      setContacts(data.contacts || [])
    } catch (error) {
      console.error('Error fetching contacts:', error)
    }
  }

  const handleVerify = async (id) => {
    try {
      await API.put(`/properties/${id}`, { isVerified: true })
      fetchStats()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return
    try {
      await API.delete(`/properties/${id}`)
      fetchStats()
    } catch (error) {
      console.error(error)
    }
  }

  const handleSelectContact = (contact) => {
    setSelectedContact(contact)
    setReplyText('')
    setReplySent(false)
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim() || !selectedContact) return

    try {
      setLoadingReply(true)
      const { data } = await API.put(`/contact/${selectedContact._id}/reply`, {
        reply: replyText,
      })

      if (data.success) {
        setReplySent(true)
        setReplyText('')
        // Update contact in list
        setContacts(prev => prev.map(c =>
          c._id === selectedContact._id
            ? { ...c, status: 'replied', adminReply: replyText, repliedAt: new Date() }
            : c
        ))
        setSelectedContact(prev => ({ ...prev, status: 'replied', adminReply: replyText }))
      }
    } catch (error) {
      alert('Error sending reply. Please try again.')
    } finally {
      setLoadingReply(false)
    }
  }

  const newMessagesCount = contacts.filter(c => c.status === 'new').length

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
      <div className="bg-navy text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Dashboard</p>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-white/50 text-sm mt-1">Manage properties, users and messages</p>

          {/* Tabs */}
          <div className="flex gap-4 mt-5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-gold text-navy' : 'text-white/60 hover:text-white'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${activeTab === 'messages' ? 'bg-gold text-navy' : 'text-white/60 hover:text-white'}`}
            >
              Contact Messages
              {newMessagesCount > 0 && (
                <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {newMessagesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
              {[
                { icon: <HiOutlineHome size={24} />, label: 'Total Properties', value: stats.totalProperties, color: 'bg-blue-50 text-blue-600' },
                { icon: <HiOutlineUsers size={24} />, label: 'Total Users', value: stats.totalUsers, color: 'bg-green-50 text-green-600' },
                { icon: <HiOutlineChartBar size={24} />, label: 'Pending Review', value: stats.pendingProperties, color: 'bg-yellow-50 text-yellow-600' },
                { icon: <MdOutlineVerified size={24} />, label: 'AI Duplicates', value: stats.duplicateProperties, color: 'bg-red-50 text-red-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-navy">{stat.value}</div>
                  <div className="text-gray-400 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { to: '/admin/properties', icon: <HiOutlineHome size={20} />, label: 'Manage Properties' },
                { to: '/admin/users', icon: <HiOutlineUsers size={20} />, label: 'Manage Users' },
                { to: '/properties', icon: <FiEye size={20} />, label: 'View Site' },
                { to: '/', icon: <HiOutlineCog size={20} />, label: 'Settings' },
              ].map((link, i) => (
                <Link key={i} to={link.to} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3 hover:border-gold transition-colors card-hover">
                  <div className="w-9 h-9 bg-gold/10 rounded-xl flex items-center justify-center text-gold">{link.icon}</div>
                  <span className="text-navy font-medium text-sm">{link.label}</span>
                </Link>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex justify-between items-center p-5 border-b border-gray-100">
                <h2 className="text-base font-bold text-navy">Recent Properties</h2>
                <Link to="/admin/properties" className="text-xs text-gold hover:underline">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Property</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Area</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Price</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentProperties.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-8 text-gray-400 text-sm">No properties found</td></tr>
                    ) : (
                      recentProperties.map(property => (
                        <tr key={property._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="text-navy font-medium text-sm line-clamp-1">{property.title}</div>
                            <div className="text-gray-400 text-xs">{property.priceType}</div>
                          </td>
                          <td className="px-5 py-3 text-sm text-gray-500">{property.area}</td>
                          <td className="px-5 py-3 text-sm font-semibold text-navy">PKR {property.price?.toLocaleString()}</td>
                          <td className="px-5 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${property.isVerified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {property.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex gap-2">
                              {!property.isVerified && (
                                <button onClick={() => handleVerify(property._id)} className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-lg hover:bg-green-100 transition-colors">Verify</button>
                              )}
                              <button onClick={() => handleDelete(property._id)} className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="grid md:grid-cols-2 gap-6">

            {/* Messages List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-bold text-navy">Contact Messages</h2>
                <span className="text-xs text-gray-400">{contacts.length} total</span>
              </div>

              {contacts.length === 0 ? (
                <div className="text-center py-16">
                  <HiOutlineMail size={40} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No messages yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                  {contacts.map(contact => (
                    <div
                      key={contact._id}
                      onClick={() => handleSelectContact(contact)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedContact?._id === contact._id ? 'bg-gold/5 border-l-2 border-gold' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-navy font-semibold text-sm">{contact.name}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                              contact.status === 'replied' ? 'bg-green-100 text-green-600' :
                              contact.status === 'read' ? 'bg-blue-100 text-blue-600' :
                              'bg-red-100 text-red-500'
                            }`}>
                              {contact.status === 'replied' ? 'Replied' : contact.status === 'read' ? 'Read' : 'New'}
                            </span>
                          </div>
                          <p className="text-xs text-gold font-medium mt-0.5">{contact.subject}</p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">{contact.message}</p>
                        </div>
                        <span className="text-xs text-gray-300 flex-shrink-0">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Detail + Reply */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              {!selectedContact ? (
                <div className="flex items-center justify-center h-full py-20">
                  <div className="text-center">
                    <HiOutlineMail size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Select a message to reply</p>
                  </div>
                </div>
              ) : (
                <div className="p-5">
                  {/* Contact Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center text-white font-bold">
                      {selectedContact.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-navy font-bold text-sm">{selectedContact.name}</div>
                      <div className="text-gray-400 text-xs">{selectedContact.email}</div>
                      {selectedContact.phone && <div className="text-gray-400 text-xs">{selectedContact.phone}</div>}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-xs text-gold font-semibold uppercase tracking-wide mb-2">{selectedContact.subject}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{selectedContact.message}</p>
                    <p className="text-xs text-gray-300 mt-3">{new Date(selectedContact.createdAt).toLocaleString()}</p>
                  </div>

                  {/* Already Replied */}
                  {selectedContact.adminReply && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                      <p className="text-xs text-green-600 font-semibold mb-1">✅ Your Reply (sent):</p>
                      <p className="text-sm text-gray-600">{selectedContact.adminReply}</p>
                    </div>
                  )}

                  {/* Reply Sent Success */}
                  {replySent && (
                    <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl mb-4">
                      ✅ Reply sent! User will see it in their Profile → My Messages.
                    </div>
                  )}

                  {/* Reply Form */}
                  {!replySent && (
                    <div>
                      <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-2">
                        {selectedContact.adminReply ? 'Update Reply' : 'Write Reply'}
                      </label>
                      <textarea
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Write your reply here..."
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-gold focus:bg-white transition-colors placeholder-gray-300 resize-none"
                      />
                      <button
                        onClick={handleReply}
                        disabled={!replyText.trim() || loadingReply}
                        className="w-full mt-3 btn-gold py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loadingReply ? (
                          <><div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> Sending...</>
                        ) : (
                          <><HiOutlineReply size={16} /> Send Reply</>
                        )}
                      </button>
                      <p className="text-center text-xs text-gray-300 mt-2">
                        User ko Profile → My Messages mein dikhega
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Admin

