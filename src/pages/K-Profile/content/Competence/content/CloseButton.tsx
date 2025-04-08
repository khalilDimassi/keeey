import { ArrowUpCircle } from 'lucide-react';

const CloseButton = ({ onClick }: { onClick: () => void }) => (
    <button
        className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1 shadow-sm border border-gray-200"
        onClick={onClick}
    >
        <ArrowUpCircle size={32} className="text-[#039DAA]" />
    </button>
);

export default CloseButton;