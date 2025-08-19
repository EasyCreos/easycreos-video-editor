import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LoginForm } from '@/components/LoginForm'
import { OAuthButtons } from '@/components/OAuthButtons'
import { LegalLinks } from '@/components/LegalLinks'
import { AuthSection } from '@/components/AuthSection'

export default function LoginPage() {
  return (
    <>
      <main className="bg-white min-h-screen text-black">
        <Header />
        <section className="max-w-md mx-auto text-center pt-51 px-11">
          <h1 className="text-4xl font-normal mb-8">Log In</h1>
          <LoginForm />
          <AuthSection text="Don't have an account?" linkText="Sign Up" linkUrl="/register" />
          <OAuthButtons googleText="Log In" xText="Log In" />
          <LegalLinks />
        </section>
      </main>
      <Footer />
    </>
  )
}
