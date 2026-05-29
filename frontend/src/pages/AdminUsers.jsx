import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineSearch } from 'react-icons/hi'
import { MdOutlineVerified } from 'react-icons/md'
import { FiTrash2 } from 'react-icons/fi'
import useAuthStore from '../store/authStore'
import API from '../utils/axios'

const AdminUsers = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    fetchUsers()
  }, [user])

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/auth/users')
      setUsers(data.users || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#f8f9fc]">

      {/* Header */}
      <div className="bg-navy text-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Admin</p>
            <h1 className="text-3xl font-bold">Manage Users</h1>
            <p className="text-white/50 text-sm mt-1">
              Total: <span className="text-gold font-semibold">{users.length}</span> users
            </p>
          </div>
          <Link to="/admin" className="btn-gold px-4 py-2 rounded-xl text-sm">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Search */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
            <HiOutlineSearch size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">User</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Email</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Phone</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Role</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Joined</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filtered.map(u => (
                      <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                              style={{ backgroundColor: '#1A2744' }}
                            >
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-navy font-medium text-sm">{u.name}</div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-500">{u.email}</td>
                        <td className="px-5 py-3 text-sm text-gray-500">{u.phone}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-600' :
                            u.role === 'seller' ? 'bg-blue-100 text-blue-600' :
                            u.role === 'agent' ? 'bg-gold/10 text-gold' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3">
                          <button
                            className="w-7 h-7 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center text-red-500 transition-colors"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers