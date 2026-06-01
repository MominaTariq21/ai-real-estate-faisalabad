const Property = require('../models/Property')
const cloudinary = require('cloudinary').v2

// ✅ Load existing properties into AI store on server start
const loadPropertiesToAI = async () => {
  try {
    const axios = require('axios')
    const FormData = require('form-data')
    
    const properties = await Property.find({}).limit(100)
    console.log(`🔄 Loading ${properties.length} properties into AI store...`)

    for (const prop of properties) {
      const aiForm = new FormData()
      aiForm.append('title', prop.title)
      aiForm.append('description', prop.description)
      aiForm.append('property_id', prop._id.toString())
      await axios.post('http://localhost:8000/detect-duplicate-combined', aiForm, {
        headers: aiForm.getHeaders()
      })

      if (prop.images && prop.images.length > 0) {
        const imgForm = new FormData()
        imgForm.append('property_id', prop._id.toString())
        for (const img of prop.images) {
          try {
            const response = await axios.get(img.url, { responseType: 'arraybuffer' })
            imgForm.append('images', Buffer.from(response.data), {
              filename: 'img.jpg',
              contentType: 'image/jpeg'
            })
          } catch (e) {}
        }
        await axios.post('http://localhost:8000/detect-duplicate-image', imgForm, {
          headers: imgForm.getHeaders()
        })
      }
    }
    console.log('✅ AI store loaded!')
  } catch (err) {
    console.log('AI load skipped:', err.message)
  }
}

// @desc    Get All Properties
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const {
      purpose,
      type,
      area,
      minPrice,
      maxPrice,
      beds,
      search,
      page = 1,
      limit = 9,
    } = req.query

    let query = { status: 'active', isDuplicate: false }

    if (purpose) query.purpose = purpose
    if (type) query.priceType = type
    if (area) query.area = area
    if (beds) query.beds = { $gte: parseInt(beds) }
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = parseInt(minPrice)
      if (maxPrice) query.price.$lte = parseInt(maxPrice)
    }
    if (search) {
      query.$text = { $search: search }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const total = await Property.countDocuments(query)
    const properties = await Property.find(query)
      .populate('owner', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      properties,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get Single Property
// @route   GET /api/properties/:id
// @access  Public
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone avatar role')

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' })
    }

    property.views += 1
    await property.save()

    res.status(200).json({ success: true, property })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Create Property
// @route   POST /api/properties
// @access  Private
const createProperty = async (req, res) => {

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  try {
    const {
      title,
      description,
      price,
      priceType,
      purpose,
      area,
      size,
      beds,
      baths,
      features,
      lat,
      lng,
      address,
    } = req.body

    // Upload Images to Cloudinary
    let images = []
    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images]

      for (const file of files) {
        try {
          const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'ai-real-estate',
            transformation: [{ width: 800, height: 600, crop: 'fill' }],
          })
          images.push({
            public_id: result.public_id,
            url: result.secure_url,
          })
        } catch (uploadError) {
          console.log('Cloudinary Upload Error:', uploadError.message)
        }
      }
    }

    const property = await Property.create({
      title,
      description,
      price: parseInt(price),
      priceType,
      purpose,
      area,
      size,
      beds: parseInt(beds) || 0,
      baths: parseInt(baths) || 0,
      features: features ? features.split(',') : [],
      images,
      location: {
        address,
        lat: parseFloat(lat) || 0,
        lng: parseFloat(lng) || 0,
      },
      owner: req.user._id,
    })

    // ✅ AI Service ko text + images register karo
    try {
      const axios = require('axios')
      const FormData = require('form-data')

      // Text register
      const aiForm = new FormData()
      aiForm.append('title', property.title)
      aiForm.append('description', property.description)
      aiForm.append('property_id', property._id.toString())
      await axios.post('http://localhost:8000/detect-duplicate-combined', aiForm, {
        headers: aiForm.getHeaders()
      })

      // ✅ Image hashes bhi register karo
      if (property.images.length > 0) {
        const imgForm = new FormData()
        imgForm.append('property_id', property._id.toString())
        for (const img of property.images) {
          try {
            const response = await axios.get(img.url, { responseType: 'arraybuffer' })
            imgForm.append('images', Buffer.from(response.data), {
              filename: 'img.jpg',
              contentType: 'image/jpeg'
            })
          } catch (e) {}
        }
        await axios.post('http://localhost:8000/detect-duplicate-image', imgForm, {
          headers: imgForm.getHeaders()
        })
      }
    } catch (aiErr) {
      console.log('AI register skipped:', aiErr.message)
    }

    res.status(201).json({
      success: true,
      message: 'Property listed successfully!',
      property,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Update Property
// @route   PUT /api/properties/:id
// @access  Private
const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' })
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property' })
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({ success: true, message: 'Property updated successfully!', property })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Delete Property
// @route   DELETE /api/properties/:id
// @access  Private
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' })
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' })
    }

    for (const image of property.images) {
      try {
        await cloudinary.uploader.destroy(image.public_id)
      } catch (err) {
        console.log('Cloudinary delete skipped:', err.message)
      }
    }

    await property.deleteOne()

    res.status(200).json({ success: true, message: 'Property deleted successfully!' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Get My Properties
// @route   GET /api/properties/my
// @access  Private
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 })

    res.status(200).json({ success: true, total: properties.length, properties })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// @desc    Toggle Favorite
// @route   POST /api/properties/:id/favorite
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    const user = req.user
    const propertyId = req.params.id

    const isFavorite = user.favorites.includes(propertyId)

    if (isFavorite) {
      user.favorites = user.favorites.filter(id => id.toString() !== propertyId)
    } else {
      user.favorites.push(propertyId)
    }

    await user.save()

    res.status(200).json({
      success: true,
      message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      favorites: user.favorites,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  toggleFavorite,
  loadPropertiesToAI  // ✅ added
}