interface InputProps {
  type?: 'email' | 'password' | 'text'
  placeholder: string
}

export function Input({ type = 'text', placeholder }: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-5 py-3 border border-gray-300 rounded-full focus:border-gray-400 outline-none appearance-none"
      style={{ background: 'none' }}
    />
  )
}
