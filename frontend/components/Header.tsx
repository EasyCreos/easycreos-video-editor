import { Button } from '@/components/ui/button'

export function Header() {
    return (
        <header className="absolute top-0 left-0 w-full flex justify-between items-center py-4 z-50 px-[150px]">
            <div className="flex items-center space-x-10">
                <div className="font-extrabold text-lg">EasyCreos</div>
                <nav className="hidden md:flex space-x-10 text-sm font-semibold">
                    <a href="#" className="hover:underline">Introduce</a>
                    <a href="#" className="hover:underline">About Us</a>
                </nav>
            </div>
            <div className="hidden md:flex space-x-2 ">
                <Button className="text-sm">Sign up</Button>
                <Button variant="outline" className="text-sm">Log in</Button>
            </div>
        </header>
    )
}