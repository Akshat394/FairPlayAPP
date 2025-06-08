import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@hooks/useRedux'
import { verifyToken } from '@store/slices/authSlice'

interface AuthGuardProps {
  children: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, token, isLoading } = useAppSelector(state => state.auth)

  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(verifyToken())
    }
  }, [token, isAuthenticated, dispatch])

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <div className="loading-text">Verifying authentication...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default AuthGuard