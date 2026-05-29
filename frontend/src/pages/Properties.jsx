
import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { HiOutlineLocationMarker, HiOutlineSearch, HiViewGrid, HiViewList } from 'react-icons/hi'
import { MdOutlineVerified, MdOutlineKingBed, MdOutlineShower } from 'react-icons/md'
import { FiMaximize2, FiHeart, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'
import API from '../utils/axios'

const PropertyCard = ({ property, viewMode }) => {
  const [liked, setLiked] = useState(false)
  const image = property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=80'

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover flex group">
        <div className="relative overflow-hidden w-56 flex-shrink-0">
          <img src={image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-lg ${property.purpose === 'For Sale' ? 'bg-gold text-navy' : 'bg-green-500 text-white'}`}>
            {property.purpose}
          </span>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-lg font-bold text-navy">PKR {property.price?.toLocaleString()}</div>
                <div className="text-xs text-gray-400">{property.priceType}</div>
              </div>
              <span className="flex items-center gap-1 text-xs text-gold font-medium bg-gold/10 px-2 py-1 rounded-lg">
                <MdOutlineVerified size={12} /> Verified
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-800 mt-2">{property.title}</h3>
            <div className="flex items-center gap-1 mt-1">
              <HiOutlineLocationMarker size={12} className="text-gold" />
              <span className="text-xs text-gray-400">{property.area}, Faisalabad</span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              {property.beds > 0 && <span className="flex items-center gap-1"><MdOutlineKingBed size={13} /> {property.beds} Beds</span>}
              {property.baths > 0 && <span className="flex items-center gap-1"><MdOutlineShower size={13} /> {property.baths} Baths</span>}
              <span className="flex items-center gap-1"><FiMaximize2 size={12} /> {property.size}</span>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Link to={`/properties/${property._id}`} className="flex-1 bg-navy text-white text-center py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-navy/90 transition-colors">
              View Detail
            </Link>
            <a href={`https://wa.me/923001234567?text=Interested in ${property.title}`} target="_blank" rel="noreferrer" className="w-9 h-9 bg-green-500 hover:bg-green-600 rounded-xl flex items-center justify-center transition-colors">
              <BsWhatsapp size={14} className="text-white" />
            </a>
            <button onClick={() => setLiked(!liked)} className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${liked ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'}`}>
              <FiHeart size={13} className={liked ? 'fill-red-500' : ''} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover group">
      <div className="relative overflow-hidden h-48">
        <img src={image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-lg ${property.purpose === 'For Sale' ? 'bg-gold text-navy' : 'bg-green-500 text-white'}`}>
          {property.purpose}
        </span>
        {property.isFeatured && (
          <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/90 text-navy">Featured</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-base font-bold text-navy">PKR {property.price?.toLocaleString()}</div>
            <div className="text-xs text-gray-400">{property.priceType}</div>
          </div>
          <span className="flex items-center gap-1 text-xs text-gold font-medium bg-gold/10 px-2 py-1 rounded-lg">
            <MdOutlineVerified size={12} /> Verified
          </span>
        </div>
        <h3 className="text-sm font-semibold text-gray-800 mt-2 line-clamp-2">{property.title}</h3>
        <div className="flex items-center gap-1 mt-1">
          <HiOutlineLocationMarker size={12} className="text-gold flex-shrink-0" />
          <span className="text-xs text-gray-400">{property.area}, Faisalabad</span>
        </div>
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          {property.beds > 0 && <span className="flex items-center gap-1"><MdOutlineKingBed size={13} /> {property.beds} Beds</span>}
          {property.baths > 0 && <span className="flex items-center gap-1"><MdOutlineShower size={13} /> {property.baths} Baths</span>}
          <span className="flex items-center gap-1"><FiMaximize2 size={12} /> {property.size}</span>
        </div>
        <div className="flex gap-2 mt-3">
          <Link to={`/properties/${property._id}`} className="flex-1 bg-navy text-white text-center py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-navy/90 transition-colors">
            View Detail
          </Link>
          <a href={`https://wa.me/923001234567?text=Interested in ${property.title}`} target="_blank" rel="noreferrer" className="w-9 h-9 bg-green-500 hover:bg-green-600 rounded-xl flex items-center justify-center transition-colors">
            <BsWhatsapp size={14} className="text-white" />
          </a>
          <button onClick={() => setLiked(!liked)} className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${liked ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'}`}>
            <FiHeart size={13} className={liked ? 'fill-red-500' : ''} />
          </button>
        </div>
      </div>
    </div>
  )
}

const Properties = () => {
  const [searchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // ✅ FIX: Filters seedha searchParams se read karo — alag state nahi
  const search  = searchParams.get('search')  || ''
  const purpose = searchParams.get('purpose') || ''
  const type    = searchParams.get('type')    || ''
  const area    = searchParams.get('area')    || ''

  // Local filter state (user jab page pe filters change kare)
  const [localSearch,  setLocalSearch]  = useState(search)
  const [localPurpose, setLocalPurpose] = useState(purpose)
  const [localType,    setLocalType]    = useState(type)
  const [localArea,    setLocalArea]    = useState(area)

  // ✅ FIX: Ek hi effect — URL params change hone par local state sync karo
  useEffect(() => {
    setLocalSearch(searchParams.get('search')  || '')
    setLocalPurpose(searchParams.get('purpose') || '')
    setLocalType(searchParams.get('type')    || '')
    setLocalArea(searchParams.get('area')    || '')
    setCurrentPage(1)
  }, [searchParams])

  // ✅ FIX: Fetch sirf tab jab local filters ya page change ho
  useEffect(() => {
    fetchProperties()
  }, [localSearch, localPurpose, localType, localArea, currentPage])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (localSearch)  params.append('search',  localSearch)
      if (localPurpose) params.append('purpose', localPurpose)
      if (localType)    params.append('type',    localType)
      if (localArea)    params.append('area',    localArea)
      params.append('page',  currentPage)
      params.append('limit', 9)

      const { data } = await API.get(`/properties?${params}`)
      setProperties(data.properties || [])
      setTotalPages(data.pages || 1)
      setTotal(data.total || 0)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setLocalSearch('')
    setLocalPurpose('')
    setLocalType('')
    setLocalArea('')
    setCurrentPage(1)
  }

  const activeFiltersCount = [localPurpose, localType, localArea, localSearch].filter(Boolean).length

  const areas = ['DHA Faisalabad', 'Gulberg', 'Canal Road', 'Madina Town', 'Wapda City', 'Peoples Colony', 'Susan Road', 'Millat Town', 'Samanabad', 'D-Ground', 'Jinnah Colony', 'Eden Valley']
  const types = ['House', 'Apartment', 'Plot', 'Commercial']

  return (
    <div className="min-h-screen bg-[#f8f9fc]">

      {/* Header */}
      <div className="bg-navy text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Browse Listings</p>
          <h1 className="text-3xl font-bold mb-1">Properties in Faisalabad</h1>
          <p className="text-white/50 text-sm">Find verified properties across all major areas</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Search + Filters */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
              <HiOutlineSearch size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by title, area..."
                value={localSearch}
                onChange={e => { setLocalSearch(e.target.value); setCurrentPage(1) }}
                className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
              />
              {localSearch && (
                <button onClick={() => setLocalSearch('')}>
                  <FiX size={14} className="text-gray-400" />
                </button>
              )}
            </div>

            <select
              value={localPurpose}
              onChange={e => { setLocalPurpose(e.target.value); setCurrentPage(1) }}
              className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-600 outline-none"
            >
              <option value="">All Purpose</option>
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
            </select>

            <select
              value={localType}
              onChange={e => { setLocalType(e.target.value); setCurrentPage(1) }}
              className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-600 outline-none"
            >
              <option value="">All Types</option>
              {types.map(t => <option key={t}>{t}</option>)}
            </select>

            <select
              value={localArea}
              onChange={e => { setLocalArea(e.target.value); setCurrentPage(1) }}
              className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm text-gray-600 outline-none"
            >
              <option value="">All Areas</option>
              {areas.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">{activeFiltersCount} filter(s) active</span>
              <button onClick={resetFilters} className="text-xs text-gold hover:underline ml-auto">Clear All</button>
            </div>
          )}
        </div>

        {/* Results Bar */}
        <div className="flex justify-between items-center mb-5">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-navy">{total}</span> properties
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-navy text-white' : 'bg-white text-gray-400 border border-gray-200'}`}
            >
              <HiViewGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-navy text-white' : 'bg-white text-gray-400 border border-gray-200'}`}
            >
              <HiViewList size={16} />
            </button>
          </div>
        </div>

        {/* Properties */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏠</div>
            <h3 className="text-navy font-bold text-lg mb-2">No Properties Found</h3>
            <p className="text-gray-400 text-sm mb-4">Try adjusting your filters</p>
            <button onClick={resetFilters} className="btn-gold px-6 py-2.5 rounded-xl text-sm">Clear Filters</button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col gap-4'}>
            {properties.map(property => (
              <PropertyCard key={property._id} property={property} viewMode={viewMode} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gold hover:text-gold disabled:opacity-40 transition-colors"
            >
              <FiChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${currentPage === i + 1 ? 'bg-navy text-white' : 'border border-gray-200 text-gray-500 hover:border-gold hover:text-gold'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gold hover:text-gold disabled:opacity-40 transition-colors"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Properties
