import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineHome, HiOutlineUsers, HiOutlineChartBar, HiOutlineCog } from 'react-icons/hi'
import { MdOutlineVerified } from 'react-icons/md'
import { FiEye, FiTrash2 } from 'react-icons/fi'
import useAuthStore from '../store/authStore'
import API from '../utils/axios'

const Admin = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUsers: 0,
    pendingProperties: 0,
    duplicateProperties: 0,
  })
  const [recentProperties, setRecentProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    fetchStats()
  }, [user])

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/properties?limit=5')
      setRecentProperties(data.properties || [])
      setStats(prev => ({
        ...prev,
        totalProperties: data.total || 0,
      }))
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
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
          <p className="text-white/50 text-sm mt-1">Manage properties, users and AI detection</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Stats Cards */}
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

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { to: '/admin/properties', icon: <HiOutlineHome size={20} />, label: 'Manage Properties' },
            { to: '/admin/users', icon: <HiOutlineUsers size={20} />, label: 'Manage Users' },
            { to: '/properties', icon: <FiEye size={20} />, label: 'View Site' },
            { to: '/', icon: <HiOutlineCog size={20} />, label: 'Settings' },
          ].map((link, i) => (
            <Link
              key={i}
              to={link.to}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3 hover:border-gold transition-colors card-hover"
            >
              <div className="w-9 h-9 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                {link.icon}
              </div>
              <span className="text-navy font-medium text-sm">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Recent Properties */}
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
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400 text-sm">
                      No properties found
                    </td>
                  </tr>
                ) : (
                  recentProperties.map(property => (
                    <tr key={property._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="text-navy font-medium text-sm line-clamp-1">{property.title}</div>
                        <div className="text-gray-400 text-xs">{property.priceType}</div>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500">{property.area}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-navy">
                        PKR {property.price?.toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          property.isVerified
                            ? 'bg-green-100 text-green-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {property.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          {!property.isVerified && (
                            <button
                              onClick={() => handleVerify(property._id)}
                              className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-lg hover:bg-green-100 transition-colors"
                            >
                              Verify
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(property._id)}
                            className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Admin