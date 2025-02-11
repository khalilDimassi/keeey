import { Star, Trash2, ArrowRight } from "lucide-react";
import axios from "axios";
import { getAuthHeader } from "../../utils/jwt";

interface Contact {
  contact_id: number;
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  phone: string;
  nb_curr_opportunity: number | null;
  created_at: string;
  updated_at: string;
  gender: string;
  role: string;
  user_id: string;
}

interface ContactsListProps {
  contacts: Contact[];
  onContactDeleted: () => void;
}

export default function ContactsList({ contacts, onContactDeleted }: ContactsListProps) {
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-gray-700">
            <th className="p-2">Nom et prénom</th>
            <th className="p-2">Société</th>
            <th className="p-2">Email</th>
            <th className="p-2">Téléphone</th>
            <th className="p-2">Nb Besoin/Recherche en cours</th>
            <th className="p-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.contact_id} className="border-b hover:bg-gray-50">
              <td className="p-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-medium">
                  {getInitials(contact.first_name, contact.last_name)}
                </div>
                <span className="font-medium">
                  {contact.first_name} {contact.last_name}
                </span>
              </td>
              <td className="p-2">{contact.company}</td>
              <td className="p-2">{contact.email}</td>
              <td className="p-2">{contact.phone}</td>
              <td className="p-2">
                {contact.nb_curr_opportunity !== null
                  ? contact.nb_curr_opportunity
                  : "-"}
              </td>
              <td className="p-2 flex gap-2 justify-end">
                <button
                  className="text-yellow-500 hover:text-yellow-600 p-1 rounded-full hover:bg-yellow-50"
                  title="Marquer comme favori"
                >
                  <Star size={20} />
                </button>
                <button
                  className="text-blue-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50"
                  title="Voir les détails"
                >
                  <ArrowRight size={20} />
                </button>
                <button
                  className="text-red-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                  onClick={() => handleDelete(contact.contact_id)}
                  title="Supprimer"
                >
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {contacts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun contact trouvé
        </div>
      )}
    </div>
  );
}