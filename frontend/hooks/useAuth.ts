import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthAPI } from '@/lib/api'

interface User {
    id: string
    email: string
    name: string
    avatarUrl?: string
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        checkUserAuth()
    }, [])

    const checkUserAuth = async () => {
        try {
            const userData = await AuthAPI.getCurrentUser()
            setUser(userData)
        } catch (error) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            await AuthAPI.logoutUser()
            setUser(null)
            router.push('/login')
        } catch (error) {
            console.error('Logout error:', error)
            setUser(null)
            router.push('/login')
        }
    }

    const refreshAuth = () => {
        checkUserAuth()
    }

    return {
        user,
        loading,
        logout,
        refreshAuth,
        isAuthenticated: !!user
    }
}
