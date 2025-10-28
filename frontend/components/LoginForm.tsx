"use client"

import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AuthAPI } from '@/lib/api'
import { useRouter } from "next/navigation"

type LoginFormData = {
  email: string
  password: string
}

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setLoading(true)
    setMessage(null)

    try {
      const response = await AuthAPI.loginUser(data.email, data.password)

      if (response.user) {
        setMessage(`✅ Welcome back, ${response.user.name}!`)

        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
    } catch (err: any) {
      console.error('Login error:', err)

      let errorMessage = 'Login failed'

      if (err.status === 401) {
        errorMessage = 'Invalid email or password'
      } else if (err.status === 403) {
        errorMessage = 'Account is deactivated'
      } else if (err.status === 400) {
        errorMessage = 'Please check your email and password'
      } else if (err.message) {
        errorMessage = err.message
      }

      setMessage(`❌ ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="email"
        placeholder="Email address"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email format",
          },
        })}
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <Input
        type="password"
        placeholder="Password"
        {...register("password", {
          required: "Password is required",
        })}
      />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

      <a href="/forgot-password" className="block text-blue-700 hover:underline font-semibold text-right">
        Forgot your password?
      </a>

      <Button
        type="submit"
        className="w-full mt-4 py-3"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Continue"}
      </Button>

      {message && <p className="text-center text-sm mt-2">{message}</p>}
    </form>
  )
}
