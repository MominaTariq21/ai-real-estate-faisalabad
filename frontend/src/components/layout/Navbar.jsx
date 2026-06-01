import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { HiOutlineHome, HiOutlineMenu, HiX, HiOutlineUser, HiOutlineLogout, HiOutlineChat, HiOutlineCog } from 'react-icons/hi'
import { MdOutlineAddHome } from 'react-icons/md'
import useAuthStore from '../../store/authStore'
import { useEffect } from 'react'
import API from '../../utils/axios'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [unreadCount, setUnreadCount] = useState(0)

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowDropdown(false)
  }

  useEffect(() => {
    if (user) {
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const fetchUnreadCount = async () => {
    try {
      const { data } = await API.get('/chat/unread-count')
      setUnreadCount(data.unreadCount)
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  return (
    <nav className="bg-navy sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center">
              <HiOutlineHome className="text-navy text-xl font-bold" />
            </div>
            <div>
              <div className="text-white font-bold text-base leading-none">
                AI<span className="text-gold">Estate</span>
              </div>
              <div className="text-gold/70 text-[10px] font-medium tracking-widest uppercase">
                Faisalabad
              </div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7">
            {[
              { to: '/', label: 'Home' },
              { to: '/properties', label: 'Properties' },
              { to: '/agents', label: 'Agents' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-sm font-medium transition-colors ${isActive(to) ? 'text-gold' : 'text-white/70 hover:text-white'}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-colors"
                >
                  <div className="w-7 h-7 bg-gold rounded-lg flex items-center justify-center text-navy font-bold text-xs">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white text-sm font-medium">{user.name?.split(' ')[0]}</span>
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 w-48 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-navy font-semibold text-sm">{user.name}</p>
                      <p className="text-gray-400 text-xs">{user.email}</p>
                      <span className="inline-block bg-gold/10 text-gold text-xs px-2 py-0.5 rounded-full mt-1 capitalize">
                        {user.role}
                      </span>
                    </div>

                    <Link to="/profile" onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                      <HiOutlineUser size={15} /> My Profile
                    </Link>

                    <Link to="/my-properties" onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                      <HiOutlineHome size={15} /> My Properties
                    </Link>

                    <Link to="/inbox" onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors relative">
                      <HiOutlineChat size={15} />
                      Messages
                      {unreadCount > 0 && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-gold text-navy text-xs font-bold px-1.5 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </Link>

                    {/* ✅ Admin Panel — sirf admin ko dikhega */}
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gold hover:bg-gold/5 transition-colors font-medium">
                        <HiOutlineCog size={15} /> Admin Panel
                      </Link>
                    )}

                    <button onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left">
                      <HiOutlineLogout size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm text-white/70 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="flex items-center gap-1.5 btn-gold px-4 py-2 rounded-lg text-sm">
                  <MdOutlineAddHome size={16} />
                  List Property
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white/80 hover:text-white">
            {isOpen ? <HiX size={24} /> : <HiOutlineMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/properties', label: 'Properties' },
              { to: '/agents', label: 'Agents' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                {label}
              </Link>
            ))}

            <div className="pt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="px-3 py-2 bg-white/10 rounded-lg">
                    <p className="text-white font-medium text-sm">{user.name}</p>
                    <p className="text-white/50 text-xs">{user.email}</p>
                  </div>

                  {/* ✅ Admin Panel mobile mein bhi */}
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsOpen(false)}
                      className="text-center py-2.5 text-sm text-gold border border-gold/30 rounded-lg font-medium">
                      Admin Panel
                    </Link>
                  )}

                  <button onClick={handleLogout}
                    className="text-center py-2.5 text-sm text-red-400 border border-red-400/30 rounded-lg">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}
                    className="text-center py-2.5 text-sm text-white/70 border border-white/20 rounded-lg">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}
                    className="text-center py-2.5 text-sm btn-gold rounded-lg">
                    List Property
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
