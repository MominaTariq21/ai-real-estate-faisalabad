import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
import { MdOutlineHome } from 'react-icons/md'
import useAuthStore from '../store/authStore'

const Login = () => {
  const navigate = useNavigate()
  const { login, loading, error } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(formData)
    if (result.success) {
      setSuccess('Login successful! Redirecting...')
      setTimeout(() => navigate('/'), 1500)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex">

      {/* ── LEFT SIDE ── */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"
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
            <h2 className="text-3xl font-bold text-white leading-tight mb-4">
              Find Your Perfect <br />
              <span className="text-gold">Property in Faisalabad</span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Join thousands of buyers, sellers, and renters on Pakistan's most trusted AI-powered real estate platform.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { num: '2,400+', label: 'Properties' },
                { num: '5,000+', label: 'Happy Clients' },
                { num: '18+', label: 'Areas' },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="text-gold font-bold text-lg">{s.num}</div>
                  <div className="text-white/50 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-navy rounded-lg flex items-center justify-center">
              <MdOutlineHome className="text-gold text-lg" />
            </div>
            <span className="text-navy font-bold text-lg">AI<span className="text-gold">Estate</span></span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-navy">Welcome back!</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to your account to continue</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">
                Email Address
              </label>
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

            {/* Password */}
            <div>
              <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">
                Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-gold focus:bg-white transition-colors placeholder-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <HiOutlineEyeOff size={16} /> : <HiOutlineEye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-gold hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>

          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold font-semibold hover:underline">
              Create Account
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login