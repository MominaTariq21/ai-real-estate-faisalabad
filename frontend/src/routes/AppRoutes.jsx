import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Home from '../pages/Home'
import Properties from '../pages/Properties'
import PropertyDetail from '../pages/PropertyDetail'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Agents from '../pages/Agents'
import About from '../pages/About'
import Contact from '../pages/Contact'
import AddProperty from '../pages/AddProperty'
import Profile from '../pages/Profile'
import MyProperties from '../pages/MyProperties'
import Chat from '../pages/Chat'
import Admin from '../pages/Admin'
import AdminProperties from '../pages/AdminProperties'
import AdminUsers from '../pages/AdminUsers'

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-properties" element={<MyProperties />} />
        <Route path="/chat/:roomId" element={<Chat />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/properties" element={<AdminProperties />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default AppRoutes