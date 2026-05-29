const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Property = require('./models/Property')
const User = require('./models/User')

dotenv.config()

const properties = [
  {
    title: '5 Marla Modern House in Gulberg III',
    description: 'Beautiful 5 Marla modern house in Gulberg III Faisalabad. Features 3 bedrooms, 2 bathrooms, modern kitchen, and well-maintained lawn. Located near main market, schools, and hospitals.',
    price: 18500000,
    priceType: 'House',
    purpose: 'For Sale',
    area: 'Gulberg',
    size: '5 Marla',
    beds: 3,
    baths: 2,
    features: ['Gas Available', 'Electricity', 'Water Supply', 'Garage', 'Garden'],
    images: [
      { public_id: 'seed/house1', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80' }
    ],
    location: { address: 'Gulberg 3, Faisalabad', lat: 31.4197, lng: 73.0851 },
    isVerified: true, isFeatured: true, status: 'active',
  },
  {
    title: '3 Bed Luxury Apartment on Canal Road',
    description: 'Luxury 3 bedroom apartment on Canal Road Faisalabad. 4th floor with beautiful view. Modern kitchen, spacious bedrooms, attached bathrooms. 24/7 security and backup generator.',
    price: 45000,
    priceType: 'Apartment',
    purpose: 'For Rent',
    area: 'Canal Road',
    size: '10 Marla',
    beds: 3,
    baths: 2,
    features: ['Elevator', 'Backup Generator', '24/7 Security', 'Parking', 'Balcony'],
    images: [
      { public_id: 'seed/apt1', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80' }
    ],
    location: { address: 'Canal Road, Faisalabad', lat: 31.4150, lng: 73.0901 },
    isVerified: true, isFeatured: false, status: 'active',
  },
  {
    title: 'Double Storey House in Peoples Colony',
    description: 'Stunning double storey house in Peoples Colony. 4 bedrooms, 3 bathrooms, large drawing room and beautiful garden. Recently renovated with modern fittings.',
    price: 24000000,
    priceType: 'House',
    purpose: 'For Sale',
    area: 'Peoples Colony',
    size: '10 Marla',
    beds: 4,
    baths: 3,
    features: ['Double Storey', 'Garden', 'Gas Available', 'Electricity', 'Security', 'Garage'],
    images: [
      { public_id: 'seed/house2', url: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=80' }
    ],
    location: { address: 'Peoples Colony, Faisalabad', lat: 31.4280, lng: 73.0791 },
    isVerified: true, isFeatured: false, status: 'active',
  },
  {
    title: '10 Marla Residential Plot in DHA',
    description: 'Prime location 10 Marla plot in DHA Faisalabad. All utilities available. Ideal for building your dream home in one of the most prestigious societies.',
    price: 8500000,
    priceType: 'Plot',
    purpose: 'For Sale',
    area: 'DHA Faisalabad',
    size: '10 Marla',
    beds: 0,
    baths: 0,
    features: ['Gas Available', 'Electricity', 'Water Supply', 'Security', 'Corner Plot'],
    images: [
      { public_id: 'seed/plot1', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80' }
    ],
    location: { address: 'DHA Faisalabad', lat: 31.3780, lng: 73.0350 },
    isVerified: true, isFeatured: true, status: 'active',
  },
  {
    title: '2 Bed Flat in Madina Town',
    description: 'Well maintained 2 bedroom flat in Madina Town. Ground floor, easy access. Close to main bazaar and all facilities. Ideal for small family.',
    price: 25000,
    priceType: 'Apartment',
    purpose: 'For Rent',
    area: 'Madina Town',
    size: '5 Marla',
    beds: 2,
    baths: 1,
    features: ['Gas Available', 'Electricity', 'Water Supply', 'Parking', 'Security'],
    images: [
      { public_id: 'seed/apt2', url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80' }
    ],
    location: { address: 'Madina Town, Faisalabad', lat: 31.4350, lng: 73.1050 },
    isVerified: true, isFeatured: false, status: 'active',
  },
  {
    title: '1 Kanal Luxury House in Wapda City',
    description: 'Grand 1 Kanal luxury house in Wapda City. Features 5 bedrooms, 4 bathrooms, huge lawn, state-of-the-art kitchen. Perfect for large family seeking luxury living.',
    price: 44500000,
    priceType: 'House',
    purpose: 'For Sale',
    area: 'Wapda City',
    size: '1 Kanal',
    beds: 5,
    baths: 4,
    features: ['Lawn', 'Servant Quarter', 'Garage', 'Gas Available', 'Solar Panels', 'Security'],
    images: [
      { public_id: 'seed/house3', url: 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&q=80' }
    ],
    location: { address: 'Wapda City, Faisalabad', lat: 31.4450, lng: 73.1150 },
    isVerified: true, isFeatured: true, status: 'active',
  },
  {
    title: '5 Marla House in Jinnah Colony',
    description: 'Well built 5 Marla house in Jinnah Colony. Ground plus 1 floor. 3 bedrooms, 2 bathrooms, drawing room, and kitchen. Close to all amenities.',
    price: 12000000,
    priceType: 'House',
    purpose: 'For Sale',
    area: 'Jinnah Colony',
    size: '5 Marla',
    beds: 3,
    baths: 2,
    features: ['Gas Available', 'Electricity', 'Water Supply', 'Security', 'Garage'],
    images: [
      { public_id: 'seed/house4', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80' }
    ],
    location: { address: 'Jinnah Colony, Faisalabad', lat: 31.4050, lng: 73.0650 },
    isVerified: true, isFeatured: false, status: 'active',
  },
  {
    title: '7 Marla House for Rent in Susan Road',
    description: '7 Marla house available for rent on Susan Road. Ideal location near schools and hospitals. Well maintained with modern fixtures throughout.',
    price: 35000,
    priceType: 'House',
    purpose: 'For Rent',
    area: 'Susan Road',
    size: '7 Marla',
    beds: 3,
    baths: 2,
    features: ['Gas Available', 'Electricity', 'Water Supply', 'Garage', 'Garden', 'Security'],
    images: [
      { public_id: 'seed/house5', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' }
    ],
    location: { address: 'Susan Road, Faisalabad', lat: 31.4550, lng: 73.1250 },
    isVerified: true, isFeatured: false, status: 'active',
  },
  {
    title: '5 Marla Plot in Samanabad',
    description: '5 Marla residential plot in Samanabad. Ideal location with all utilities available. Ready for construction. Near main road.',
    price: 5500000,
    priceType: 'Plot',
    purpose: 'For Sale',
    area: 'Samanabad',
    size: '5 Marla',
    beds: 0,
    baths: 0,
    features: ['Gas Available', 'Electricity', 'Water Supply', 'Near Main Road'],
    images: [
      { public_id: 'seed/plot2', url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80' }
    ],
    location: { address: 'Samanabad, Faisalabad', lat: 31.4320, lng: 73.0720 },
    isVerified: true, isFeatured: false, status: 'active',
  },
  {
    title: '1 Bed Apartment in Millat Town',
    description: 'Cozy 1 bedroom apartment in Millat Town. Perfect for bachelor or small family. All utilities available. Easy access to main road.',
    price: 18000,
    priceType: 'Apartment',
    purpose: 'For Rent',
    area: 'Millat Town',
    size: '3 Marla',
    beds: 1,
    baths: 1,
    features: ['Gas Available', 'Electricity', 'Water Supply', 'Parking'],
    images: [
      { public_id: 'seed/apt3', url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80' }
    ],
    location: { address: 'Millat Town, Faisalabad', lat: 31.4620, lng: 73.1320 },
    isVerified: true, isFeatured: false, status: 'active',
  },
  {
    title: '1 Kanal House in D-Ground',
    description: 'Spacious 1 Kanal house in D-Ground. Prime location near main market. Features 5 bedrooms, large lawn, servant quarter. Ideal for large family.',
    price: 32000000,
    priceType: 'House',
    purpose: 'For Sale',
    area: 'D-Ground',
    size: '1 Kanal',
    beds: 5,
    baths: 4,
    features: ['Lawn', 'Servant Quarter', 'Garage', 'Gas Available', 'Electricity', 'Security'],
    images: [
      { public_id: 'seed/house6', url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80' }
    ],
    location: { address: 'D-Ground, Faisalabad', lat: 31.4180, lng: 73.0780 },
    isVerified: true, isFeatured: true, status: 'active',
  },
  {
    title: 'Commercial Shop at D-Ground Main Market',
    description: 'Prime commercial shop at D-Ground Main Market. High footfall area. Ideal for any retail business. Ground floor with easy access.',
    price: 24000000,
    priceType: 'Commercial',
    purpose: 'For Sale',
    area: 'D-Ground',
    size: '400 sqft',
    beds: 0,
    baths: 0,
    features: ['Main Road Facing', 'Electricity', 'Water Supply', 'High Footfall', 'Parking Nearby'],
    images: [
      { public_id: 'seed/commercial1', url: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80' }
    ],
    location: { address: 'D-Ground, Faisalabad', lat: 31.4170, lng: 73.0770 },
    isVerified: true, isFeatured: false, status: 'active',
  },
  {
    title: '3 Bed Apartment in Eden Valley',
    description: 'Beautiful 3 bedroom apartment in Eden Valley. Modern design with all facilities. Peaceful environment ideal for families.',
    price: 30000,
    priceType: 'Apartment',
    purpose: 'For Rent',
    area: 'Eden Valley',
    size: '8 Marla',
    beds: 3,
    baths: 2,
    features: ['Elevator', 'Parking', 'Gas Available', 'Electricity', 'Security', 'Balcony'],
    images: [
      { public_id: 'seed/apt4', url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80' }
    ],
    location: { address: 'Eden Valley, Faisalabad', lat: 31.3950, lng: 73.0550 },
    isVerified: true, isFeatured: false, status: 'active',
  },
  {
    title: '5 Marla House in Susan Road',
    description: 'Neat and clean 5 Marla house in Susan Road. Well maintained with tiled floors. 3 bedrooms, drawing room, and kitchen.',
    price: 9500000,
    priceType: 'House',
    purpose: 'For Sale',
    area: 'Susan Road',
    size: '5 Marla',
    beds: 3,
    baths: 2,
    features: ['Gas Available', 'Electricity', 'Water Supply', 'Security', 'Garage'],
    images: [
      { public_id: 'seed/house7', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80' }
    ],
    location: { address: 'Susan Road, Faisalabad', lat: 31.4560, lng: 73.1260 },
    isVerified: true, isFeatured: false, status: 'active',
  },
  {
    title: '7 Marla House in Peoples Colony',
    description: '7 Marla house in Peoples Colony. Double storey with 4 bedrooms, 3 bathrooms. Spacious drawing room and modern kitchen.',
    price: 15000000,
    priceType: 'House',
    purpose: 'For Sale',
    area: 'Peoples Colony',
    size: '7 Marla',
    beds: 4,
    baths: 3,
    features: ['Double Storey', 'Gas Available', 'Electricity', 'Water Supply', 'Security', 'Garden'],
    images: [
      { public_id: 'seed/house8', url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80' }
    ],
    location: { address: 'Peoples Colony, Faisalabad', lat: 31.4290, lng: 73.0800 },
    isVerified: true, isFeatured: false, status: 'active',
  },
  {
    title: '10 Marla House for Rent in Gulberg',
    description: 'Spacious 10 Marla house for rent in Gulberg. Prime location with all amenities nearby. 4 bedrooms, large lawn, servant quarter.',
    price: 50000,
    priceType: 'House',
    purpose: 'For Rent',
    area: 'Gulberg',
    size: '10 Marla',
    beds: 4,
    baths: 3,
    features: ['Lawn', 'Servant Quarter', 'Garage', 'Gas Available', 'Electricity', '24/7 Security'],
    images: [
      { public_id: 'seed/house9', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80' }
    ],
    location: { address: 'Gulberg, Faisalabad', lat: 31.4210, lng: 73.0860 },
    isVerified: true, isFeatured: false, status: 'active',
  },
  {
    title: '10 Marla House in Wapda City',
    description: '10 Marla house in Wapda City. Modern design with 4 bedrooms, drawing room, and beautiful lawn. All utilities available.',
    price: 28000000,
    priceType: 'House',
    purpose: 'For Sale',
    area: 'Wapda City',
    size: '10 Marla',
    beds: 4,
    baths: 3,
    features: ['Lawn', 'Gas Available', 'Electricity', 'Water Supply', 'Security', 'Solar Panels'],
    images: [
      { public_id: 'seed/house10', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80' }
    ],
    location: { address: 'Wapda City, Faisalabad', lat: 31.4460, lng: 73.1160 },
    isVerified: true, isFeatured: true, status: 'active',
  },
  {
    title: '3 Marla Plot in Madina Town',
    description: '3 Marla plot in Madina Town. Residential area with all utilities. Ideal for construction of small house.',
    price: 4500000,
    priceType: 'Plot',
    purpose: 'For Sale',
    area: 'Madina Town',
    size: '3 Marla',
    beds: 0,
    baths: 0,
    features: ['Gas Available', 'Electricity', 'Water Supply', 'Near Main Road'],
    images: [
      { public_id: 'seed/plot3', url: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=800&q=80' }
    ],
    location: { address: 'Madina Town, Faisalabad', lat: 31.4360, lng: 73.1060 },
    isVerified: true, isFeatured: false, status: 'active',
  },
  {
    title: '2 Bed Apartment in Samanabad',
    description: '2 bedroom apartment in Samanabad. Clean and well maintained. Close to schools and markets. Ideal for small families.',
    price: 20000,
    priceType: 'Apartment',
    purpose: 'For Rent',
    area: 'Samanabad',
    size: '4 Marla',
    beds: 2,
    baths: 1,
    features: ['Gas Available', 'Electricity', 'Water Supply', 'Parking', 'Security'],
    images: [
      { public_id: 'seed/apt5', url: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80' }
    ],
    location: { address: 'Samanabad, Faisalabad', lat: 31.4330, lng: 73.0730 },
    isVerified: true, isFeatured: false, status: 'active',
  },
  {
    title: '1 Kanal Corner House in DHA Faisalabad',
    description: 'Magnificent 1 Kanal corner house in DHA Faisalabad. Ultra luxury with 6 bedrooms, 5 bathrooms, home theater, and swimming pool.',
    price: 65000000,
    priceType: 'House',
    purpose: 'For Sale',
    area: 'DHA Faisalabad',
    size: '1 Kanal',
    beds: 6,
    baths: 5,
    features: ['Swimming Pool', 'Home Theater', 'Servant Quarter', 'Garage', 'Lawn', 'Solar Panels', '24/7 Security'],
    images: [
      { public_id: 'seed/house11', url: 'https://images.unsplash.com/photo-1600047509782-20d39509f26d?w=800&q=80' }
    ],
    location: { address: 'DHA Faisalabad', lat: 31.3790, lng: 73.0360 },
    isVerified: true, isFeatured: true, status: 'active',
  },
]

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB Connected!')

    // Find admin user
    const adminUser = await User.findOne({ role: 'admin' })
    if (!adminUser) {
      console.log('❌ No admin user found! Please create admin first.')
      process.exit(1)
    }

    console.log(`✅ Admin found: ${adminUser.name}`)

    // Delete existing seed properties
    await Property.deleteMany({ 'images.public_id': /^seed\// })
    console.log('🗑️ Old seed properties deleted!')

    // Add owner to each property
    const propertiesWithOwner = properties.map(p => ({
      ...p,
      owner: adminUser._id,
    }))

    // Insert properties
    await Property.insertMany(propertiesWithOwner)
    console.log(`✅ ${properties.length} properties seeded successfully!`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Seed error:', error.message)
    process.exit(1)
  }
}

seedDB()