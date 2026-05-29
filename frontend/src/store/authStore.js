import { create } from 'zustand'
import API from '../utils/axios'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  // Register
  register: async (formData) => {
    set({ loading: true, error: null })
    try {
      const { data } = await API.post('/auth/register', formData)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      set({ user: data.user, token: data.token, loading: false })
      return { success: true, message: data.message }
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || 'Registration failed' })
      return { success: false, message: error.response?.data?.message || 'Registration failed' }
    }
  },

  // Login
  login: async (formData) => {
    set({ loading: true, error: null })
    try {
      const { data } = await API.post('/auth/login', formData)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      set({ user: data.user, token: data.token, loading: false })
      return { success: true, message: data.message }
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || 'Login failed' })
      return { success: false, message: error.response?.data?.message || 'Login failed' }
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },

  // Clear Error
  clearError: () => set({ error: null }),
}))

export default useAuthStore