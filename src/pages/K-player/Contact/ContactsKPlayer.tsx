import { addContact, deleteContact, fetchContacts } from "./services";
import { Contact, PenBox, Plus, Trash2 } from "lucide-react";
import { contact, contactRole } from "./types";
import { useEffect, useState } from "react";

import ContactForm from "./content/ContactForm";

const ContactsKPlayer = () => {
  const [activeTab, setActiveTab] = useState<contactRole>('INTERNAL-CONTACT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<contact[]>([]);
  const [formActive, setFormActive] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      let data: contact[] = [];

      try {
        data = await fetchContacts();
        setContacts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setLoading, setError, setContacts]);

  const handleNewContact = async (role: contactRole, data: contact) => {
    setLoading(true);
    setError(null);

    try {
      await addContact(role, data);
      const updatedContacts = await fetchContacts();
      setContacts(updatedContacts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="flex items-center space-x-3 my-4">
        <Contact
          className={`w-8 h-8 md:w-4 md:h-4 lg:w-8 lg:h-8 transition-all duration-500 `}
          color="#215A96"
        />
        <h1 className="text-xl font-semibold text-black">
          Contacts
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex relative h-16 w-full pr-4 pt-4 rounded-xl ">
        <button
          onClick={() => setActiveTab('INTERNAL-CONTACT')}
          className={`px-6 py-3 font-medium text-sm rounded-tl-xl rounded-tr-xl relative ${activeTab === 'INTERNAL-CONTACT'
            ? 'text-black bg-white shadow-[0_0_8px_0_rgba(0,0,0,0.1)] z-10'
            : 'text-gray-700 bg-slate-100 hover:bg-gray-300'
            }`}
        >
          Mes contacts internes
        </button>
        <button
          onClick={() => setActiveTab('EXTERNAL-CONTACT')}
          className={`px-6 py-3 font-medium text-sm rounded-tl-xl rounded-tr-xl relative -ml-1 ${activeTab === 'EXTERNAL-CONTACT'
            ? 'text-black bg-white shadow-[0_0_8px_0_rgba(0,0,0,0.1)] z-10'
            : 'text-gray-700 bg-slate-100 hover:bg-gray-300'
            }`}
        >
          Mes contacts externes
        </button>
        <button
          className="ml-auto mb-2 h-fit flex self-center items-center bg-[#215A96] text-white text-sm px-5 py-1.5 rounded-full shadow-md hover:bg-blue-900"
          onClick={() => setFormActive(true)}
        >
          <Plus className="w-3 h-3 mr-1" /> Ajouter un contact
        </button>
      </div>

      <div className={`overflow-x-auto min-w-full rounded-b-xl rounded-r-xl p-6 bg-white shadow-lg ${activeTab === 'EXTERNAL-CONTACT' ? 'rounded-l-xl' : ''}`}>
        <table className="w-full border-collapse bg-white shadow-lg">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-500 text-left ">
              <td className="p-2"></td>
              <td className="p-2">Nom Prénom</td>
              <td className="p-2">Fonction</td>
              {activeTab === 'EXTERNAL-CONTACT' && <td className="p-2">Société</td>}
              <td className="p-2">Email</td>
              <td className="p-2">Telephone</td>
              <td className="p-2">Nb Besoin en cours</td>
              <td className="p-2"></td>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={activeTab === 'INTERNAL-CONTACT' ? 7 : 8} className="p-4">
                  <div className="flex justify-center">
                    <div className="animate-pulse flex space-x-4">
                      <div className="flex-1 space-y-4 py-1">
                        <div className="h-12 bg-gray-200 rounded" />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan={activeTab === 'INTERNAL-CONTACT' ? 7 : 8} className="p-4 text-center text-red-500">
                  Error loading contacts. Please try again.
                </td>
              </tr>
            )}

            {!loading && !error && contacts.filter(contact => contact.role === activeTab).length === 0 && (
              <tr>
                <td colSpan={activeTab === 'INTERNAL-CONTACT' ? 7 : 8} className="p-4 text-center text-gray-500">
                  No {activeTab === 'INTERNAL-CONTACT' ? 'internal' : 'external'} contacts found
                </td>
              </tr>
            )}

            {!loading && !error && contacts.filter(contact => contact.role === activeTab).length > 0 && (
              contacts
                .filter(contact => contact.role === activeTab)
                .map(contact => (
                  <tr
                    key={contact.id}
                    className="border-b bg-gray-50 hover:bg-blue-50 transition-all duration-300"
                  >
                    <td className="p-2">
                      <div className="w-11 h-11 rounded-full bg-gray-300 animate-pulse mx-auto"></div>
                    </td>
                    <td className="p-2">{contact.first_name} {contact.last_name}</td>
                    <td className="p-2">{contact.occupation}</td>
                    {activeTab === 'EXTERNAL-CONTACT' && (
                      <td className="p-2">{contact.company}</td>
                    )}
                    <td className="p-2">{contact.email}</td>
                    <td className="p-2">{(contact.phone && contact.phone !== "") ? contact.phone : "N/A"}</td>
                    <td className="p-2">{contact.ongoing_projects ?? "N/A"}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <PenBox size={24} className="transition-colors duration-100 hover:text-blue-700 cursor-pointer" onClick={() => { }} />
                        <Trash2 size={24} className="transition-colors duration-100 hover:text-red-700 cursor-pointer" onClick={() => deleteContact(contact.id)} />
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {formActive && <ContactForm setFormActive={setFormActive} handleNewContact={handleNewContact} />}
    </div>

  );
};

export default ContactsKPlayer;
