import { Link } from 'react-router-dom'
import { MdOutlineVerified, MdOutlineAddHome } from 'react-icons/md'
import { FiUsers, FiHome, FiMapPin, FiStar, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { BsBuilding, BsRobot } from 'react-icons/bs'

const stats = [
  { icon: <FiHome size={24} />, num: '2,400+', label: 'Properties Listed' },
  { icon: <FiUsers size={24} />, num: '5,000+', label: 'Happy Clients' },
  { icon: <FiMapPin size={24} />, num: '18+', label: 'Areas Covered' },
  { icon: <FiStar size={24} />, num: '4.9★', label: 'Average Rating' },
]

const values = [
  {
    icon: <MdOutlineVerified size={28} />,
    title: 'Trust & Transparency',
    desc: 'Every listing is manually verified by our team. We ensure zero fake or duplicate properties on our platform.',
  },
  {
    icon: <BsRobot size={28} />,
    title: 'AI Innovation',
    desc: 'Our AI-powered duplicate detection system uses NLP and image hashing to keep listings genuine and unique.',
  },
  {
    icon: <FiUsers size={28} />,
    title: 'Community First',
    desc: 'We are built for the people of Faisalabad. Our platform connects buyers, sellers, and renters directly.',
  },
  {
    icon: <FiCheckCircle size={28} />,
    title: 'Quality Service',
    desc: 'From listing to closing, we provide end-to-end support to ensure a smooth property transaction experience.',
  },
]

const team = [
  { name: 'Nida Shafaqat', role: 'Co-Founder & AI Engineer', initials: 'NS', bg: '#1A2744', desc: 'AI specialist focused on NLP and computer vision for real estate.' },
  { name: 'Momina', role: 'Co-Founder & Full Stack Developer', initials: 'M', bg: '#1B4332', desc: 'MERN stack developer building scalable real estate solutions.' },
]

const About = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fc]">

      {/* ── HERO ── */}
      <div className="bg-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-3">About Us</p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              Faisalabad's Most Trusted
              <span className="text-gold block mt-1">AI Real Estate Platform</span>
            </h1>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              AI Real Estate Faisalabad is a Final Year Project built by two passionate Computer Science students from the University of Agriculture, Faisalabad. Our mission is to revolutionize the real estate industry in Faisalabad using artificial intelligence.
            </p>
            <div className="flex gap-3">
              <Link to="/properties" className="btn-gold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2">
                Browse Properties <FiArrowRight size={14} />
              </Link>
              <Link to="/contact" className="btn-outline-white px-5 py-2.5 rounded-xl text-sm">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="hidden md:block relative">
            <div className="rounded-3xl overflow-hidden h-72">
              <img
                src="https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80"
                alt="About"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent rounded-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="bg-navy-light border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-gold flex justify-center mb-2">{s.icon}</div>
              <div className="text-white font-bold text-2xl">{s.num}</div>
              <div className="text-white/40 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MISSION ── */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Our Mission</p>
            <h2 className="text-2xl font-bold text-navy mb-4">
              Making Real Estate Smarter with AI
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Traditional real estate platforms in Pakistan suffer from duplicate listings, fake properties, and lack of transparency. We built AI Real Estate Faisalabad to solve these problems using cutting-edge artificial intelligence.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Our platform uses Natural Language Processing (NLP) to detect similar property descriptions and image hashing algorithms to identify duplicate property photos — ensuring every listing on our platform is 100% genuine.
            </p>
            <div className="space-y-3">
              {[
                'AI-powered duplicate property detection',
                'Real-time chat between buyers and sellers',
                'Interactive map-based property search',
                'JWT-secured authentication system',
                'Admin panel for property management',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiCheckCircle size={11} className="text-gold" />
                  </div>
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-navy rounded-2xl p-8 text-white">
            <BsRobot size={40} className="text-gold mb-4" />
            <h3 className="text-xl font-bold mb-3">AI Duplicate Detection</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Our AI service is built with Python FastAPI and uses two powerful techniques:
            </p>
            <div className="space-y-3">
              {[
                { title: 'NLP Similarity', desc: 'sentence-transformers model compares property titles and descriptions to detect similar listings.' },
                { title: 'Image Hashing', desc: 'imagehash library compares property photos to detect duplicate images even if slightly modified.' },
                { title: 'Smart Scoring', desc: 'Combined similarity score flags potential duplicates for admin review before publishing.' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <div className="text-gold font-semibold text-sm mb-1">{item.title}</div>
                  <div className="text-white/40 text-xs leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── VALUES ── */}
      <div className="bg-[#f0f2f5] py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">What We Stand For</p>
            <h2 className="text-2xl font-bold text-navy">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 card-hover text-center">
                <div className="text-gold mb-4 flex justify-center">{v.icon}</div>
                <h3 className="text-navy font-bold text-sm mb-2">{v.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TEAM ── */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">The Builders</p>
          <h2 className="text-2xl font-bold text-navy">Meet Our Team</h2>
          <p className="text-gray-400 text-sm mt-1">Final Year Project — University of Agriculture, Faisalabad</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {team.map((member, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 card-hover text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl"
                style={{ backgroundColor: member.bg }}
              >
                {member.initials}
              </div>
              <h3 className="text-navy font-bold">{member.name}</h3>
              <p className="text-gold text-xs font-medium mt-1">{member.role}</p>
              <p className="text-gray-400 text-xs mt-3 leading-relaxed">{member.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── TECH STACK ── */}
      <div className="bg-navy py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Built With</p>
            <h2 className="text-2xl font-bold text-white">Our Tech Stack</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Frontend', items: ['React.js', 'Vite', 'Tailwind CSS', 'Zustand'] },
              { label: 'Backend', items: ['Node.js', 'Express.js', 'MongoDB', 'JWT'] },
              { label: 'AI Service', items: ['Python', 'FastAPI', 'sentence-transformers', 'imagehash'] },
              { label: 'Features', items: ['Socket.io', 'Cloudinary', 'React Leaflet', 'Axios'] },
            ].map((stack, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-gold font-semibold text-sm mb-3">{stack.label}</h3>
                <ul className="space-y-2">
                  {stack.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                      <span className="text-white/60 text-xs">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="bg-navy rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-white mb-3">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-white/40 text-sm mb-6">
              Browse verified listings across all major areas of Faisalabad
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/properties" className="btn-gold px-6 py-3 rounded-xl text-sm flex items-center gap-2">
                Browse Properties <FiArrowRight size={14} />
              </Link>
              <Link to="/register" className="btn-outline-white px-6 py-3 rounded-xl text-sm">
                Join Free
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default About