import { Button } from '@/components/ui/Button'

export function OAuthButtons() {
  return (
    <>
      <Button
        variant="outline"
        className="w-full mt-8 flex items-center px-6 font-medium text-base"
      >
        <img src="/icons/google-icon.svg" alt="Google" className="w-6 h-6 mr-2" />
        Sign Up with Google
      </Button>

      <Button
        variant="outline"
        className="w-full mt-2 flex items-center px-6 font-medium text-base"
      >
        <img src="/icons/x-icon.svg" alt="Twitter" className="w-6 h-6 mr-2" />
        Sign Up with Twitter
      </Button>
    </>
  )
}
