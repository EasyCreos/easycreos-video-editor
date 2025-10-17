import { Header } from '@/components/Header';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-brand-black px-20 text-center">
      <Header />
      <h1 className="text-[15.625rem] font-bold text-blue-200 leading-tight">404</h1>
      <p className="text-3xl">Opps! Page not found</p>
    </div>
  );
}
