import { useEffect, useState } from "react";
import { FileText, Award, X } from "lucide-react";
import ContactsList from "./ContactsList";
import Cooptation from "./Cooptation";
import { getAuthHeader } from "../../../utils/jwt";
import axios from "axios";

const GENDERS = ["Mr.", "Madame", "Autre"]
const ROLES = { CONTACT: "DEFAULT", COOPTATION: "SPONSOR" }

const Contacts = () => {
  const [activeTab, setActiveTab] = useState("contacts");
  const [isModalOpen, setIsModalOpen] = useState(false);
  interface Contact {
    ID: number,
    user_id: string;
    first_name: string,
    last_name: string,
    gender: string,
    phone: string,
    email: string,
    company: string,
    occupation: string,
    role: string,
    nb_curr_opportunity: null;
    nb_done_opportunity: null;
    nb_days: null;
    note: any;
    favorite: boolean;
    created_at: string;
    updated_at: string;
  }

  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    email: "",
    phone: "",
    occupation: "",
    company: "",
    nb_curr_opportunity: null,
    nb_days: null,
    nb_done_opportunity: null,
    note: null
  });

  // Filtered contacts based on active tab
  const filteredContacts = allContacts.filter(contact =>
    contact.role === (activeTab === "contacts" ? ROLES.CONTACT : ROLES.COOPTATION)
  );

  const fetchAllContacts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts`,
        { headers: getAuthHeader() }
      );
      setAllContacts(response.data);
    } catch (error) {
      console.error("Error fetching all contacts:", error);
    }
  };

  useEffect(() => {
    fetchAllContacts();
  }, []);

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    if (['nb_curr_opportunity', 'nb_days', 'nb_done_opportunity'].includes(name)) {
      const numericValue = value === '' ? null : Number(value);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const requestData: { [key: string]: any } = {
      ...formData,
      contact_role: activeTab === "contacts" ? ROLES.CONTACT : ROLES.COOPTATION
    };

    Object.keys(requestData).forEach(key => {
      if (requestData[key] === null || requestData[key] === "") {
        delete requestData[key];
      }
    });

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts`,
        requestData,
        { headers: getAuthHeader() }
      );

      setIsModalOpen(false);
      fetchAllContacts();
      setFormData({
        first_name: "",
        last_name: "",
        gender: "",
        email: "",
        phone: "",
        occupation: "",
        company: "",
        nb_curr_opportunity: null,
        nb_days: null,
        nb_done_opportunity: null,
        note: null
      });
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  };

  const handleContactDeleted = () => {
    fetchAllContacts();
  };

  const handleContactUpdated = () => {
    fetchAllContacts();
  };

  return (
    <div className="w-full">
      <div className="relative  shadow-sm rounded-lg">
        <div className="flex items-center space-x-3 ">
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30.875 2.375H7.125C5.81281 2.375 4.75 3.43781 4.75 4.75V7.125H3.5625C2.907 7.125 2.375 7.657 2.375 8.3125C2.375 8.968 2.907 9.5 3.5625 9.5C5.69406 9.5 2.20281 9.5 7.125 9.5C7.7805 9.5 8.3125 10.032 8.3125 10.6875C8.3125 11.343 7.7805 11.875 7.125 11.875H4.75V26.125H3.5625C2.907 26.125 2.375 26.657 2.375 27.3125C2.375 27.968 2.907 28.5 3.5625 28.5C5.69406 28.5 2.20281 28.5 7.125 28.5C7.7805 28.5 8.3125 29.032 8.3125 29.6875C8.3125 30.343 7.7805 30.875 7.125 30.875H4.75V33.25C4.75 34.5622 5.81281 35.625 7.125 35.625H30.875C32.1872 35.625 33.25 34.5622 33.25 33.25V4.75C33.25 3.43781 32.1872 2.375 30.875 2.375ZM19 8.3125C21.6232 8.3125 23.75 10.4393 23.75 13.0625C23.75 15.6857 21.6232 17.8125 19 17.8125C16.3768 17.8125 14.25 15.6857 14.25 13.0625C14.25 10.4393 16.3768 8.3125 19 8.3125ZM26.125 28.5H11.875V26.125C11.875 22.1896 15.0646 19 19 19C22.9354 19 26.125 22.1896 26.125 26.125V28.5Z" fill="url(#paint0_linear_542_3675)" />
            <defs>
              <linearGradient id="paint0_linear_542_3675" x1="17.8125" y1="2.375" x2="17.8125" y2="35.625" gradientUnits="userSpaceOnUse">
                <stop stop-color="#30797F" />
                <stop offset="1" stop-color="#039DAA" />
              </linearGradient>
            </defs>
          </svg>
          <h1 className="text-xl font-semibold">Contact</h1>

        </div>
        {/* Header */}
        <div className="flex items-center justify-between ">
          {/* Tabs */}







          <div className="flex gap-2 relative mt-5">
            <button
              style={{
                boxShadow: activeTab === "contacts"
                  ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(103, 109, 103, 0.14)"
                  : "none",

                fontWeight: 500,
                fontSize: '20px',
                lineHeight: 'Body Large/Line Height',
                letterSpacing: 'Body Large/Tracking',
                textAlign: 'center',
                verticalAlign: 'middle'
              }}
              className={`px-4 py-2 flex gap-2 font-medium transition-all relative ${activeTab === "contacts"
                ? "text-gray-900 bg-white rounded-t-xl z-10"
                : " bg-gray-100/50"
                }`}
              onClick={() => setActiveTab("contacts")}
            >
              Mes Contacts / Références
            </button>
            <button
              style={{
                boxShadow: activeTab === "cooptation"
                  ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(40, 44, 40, 0.14)"
                  : "none",
                fontWeight: 500,
                fontSize: '20px',
                lineHeight: 'Body Large/Line Height',
                letterSpacing: 'Body Large/Tracking',
                textAlign: 'center',
                verticalAlign: 'middle'
              }}
              className={`px-8 flex gap-2 py-2 font-medium transition-all relative ${activeTab === "cooptation"
                ? "text-gray-900 bg-white rounded-t-xl z-10"
                : " bg-gray-100/50"
                }`}
              onClick={() => setActiveTab("cooptation")}
            >
              Mes cooptation/parrainages
            </button>

          </div>






























          {/* Action Buttons */}
          <div className="flex items-center gap-2 px-4">
            <button
              className="px-4 py-2 bg-gradient-to-b from-[#30797F] to-[#039DAA] text-white font-medium rounded hover:bg-teal-700"
              onClick={() => setIsModalOpen(true)}
            >
              {activeTab === "contacts" ? "Ajouter un contact" : "Ajouter une cooptation"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 shadow-lg bg-white rounded-lg">
          {activeTab === "contacts" ? (
            <ContactsList
              contacts={filteredContacts}
              onContactDeleted={handleContactDeleted}
              onContactUpdated={handleContactUpdated}
            />
          ) : (
            <Cooptation
              contacts={filteredContacts}
              onContactDeleted={handleContactDeleted}
              onContactUpdated={handleContactUpdated}
            />
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center ">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {activeTab === "contacts" ? "Ajouter un contact" : "Ajouter une cooptation"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="flex gap-4 mb-4">
                {GENDERS.map((gender) => (
                  <label key={gender} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={formData.gender === gender}
                      onChange={handleInputChange}
                    />
                    {gender}
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prénom</label>
                  <input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {activeTab === "contacts" ? "Société" : "Fonction"}
                  </label>
                  <input
                    name={activeTab === "contacts" ? "company" : "occupation"}
                    value={activeTab === "contacts" ? formData.company : formData.occupation}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded mt-2"
                  required
                />
              </div>

              {activeTab === "contacts" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nb Besoin/Recherche en cours
                  </label>
                  <input
                    name="nb_curr_opportunity"
                    type="number"
                    value={formData.nb_curr_opportunity || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded mt-2"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nb missions réalisées
                    </label>
                    <input
                      name="nb_done_opportunity"
                      type="number"
                      value={formData.nb_done_opportunity || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nb jours</label>
                      <input
                        name="nb_days"
                        type="number"
                        value={formData.nb_days || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Note</label>
                      <input
                        name="note"
                        value={formData.note || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-b from-[#30797F] to-[#039DAA] text-white rounded-xl hover:bg-teal-700"
                >
                  + Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;