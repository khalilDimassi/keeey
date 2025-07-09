import { AlertCircle, RefreshCw, Plus, UserRound, User, ArrowUpRight, MailX, MailCheck, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { contactFetch } from "../types";

interface ContactsReferencesContentProps {
  displayedContacts: contactFetch[];
  isTransitioning: boolean;
  loading: boolean;
  error: string | null;
  onReload: () => void;
  onAddContact: () => void;
}

const ContactsTableSkeleton = ({ loading = false, error = null as string | null, empty = false, onReload = () => { }, onAddContact = () => { } }) => {
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
            {/* Company column */}
            <td className="p-3">
              <div className="w-28 h-4 bg-gray-300 animate-pulse rounded"></div>
            </td>
            {/* Projects column */}
            <td className="p-3">
              <div className="w-8 h-4 bg-gray-300 animate-pulse rounded"></div>
            </td>
            {/* Recommendation column */}
            <td className="p-3">
              <div className="w-20 h-4 bg-gray-300 animate-pulse rounded"></div>
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
        {/* Function column */}
        <td className="p-3">
          <div className="w-24 h-4 bg-red-200 rounded"></div>
        </td>
        {/* Company column - Error message here */}
        <td className="p-3">
          <div className="text-red-600 text-sm font-medium animate-fade-in">
            {typeof error === 'string' ? error : 'Failed to load contacts'}
          </div>
        </td>
        {/* Projects column */}
        <td className="p-3">
          <div className="w-8 h-4 bg-red-200 rounded"></div>
        </td>
        {/* Recommendation column */}
        <td className="p-3">
          <div className="w-20 h-4 bg-red-200 rounded"></div>
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
        {/* Function column */}
        <td className="p-3">
          <div className="w-24 h-4 bg-gray-100 rounded"></div>
        </td>
        {/* Company column - Empty message */}
        <td className="p-3">
          <div className="text-gray-500 text-sm animate-fade-in">
            Aucune référence trouvée
          </div>
        </td>
        {/* Projects column */}
        <td className="p-3">
          <div className="w-8 h-4 bg-gray-100 rounded"></div>
        </td>
        {/* Recommendation column */}
        <td className="p-3">
          <div className="w-20 h-4 bg-gray-100 rounded"></div>
        </td>
        {/* Actions column - Add contact button */}
        <td className="p-3">
          <div className="flex items-center justify-end w-full gap-4">
            <button
              onClick={onAddContact}
              className="flex items-center gap-1 px-3 py-1.5 text-white bg-[#297280] rounded-full hover:bg-teal-900 transition-all duration-200 transform hover:scale-105 text-sm animate-slide-in-right"
              title="Add new contact"
            >
              <Plus size={15} />
              Ajouter un contact
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

const ContactsReferencesContent = ({ displayedContacts = [], isTransitioning, loading, error, onReload, onAddContact }: ContactsReferencesContentProps) => (
  <div className="p-6">
    <table className="w-full border-collapse bg-white shadow-lg ">
      <thead>
        <tr className="border-b bg-gray-50 text-gray-500 text-left ">
          <td className="p-2"></td>
          <td className="p-2 flex justify-center">Statut</td>
          <td className="p-2">Nom Prénom</td>
          <td className="p-2">Fonction</td>
          <td className="p-2">Société</td>
          <td className="p-2">Projet(s)</td>
          <td className="p-2">Recommandation</td>
          <td className="p-2"></td>
        </tr>
      </thead>
      <tbody>
        {loading && (
          <ContactsTableSkeleton
            key={1}
            loading={true}
            onReload={onReload}
          />
        )}

        {error && (
          <ContactsTableSkeleton
            key={2}
            error={error}
            onReload={onReload}
          />
        )}

        {!loading && !error && (displayedContacts.length === 0 || !displayedContacts.some((contact) => contact.role === "REFERRAL")) && (
          <ContactsTableSkeleton
            key={3}
            empty={true}
            onAddContact={onAddContact}
          />
        )}

        {!loading && !error && !isTransitioning && displayedContacts.length > 0 && displayedContacts.some((contact) => contact.role === "REFERRAL") && (
          displayedContacts.map((contact, index) => (
            <tr
              key={contact.id}
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
                      <UserRound size={28} strokeWidth={2.3} color="#EC4899" />
                    ) : (
                      <User size={28} strokeWidth={2.3} color="#3B82F6" />
                    )}
                  </div>
                </div>
              </td>
              <td className="p-3 animate-slide-in-left" style={{ animationDelay: `${index * 0.05 + 0.1}s` }}>
                {renderStatusBadge(contact.status)}
              </td>
              <td className="p-3 animate-slide-in-left" style={{ animationDelay: `${index * 0.05 + 0.15}s` }}>
                {contact.last_name} {contact.first_name}
              </td>
              <td className="p-3 animate-slide-in-left" style={{ animationDelay: `${index * 0.05 + 0.2}s` }}>
                {contact.occupation ?? "-"}
              </td>
              <td className="p-3 animate-slide-in-left" style={{ animationDelay: `${index * 0.05 + 0.25}s` }}>
                {contact.company ?? "-"}
              </td>
              <td className="p-3 animate-slide-in-left" style={{ animationDelay: `${index * 0.05 + 0.3}s` }}>
                {contact.nbrProjects ?? 0}
              </td>
              <td className="p-3 animate-slide-in-left" style={{ animationDelay: `${index * 0.05 + 0.35}s` }}>
                <span className="rounded-full bg-gray-200 w-fit h-fit px-3 py-1">{contact.recommendation ?? "Non demandé"}</span>
              </td>
              <td className="p-3">
                <div className="flex items-center justify-end w-full gap-4 animate-slide-in-right" style={{ animationDelay: `${index * 0.05 + 0.4}s` }}>
                  <button
                    className="p-2 text-white bg-[#297280] rounded-full hover:bg-gray-500 transition-all duration-200 transform hover:scale-110"
                    title="Contact profile"
                    onClick={() => { }}
                  >
                    <ArrowUpRight size={15} />
                  </button>

                  <button
                    onClick={() => { }}
                    className={`px-3 py-1.5 rounded-full flex items-center gap-1 transition-all duration-200 transform hover:scale-110 ${contact.id
                      ? 'text-green-500 hover:text-red-500'
                      : 'text-black hover:text-green-500'
                      }`}
                    title={contact.id ? 'Cancel submission' : 'Submit opportunity'}
                  >
                    {contact.id ? (
                      <MailX size={24} />
                    ) : (
                      <MailCheck size={24} />
                    )}
                  </button>

                  <Trash2
                    size={32}
                    color="#297280"
                    className="cursor-pointer hover:text-[#1e5d63] transition-all duration-200 transform hover:scale-110"
                    onClick={() => { }}
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

export default ContactsReferencesContent;