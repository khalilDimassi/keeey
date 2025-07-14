import { AlertCircle, RefreshCw, Plus, UserRound, User, Star, StarHalf, ArrowUpRight, MailX, MailCheck, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { contactFetch } from "../types";

interface CoOptationPatronageContentProps {
    displayedContacts: contactFetch[];
    isTransitioning: boolean;
    loading: boolean;
    error: string | null;
    onReload: () => void;
    onAddContact: () => void;
    handleContactDetails: (contact: contactFetch) => void;
    handleContactDelete: (contactID: number) => void;
}

const CoOptationPatronageSkeleton = ({ loading = false, error = null as string | null, empty = false, onReload = () => { }, onAddContact = () => { } }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [_currentState, setCurrentState] = useState<string | null>(null);

    useEffect(() => {
        // Add a small delay to ensure smooth transitions
        const timer = setTimeout(() => {
            setIsVisible(true);
            if (loading) setCurrentState('loading');
            else if (error) setCurrentState('error');
            else if (empty) setCurrentState('empty');
        }, 50);

        return () => clearTimeout(timer);
    }, [loading, error, empty]);

    // Loading state - show multiple pulsing rows with staggered animation
    if (loading) {
        return (
            <>
                {[...Array(5)].map((_, index) => (
                    <tr
                        key={index}
                        className={`border-b bg-gray-50 hover:bg-green-50 transition-all duration-300 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'
                            }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {/* Avatar column */}
                        <td className="p-3">
                            <div className="w-11 h-11 rounded-full bg-gray-300 animate-pulse mx-auto animate-bounce-in"></div>
                        </td>
                        {/* Status column */}
                        <td className="p-3">
                            <div className="w-16 h-6 bg-gray-300 animate-pulse rounded-full"></div>
                        </td>
                        {/* Name column */}
                        <td className="p-3">
                            <div className="w-32 h-4 bg-gray-300 animate-pulse rounded"></div>
                        </td>
                        {/* Function column */}
                        <td className="p-3">
                            <div className="w-24 h-4 bg-gray-300 animate-pulse rounded"></div>
                        </td>
                        {/* Nb Missions column */}
                        <td className="p-3">
                            <div className="w-8 h-4 bg-gray-300 animate-pulse rounded"></div>
                        </td>
                        {/* Nb Jours column */}
                        <td className="p-3">
                            <div className="w-8 h-4 bg-gray-300 animate-pulse rounded"></div>
                        </td>
                        {/* Satisfactions Clients column */}
                        <td className="p-3">
                            <div className="flex items-center justify-around pr-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-4 h-4 bg-gray-300 animate-pulse rounded-full"></div>
                                ))}
                            </div>
                        </td>
                        {/* Actions column */}
                        <td className="p-3">
                            <div className="flex items-center justify-end w-full gap-4">
                                <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full"></div>
                                <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full"></div>
                                <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full"></div>
                            </div>
                        </td>
                    </tr>
                ))}
            </>
        );
    }

    // Error state - show error message and reload button
    if (error) {
        return (
            <tr className={`border-b bg-red-50 hover:bg-red-100 transition-all duration-300 ${isVisible ? 'animate-slide-in-left' : 'opacity-0 translate-x-4'
                }`}>
                {/* Avatar column */}
                <td className="p-3">
                    <div className="w-11 h-11 rounded-full bg-red-200 mx-auto flex items-center justify-center animate-bounce-in">
                        <AlertCircle size={20} className="text-red-500" />
                    </div>
                </td>
                {/* Status column */}
                <td className="p-3">
                    <div className="w-16 h-6 bg-red-200 rounded-full"></div>
                </td>
                {/* Name column */}
                <td className="p-3">
                    <div className="w-32 h-4 bg-red-200 rounded"></div>
                </td>
                {/* Function column - Error message here */}
                <td className="p-3">
                    <div className="text-red-600 text-sm font-medium animate-fade-in">
                        {typeof error === 'string' ? error : 'Failed to load contacts'}
                    </div>
                </td>
                {/* Nb Missions column */}
                <td className="p-3">
                    <div className="w-8 h-4 bg-red-200 rounded"></div>
                </td>
                {/* Nb Jours column */}
                <td className="p-3">
                    <div className="w-8 h-4 bg-red-200 rounded"></div>
                </td>
                {/* Satisfactions Clients column */}
                <td className="p-3">
                    <div className="flex items-center justify-around pr-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-4 h-4 bg-red-200 rounded-full"></div>
                        ))}
                    </div>
                </td>
                {/* Actions column - Reload button */}
                <td className="p-3">
                    <div className="flex items-center justify-end w-full gap-4">
                        <button
                            onClick={onReload}
                            className="p-2 text-white bg-red-500 rounded-full hover:bg-red-600 transition-all duration-200 transform hover:scale-105 animate-bounce-in"
                            title="Reload contacts"
                        >
                            <RefreshCw size={15} />
                        </button>
                    </div>
                </td>
            </tr>
        );
    }

    // Empty state - show empty skeleton with add contact button
    if (empty) {
        return (
            <tr className={`border-b bg-gray-50 hover:bg-green-50 transition-all duration-300 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'
                }`}>
                {/* Avatar column */}
                <td className="p-3">
                    <div className="w-11 h-11 rounded-full bg-gray-100 mx-auto animate-bounce-in"></div>
                </td>
                {/* Status column */}
                <td className="p-3">
                    <div className="w-16 h-6 bg-gray-100 rounded-full"></div>
                </td>
                {/* Name column */}
                <td className="p-3">
                    <div className="w-32 h-4 bg-gray-100 rounded"></div>
                </td>
                {/* Function column - Empty message */}
                <td className="p-3">
                    <div className="text-gray-500 text-sm animate-fade-in">
                        Aucun sponsor trouvé
                    </div>
                </td>
                {/* Nb Missions column */}
                <td className="p-3">
                    <div className="w-8 h-4 bg-gray-100 rounded"></div>
                </td>
                {/* Nb Jours column */}
                <td className="p-3">
                    <div className="w-8 h-4 bg-gray-100 rounded"></div>
                </td>
                {/* Satisfactions Clients column */}
                <td className="p-3">
                    <div className="flex items-center justify-around pr-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-4 h-4 bg-gray-100 rounded-full"></div>
                        ))}
                    </div>
                </td>
                {/* Actions column - Add cooptation button */}
                <td className="p-3">
                    <div className="flex items-center justify-end w-full gap-4">
                        <button
                            onClick={onAddContact}
                            className="flex items-center gap-1 px-3 py-1.5 text-white bg-[#297280] rounded-full hover:bg-teal-900 transition-all duration-200 transform hover:scale-105 text-sm animate-slide-in-right"
                            title="Add new cooptation"
                        >
                            <Plus size={15} />
                            Ajouter une cooptation
                        </button>
                    </div>
                </td>
            </tr>
        );
    }

    return null;
};


const renderStatusBadge = (status: string) => {
    const statusStyles: Record<string, { label: string; bg: string; text: string }> = {
        "REGISTRED": { label: "Inscrit", bg: "bg-green-100", text: "text-green-800" },
        "NOT-REGISTRED": { label: "Contact NI", bg: "bg-orange-100", text: "text-orange-800" },
        "CONTACTED": { label: "Contacté", bg: "bg-blue-100", text: "text-blue-800" },
        "ACCEPTED": { label: "Accepté", bg: "bg-green-200", text: "text-green-900" },
        "REJECTED": { label: "Rejeté", bg: "bg-red-100", text: "text-red-700" },
        "IN-MISSION": { label: "En mission", bg: "bg-teal-100", text: "text-teal-800" },
        "MISSION-HK": { label: "Mission HK", bg: "bg-amber-100", text: "text-amber-800" },
        "SEARCHING": { label: "En Recherche", bg: "bg-indigo-100", text: "text-indigo-800" },
        "ARCHIVE": { label: "Archivé", bg: "bg-gray-100", text: "text-gray-600" },
    };

    const fallback = { label: status, bg: "bg-gray-200", text: "text-gray-800" };
    const { label, bg, text } = statusStyles[status] || fallback;

    return (
        <span className={`px-3 flex justify-self-center self-center py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
            {label}
        </span>
    );
};


const CoOptationPatronageContent = ({ displayedContacts, isTransitioning, loading, error, onReload, onAddContact, handleContactDetails, handleContactDelete }: CoOptationPatronageContentProps) => (
    <div className="p-6">
        <table className="w-full border-collapse bg-white shadow-lg ">
            <thead>
                <tr className="border-b bg-gray-50 text-gray-500 text-left ">
                    <td className="p-2"></td>
                    <td className="p-2 flex justify-center">Statut</td>
                    <td className="p-2">Nom Prénom</td>
                    <td className="p-2">Fonction</td>
                    <td className="p-2">Nb Missions</td>
                    <td className="p-2">Nb Jours</td>
                    <td className="p-2">Satisfactions Clients</td>
                    <td className="p-2"></td>
                </tr>
            </thead>
            <tbody>
                {loading && (
                    <CoOptationPatronageSkeleton
                        key={10000}
                        loading={true}
                        onReload={onReload}
                    />
                )}

                {error && (
                    <CoOptationPatronageSkeleton
                        key={20000}
                        error={error}
                        onReload={onReload}
                    />
                )}

                {!loading && !error && (displayedContacts.length === 0 || !displayedContacts.some((contact) => contact.role === "SPONSOR")) && (
                    <CoOptationPatronageSkeleton
                        key={30000}
                        empty={true}
                        onAddContact={onAddContact}
                    />
                )}

                {!loading && !error && !isTransitioning && displayedContacts.length > 0 && displayedContacts.some((contact) => contact.role === "SPONSOR") && (
                    displayedContacts.some((contact) => contact.role === "SPONSOR") && displayedContacts.map((contact, index) => (
                        <tr key={contact.ID}
                            className="border-b bg-gray-50 hover:bg-green-50"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <td className="p-3">
                                <div
                                    title={contact.gender === "female" ? "Femme" : "Homme"}
                                    className="w-11 h-11 rounded-full mx-auto flex items-center justify-center transition-all duration-200 hover:scale-110 relative"
                                    style={{
                                        animationDelay: `${index * 0.05}s`,
                                    }}
                                >
                                    {/* Outer Ring */}
                                    <div className="absolute inset-0 rounded-full border-4 border-[#297280]"></div>

                                    {/* Inner White Circle */}
                                    <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center z-10">
                                        {contact.gender === "female" ? (
                                            <UserRound size={28} strokeWidth={2.3} color="#EC4899" /* Tailwind pink-400 */ />
                                        ) : (
                                            <User size={28} strokeWidth={2.3} color="#3B82F6" /* Tailwind blue-500 */ />
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="p-2 animate-slide-in-left" style={{ animationDelay: `${index * 0.05 + 0.1}s` }}>
                                {renderStatusBadge(contact.status)}
                            </td>
                            <td className="p-2 animate-slide-in-left" style={{ animationDelay: `${index * 0.05 + 0.15}s` }}>
                                {contact.first_name} {contact.last_name}
                            </td>
                            <td className="p-2 animate-slide-in-left" style={{ animationDelay: `${index * 0.05 + 0.2}s` }}>
                                {contact.occupation ?? "-"}
                            </td>
                            <td className="p-2 animate-slide-in-left" style={{ animationDelay: `${index * 0.05 + 0.25}s` }}>
                                {contact.nbrMissions ?? 0}
                            </td>
                            <td className="p-2 animate-slide-in-left" style={{ animationDelay: `${index * 0.05 + 0.3}s` }}>
                                {contact.nbrDays ?? 0}
                            </td>
                            <td
                                className="p-2 animate-slide-in-left"
                                style={{ animationDelay: `${index * 0.05 + 0.35}s` }}
                            >
                                <div className="flex items-center justify-around pr-3">
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const filled = contact.satisfaction >= i + 1;
                                        const half = contact.satisfaction >= i + 0.5 && contact.satisfaction < i + 1;

                                        return filled ? (
                                            <Star key={i} size={16} color="gray" fill="yellow" />
                                        ) : half ? (
                                            <StarHalf key={i} size={16} color="gray" fill="yellow" />
                                        ) : (
                                            <Star key={i} size={16} color="gray" />
                                        );
                                    })}
                                </div>
                            </td>
                            <td className="p-3">
                                <div className="flex items-center justify-end w-full gap-4 animate-slide-in-right" style={{ animationDelay: `${index * 0.05 + 0.4}s` }}>
                                    <ArrowUpRight
                                        className="p-1 text-white bg-[#297280] rounded-full hover:shadow-md transition-all duration-200 transform hover:scale-110"
                                        cursor={"pointer"}
                                        size={30}
                                        onClick={() => { handleContactDetails(contact) }}
                                    />

                                    {contact.is_request_sent ? (
                                        <MailX
                                            className="text-[#297280] hover:text-red-500 transition-all duration-200 transform hover:scale-110"
                                            cursor={"pointer"}
                                            size={30}
                                            strokeWidth={2.5}
                                        />
                                    ) : (
                                        <MailCheck
                                            className="text-[#297280] hover:text-green-500 transition-all duration-200 transform hover:scale-110"
                                            cursor={"pointer"}
                                            size={30}
                                            strokeWidth={2.5}
                                        />
                                    )}

                                    <Trash2
                                        size={32}
                                        cursor={"pointer"}
                                        className="text-[#297280] hover:text-red-700 transition-all duration-200 transform hover:scale-110"
                                        onClick={() => { handleContactDelete(contact.ID) }}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
);

export default CoOptationPatronageContent;