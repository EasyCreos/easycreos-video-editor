import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PasswordRecoveryForm } from '@/components/PasswordRecoveryForm'
import { LegalLinks } from '@/components/LegalLinks'

export default function PasswordRecoveryPage() {
  return (
    <>
      <main className="bg-white min-h-screen flex flex-col">
        <Header />
        <section className="flex-1 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-[2rem] mb-2">Password Recovery</h1>
            <PasswordRecoveryForm />
            <LegalLinks />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
