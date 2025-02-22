'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/components/providers/user-provider'
import Cookies from 'js-cookie'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { updateUserFromToken } = useUser()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    checkAuth()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    const cookieToken = Cookies.get('auth-token')
    
    if (!token || !cookieToken) {
      localStorage.removeItem('token')
      Cookies.remove('auth-token')
      router.push('/auth')
      return
    }

    if (token !== cookieToken) {
      // Token mismatch, clear both and redirect
      localStorage.removeItem('token')
      Cookies.remove('auth-token')
      router.push('/auth')
      return
    }

    updateUserFromToken()
    setAuthorized(true)
  }

  if (!authorized) {
    return null
  }

  return <>{children}</>
}