import { Star, Trash2 } from "lucide-react";
import axios from "axios";
import { getAuthHeader } from "../../utils/jwt";
import { useState, useEffect } from "react";

interface Contact {
  ID: number;
  user_id: string;
  gender: string;
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  phone: string;
  role: string;
  favorite: boolean;
  nb_curr_opportunity: number | null;
  created_at: string;
  updated_at: string;
}

interface ContactsListProps {
  contacts: Contact[];
  onContactDeleted: () => void;
  onContactUpdated: () => void;
}

export default function ContactsList({ contacts, onContactDeleted, onContactUpdated }: ContactsListProps) {
  const [sortedContacts, setSortedContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const sorted = [...contacts].sort((a, b) => {
      if (a.favorite === b.favorite) {
        return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
      }
      return a.favorite ? -1 : 1;
    });
    setSortedContacts(sorted);
  }, [contacts]);

  const handleDelete = async (contactId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce contact ?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts/${contactId}`,
          { headers: getAuthHeader() }
        );
        onContactDeleted();
      } catch (error) {
        console.error("Error deleting contact:", error);
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
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-3 px-4 text-left">Nom et prénom</th>
            <th className="py-3 px-4 text-left">Société</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Téléphone</th>
            <th className="py-3 px-4 text-left">N° Besoin/Recherche en cours</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedContacts.map((contact) => (
            <tr key={contact.ID} className="hover:bg-gray-50">
              <td className="py-4 px-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                  {getInitials(contact.first_name, contact.last_name)}
                </div>
                <span>{contact.first_name} {contact.last_name}</span>
              </td>
              <td className="py-4 px-4">{contact.company}</td>
              <td className="py-4 px-4">{contact.email}</td>
              <td className="py-4 px-4">{contact.phone}</td>
              <td className="py-4 px-4 text-center">
                {contact.nb_curr_opportunity !== null
                  ? contact.nb_curr_opportunity
                  : "-"}
              </td>
              <td className="py-4 px-4 text-center">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handleToggleFavorite(contact)}
                    title={contact.favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <Star
                      size={20}
                      className={contact.favorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}
                    />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.ID)}
                    title="Supprimer"
                    className="p-1 rounded hover:bg-gray-100 text-red-500"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {sortedContacts.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          Aucun contact trouvé
        </div>
      )}
    </div>
  );
}