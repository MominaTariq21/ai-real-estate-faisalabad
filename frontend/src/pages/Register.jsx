import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineUser, HiOutlinePhone } from 'react-icons/hi'
import { MdOutlineHome } from 'react-icons/md'
import useAuthStore from '../store/authStore'

const Register = () => {
  const navigate = useNavigate()
  const { register, loading, error } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [success, setSuccess] = useState('')
  const [role, setRole] = useState('buyer')
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      return alert('Passwords do not match!')
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role,
    })

    if (result.success) {
      setSuccess('Account created! Redirecting...')
      setTimeout(() => navigate('/'), 1500)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex">

      {/* ── LEFT SIDE ── */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80"
          alt="Property"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy/80" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
              <MdOutlineHome className="text-navy text-xl" />
            </div>
            <div>
              <div className="text-white font-bold text-lg">AI<span className="text-gold">Estate</span></div>
              <div className="text-gold/60 text-[10px] tracking-widest uppercase">Faisalabad</div>
            </div>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight mb-6">
              Join Faisalabad's <br />
              <span className="text-gold">#1 AI Real Estate Platform</span>
            </h2>
            <div className="space-y-4">
              {[
                { icon: '✅', text: 'Post unlimited property listings for free' },
                { icon: '🤖', text: 'AI powered duplicate property detection' },
                { icon: '💬', text: 'Real-time chat with buyers and sellers' },
                { icon: '📍', text: 'Interactive map-based property search' },
                { icon: '❤️', text: 'Save your favorite properties' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-white/70 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          <Link to="/" className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-9 h-9 bg-navy rounded-lg flex items-center justify-center">
              <MdOutlineHome className="text-gold text-lg" />
            </div>
            <span className="text-navy font-bold text-lg">AI<span className="text-gold">Estate</span></span>
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-navy">Create Account</h1>
            <p className="text-gray-400 text-sm mt-1">Join thousands of property seekers in Faisalabad</p>
          </div>

          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4">
              {success}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}

          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
            {[
              { value: 'buyer', label: 'Buyer' },
              { value: 'seller', label: 'Seller' },
              { value: 'agent', label: 'Agent' },
            ].map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                  role === r.value
                    ? 'bg-navy text-gold shadow-sm'
                    : 'text-gray-500 hover:text-navy'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Full Name</label>
              <div className="relative">
                <HiOutlineUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-gold focus:bg-white transition-colors placeholder-gray-300"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Email</label>
              <div className="relative">
                <HiOutlineMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-gold focus:bg-white transition-colors placeholder-gray-300"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Phone</label>
              <div className="relative">
                <HiOutlinePhone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="03XX-XXXXXXX"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-gold focus:bg-white transition-colors placeholder-gray-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Password</label>
              <div className="relative">
                <HiOutlineLockClosed size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-gold focus:bg-white transition-colors placeholder-gray-300"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <HiOutlineEyeOff size={16} /> : <HiOutlineEye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Confirm Password</label>
              <div className="relative">
                <HiOutlineLockClosed size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-gold focus:bg-white transition-colors placeholder-gray-300"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirm ? <HiOutlineEyeOff size={16} /> : <HiOutlineEye size={16} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-0.5 accent-gold" />
              <p className="text-xs text-gray-400">
                I agree to the{' '}
                <span className="text-gold font-medium cursor-pointer">Terms of Service</span>
                {' '}and{' '}
                <span className="text-gold font-medium cursor-pointer">Privacy Policy</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : 'Create Account'}
            </button>

          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-gold font-semibold hover:underline">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Register