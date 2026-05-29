import { Link } from 'react-router-dom'
import { HiOutlineHome, HiOutlineLocationMarker, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi'
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 pt-14 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-white/10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center">
                <HiOutlineHome className="text-navy text-xl" />
              </div>
              <div>
                <div className="text-white font-bold text-base leading-none">AI<span className="text-gold">Estate</span></div>
                <div className="text-gold/60 text-[10px] tracking-widest uppercase">Faisalabad</div>
              </div>
            </div>
            <p className="text-white/35 text-xs leading-relaxed mb-4">
              Faisalabad's most trusted property platform for buying, selling and renting properties.
            </p>
            <div className="space-y-2 text-xs text-white/35">
              <div className="flex items-start gap-2">
                <HiOutlineLocationMarker className="text-gold mt-0.5 flex-shrink-0" size={14} />
                <span>Gulberg & Faisalabad Punjab, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlinePhone className="text-gold flex-shrink-0" size={14} />
                <span>+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineMail className="text-gold flex-shrink-0" size={14} />
                <span>info@aiestate.pk</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {['Home', 'Properties for Sale', 'Properties for Rent', 'Our Agents', 'About Us', 'Contact', 'List Your Property'].map(item => (
                <li key={item}>
                  <Link to="/" className="text-white/35 hover:text-gold text-xs transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">Property Types</h4>
            <ul className="space-y-2.5">
              {['Houses', 'Apartments & Flats', 'Plots & Land', 'Commercial Spaces', 'Industrial Units', 'Farm Houses'].map(item => (
                <li key={item}>
                  <Link to="/properties" className="text-white/35 hover:text-gold text-xs transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Areas */}
          <div>
            <h4 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">Top Areas</h4>
            <ul className="space-y-2.5">
              {['Gulberg', 'Peoples Colony', 'Canal Road', 'D-Ground', 'Jinnah Colony', 'Madina Town', 'Susan Road', 'Millat Town'].map(item => (
                <li key={item}>
                  <Link to="/properties" className="text-white/35 hover:text-gold text-xs transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6">
          <p className="text-white/20 text-xs">© 2026 AI Real Estate Faisalabad. All rights reserved.</p>
          <div className="flex gap-3">
            {[
              { Icon: FaFacebookF, href: '#' },
              { Icon: FaInstagram, href: '#' },
              { Icon: FaWhatsapp, href: '#' },
              { Icon: FaYoutube, href: '#' },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/30 hover:text-gold hover:border-gold/40 transition-colors"
              >
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer