import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@hooks/useRedux'
import { login, register, clearError } from '@store/slices/authSlice'

const LoginScreen: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, isLoading, error } = useAppSelector(state => state.auth)
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'athlete' as 'athlete' | 'coach' | 'doctor'
  })

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isRegisterMode) {
      if (formData.password !== formData.confirmPassword) {
        return
      }
      dispatch(register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      }))
    } else {
      dispatch(login({
        email: formData.email,
        password: formData.password
      }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="ui-panel w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            FairPlay Metaverse
          </h1>
          <p className="text-gray-300">
            {isRegisterMode ? 'Join the community' : 'Welcome back'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="ui-input"
                placeholder="Enter your username"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="ui-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="ui-input"
              placeholder="Enter your password"
              required
            />
          </div>

          {isRegisterMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="ui-input"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="ui-input"
                  required
                >
                  <option value="athlete">Athlete</option>
                  <option value="coach">Coach</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="ui-button w-full"
          >
            {isLoading ? 'Please wait...' : (isRegisterMode ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode)
              dispatch(clearError())
            }}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            {isRegisterMode 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen