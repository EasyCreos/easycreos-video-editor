"use client"

import { Button } from '@/components/ui/Button';

interface OAuthButtonsProps {
  googleText: string
  xText: string
}

export function OAuthButtons({ googleText, xText }: OAuthButtonsProps) {
  const handleClick = (provider: string) => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}`;
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full mt-8 flex items-center px-5 py-3"
        onClick={() => handleClick('google')}
      >
        <img src="/icons/google-icon.svg" alt="Google" className="w-6 h-6 mr-2" />
        {googleText} with Google
      </Button>
      <Button
        variant="outline"
        className="w-full mt-2 flex items-center px-5 py-3"
        onClick={() => handleClick('twitter')}
      >
        <img src="/icons/x-icon.svg" alt="X" className="w-6 h-6 mr-2" />
        {xText} with X
      </Button>
    </>
  )
}
