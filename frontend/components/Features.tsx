import Image from 'next/image'

export function Features() {
    const cards = [
        {
            title: 'Compositions',
            desc: 'Create your video creatives using ready-made composition solutions',
            image: '/icons/composition-icon.svg',
        },
        {
            title: 'Subtitles',
            desc: 'Convert your texts and voices for automatic subtitles. Or generate your subtitles together with the voice, via text directly.',
            image: '/icons/subtitles-icon.svg',
        },
        {
            title: 'Effects',
            desc: 'Ready-made simple effects and animations that can be applied to your video elements',
            image: '/icons/effects-icon.svg',
        },
    ]

    return (
        <div className="grid md:grid-cols-3 gap-6 h-[500px]">
            {cards.map(({ title, desc, image }) => (
                <div key={title} className="bg-gray-50 rounded-3xl border border-gray-200 overflow-hidden inset-shadow-2xs">
                    <div className={`w-full p-6 h-[300px] flex items-center justify-center`}>
                        <Image src={image} alt={title} width={200} height={150} className="w-full object-contain" />
                    </div>
                    <div className="px-6">
                        <h3 className="text-2xl font-medium mb-2">{title}</h3>
                        <p className="text-lg">{desc}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}