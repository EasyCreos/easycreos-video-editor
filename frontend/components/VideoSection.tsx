export function VideoSection() {
    return (
        <div className="grid grid-cols-[250px_1fr] gap-3 items-stretch">
            <div className="flex flex-col gap-3 h-full">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="bg-gray-100 aspect-video rounded-xl flex items-center justify-center h-full"
                    >
                        <button className="text-gray-400 text-2xl">▶</button>
                    </div>
                ))}
            </div>

            <div className="bg-gray-100 aspect-video rounded-xl flex items-center justify-center">
                <button className="text-gray-400 text-4xl">▶</button>
            </div>
        </div>
    );
}
