import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom Gold Marker
const goldIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const PropertyMap = ({ lat, lng, title, price, location }) => {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={goldIcon}>
        <Popup>
          <div style={{ minWidth: '150px' }}>
            <div style={{ fontWeight: '700', fontSize: '13px', color: '#0D1B2A' }}>
              {title}
            </div>
            <div style={{ color: '#D4AF37', fontWeight: '600', fontSize: '12px', marginTop: '4px' }}>
              {price}
            </div>
            <div style={{ color: '#888', fontSize: '11px', marginTop: '2px' }}>
              {location}
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default PropertyMap