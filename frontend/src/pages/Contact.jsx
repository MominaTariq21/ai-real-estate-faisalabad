import { useState } from 'react'
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi'
import { FiSend, FiCheckCircle } from 'react-icons/fi'
import { BsWhatsapp } from 'react-icons/bs'
import API from '../utils/axios'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await API.post('/contact', formData)

      if (data.success) {
        setSubmitted(true)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc]">

      {/* HEADER */}
      <div className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Get In Touch</p>
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Have a question or need help? We're here for you 24/7
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">

          {/* LEFT — Contact Info */}
          <div className="space-y-5">
            {[
              {
                icon: <HiOutlinePhone size={22} />,
                title: 'Phone',
                lines: ['+92 311 7581361', '+92 306 1273273'],
                sub: 'Mon - Sat, 9am - 6pm',
              },
              {
                icon: <HiOutlineMail size={22} />,
                title: 'Email',
                lines: ['mominatariq21.2004@gmail.com', 'shafaqatnida416@gmail.com'],
                sub: 'We reply within 24 hours',
              },
              {
                icon: <HiOutlineLocationMarker size={22} />,
                title: 'Office',
                lines: ['Gulberg III, Faisalabad', 'Punjab, Pakistan'],
                sub: 'Visit us anytime',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 flex gap-4 card-hover">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-navy font-bold text-sm mb-1">{item.title}</h3>
                  {item.lines.map((line, j) => (
                    <p key={j} className="text-gray-600 text-xs">{line}</p>
                  ))}
                  <p className="text-gray-400 text-xs mt-1">{item.sub}</p>
                </div>
              </div>
            ))}

            {/* WhatsApp */}
            <a
              href="https://wa.me/923117581361"
              target="_blank"
              rel="noreferrer"
              className="bg-green-500 hover:bg-green-600 rounded-2xl p-5 flex items-center gap-4 transition-colors card-hover"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <BsWhatsapp size={22} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">WhatsApp Us</h3>
                <p className="text-white/70 text-xs mt-0.5">Quick response guaranteed</p>
              </div>
            </a>

            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-100 h-40 flex items-center justify-center">
                <div className="text-center">
                  <HiOutlineLocationMarker size={32} className="text-gold mx-auto mb-2" />
                  <p className="text-gray-400 text-sm font-medium">Gulberg III</p>
                  <p className="text-gray-300 text-xs">Faisalabad, Punjab</p>
                </div>
              </div>
              <div className="p-3 text-center">
                <p className="text-xs text-gray-400">Interactive map coming soon</p>
              </div>
            </div>
          </div>

          {/* RIGHT — Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">

              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheckCircle size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-navy font-bold text-xl mb-2">Message Sent!</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
                    }}
                    className="btn-gold px-6 py-2.5 rounded-xl text-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-navy">Send us a Message</h2>
                    <p className="text-gray-400 text-sm mt-1">Fill the form below and we'll respond shortly</p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Full Name</label>
                        <input
                          type="text"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-gold focus:bg-white transition-colors placeholder-gray-300"
                        />
                      </div>
                      <div>
                        <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Email</label>
                        <input
                          type="email"
                          placeholder="Your email"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-gold focus:bg-white transition-colors placeholder-gray-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Phone</label>
                        <input
                          type="tel"
                          placeholder="03XX-XXXXXXX"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-gold focus:bg-white transition-colors placeholder-gray-300"
                        />
                      </div>
                      <div>
                        <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Subject</label>
                        <select
                          value={formData.subject}
                          onChange={e => setFormData({ ...formData, subject: e.target.value })}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 outline-none focus:border-gold focus:bg-white transition-colors"
                        >
                          <option value="">Select subject</option>
                          <option>Property Inquiry</option>
                          <option>List My Property</option>
                          <option>Agent Support</option>
                          <option>Technical Issue</option>
                          <option>General Inquiry</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Message</label>
                      <textarea
                        placeholder="Write your message here..."
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-gold focus:bg-white transition-colors placeholder-gray-300 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-gold py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiSend size={15} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

