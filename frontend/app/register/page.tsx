import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  return (
    <>
      <main className="bg-white min-h-screen text-black">
        <Header />

        <section className="max-w-md mx-auto text-center pt-51 px-11">
          <h1 className="text-4xl font-normal mb-8">Sign Up</h1>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-600 rounded-full py-3 font-normal text-base cursor-pointer">
              Continue
            </Button>
          </div>
          <p className="mt-8 text-lg">Already have an account?</p>
          <a href="/login" className="mt-4 block text-blue-700 hover:underline font-semibold text-lg">Log In</a>
          <div className="mt-8 flex items-center">
            <hr className="flex-1 border-gray-300" />
            <p className="mx-2 text-base">OR</p>
            <hr className="flex-1 border-gray-300" />
          </div>
          <Button
            variant="outline"
            className="w-full mt-8 flex items-center hover:bg-gray-50 rounded-full px-6 py-2 font-medium text-base cursor-pointer"
          >
            <img src="/icons/google-icon.svg" alt="Google" className="w-6 h-6 mr-2" />
            Sign Up with Google
          </Button>
          <Button
            variant="outline"
            className="w-full mt-2 flex items-center hover:bg-gray-50 rounded-full px-6 py-2 font-medium text-base cursor-pointer"
          >
            <img src="/icons/x-icon.svg" alt="Twitter" className="w-6 h-6 mr-2" />
            Sign Up with Twitter
          </Button>
          <p className="mt-8 text-base text-gray-500">
            <a href="/terms" className="underline cursor-pointer hover:text-gray-700">Terms of Use</a>
            <span className="mx-5">|</span>
            <a href="/privacy" className="underline cursor-pointer hover:text-gray-700">Privacy Policy</a>
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
