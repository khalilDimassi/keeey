import { Star, Trash2 } from "lucide-react";
import axios from "axios";
import { getAuthHeader } from "../../../utils/jwt";
import { useState, useEffect } from "react";

interface Contact {
  ID: number;
  user_id: string;
  gender: string;
  first_name: string;
  last_name: string;
  occupation: string;
  email: string;
  phone: string;
  role: string;
  favorite: boolean;
  nb_done_opportunity: number | null;
  nb_days: number | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

interface CooptationProps {
  contacts: Contact[];
  onContactDeleted: () => void;
  onContactUpdated: () => void;
}

export default function Cooptation({ contacts, onContactDeleted, onContactUpdated }: CooptationProps) {
  const [sortedContacts, setSortedContacts] = useState<Contact[]>([]);

  useEffect(() => {
    // Sort contacts with favorites on top
    const sorted = [...contacts].sort((a, b) => {
      if (a.favorite === b.favorite) {
        // If favorite status is the same, sort by name
        return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
      }
      // Favorites on top
      return a.favorite ? -1 : 1;
    });
    setSortedContacts(sorted);
  }, [contacts]);

  const handleDelete = async (contactId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette cooptation ?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts/${contactId}`,
          { headers: getAuthHeader() }
        );
        onContactDeleted();
      } catch (error) {
        console.error("Error deleting cooptation:", error);
      }
    }
  };

  const handleToggleFavorite = async (contact: Contact) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts/${contact.ID}`,
        { favorite: !contact.favorite },
        { headers: getAuthHeader() }
      );
      onContactUpdated();
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
      <thead className=" text-gray-700 border-b-2">
          <tr className="text-left text-gray-700">
            <th className="py-3 px-4 text-left">Nom et prénom</th>
            <th className="py-3 px-4 text-left">Fonction</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Téléphone</th>
            <th className="py-3 px-4 text-left">N° missions réalisées</th>
            <th className="py-3 px-4 text-left">N° jours</th>
            <th className="py-3 px-4 text-left">Note</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedContacts.map((contact) => (
            <tr key={contact.ID} className="border-b hover:bg-gray-50">
              <td className="p-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-medium">
                  {getInitials(contact.first_name, contact.last_name)}
                </div>
                <span className="font-medium">
                  {contact.first_name} {contact.last_name}
                </span>
              </td>
              <td className="p-2">{contact.occupation}</td>
              <td className="p-2">{contact.email}</td>
              <td className="p-2">{contact.phone}</td>
              <td className="p-2">
                {contact.nb_done_opportunity !== null
                  ? contact.nb_done_opportunity
                  : "-"}
              </td>
              <td className="p-2">
                {contact.nb_days !== null
                  ? contact.nb_days
                  : "-"}
              </td>
              <td className="p-2">
                {contact.note || "-"}
              </td>
              <td className="p-2 flex gap-2 justify-end">
                <button
                  className={`${contact.favorite
                    ? "text-yellow-500 hover:text-yellow-600"
                    : "text-gray-400 hover:text-yellow-500"
                    } p-1 rounded-full hover:bg-yellow-50`}
                  onClick={() => handleToggleFavorite(contact)}
                  title={contact.favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <Star
                    size={20}
                    className={contact.favorite ? "fill-yellow-500" : ""}
                  />
                </button>
                <button
                  className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                  onClick={() => handleDelete(contact.ID)}
                  title="Supprimer"
                >
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sortedContacts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucune cooptation trouvée
        </div>
      )}
    </div>
  );
}