import { Button } from '@/components/ui/Button'

export function OAuthButtons() {
  return (
    <>
      <Button
        variant="outline"
        className="w-full mt-8 flex items-center px-6 font-medium text-base py-2.5"
      >
        <img src="/icons/google-icon.svg" alt="Google" className="w-6 h-6 mr-2" />
        Sign Up with Google
      </Button>

      <Button
        variant="outline"
        className="w-full mt-2 flex font-medium items-center px-6 text-base py-2.5"
      >
        <img src="/icons/x-icon.svg" alt="Twitter" className="w-6 h-6 mr-2" />
        Sign Up with Twitter
      </Button>
    </>
  )
}
