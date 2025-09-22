import * as React from "react"

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type = "text", placeholder, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`w-full px-5 py-3 border border-gray-300 rounded-full focus:border-gray-400 outline-none appearance-none ${className || ""}`}
        style={{ background: "none" }}
        {...props}
      />
    )
  }
)