import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineLocationMarker, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi'
import { MdOutlineVerified } from 'react-icons/md'
import { FiMaximize2, FiEye } from 'react-icons/fi'
import useAuthStore from '../store/authStore'
import API from '../utils/axios'

const MyProperties = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  if (!user) {
    navigate('/login')
    return null
  }

  useEffect(() => {
    fetchMyProperties()
  }, [])

  const fetchMyProperties = async () => {
    try {
      const { data } = await API.get('/properties/my/properties')
      setProperties(data.properties)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return
    setDeleting(id)
    try {
      await API.delete(`/properties/${id}`)
      setProperties(properties.filter(p => p._id !== id))
    } catch (error) {
      console.error(error)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc]">

      {/* Header */}
      <div className="bg-navy text-white py-10">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Dashboard</p>
            <h1 className="text-3xl font-bold">My Properties</h1>
            <p className="text-white/50 text-sm mt-1">Manage your property listings</p>
          </div>
          <Link
            to="/add-property"
            className="btn-gold flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm"
          >
            <HiOutlinePlus size={16} /> Add Property
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Loading your properties...</p>
          </div>
        ) : properties.length === 0 ? (

          /* Empty State */
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-navy font-bold text-xl mb-2">No Properties Yet</h3>
            <p className="text-gray-400 text-sm mb-6">You haven't listed any properties yet.</p>
            <Link
              to="/add-property"
              className="inline-flex items-center gap-2 btn-gold px-6 py-3 rounded-xl text-sm"
            >
              <HiOutlinePlus size={16} /> Add Your First Property
            </Link>
          </div>

        ) : (

          /* Properties Grid */
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-500">
                Total: <span className="font-semibold text-navy">{properties.length}</span> properties
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {properties.map(property => (
                <div key={property._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover">

                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    {property.images?.length > 0 ? (
                      <img
                        src={property.images[0].url}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-4xl">🏠</span>
                      </div>
                    )}
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                      property.purpose === 'For Sale' ? 'bg-gold text-navy' : 'bg-green-500 text-white'
                    }`}>
                      {property.purpose}
                    </span>
                    <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                      property.isVerified ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                    }`}>
                      {property.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="text-base font-bold text-navy">
                      PKR {property.price?.toLocaleString()}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 mt-1 line-clamp-1">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <HiOutlineLocationMarker size={12} className="text-gold" />
                      <span className="text-xs text-gray-400">{property.area}, Faisalabad</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiEye size={12} /> {property.views || 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <FiMaximize2 size={12} /> {property.size}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                      <Link
                        to={`/properties/${property._id}`}
                        className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-center py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <FiEye size={12} /> View
                      </Link>
                      <Link
                        to={`/edit-property/${property._id}`}
                        className="flex-1 bg-navy/5 hover:bg-navy/10 text-navy text-center py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <HiOutlinePencil size={12} /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(property._id)}
                        disabled={deleting === property._id}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 text-center py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                      >
                        <HiOutlineTrash size={12} />
                        {deleting === property._id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyProperties