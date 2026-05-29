import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineLocationMarker, HiOutlineSearch } from 'react-icons/hi'
import { MdOutlineVerified, MdOutlineAddHome, MdOutlineKingBed, MdOutlineShower, MdOutlineLandscape } from 'react-icons/md'
import { FiMaximize2, FiHeart, FiArrowRight, FiCheckCircle, FiPhone } from 'react-icons/fi'
import { BsBuilding, BsHouseDoor, BsShop } from 'react-icons/bs'

const propertyTypes = [
  { icon: <BsHouseDoor size={26} />, label: 'Houses', count: '840+' },
  { icon: <BsBuilding size={26} />, label: 'Apartments', count: '320+' },
  { icon: <MdOutlineLandscape size={26} />, label: 'Plots', count: '560+' },
  { icon: <BsShop size={26} />, label: 'Commercial', count: '140+' },
  { icon: <BsBuilding size={26} />, label: 'Industrial', count: '90+' },
  { icon: <BsHouseDoor size={26} />, label: 'Farm Houses', count: '45+' },
]

const properties = [
  {
    id: 1,
    badge: 'For Sale',
    badgeColor: 'bg-gold text-navy',
    featured: true,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80',
    price: 'PKR 1.85 Crore',
    priceType: 'House',
    title: '5 Marla Modern House in Gulberg III',
    location: 'Gulberg 3, Faisalabad',
    beds: 3, baths: 2, area: '5 Marla',
  },
  {
    id: 2,
    badge: 'For Rent',
    badgeColor: 'bg-green-500 text-white',
    featured: false,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    price: 'PKR 45,000/mo',
    priceType: 'Apartment',
    title: '3 Bed Luxury Apartment on Canal Road',
    location: 'Canal Road, Faisalabad',
    beds: 3, baths: 2, area: '10 Marla',
  },
  {
    id: 3,
    badge: 'For Sale',
    badgeColor: 'bg-gold text-navy',
    featured: false,
    image: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=80',
    price: 'PKR 2.40 Crore',
    priceType: 'House',
    title: 'Double Storey House in Peoples Colony',
    location: 'Peoples Colony, Faisalabad',
    beds: 4, baths: 3, area: '10 Marla',
  },
  {
    id: 4,
    badge: 'For Sale',
    badgeColor: 'bg-gold text-navy',
    featured: true,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
    price: 'PKR 85 Lac',
    priceType: 'Plot',
    title: '10 Marla Residential Plot in DHA',
    location: 'DHA Faisalabad',
    beds: null, baths: null, area: '10 Marla',
  },
  {
    id: 5,
    badge: 'For Rent',
    badgeColor: 'bg-green-500 text-white',
    featured: false,
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80',
    price: 'PKR 25,000/mo',
    priceType: 'Apartment',
    title: '2 Bed Flat in Madina Town',
    location: 'Madina Town, Faisalabad',
    beds: 2, baths: 1, area: '5 Marla',
  },
  {
    id: 6,
    badge: 'For Sale',
    badgeColor: 'bg-gold text-navy',
    featured: false,
    image: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=600&q=80',
    price: 'PKR 4.45 Crore',
    priceType: 'House',
    title: '1 Kanal Luxury House in Wapda City',
    location: 'Wapda City, Faisalabad',
    beds: 5, baths: 4, area: '1 Kanal',
  },
]

const areas = [
  { name: 'Gulberg', forSale: '340+ for sale', forRent: '54 for rent', image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&q=80' },
  { name: 'Peoples Colony', forSale: '210+ for sale', forRent: '38 for rent', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&q=80' },
  { name: 'Canal Road', forSale: '180+ for sale', forRent: '29 for rent', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&q=80' },
  { name: 'D-Ground', forSale: '120+ for sale', forRent: '18 for rent', image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=500&q=80' },
  { name: 'Madina Town', forSale: '190+ for sale', forRent: '31 for rent', image: 'https://images.unsplash.com/photo-1467803738586-46b7eb7b16a1?w=500&q=80' },
  { name: 'Wapda City', forSale: '200+ for sale', forRent: '35 for rent', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80' },
  { name: 'Susan Road', forSale: '110+ for sale', forRent: '15 for rent', image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500&q=80' },
  { name: 'Samanabad', forSale: '130+ for sale', forRent: '20 for rent', image: 'https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=500&q=80' },
]

const whyUs = [
  { icon: <MdOutlineVerified size={26} />, title: 'Verified Listings', desc: 'Every property is manually reviewed. Zero duplicate or fake listings.' },
  { icon: <FiPhone size={26} />, title: 'Direct Owner Contact', desc: 'Connect directly with owners. No middlemen, no delays.' },
  { icon: <HiOutlineLocationMarker size={26} />, title: 'Map-Based Search', desc: 'View exact property locations on an interactive map.' },
  { icon: <FiCheckCircle size={26} />, title: 'Secure & Private', desc: 'JWT authentication. Browse and communicate with full confidence.' },
]

const PropertyCard = ({ property }) => {
  const [liked, setLiked] = useState(false)
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover group">
      <div className="relative overflow-hidden h-48">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-lg ${property.badgeColor}`}>
          {property.badge}
        </span>
        {property.featured && (
          <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/90 text-navy">
            Featured
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-base font-bold text-navy">{property.price}</div>
            <div className="text-xs text-gray-400">{property.priceType}</div>
          </div>
          <span className="flex items-center gap-1 text-xs text-gold font-medium bg-gold/10 px-2 py-1 rounded-lg">
            <MdOutlineVerified size={12} /> Verified
          </span>
        </div>
        <h3 className="text-sm font-semibold text-gray-800 mt-2 line-clamp-2">{property.title}</h3>
        <div className="flex items-center gap-1 mt-1">
          <HiOutlineLocationMarker size={12} className="text-gold flex-shrink-0" />
          <span className="text-xs text-gray-400">{property.location}</span>
        </div>
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          {property.beds && (
            <span className="flex items-center gap-1"><MdOutlineKingBed size={13} /> {property.beds} Beds</span>
          )}
          {property.baths && (
            <span className="flex items-center gap-1"><MdOutlineShower size={13} /> {property.baths} Baths</span>
          )}
          <span className="flex items-center gap-1"><FiMaximize2 size={12} /> {property.area}</span>
        </div>
        <div className="flex gap-2 mt-3">
          <Link
            to={`/properties/${property.id}`}
            className="flex-1 bg-navy text-white text-center py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-navy/90 transition-colors"
          >
            View Detail
          </Link>
          <a
            href={`https://wa.me/923001234567?text=Interested in: ${property.title}`}
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 bg-green-500 hover:bg-green-600 rounded-xl flex items-center justify-center transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
          <button
            onClick={() => setLiked(!liked)}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${liked ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'}`}
          >
            <FiHeart size={13} className={liked ? 'fill-red-500' : ''} />
          </button>
        </div>
      </div>
    </div>
  )
}

const Home = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [propertyType, setPropertyType] = useState('All Types')
  const [selectedArea, setSelectedArea] = useState('All Faisalabad')
  const [budget, setBudget] = useState('Any Budget')
  const [lookingFor, setLookingFor] = useState('Buy') // ✅ FIXED: sirf ek baar declare, useState se

  // ✅ FIXED: handleSearch sahi tarah se likha — ek hi function, koi orphan code nahi
  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.append('search', searchQuery)
    if (propertyType !== 'All Types') params.append('type', propertyType)
    if (selectedArea !== 'All Faisalabad') params.append('area', selectedArea)
    if (lookingFor === 'Rent') params.append('purpose', 'For Rent')
    if (lookingFor === 'Buy') params.append('purpose', 'For Sale')
    navigate(`/properties?${params}`)
  }

  const tabs = ['All', 'For Sale', 'For Rent', 'Houses', 'Plots', 'Apartments']

  const filteredProperties = activeTab === 'All'
    ? properties
    : properties.filter(p => p.badge === activeTab || p.priceType === activeTab)

  return (
    <div className="min-h-screen bg-[#f8f9fc]">

      {/* ── HERO ── */}
      <section className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <div className="inline-flex items-center gap-2 border border-gold/30 rounded-full px-4 py-1.5 mb-5 bg-gold/5">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-gold text-xs font-medium tracking-wide uppercase">Real Estate Agency in Faisalabad</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Find Your <br /><span className="text-gold">Perfect Property.</span>
            </h1>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-md">
              Browse verified listings across Gulberg, Peoples Colony, Canal Road and all major areas of Faisalabad.
            </p>

            {/* Search Box */}
            <div className="bg-white rounded-2xl p-4 space-y-3 shadow-xl">
              {/* Tabs */}
              <div className="flex gap-2">
                {['Buy', 'Rent'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setLookingFor(tab)}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      lookingFor === tab
                        ? 'bg-navy text-gold'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search Input
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-gold transition-colors">
                <HiOutlineSearch size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search by area, property type, location..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSearch()}
                  className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
                />
              </div> */}

              {/* Filters Row */}
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                  className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-gold"
                >
                  <option value="All Types">All Types</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Plot">Plot</option>
                  <option value="Commercial">Commercial</option>
                </select>

                <select
                  value={selectedArea}
                  onChange={e => setSelectedArea(e.target.value)}
                  className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-gold"
                >
                  <option value="All Faisalabad">All Areas</option>
                  <option value="DHA Faisalabad">DHA Faisalabad</option>
                  <option value="Gulberg">Gulberg</option>
                  <option value="Canal Road">Canal Road</option>
                  <option value="Madina Town">Madina Town</option>
                  <option value="Wapda City">Wapda City</option>
                  <option value="Peoples Colony">Peoples Colony</option>
                  <option value="Susan Road">Susan Road</option>
                  <option value="Samanabad">Samanabad</option>
                  <option value="D-Ground">D-Ground</option>
                  <option value="Jinnah Colony">Jinnah Colony</option>
                  <option value="Eden Valley">Eden Valley</option>
                </select>

                <select
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-gold"
                >
                  <option value="Any Budget">Any Budget</option>
                  <option value="Under 50 Lac">Under 50 Lac</option>
                  <option value="50 Lac - 1 Crore">50 Lac - 1 Crore</option>
                  <option value="1 Crore - 3 Crore">1 Crore - 3 Crore</option>
                  <option value="3 Crore+">3 Crore+</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="w-full btn-gold py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
              >
                <HiOutlineSearch size={16} /> Search Properties
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden md:block relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl h-[400px]">
              <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80" alt="Luxury property" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur rounded-2xl px-4 py-3 shadow-xl">
              <div className="text-2xl font-black text-navy">2,400+</div>
              <div className="text-xs text-gray-400">Active Listings</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-navy-light border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: '2,400+', label: 'Active Listings' },
            { num: '840+', label: 'Verified Agents' },
            { num: '18', label: 'Top Localities' },
            { num: '4.9★', label: 'Average Rating' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-white font-bold text-xl">{s.num}</div>
              <div className="text-white/40 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROPERTY TYPES ── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">What are you looking for?</p>
          <h2 className="text-2xl font-bold text-navy">Browse by Property Type</h2>
          <p className="text-gray-400 text-sm mt-1">Find the right category across all of Faisalabad</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {propertyTypes.map((type, i) => (
            <Link to="/properties" key={i} className="card-hover bg-white border border-gray-100 rounded-2xl p-4 text-center group">
              <div className="text-gold/80 group-hover:text-gold flex justify-center mb-2 transition-colors">{type.icon}</div>
              <div className="text-navy font-semibold text-sm">{type.label}</div>
              <div className="text-gray-400 text-xs mt-0.5">{type.count}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── RECENT PROPERTIES ── */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex justify-between items-end mb-5">
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">Latest Listings</p>
            <h2 className="text-2xl font-bold text-navy">Recent Properties</h2>
            <p className="text-gray-400 text-sm mt-1">Hand-picked verified listings across Faisalabad</p>
          </div>
          <Link to="/properties" className="text-sm text-gold font-medium flex items-center gap-1 hover:underline">
            View All <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === tab
                  ? 'bg-navy text-gold border border-gold/40'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gold/40'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/properties" className="inline-flex items-center gap-2 btn-gold px-8 py-3 rounded-xl text-sm">
            View All Properties <FiArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── TOP AREAS ── */}
      <section className="bg-navy py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-1">Explore by Location</p>
              <h2 className="text-2xl font-bold text-white">Top Areas in <span className="text-gold">Faisalabad</span></h2>
              <p className="text-white/40 text-sm mt-1">Most sought-after localities</p>
            </div>
            <Link to="/properties" className="text-sm text-gold font-medium flex items-center gap-1">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {areas.map((area, i) => (
              <Link
                to={`/properties?area=${area.name}`}
                key={i}
                className="relative rounded-2xl overflow-hidden group h-44"
              >
                <img src={area.image} alt={area.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <div className="text-white font-bold text-sm">{area.name}</div>
                  <div className="text-white/60 text-[11px]">{area.forSale}</div>
                  <div className="text-gold text-[11px]">{area.forRent}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Why Us</p>
          <h2 className="text-2xl font-bold text-navy">Why Choose AI Real Estate</h2>
          <p className="text-gray-400 text-sm mt-1">Faisalabad's most trusted property platform</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {whyUs.map((item, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 card-hover text-center">
              <div className="text-gold mb-3 flex justify-center">{item.icon}</div>
              <h3 className="text-navy font-bold text-sm mb-1.5">{item.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-[#f0f2f5] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Simple Process</p>
            <h2 className="text-2xl font-bold text-navy">How It Works</h2>
            <p className="text-gray-400 text-sm mt-1">Find your perfect property in 4 easy steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gold/20 z-0" />
            {[
              { icon: '📝', title: 'Register & Login', desc: 'Create your free account as a buyer, seller, or renter in just 2 minutes.' },
              { icon: '🔍', title: 'Search Property', desc: 'Use smart filters — area, price, type — to find your perfect match in Faisalabad.' },
              { icon: '💬', title: 'Contact Owner', desc: 'Connect directly with property owners via WhatsApp or real-time chat.' },
              { icon: '🏠', title: 'Visit & Book', desc: 'Schedule a visit, verify the property on map, and finalize your deal.' },
            ].map((item, i) => (
              <div key={i} className="relative z-10 text-center">
                <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-4 relative shadow-lg">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-gold rounded-full text-navy text-xs font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-navy font-bold text-sm mb-2">{item.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed px-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-navy rounded-3xl p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">List with AI Real Estate</p>
            <h2 className="text-2xl font-bold text-white">Sell or Rent Your Property in <span className="text-gold">Faisalabad</span> Today</h2>
            <p className="text-white/40 text-sm mt-2">Free listing for 30 days. Instant visibility across the city.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0 relative">
            <Link to="/add-property" className="btn-gold flex items-center gap-2 px-6 py-3 rounded-xl text-sm whitespace-nowrap">
              <MdOutlineAddHome size={18} /> Add Property
            </Link>
            <Link to="/contact" className="btn-outline-white flex items-center gap-2 px-6 py-3 rounded-xl text-sm whitespace-nowrap">
              Talk to Agent
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
