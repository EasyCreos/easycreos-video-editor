interface InputProps {
  type?: 'email' | 'password' | 'text'
  placeholder: string
  error?: boolean
  errorMessage?: string
}

export function Input({ type = 'text', placeholder, error = false, errorMessage }: InputProps) {
  return (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full px-5 py-3 border rounded-full focus:outline-none appearance-none ${error
            ? 'border-red-500 focus:border-red-500 text-red-500'
            : 'border-gray-300 focus:border-gray-400 text-black'
          }`}
        style={{ background: 'none' }}
      />
      {error && errorMessage && (
        <p className="text-right text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  )
}
