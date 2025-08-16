import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function RegistrationForm() {
  return (
    <div className="space-y-4">
      <Input type="email" placeholder="Email address" />
      <Input type="password" placeholder="Password" />
      <Input type="password" placeholder="Confirm password" />
      <Button className="w-full mt-4 py-3 bg-blue-500 hover:bg-blue-600 font-normal text-base">
        Continue
      </Button>
    </div>
  )
}
