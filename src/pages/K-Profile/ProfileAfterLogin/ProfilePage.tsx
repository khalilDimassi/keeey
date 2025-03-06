import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaPlus, FaUser } from "react-icons/fa";
import DocumentsSection from "./DocumentsSection";
import { PlusCircle } from "lucide-react";
import axios from "axios";
import { getAuthHeader } from "../../../utils/jwt";

const Profile: React.FC = () => {
  const [formData, setFormData] = useState({
    gender: "",
    first_name: "",
    last_name: "",
    email: "",
    occupation: "",
    phone: "",
    address: "",
    zip: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch user data from API on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/profile`,
        { headers: getAuthHeader() }
      );
      setFormData(response.data.user);
    } catch (err) {
      setError("Failed to load profile data.");
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/user-data`,
        formData,
        { headers: getAuthHeader() }
      );
      setIsEditing(false);
      await fetchUserProfile();
    } catch (err) {
      setError("Failed to update profile.");
    }
    setLoading(false);
  };

  interface Referral {
    ID: number,
    first_name: string,
    last_name: string,
    gender: string,
    phone: string,
    email: string,
    company: string,
    occupation: string,

    nb_curr_opportunity: null;
    nb_done_opportunity: null;
    nb_days: null;
    note: any;
  }

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [contactFormData, setContactFormData] = useState({
    gender: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",

    occupation: "...",
    contact_role: "REFERRAL"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactFormData({
      ...contactFormData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchReferrals = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts/REFERRAL`,
        { headers: getAuthHeader() }
      );
      setReferrals(response.data || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      setReferrals([]);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const handleContactSubmit = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts`,
        contactFormData,
        { headers: getAuthHeader() }
      );

      // Reset the contact form
      setContactFormData({
        gender: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        company: "",
        occupation: "...",
        contact_role: "REFERRAL"
      });

      // Refresh the referrals list
      fetchReferrals();
      alert("Référence ajoutée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'envoi", error);
      alert("Une erreur est survenue");
    }
  };

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts/REFERRAL`, { headers: getAuthHeader() });
        setReferrals(response.data || []);
      } catch (error) {
        console.error('Error fetching referrals:', error);
        setReferrals([]);
      }
    };

    fetchReferrals();
  }, []);

  const handleCardClick = (referral: Referral) => {
    setSelectedReferral(referral);
  };

  const handleDeleteReferral = async (ID: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette référence ?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/contacts/${ID}`,
          { headers: getAuthHeader() }
        );

        // Update the referrals list after deletion
        setReferrals(referrals.filter(ref => (ref.ID) !== ID));

        // If the deleted referral is currently selected, clear the selection
        if (selectedReferral && (selectedReferral.ID === ID)) {
          setSelectedReferral(null);
        }

        alert("Référence supprimée avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression", error);
        alert("Une erreur est survenue lors de la suppression");
      }
    }
  };

  return (
    <div className="p-1 space-y-6 min-h-screen w-full " >
      <div className="flex items-center space-x-4 ">
        <FaUser className="text-3xl text-teal-800 " />
        <span className="text-2xl text-gray-800" style={{ fontWeight: "bold" }}>
          Profile
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 ">
        <div
          className="bg-white p-6 rounded-2xl shadow-md border w-full md:w-[30%]"
          style={{ boxShadow: "0 0 3px 1px rgba(12, 94, 12, 0.2)" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Mes Informations générales</h2>
            {!isEditing && (
              <button
                className="text-green-600 hover:text-green-700"
                onClick={() => setIsEditing(true)}
              >
                <FaPencilAlt />
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : isEditing ? (
            // Edit Form View
            <div className="space-y-4">
              <div className="flex space-x-4 mb-4">
                {["Mr.", "Madame", "Autre"].map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="gender"
                      checked={formData.gender === option}
                      onChange={() => handleRadioChange(option)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>

              {["first_name", "last_name", "email", "occupation", "address", "zip"].map(
                (field) => (
                  <label key={field} className="block">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    <input
                      name={field}
                      value={formData[field as keyof typeof formData]}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded mt-1"
                      placeholder={field}
                    />
                  </label>
                )
              )}

              <label className="block mb-2">Numéro de téléphone</label>
              <div className="flex items-center space-x-2 mb-2">
                <select className="p-3 border rounded bg-white">
                  <option>🇫🇷</option>
                  <option>🇬🇧</option>
                </select>
                <input
                  name="telephone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded mt-1"
                  placeholder="Numéro de téléphone"
                />
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-7 rounded transition duration-200 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-green-800 hover:bg-green-600 text-white font-bold py-2 px-7 rounded transition duration-200 ease-in-out"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            // Display View 
            <div className="space-y-3">
              {/* Gender */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Civilité</span>
                <span className="text-base">{formData.gender || '-'}</span>
              </div>

              {/* Last name */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Nom</span>
                <span className="text-base">{formData.last_name || '-'}</span>
              </div>

              {/* First name */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Prénom</span>
                <span className="text-base">{formData.first_name || '-'}</span>
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Adresse e-mail</span>
                <span className="text-base">{formData.email || '-'}</span>
              </div>

              {/* Occupation */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Profession</span>
                <span className="text-base">{formData.occupation || '-'}</span>
              </div>

              {/* Phone */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Numéro de téléphone</span>
                <span className="text-base">{formData.phone || '-'}</span>
              </div>

              {/* Address */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Adresse</span>
                <span className="text-base">{formData.address || '-'}</span>
              </div>

              {/* Zip */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Code postal</span>
                <span className="text-base">{formData.zip || '-'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Mes Références Section */}
        <div
          className="bg-white p-6 rounded-2xl shadow-md border w-full md:w-full"
          style={{ boxShadow: "0 0 4px 1px rgba(0, 128, 0, 0.2)" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Mes Références</h2>
            <button onClick={handleContactSubmit} className="text-green-700 hover:text-blue-700">
              <PlusCircle size={40} />
            </button>
          </div>
          <div className="flex space-x-4 mb-4">
            {["Mr.", "Madame", "Autre"].map((label) => (
              <label key={label} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value={label}
                  checked={contactFormData.gender === label}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <label className="block">
              Nom
              <input
                name="first_name"
                className="w-full p-3 border rounded mt-1"
                placeholder="Nom"
                value={contactFormData.first_name}
                onChange={handleChange}
              />
            </label>
            <label className="block">
              Prénom
              <input
                name="last_name"
                className="w-full p-3 border rounded mt-1"
                placeholder="Prénom"
                value={contactFormData.last_name}
                onChange={handleChange}
              />
            </label>
          </div>
          <label className="block mb-2">
            Adresse mail
            <input
              name="email"
              className="w-full p-3 border rounded mt-1"
              placeholder="Adresse mail"
              value={contactFormData.email}
              onChange={handleChange}
            />
          </label>
          <label className="block mb-2">Numéro de téléphone</label>
          <div className="flex items-center space-x-2 mb-2">
            <select className="p-3 border rounded bg-white">
              <option>🇫🇷</option>
              <option>🇬🇧</option>
            </select>
            <input
              name="phone"
              className="w-full p-3 border rounded"
              placeholder="Numéro de téléphone"
              value={contactFormData.phone}
              onChange={handleChange}
            />
          </div>
          <label className="block mb-2">
            Entreprise
            <input
              name="company"
              className="w-full p-3 border rounded mt-1"
              placeholder="Entreprise"
              value={contactFormData.company}
              onChange={handleChange}
            />
          </label>

          <h3 className="text-md font-semibold mt-4">Liste des références</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {referrals.length === 0 ? (
              <p><span role="img" aria-label="cute face">😊</span>Aucune référence trouvée pour le moment.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {referrals.map((referral) => (
                  <div
                    key={referral.ID}
                    className="p-4 border rounded bg-gray-50 shadow cursor-pointer relative"
                  >
                    <div
                      className="w-full h-full"
                      onClick={() => handleCardClick(referral)}
                    >
                      <div>{`${referral.first_name} ${referral.last_name}`}</div>
                      <div>{referral.company}</div>
                    </div>
                    <button
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReferral(referral.ID);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Referral Modal Popup */}
          {selectedReferral && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Détails de la référence</h3>
                  <button
                    onClick={() => setSelectedReferral(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Civilité</span>
                    <span className="text-base">{selectedReferral.gender || '-'}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Prénom</span>
                    <span className="text-base">{selectedReferral.first_name || '-'}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Nom</span>
                    <span className="text-base">{selectedReferral.last_name || '-'}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Adresse e-mail</span>
                    <span className="text-base">{selectedReferral.email || '-'}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Numéro de téléphone</span>
                    <span className="text-base">{selectedReferral.phone || '-'}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Entreprise</span>
                    <span className="text-base">{selectedReferral.company || '-'}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600">Profession</span>
                    <span className="text-base">{selectedReferral.occupation || '-'}</span>
                  </div>

                  {selectedReferral.nb_curr_opportunity !== null && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">Opportunités en cours</span>
                      <span className="text-base">{selectedReferral.nb_curr_opportunity}</span>
                    </div>
                  )}

                  {selectedReferral.nb_done_opportunity !== null && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">Opportunités terminées</span>
                      <span className="text-base">{selectedReferral.nb_done_opportunity}</span>
                    </div>
                  )}

                  {selectedReferral.nb_days !== null && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">Nombre de jours</span>
                      <span className="text-base">{selectedReferral.nb_days}</span>
                    </div>
                  )}

                  {selectedReferral.note && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">Note</span>
                      <span className="text-base">{selectedReferral.note}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedReferral(null)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Updated Documents Section */}
      <DocumentsSection />
    </div>
  );
};

export default Profile;