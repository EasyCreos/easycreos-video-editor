"use client"

import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth' 
import Image from 'next/image'

export function Header() {
  const { user, loading, isAuthenticated} = useAuth()

  return (
    <header className="absolute top-0 left-0 w-full flex justify-between items-center py-4 z-50 px-[150px]">
      <div className="flex items-center space-x-10">
        <div className="font-extrabold text-lg">EasyCreos</div>
        <nav className="hidden md:flex space-x-10 text-sm font-semibold">
          <a href="#" className="hover:underline">Introduce</a>
          <a href="#" className="hover:underline">About Us</a>
        </nav>
      </div>

      {loading ? null : (
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2">
                <Image
                  src={user?.avatarUrl || "/icons/def-user.png"}
                  alt={user?.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="font-medium">{user?.name || user?.email}</span>
              </div>
            </>
          ) : (
            <>
              <Button className="text-sm">Sign up</Button>
              <Button variant="outline" className="text-sm">Log in</Button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
