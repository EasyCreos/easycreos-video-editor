interface AuthSectionProps {
  text: string
  linkText: string
  linkUrl: string
}

export function AuthSection({ text, linkText, linkUrl }: AuthSectionProps) {
  return (
    <>
      <p className="mt-8 text-lg">{text}</p>
      <a href={linkUrl} className="mt-4 block text-blue-700 hover:underline font-semibold text-lg">{linkText}</a>
      <div className="mt-8 flex items-center">
        <hr className="flex-1 border-gray-200" />
        <p className="mx-2 text-base">OR</p>
        <hr className="flex-1 border-gray-200" />
      </div>
    </>
  )
}
