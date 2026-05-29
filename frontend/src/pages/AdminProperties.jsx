import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineSearch, HiOutlineLocationMarker } from 'react-icons/hi'
import { MdOutlineVerified } from 'react-icons/md'
import { FiEye, FiTrash2, FiCheck } from 'react-icons/fi'
import useAuthStore from '../store/authStore'
import API from '../utils/axios'

const AdminProperties = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    fetchProperties()
  }, [user])

  const fetchProperties = async () => {
    try {
      const { data } = await API.get('/properties?limit=100')
      setProperties(data.properties || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (id) => {
    try {
      await API.put(`/properties/${id}`, { isVerified: true })
      setProperties(properties.map(p =>
        p._id === id ? { ...p, isVerified: true } : p
      ))
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return
    try {
      await API.delete(`/properties/${id}`)
      setProperties(properties.filter(p => p._id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  const filtered = properties.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.area?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' ||
      (filter === 'Verified' && p.isVerified) ||
      (filter === 'Pending' && !p.isVerified) ||
      (filter === 'Duplicate' && p.isDuplicate)
    return matchSearch && matchFilter
  })

  return (
    <div className="min-h-screen bg-[#f8f9fc]">

      {/* Header */}
      <div className="bg-navy text-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Admin</p>
            <h1 className="text-3xl font-bold">Manage Properties</h1>
            <p className="text-white/50 text-sm mt-1">
              Total: <span className="text-gold font-semibold">{properties.length}</span> properties
            </p>
          </div>
          <Link to="/admin" className="btn-gold px-4 py-2 rounded-xl text-sm">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
            <HiOutlineSearch size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Verified', 'Pending', 'Duplicate'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                  filter === f
                    ? 'bg-navy text-gold'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Properties Table */}
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
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Property</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Area</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Price</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Views</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                        No properties found
                      </td>
                    </tr>
                  ) : (
                    filtered.map(property => (
                      <tr key={property._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            {property.images?.[0]?.url ? (
                              <img
                                src={property.images[0].url}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                🏠
                              </div>
                            )}
                            <div>
                              <div className="text-navy font-medium text-sm line-clamp-1 max-w-xs">
                                {property.title}
                              </div>
                              <div className="text-gray-400 text-xs">{property.purpose}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <HiOutlineLocationMarker size={12} className="text-gold" />
                            {property.area}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-500">{property.priceType}</td>
                        <td className="px-5 py-3 text-sm font-semibold text-navy">
                          PKR {property.price?.toLocaleString()}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-col gap-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-fit ${
                              property.isVerified
                                ? 'bg-green-100 text-green-600'
                                : 'bg-yellow-100 text-yellow-600'
                            }`}>
                              {property.isVerified ? '✅ Verified' : '⏳ Pending'}
                            </span>
                            {property.isDuplicate && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-600 w-fit">
                                ⚠️ Duplicate
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-500">
                          {property.views || 0}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex gap-2">
                            <Link
                              to={`/properties/${property._id}`}
                              className="w-7 h-7 bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 transition-colors"
                            >
                              <FiEye size={13} />
                            </Link>
                            {!property.isVerified && (
                              <button
                                onClick={() => handleVerify(property._id)}
                                className="w-7 h-7 bg-green-50 hover:bg-green-100 rounded-lg flex items-center justify-center text-green-600 transition-colors"
                              >
                                <FiCheck size={13} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(property._id)}
                              className="w-7 h-7 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center text-red-500 transition-colors"
                            >
                              <FiTrash2 size={13} />
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
        )}
      </div>
    </div>
  )
}

export default AdminProperties