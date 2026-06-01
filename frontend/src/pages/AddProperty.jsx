import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineLocationMarker, HiOutlinePhotograph, HiOutlineX } from 'react-icons/hi'
import { MdOutlineKingBed, MdOutlineShower } from 'react-icons/md'
import { FiMaximize2, FiDollarSign } from 'react-icons/fi'
import useAuthStore from '../store/authStore'
import API from '../utils/axios'

const AddProperty = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    priceType: 'House',
    purpose: 'For Sale',
    area: 'Gulberg',
    size: '',
    beds: '',
    baths: '',
    address: '',
    lat: '',
    lng: '',
    features: '',
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user])

  if (!user) return null

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)
    const previewUrls = files.map(file => URL.createObjectURL(file))
    setPreviews(previewUrls)
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setImages(newImages)
    setPreviews(newPreviews)
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   setLoading(true)
  //   setError('')

  //   try {
  //     // Step 1 — AI Text Duplicate Check
  //     const aiTextCheck = await API.post('/ai/check-duplicate', {
  //       title: formData.title,
  //       description: formData.description,
  //       propertyId: 'temp_' + Date.now(),
  //     })

  //     if (aiTextCheck.data.result.is_duplicate) {
  //       const score = aiTextCheck.data.result.duplicate_score
  //       const confirm = window.confirm(
  //         `⚠️ AI detected ${score}% text similarity with existing property!\n\nDo you still want to submit?`
  //       )
  //       if (!confirm) {
  //         setLoading(false)
  //         return
  //       }
  //     }

  //     // Step 2 — AI Image Duplicate Check
  //     if (images.length > 0) {
  //       try {
  //         const imgFormData = new FormData()
  //         imgFormData.append('property_id', 'temp_img_' + Date.now())
  //         images.forEach(image => imgFormData.append('images', image))

  //         const aiImageCheck = await API.post('/ai/check-image-duplicate', imgFormData, {
  //           headers: { 'Content-Type': 'multipart/form-data' }
  //         })

  //         if (aiImageCheck.data.result.is_duplicate) {
  //           const confirm = window.confirm(
  //             `⚠️ AI detected 100% image similarity with existing property!\n\nDo you still want to submit?`
  //           )
  //           if (!confirm) {
  //             setLoading(false)
  //             return
  //           }
  //         }
  //       } catch (imgError) {
  //         console.log('Image check error:', imgError)
  //         setError('Image check failed: ' + imgError.message)
  //       }
  //     }

  //     // Step 3 — Submit Property
  //     const data = new FormData()
  //     Object.keys(formData).forEach(key => data.append(key, formData[key]))
  //     images.forEach(image => data.append('images', image))

  //     await API.post('/properties', data, {
  //       headers: { 'Content-Type': 'multipart/form-data' }
  //     })

  //     setSuccess('Property listed successfully!')
  //     setTimeout(() => navigate('/my-properties'), 1500)

  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Something went wrong!')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError('')

  // ✅ Ek hi ID dono checks ke liye
  const tempId = 'temp_' + Date.now()

  try {
    // Step 1 — Text Check
    const aiTextCheck = await API.post('/ai/check-duplicate', {
      title: formData.title,
      description: formData.description,
      propertyId: tempId,  // ✅ same ID
    })

    if (aiTextCheck.data.result.is_duplicate) {
      const score = aiTextCheck.data.result.duplicate_score
      const confirm = window.confirm(
        `⚠️ AI detected ${score}% text similarity with existing property!\n\nDo you still want to submit?`
      )
      if (!confirm) { setLoading(false); return }
    }

    // Step 2 — Image Check
    if (images.length > 0) {
      try {
        const imgFormData = new FormData()
        imgFormData.append('property_id', tempId)  // ✅ same ID
        images.forEach(image => imgFormData.append('images', image))

        const aiImageCheck = await API.post('/ai/check-image-duplicate', imgFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        console.log('Image check result:', aiImageCheck.data)  // debug ke liye

        if (aiImageCheck.data.result.is_duplicate) {
          const score = aiImageCheck.data.result.duplicate_score
          const confirm = window.confirm(
            `⚠️ AI detected ${score}% image similarity with existing property!\n\nDo you still want to submit?`
          )
          if (!confirm) { setLoading(false); return }
        }
      } catch (imgError) {
        console.log('Image check error:', imgError)
      }
    }

    // Step 3 — Property Submit
    const data = new FormData()
    Object.keys(formData).forEach(key => data.append(key, formData[key]))
    images.forEach(image => data.append('images', image))

    await API.post('/properties', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    setSuccess('Property listed successfully!')
    setTimeout(() => navigate('/my-properties'), 1500)

  } catch (err) {
    setError(err.response?.data?.message || 'Something went wrong!')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-[#f8f9fc]">

      {/* Header */}
      <div className="bg-navy text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">List Property</p>
          <h1 className="text-3xl font-bold">Add New Property</h1>
          <p className="text-white/50 text-sm mt-1">Fill in the details to list your property</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Success */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-6">
            {success}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-navy mb-5">Basic Information</h2>
            <div className="space-y-4">

              {/* Title */}
              <div>
                <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Property Title</label>
                <input
                  type="text"
                  placeholder="e.g. 5 Marla Modern House in Gulberg"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Description</label>
                <textarea
                  placeholder="Describe your property in detail..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gold transition-colors resize-none"
                />
              </div>

              {/* Purpose + Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Purpose</label>
                  <select
                    value={formData.purpose}
                    onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gold transition-colors"
                  >
                    <option>For Sale</option>
                    <option>For Rent</option>
                  </select>
                </div>
                <div>
                  <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Property Type</label>
                  <select
                    value={formData.priceType}
                    onChange={e => setFormData({ ...formData, priceType: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gold transition-colors"
                  >
                    <option>House</option>
                    <option>Apartment</option>
                    <option>Plot</option>
                    <option>Commercial</option>
                    <option>Industrial</option>
                    <option>Farm House</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* Price & Size */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-navy mb-5">Price & Size</h2>
            <div className="grid grid-cols-2 gap-4">

              {/* Price */}
              <div>
                <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Price (PKR)</label>
                <div className="relative">
                  <FiDollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    placeholder="e.g. 5000000"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Size</label>
                <div className="relative">
                  <FiMaximize2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. 5 Marla, 1 Kanal"
                    value={formData.size}
                    onChange={e => setFormData({ ...formData, size: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

              {/* Beds */}
              <div>
                <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Bedrooms</label>
                <div className="relative">
                  <MdOutlineKingBed size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.beds}
                    onChange={e => setFormData({ ...formData, beds: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

              {/* Baths */}
              <div>
                <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Bathrooms</label>
                <div className="relative">
                  <MdOutlineShower size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.baths}
                    onChange={e => setFormData({ ...formData, baths: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-navy mb-5">Location</h2>
            <div className="space-y-4">

              {/* Area */}
              <div>
                <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Area</label>
                <select
                  value={formData.area}
                  onChange={e => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gold transition-colors"
                >
                  <option>Gulberg</option>
                  <option>DHA Faisalabad</option>
                  <option>Canal Road</option>
                  <option>Madina Town</option>
                  <option>Wapda City</option>
                  <option>Peoples Colony</option>
                  <option>Susan Road</option>
                  <option>Millat Town</option>
                  <option>Samanabad</option>
                  <option>D-Ground</option>
                  <option>Jinnah Colony</option>
                  <option>Eden Valley</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Full Address</label>
                <div className="relative">
                  <HiOutlineLocationMarker size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. House 12, Street 4, Gulberg 3, Faisalabad"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

              {/* Lat/Lng */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Latitude (Optional)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 31.4197"
                    value={formData.lat}
                    onChange={e => setFormData({ ...formData, lat: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">Longitude (Optional)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 73.0851"
                    value={formData.lng}
                    onChange={e => setFormData({ ...formData, lng: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-navy mb-5">Features & Amenities</h2>
            <div>
              <label className="text-navy text-xs font-semibold uppercase tracking-wide block mb-1.5">
                Features (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Gas Available, Electricity, Water Supply, Garage"
                value={formData.features}
                onChange={e => setFormData({ ...formData, features: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gold transition-colors"
              />
              <p className="text-gray-400 text-xs mt-1">Separate each feature with a comma</p>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-base font-bold text-navy mb-5">Property Images</h2>

            {/* Upload Area */}
            <label className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-gold transition-colors">
              <HiOutlinePhotograph size={32} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-400 font-medium">Click to upload images</p>
              <p className="text-xs text-gray-300 mt-1">PNG, JPG up to 5MB each</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {previews.map((preview, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden h-24">
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <HiOutlineX size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                Uploading Property...
              </>
            ) : 'Submit Property Listing'}
          </button>

        </form>
      </div>
    </div>
  )
}

export default AddProperty


