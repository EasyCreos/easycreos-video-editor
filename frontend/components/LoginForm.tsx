import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function LoginForm() {
  return (
    <div className="space-y-4">
      <Input type="email" placeholder="Email address" />
      <Input type="password" placeholder="Password" />
      <a href="/forgot-password" className="block text-blue-700 hover:underline font-semibold text-base text-right">
        Forgot your password?
      </a>
      <Button className="w-full mt-4 py-3 bg-blue-500 hover:bg-blue-600 font-normal text-base">
        Continue
      </Button>
    </div>
  )
}
