export function AuthSection() {
  return (
    <>
      <p className="mt-8 text-lg">Already have an account?</p>
      <a href="/login" className="mt-4 block text-blue-700 hover:underline font-semibold text-lg">Log In</a>
      <div className="mt-8 flex items-center">
        <hr className="flex-1 border-gray-300" />
        <p className="mx-2 text-base">OR</p>
        <hr className="flex-1 border-gray-300" />
      </div>
    </>
  )
}
