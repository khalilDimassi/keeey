import { useState } from "react";
import { Star, Trash2, ArrowRight } from "lucide-react";

interface Contact {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string;
  avatar: string;
}

const generateFakeContacts = (count: number): Contact[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `John Doe ${i + 1}`,
    company: "Exemple Corp",
    email: `johndoe${i + 1}@example.com`,
    phone: `+33 123 456 78${i}`,
    status: "En cours",
    avatar: `https://i.pravatar.cc/40?img=${i + 1}`,
  }));
};

export default function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>(generateFakeContacts(10));

  return (
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
          <tr key={contact.id} className="border-b hover:bg-gray-50">
            <td className="p-2 flex items-center gap-2">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-8 h-8 rounded-full"
              />
              {contact.name}
            </td>
            <td className="p-2">{contact.company}</td>
            <td className="p-2">{contact.email}</td>
            <td className="p-2">{contact.phone}</td>
            <td className="p-2">{contact.status}</td>
            <td className="p-2 flex gap-2 justify-end">
              <button className="text-yellow-500 hover:text-yellow-600">
                <Star size={20} />
              </button>
              <button className="text-blue-500 hover:text-blue-600">
                <ArrowRight size={20} />
              </button>
              <button className="text-red-500 hover:text-red-600">
                <Trash2 size={20} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
