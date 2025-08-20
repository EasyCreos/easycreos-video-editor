"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { AuthAPI } from "@/lib/api"

type FormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function RegistrationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      setMessage("Passwords do not match")
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      await AuthAPI.registerUser(data.email, data.password)
      setMessage("✅ User registered successfully")
    } catch (err: any) {
      setMessage(`❌ ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input type="name" placeholder="Name" {...register("name", { required: true })} />
      {errors.name && <p className="text-red-500 text-sm">Name is required</p>}

      <Input type="email" placeholder="Email address" {...register("email", { required: true })} />
      {errors.email && <p className="text-red-500 text-sm">Email is required</p>}

      <Input type="password" placeholder="Password" {...register("password", { required: true })} />
      {errors.password && <p className="text-red-500 text-sm">Password is required</p>}

      <Input type="password" placeholder="Confirm password" {...register("confirmPassword", { required: true })} />
      {errors.confirmPassword && <p className="text-red-500 text-sm">Confirm password is required</p>}

      <Button type="submit" className="w-full mt-4 py-3 bg-blue-500 hover:bg-blue-600" disabled={loading}>
        {loading ? "Registering..." : "Continue"}
      </Button>

      {message && <p className="text-center text-sm">{message}</p>}
    </form>
  )
}
