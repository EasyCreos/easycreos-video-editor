import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function PasswordRecoveryForm() {
  return (
    <div className="space-y-4">
      <p className="mb-8">
        Please enter your email address so<br />we can send you a confirmation code.
      </p>
      <Input type="email" placeholder="Email address" />
      <Button className="w-full mt-4 py-3">
        Continue
      </Button>
    </div>
  )
}
