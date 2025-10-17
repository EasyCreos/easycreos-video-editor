"use client"

import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function Header() {
  return (
    <header className="absolute top-0 left-0 w-full flex justify-between items-center py-4 z-50 px-[150px]">
      <div className="flex items-center space-x-15">
        <Link href="/" className="font-extrabold text-lg">
          EasyCreos
        </Link>
        <nav className="hidden md:flex space-x-15 text-base font-semibold">
          <a href="#" className="hover:underline">Introduce</a>
          <a href="#" className="hover:underline">About Us</a>
        </nav>
      </div>
      <div className="hidden md:flex items-center space-x-2">
        <Link href="/register">
          <Button className="text-sm">Sign up</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" className="text-sm">Log in</Button>
        </Link>
      </div>
    </header>
  );
}
