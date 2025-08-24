"use client"

import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { AuthAPI } from "@/lib/api"
import { useRouter } from "next/navigation"

type FormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function RegistrationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (data.password !== data.confirmPassword) {
      setMessage("Passwords do not match")
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      await AuthAPI.registerUser(data.name, data.email, data.password)
      setMessage("✅ User registered successfully")
      setTimeout(() => router.push('/login'), 1000)
    } catch (err: any) {
      let errorMessage = err.message || 'An unexpected error occurred. Please try again'

      if (errorMessage.includes('Email already in use')) {
        errorMessage = 'This email is already registered'
      } else if (errorMessage.includes('Invalid email format')) {
        errorMessage = 'Please enter a valid email address'
      } else if (errorMessage.includes('Request failed with status')) {
        const status = err.message.match(/status (\d+)/)?.[1]
        errorMessage = status === '403'
          ? 'CSRF token invalid. Please refresh the page and try again'
          : status === '500'
            ? 'Server error. Please try again later'
            : 'Network error. Check your connection and try again'
      }

      setMessage(`❌ ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="text"
        placeholder="Name"
        {...register("name", {
          required: "Name is required",
          minLength: { value: 2, message: "Name must be at least 2 characters" },
        })}
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

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
          minLength: { value: 6, message: "Password must be at least 6 characters" },
        })}
      />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

      <Input
        type="password"
        placeholder="Confirm password"
        {...register("confirmPassword", {
          required: "Confirm password is required",
        })}
      />
      {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

      <Button type="submit" className="w-full mt-4 py-3 bg-blue-500 hover:bg-blue-600" disabled={loading}>
        {loading ? "Registering..." : "Continue"}
      </Button>

      {message && <p className="text-center text-sm">{message}</p>}
    </form>
  )
}
