
const SubscriptionForm = ({ setMessage }: { setMessage: (message: string) => void }) => {
    return (
        <div className="relative w-full h-full">
            {/* Stylish Work in Progress Overlay */}
            <div className="absolute inset-0 bg-gray-100/80 z-10 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,_#e5e7eb_0,_#e5e7eb_25px,_transparent_25px,_transparent_50px)] opacity-60"></div>
                </div>
                <div className="bg-white border-2 border-gray-300 px-8 py-4 rounded-xl shadow-lg z-10">
                    <span className="text-l font-bold text-gray-700">EN COURS DE CONSTRUCTION</span>
                </div>
            </div>
        </div>
    )
}

export default SubscriptionForm