import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaUser } from "react-icons/fa";
import DocumentsSection from "./DocumentsSection";
import { PlusCircle } from "lucide-react";
import axios from "axios";
import { getAuthHeader } from "../../../utils/jwt";
import { ChevronRight, User } from "lucide-react";
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
  const [activeForm, setActiveForm] = useState("cooptations"); // Default form

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
          className="bg-white p-6 rounded-2xl shadow-md border w-full md:w-[40%]"
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

        <div className="w-full md:w-60%]">
          {/* Tabs */}


          <div className="flex gap-2 relative">
            <button
              style={{
                boxShadow: activeForm === "cooptations"
                  ? "0 -4px 4px -2px #00800033, 4px 0 4px -2px #00800033, -4px 0 4px -2px #00800033"
                  : "none"
              }}
              className={`px-8 py-3  font-medium transition-all relative ${activeForm === "cooptations"
                ? "text-gray-900 bg-white rounded-t-xl z-10"
                : "text-gray-400 bg-gray-100/50"
                }`}
              onClick={() => setActiveForm("cooptations")}
            >
              Mes cooptations
            </button>

            <button
              style={{
                boxShadow: activeForm === "references"
                  ? "0 -4px 4px -2px #00800033, 4px 0 4px -2px #00800033, -4px 0 4px -2px #00800033"
                  : "none"
              }}
              className={`px-8 py-3 font-medium transition-all relative ${activeForm === "references"
                ? "text-gray-900 bg-white rounded-t-2xl z-10"
                : "text-gray-400 bg-gray-100/50"
                }`}
              onClick={() => setActiveForm("references")}
            >
              Mes Références
            </button>
          </div>

          {/* Forms */}
          {/* Forms */}
          <div className="w-full">
            {(activeForm === "cooptations" || activeForm === "references") && (
              <div
                className="bg-white p-6 w-full md:w-full"
                style={{
                  boxShadow: "0 0 4px 1px #00800033",
                  borderRadius: activeForm === "cooptations" ? "0px 20px 20px 20px" : "rounded-2xl"
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    {activeForm === "cooptations" ? "Mes cooptations" : "Mes Références"}
                  </h2>
                  <button onClick={handleContactSubmit} className="text-green-700 hover:text-blue-700">
                    <PlusCircle size={40} />
                  </button>
                </div>

                {/* Gender Radio Buttons */}
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

                {/* Name Fields */}
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

                {/* Contact Fields */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <label className="block">
                    Adresse mail
                    <input
                      name="email"
                      className="w-full p-3 border rounded mt-1"
                      placeholder="Adresse mail"
                      value={contactFormData.email}
                      onChange={handleChange}
                    />
                  </label>
                  <label className="block">
                    Numéro de téléphone
                    <div className="flex items-center space-x-2 mt-1">
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
                  </label>
                </div>

                {/* Company Fields */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <label className="block">
                    Entreprise
                    <input
                      name="company"
                      className="w-full p-3 border rounded mt-1"
                      placeholder="Entreprise"
                      value={contactFormData.company}
                      onChange={handleChange}
                    />
                  </label>
                  <label className="block">
                    Fonction principale / Titre
                    <input
                      name="job_title"
                      className="w-full p-3 border rounded mt-1"
                      placeholder="Fonction principale / Titre"
                      value={contactFormData.occupation}
                      onChange={handleChange}
                    />
                  </label>
                </div>

                {/* List of Items */}
                <div className="p-6">
                  <div className="max-w-3xl">
                    <div className="flex justify-between items-center mb-6">
                      <h1 className="text-xl font-semibold text-gray-800">
                        Liste des {activeForm === "cooptations" ? "cooptations" : "Réferences"}
                      </h1>
                      <button className="text-blue-600 hover:text-blue-800 flex items-center">
                        Voir tout
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>

                    {referrals.length === 0 ? (
                      <p>
                        <span role="img" aria-label="cute face">😊</span>
                        Aucune {activeForm === "cooptations" ? "cooptations" : "référence"} trouvée pour le moment.
                      </p>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {referrals.map((referral) => (
                          <div
                            key={referral.ID}
                            onClick={() => handleCardClick(referral)}
                            className="bg-white rounded-xl border shadow hover:shadow-md transition-shadow p-5 cursor-pointer relative"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center">
                                <div className="bg-gray-100 p-2 rounded-full">
                                  <User className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-gray-600">{`${referral.first_name} ${referral.last_name}`}</p>
                                  <h3 className="font-medium text-gray-900">{referral.company}</h3>
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-400" />
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
                </div>

                {/* Shared Modal Popup */}
                {selectedReferral && (
                  <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300 ease-in-out">
                    <div className="bg-white p-0 rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                      {/* Header with gradient */}
                      <div className="p-5 text-white" style={{ background: 'linear-gradient(to right,rgb(23, 43, 44),rgb(46, 167, 179))' }}>
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-bold">
                            Détails de {activeForm === "cooptations" ? "la cooptation" : "la référence"}
                          </h3>
                          <button
                            onClick={() => setSelectedReferral(null)}
                            className="text-white hover:text-green-100 transition-colors duration-200"
                            aria-label="Fermer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Content area with drop shadow at top */}
                      <div className="p-6 shadow-inner max-h-96 overflow-y-auto">
                        <div className="space-y-4">
                          {/* Personal information section */}
                          <div className="mb-6">
                            <h4 className="text-green-600 font-medium text-lg mb-3 border-b border-green-200 pb-1" style={{ color: "#297280" }}>
                              Informations personnelles
                            </h4>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                              <div>
                                <span className="text-xs uppercase tracking-wider text-gray-500">Civilité</span>
                                <p className="font-medium mt-1">{selectedReferral.gender || '-'}</p>
                              </div>
                              <div>
                                <span className="text-xs uppercase tracking-wider text-gray-500">Prénom</span>
                                <p className="font-medium mt-1">{selectedReferral.first_name || '-'}</p>
                              </div>
                              <div>
                                <span className="text-xs uppercase tracking-wider text-gray-500">Nom</span>
                                <p className="font-medium mt-1">{selectedReferral.last_name || '-'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Contact information section */}
                          <div className="mb-6">
                            <h4 className="text-green-600 font-medium text-lg mb-3 border-b border-green-200 pb-1" style={{ color: "#297280" }}>
                              Contact
                            </h4>
                            <div className="space-y-4">
                              <div>
                                <span className="text-xs uppercase tracking-wider text-gray-500">Adresse e-mail</span>
                                <p className="font-medium mt-1 break-words">{selectedReferral.email || '-'}</p>
                              </div>
                              <div>
                                <span className="text-xs uppercase tracking-wider text-gray-500">Numéro de téléphone</span>
                                <p className="font-medium mt-1">{selectedReferral.phone || '-'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Professional information section */}
                          <div className="mb-6">
                            <h4 className="text-green-600 font-medium text-lg mb-3 border-b border-green-200 pb-1" style={{ color: "#297280" }}>
                              Informations professionnelles
                            </h4>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                              <div>
                                <span className="text-xs uppercase tracking-wider text-gray-500">Entreprise</span>
                                <p className="font-medium mt-1">{selectedReferral.company || '-'}</p>
                              </div>
                              <div>
                                <span className="text-xs uppercase tracking-wider text-gray-500">Profession</span>
                                <p className="font-medium mt-1">{selectedReferral.occupation || '-'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Opportunities section - only shown if at least one opportunity field exists */}
                          {(selectedReferral.nb_curr_opportunity !== null ||
                            selectedReferral.nb_done_opportunity !== null ||
                            selectedReferral.nb_days !== null) && (
                              <div className="mb-6">
                                <h4 className="text-green-600 font-medium text-lg mb-3 border-b border-green-200 pb-1" style={{ color: "#297280" }}>
                                  Opportunités
                                </h4>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                  {selectedReferral.nb_curr_opportunity !== null && (
                                    <div>
                                      <span className="text-xs uppercase tracking-wider text-gray-500">En cours</span>
                                      <p className="font-medium mt-1">{selectedReferral.nb_curr_opportunity}</p>
                                    </div>
                                  )}
                                  {selectedReferral.nb_done_opportunity !== null && (
                                    <div>
                                      <span className="text-xs uppercase tracking-wider text-gray-500">Terminées</span>
                                      <p className="font-medium mt-1">{selectedReferral.nb_done_opportunity}</p>
                                    </div>
                                  )}
                                  {selectedReferral.nb_days !== null && (
                                    <div>
                                      <span className="text-xs uppercase tracking-wider text-gray-500">Nombre de jours</span>
                                      <p className="font-medium mt-1">{selectedReferral.nb_days}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Notes section - only shown if notes exist */}
                          {selectedReferral.note && (
                            <div>
                              <h4 className="text-green-600 font-medium text-lg mb-3 border-b border-green-200 pb-1" style={{ color: "#297280" }}>
                                Notes
                              </h4>
                              <div className="bg-green-50 p-3 rounded-lg">
                                <p className="text-base whitespace-pre-wrap">{selectedReferral.note}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer with action button */}
                      <div className="bg-gray-50 p-4 flex justify-end border-t border-gray-100">
                        <button
                          onClick={() => setSelectedReferral(null)}
                          style={{ background: "#297280" }}
                          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-xl transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 shadow-md"
                        >
                          Fermer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Updated Documents Section */}
      <DocumentsSection />
    </div>
  );
};

export default Profile;