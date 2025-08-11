import Image from "next/image"

export function Footer() {
    return (
        <footer className="bg-primary text-brand-white py-10 mt-20">
            <div className="px-[380px]">
                <div className="flex justify-between items-center">
                    <div>
                        <ul className="text-lg space-y-4">
                            <li>About us</li>
                            <li>Help Center</li>
                            <li>Terms of Use</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Image src="/icons/c-icon.svg" alt="c" width={34} height={34} />
                        <p className="text-lg">2025 EasyCreos. All rights reserved.</p>
                    </div>
                    <div className="text-left w-fit">
                        <ul className="text-lg space-y-4">
                            <li className="font-light">Contact</li>
                            <li>support@gmail.com</li>
                            <li className="font-light">Social media</li>
                            <li>Instagram</li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}