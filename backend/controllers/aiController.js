const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
 
const AI_SERVICE_URL = 'http://localhost:8000'
 
// @desc    Check Text Duplicate
const checkDuplicate = async (req, res) => {
  try {
    const { title, description, propertyId } = req.body
 
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('property_id', propertyId || 'temp_' + Date.now())
 
    const response = await axios.post(
      `${AI_SERVICE_URL}/detect-duplicate-combined`,
      formData,
      { headers: formData.getHeaders() }
    )
 
    res.status(200).json({
      success: true,
      result: response.data,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'AI Service unavailable — ' + error.message,
    })
  }
}
 
// @desc    Check Image Duplicate
const checkImageDuplicate = async (req, res) => {
  try {
    const propertyId = req.body?.propertyId || 'temp_' + Date.now()
 
    // Debug: dekho kya aa raha hai
    console.log('📸 Image check request received')
    console.log('req.files:', req.files)
    console.log('req.body:', req.body)
 
    // Files check — express-fileupload se
    if (!req.files || !req.files.images) {
      console.log('❌ No images found in req.files')
      return res.status(400).json({
        success: false,
        message: 'No images provided',
      })
    }
 
    const formData = new FormData()
    formData.append('property_id', propertyId)
 
    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images]
 
    console.log(`📦 Sending ${files.length} image(s) to AI service...`)
 
    for (const file of files) {
      formData.append('images', fs.createReadStream(file.tempFilePath), {
        filename: file.name,
        contentType: file.mimetype,
      })
    }
 
    const response = await axios.post(
      `${AI_SERVICE_URL}/detect-duplicate-image`,
      formData,
      { headers: formData.getHeaders() }
    )
 
    console.log('🤖 AI Image response:', response.data)
 
    res.status(200).json({
      success: true,
      result: response.data,
    })
  } catch (error) {
    console.log('❌ Image check error:', error.message)
    res.status(500).json({
      success: false,
      message: 'AI Image check failed — ' + error.message,
    })
  }
}
 
// @desc    Get AI Service Status
const getAIStatus = async (req, res) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/`)
    res.status(200).json({
      success: true,
      status: 'AI Service Running',
      data: response.data,
    })
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'AI Service Offline',
      message: error.message,
    })
  }
}
 
module.exports = { checkDuplicate, checkImageDuplicate, getAIStatus }