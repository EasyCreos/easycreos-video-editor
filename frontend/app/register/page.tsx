import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { RegistrationForm } from '@/components/RegistrationForm'
import { OAuthButtons } from '@/components/OAuthButtons'
import { LegalLinks } from '@/components/LegalLinks'
import { AuthSection } from '@/components/AuthSection'

export default function RegisterPage() {
  return (
    <>
      <main className="bg-white min-h-screen text-black">
        <Header />
        <section className="max-w-md mx-auto text-center pt-51 px-11">
          <h1 className="text-4xl font-normal mb-8">Sign Up</h1>
          <RegistrationForm />
          <AuthSection />
          <OAuthButtons />
          <LegalLinks />
        </section>
      </main>
      <Footer />
    </>
  )
}
