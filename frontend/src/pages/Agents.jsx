import { useState } from 'react'
import { FiPhone, FiMail, FiStar, FiMessageSquare } from 'react-icons/fi'
import { MdOutlineVerified } from 'react-icons/md'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { BsWhatsapp } from 'react-icons/bs'

const agents = [
  { id: 1, name: 'Ahmed Khan', role: 'Senior Property Agent', area: 'DHA & Gulberg', experience: '8 years', sold: 142, rating: 4.9, reviews: 38, phone: '923001234567', email: 'ahmed@aiestate.pk', initials: 'AK', bg: '#1A2744', speciality: 'Luxury Houses' },
  { id: 2, name: 'Sara Ali', role: 'DHA Specialist', area: 'DHA Faisalabad', experience: '6 years', sold: 98, rating: 4.8, reviews: 29, phone: '923011234567', email: 'sara@aiestate.pk', initials: 'SA', bg: '#1B4332', speciality: 'Residential Plots' },
  { id: 3, name: 'Usman Raza', role: 'Commercial Expert', area: 'D-Ground & Canal Road', experience: '10 years', sold: 76, rating: 4.7, reviews: 21, phone: '923021234567', email: 'usman@aiestate.pk', initials: 'UR', bg: '#3B1A44', speciality: 'Commercial Properties' },
  { id: 4, name: 'Fatima Malik', role: 'Residential Agent', area: 'Peoples Colony & Madina Town', experience: '4 years', sold: 63, rating: 4.8, reviews: 18, phone: '923031234567', email: 'fatima@aiestate.pk', initials: 'FM', bg: '#44281A', speciality: 'Apartments & Flats' },
  { id: 5, name: 'Bilal Ahmed', role: 'Property Consultant', area: 'Wapda City & Susan Road', experience: '7 years', sold: 89, rating: 4.6, reviews: 24, phone: '923041234567', email: 'bilal@aiestate.pk', initials: 'BA', bg: '#1A3344', speciality: 'Investment Properties' },
  { id: 6, name: 'Zara Hussain', role: 'Rental Specialist', area: 'Samanabad & Jinnah Colony', experience: '5 years', sold: 54, rating: 4.9, reviews: 16, phone: '923051234567', email: 'zara@aiestate.pk', initials: 'ZH', bg: '#2D1A44', speciality: 'Rental Properties' },
  { id: 7, name: 'Kamran Sheikh', role: 'Plot Specialist', area: 'Millat Town & Eden Valley', experience: '9 years', sold: 112, rating: 4.7, reviews: 31, phone: '923061234567', email: 'kamran@aiestate.pk', initials: 'KS', bg: '#1A4433', speciality: 'Plots & Land' },
  { id: 8, name: 'Ayesha Noor', role: 'Luxury Property Expert', area: 'DHA & Canal Road', experience: '6 years', sold: 71, rating: 4.8, reviews: 22, phone: '923071234567', email: 'ayesha@aiestate.pk', initials: 'AN', bg: '#44331A', speciality: 'Luxury Properties' },
]

const Agents = () => {
  const [search, setSearch] = useState('')

  const filtered = agents.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.area.toLowerCase().includes(search.toLowerCase()) ||
    a.speciality.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#f8f9fc]">

      {/* Header */}
      <div className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Our Team</p>
          <h1 className="text-3xl font-bold mb-2">Meet Our Expert Agents</h1>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Connect with verified real estate professionals across all major areas of Faisalabad
          </p>
          {/* Search */}
          <div className="max-w-md mx-auto mt-6">
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3">
              <FiPhone size={15} className="text-gold flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by name, area or speciality..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-navy-light border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: '8+', label: 'Expert Agents' },
            { num: '700+', label: 'Properties Sold' },
            { num: '4.8★', label: 'Average Rating' },
            { num: '100%', label: 'Verified' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-white font-bold text-xl">{s.num}</div>
              <div className="text-white/40 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Agents Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">👤</div>
            <h3 className="text-navy font-bold text-lg">No Agents Found</h3>
            <p className="text-gray-400 text-sm mt-2">Try a different search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map(agent => (
              <div key={agent.id} className="bg-white rounded-2xl p-5 border border-gray-100 card-hover">
                {/* Avatar */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ backgroundColor: agent.bg }}
                  >
                    {agent.initials}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-gold bg-gold/10 px-2 py-1 rounded-lg">
                    <MdOutlineVerified size={12} /> Verified
                  </span>
                </div>

                {/* Info */}
                <h3 className="text-navy font-bold text-sm">{agent.name}</h3>
                <p className="text-gray-400 text-xs mt-0.5">{agent.role}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <HiOutlineLocationMarker size={11} className="text-gold" />
                  <span className="text-xs text-gray-400">{agent.area}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-navy font-bold text-sm">{agent.sold}</div>
                    <div className="text-gray-400 text-[10px]">Sold</div>
                  </div>
                  <div className="text-center border-x border-gray-100">
                    <div className="text-navy font-bold text-sm flex items-center justify-center gap-0.5">
                      <FiStar size={11} className="text-gold fill-gold" />
                      {agent.rating}
                    </div>
                    <div className="text-gray-400 text-[10px]">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-navy font-bold text-sm">{agent.experience}</div>
                    <div className="text-gray-400 text-[10px]">Exp</div>
                  </div>
                </div>

                {/* Speciality */}
                <div className="mt-3 bg-gold/5 border border-gold/20 rounded-lg px-3 py-1.5">
                  <span className="text-gold text-xs font-medium">{agent.speciality}</span>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mt-3">
                  <a
                    href={`https://wa.me/${agent.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <BsWhatsapp size={13} /> WhatsApp
                  </a>
                  <a
                    href={`tel:+${agent.phone}`}
                    className="w-9 h-9 bg-navy hover:bg-navy/90 text-white rounded-xl flex items-center justify-center transition-colors"
                  >
                    <FiPhone size={13} />
                  </a>
                  <a
                    href={`mailto:${agent.email}`}
                    className="w-9 h-9 border border-gray-200 hover:border-gold text-gray-400 hover:text-gold rounded-xl flex items-center justify-center transition-colors"
                  >
                    <FiMail size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Agents