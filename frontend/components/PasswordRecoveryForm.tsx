import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function PasswordRecoveryForm() {
  return (
    <div className="space-y-4">
      <p className="text-base text-gray-950 mb-8">
        Please enter your email address so<br />we can send you a confirmation code.
      </p>
      <Input type="email" placeholder="Email address" />
      <Button className="w-full mt-4 py-3 bg-blue-500 hover:bg-blue-600 font-normal text-base">
        Continue
      </Button>
    </div>
  )
}
