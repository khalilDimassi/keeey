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
      <div className="relative bg-white shadow-sm rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between ">
          {/* Tabs */}
          <div className="flex ">
            <button
              className={`px-4 py-2 font-medium transition-all flex items-center gap-2 rounded-md ${activeTab === "contacts"
                ? "text-teal-600 bg-white shadow-md border border-gray-100"
                : "text-gray-500 hover:text-teal-600 hover:bg-gray-50"
                }`}
              onClick={() => setActiveTab("contacts")}
            >
              <FileText className={`w-5 h-5 ${activeTab === "contacts" ? "text-teal-600" : "text-gray-400"}`} />
              Mes contacts
            </button>
            <button
              className={`px-4 py-2 font-medium transition-all flex items-center gap-2 rounded-md ${activeTab === "cooptation"
                ? "text-teal-600 bg-white shadow-md border border-gray-100"
                : "text-gray-500 hover:text-teal-600 hover:bg-gray-50"
                }`}
              onClick={() => setActiveTab("cooptation")}
            >
              <Award className={`w-5 h-5 ${activeTab === "cooptation" ? "text-teal-600" : "text-gray-400"}`} />
              Mes cooptation/parrainages
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 px-4">
            <button
              className="px-4 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700"
              onClick={() => setIsModalOpen(true)}
            >
              {activeTab === "contacts" ? "Ajouter un contact" : "Ajouter une cooptation"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 shadow-lg rounded-lg">
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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
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
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
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