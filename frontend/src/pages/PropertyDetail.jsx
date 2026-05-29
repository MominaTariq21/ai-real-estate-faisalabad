import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { HiOutlineLocationMarker, HiOutlineArrowLeft } from 'react-icons/hi'
import { MdOutlineVerified, MdOutlineKingBed, MdOutlineShower } from 'react-icons/md'
import { FiMaximize2, FiHeart, FiShare2, FiCheck, FiPhone } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'
import PropertyMap from '../components/PropertyMap'
import ChatBox from '../components/ChatBox'
import API from '../utils/axios'

const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [similarProperties, setSimilarProperties] = useState([])

  useEffect(() => {
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
    try {
      setLoading(true)
      const { data } = await API.get(`/properties/${id}`)
      setProperty(data.property)
      fetchSimilar(data.property.area, data.property._id)
    } catch (error) {
      console.error(error)
      navigate('/properties')
    } finally {
      setLoading(false)
    }
  }

  const fetchSimilar = async (area, currentId) => {
    try {
      const { data } = await API.get(`/properties?area=${area}&limit=3`)
      setSimilarProperties(
        data.properties?.filter(p => p._id !== currentId).slice(0, 3) || []
      )
    } catch (error) {
      console.error(error)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  if (!property) return null

  const images = property.images?.length > 0
    ? property.images.map(img => img.url)
    : ['https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80']

  return (
    <div className="min-h-screen bg-[#f8f9fc]">

      {/* Breadcrumb */}
      <div className="bg-navy text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-sm">
          <Link to="/" className="text-white/50 hover:text-white">Home</Link>
          <span className="text-white/30">/</span>
          <Link to="/properties" className="text-white/50 hover:text-white">Properties</Link>
          <span className="text-white/30">/</span>
          <span className="text-gold line-clamp-1">{property.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Back Button */}
        <Link to="/properties" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy mb-6 transition-colors">
          <HiOutlineArrowLeft size={16} />
          Back to Properties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Side */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="relative h-80 md:h-96">
                <img
                  src={images[activeImg]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-lg ${
                  property.purpose === 'For Sale' ? 'bg-gold text-navy' : 'bg-green-500 text-white'
                }`}>
                  {property.purpose}
                </span>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors backdrop-blur-sm ${liked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-500'}`}
                  >
                    <FiHeart size={15} className={liked ? 'fill-white' : ''} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-500 hover:text-navy"
                  >
                    {copied ? <FiCheck size={15} className="text-green-500" /> : <FiShare2 size={15} />}
                  </button>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2.5 py-1 rounded-lg">
                  {activeImg + 1} / {images.length}
                </div>
              </div>
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${activeImg === i ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <h1 className="text-xl font-bold text-navy">{property.title}</h1>
                  <div className="flex items-center gap-1.5 mt-2">
                    <HiOutlineLocationMarker size={14} className="text-gold" />
                    <span className="text-sm text-gray-400">{property.area}, Faisalabad</span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs text-gold font-medium bg-gold/10 px-3 py-1.5 rounded-xl">
                  <MdOutlineVerified size={14} /> AI Verified
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                {property.beds > 0 && (
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <MdOutlineKingBed size={22} className="text-gold mx-auto mb-1" />
                    <div className="text-navy font-bold text-sm">{property.beds}</div>
                    <div className="text-gray-400 text-xs">Bedrooms</div>
                  </div>
                )}
                {property.baths > 0 && (
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <MdOutlineShower size={22} className="text-gold mx-auto mb-1" />
                    <div className="text-navy font-bold text-sm">{property.baths}</div>
                    <div className="text-gray-400 text-xs">Bathrooms</div>
                  </div>
                )}
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <FiMaximize2 size={20} className="text-gold mx-auto mb-1" />
                  <div className="text-navy font-bold text-sm">{property.size}</div>
                  <div className="text-gray-400 text-xs">Area</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-base font-bold text-navy mb-3">Description</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            {property.features?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-base font-bold text-navy mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {property.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                      <div className="w-5 h-5 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiCheck size={11} className="text-gold" />
                      </div>
                      <span className="text-xs text-gray-600 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-base font-bold text-navy mb-4">Location on Map</h2>
              {property.location?.lat && property.location?.lng ? (
                <div className="h-64 rounded-xl overflow-hidden">
                  <PropertyMap
                    lat={property.location.lat}
                    lng={property.location.lng}
                    title={property.title}
                    price={`PKR ${property.price?.toLocaleString()}`}
                    location={property.area}
                  />
                </div>
              ) : (
                <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center">
                  <div className="text-center">
                    <HiOutlineLocationMarker size={32} className="text-gold mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">{property.area}, Faisalabad</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 mt-3">
                <HiOutlineLocationMarker size={14} className="text-gold" />
                <span className="text-sm text-gray-500">
                  {property.location?.address || `${property.area}, Faisalabad`}
                </span>
              </div>
            </div>

          </div>

          {/* Right Side */}
          <div className="space-y-5">

            {/* Price Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm sticky top-20">
              <div className="text-2xl font-black text-navy">
                PKR {property.price?.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {property.priceType} • {property.purpose}
              </div>
              <div className="text-xs text-gray-300 mt-1">
                Posted {new Date(property.createdAt).toLocaleDateString()}
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4">
                {/* Owner Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-navy rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {property.owner?.name?.charAt(0).toUpperCase() || 'O'}
                  </div>
                  <div>
                    <div className="text-navy font-semibold text-sm">
                      {property.owner?.name || 'Property Owner'}
                    </div>
                    <div className="text-gray-400 text-xs capitalize">
                      {property.owner?.role || 'Seller'}
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${property.owner?.phone || '923001234567'}?text=I am interested in: ${property.title}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-sm font-semibold transition-colors mb-2"
                >
                  <BsWhatsapp size={16} />
                  WhatsApp Owner
                </a>

                {/* Call */}
                <a
                  href={`tel:+${property.owner?.phone || '923001234567'}`}
                  className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy/90 text-white py-3 rounded-xl text-sm font-semibold transition-colors mb-2"
                >
                  <FiPhone size={14} />
                  Call Owner
                </a>

                {/* Chat */}
                <ChatBox
                  propertyId={property._id}
                  ownerId={property.owner?._id}
                  ownerName={property.owner?.name}
                />

                {/* Save */}
                <button
                  onClick={() => setLiked(!liked)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors border mt-2 ${
                    liked
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'border-gray-200 text-gray-500 hover:border-gold hover:text-gold'
                  }`}
                >
                  <FiHeart size={14} className={liked ? 'fill-red-500' : ''} />
                  {liked ? 'Saved' : 'Save Property'}
                </button>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-navy mb-4">Property Details</h3>
              <div className="space-y-3">
                {[
                  { label: 'Type', value: property.priceType },
                  { label: 'Purpose', value: property.purpose },
                  { label: 'Area Size', value: property.size },
                  { label: 'Location', value: property.area },
                  { label: 'Bedrooms', value: property.beds || 'N/A' },
                  { label: 'Bathrooms', value: property.baths || 'N/A' },
                  { label: 'Views', value: property.views || 0 },
                  { label: 'Status', value: property.status || 'Active' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-400">{item.label}</span>
                    <span className="text-xs font-semibold text-navy capitalize">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">More Options</p>
                <h2 className="text-xl font-bold text-navy">Similar Properties</h2>
              </div>
              <Link to="/properties" className="text-sm text-gold font-medium hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {similarProperties.map((p, i) => (
                <Link to={`/properties/${p._id}`} key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover group">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400&q=80'}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-lg ${p.purpose === 'For Sale' ? 'bg-gold text-navy' : 'bg-green-500 text-white'}`}>
                      {p.purpose}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="text-base font-bold text-navy">PKR {p.price?.toLocaleString()}</div>
                    <h3 className="text-sm text-gray-600 mt-1 line-clamp-1">{p.title}</h3>
                    <div className="flex items-center gap-1 mt-1.5">
                      <HiOutlineLocationMarker size={12} className="text-gold" />
                      <span className="text-xs text-gray-400">{p.area}, Faisalabad</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default PropertyDetail