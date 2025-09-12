import Image from 'next/image'
import { Features } from '@/components/Features'
import { Button } from '@/components/ui/Button'
import { VideoSection } from '@/components/VideoSection'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PinkBubbles } from '@/components/PinkBubbles'
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <main className="bg-white min-h-screen text-brand-black px-20">
        <Header />

        {/* Hero */}
        <section className="text-center h-screen flex flex-col content-center justify-center">
          <PinkBubbles />
          <div className="mx-auto w-50 h-50">
            <Image src="/mascot.svg" alt="Mascot" width={250} height={250} />
          </div>
          <p className="max-w-md mx-auto text-2xl ">
            The world’s <strong>first web application</strong> that allows you to instantly create <strong>visual solutions using a simple and intuitive constructor</strong>
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button className="text-sm">Try the workspace</Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="min-h-screen px-[300px]">
          <p className="text-center text-[200px] font-light">Features</p>
          <p className="text-center text-xl max-w-100 mb-12 mx-auto">
            Advantages of our video editor that you will find convenient to work with
          </p>
          <Features />
        </section>

        {/* How it works */}
        <section className="py-20 px-[300px]">
          <h2 className="text-center text-[150px] font-light ">
            <span className="text-primary font-light">How</span> it <span className="text-secondary font-light">works</span>
          </h2>
          <p className="text-center text-lg max-w-md mx-auto mb-12">
            Below we have provided several videos that will introduce you to our video editor and help you better understand how our main features work.
          </p>
          <VideoSection />
        </section>

      </main>
      <Footer />
    </>
  )
}
