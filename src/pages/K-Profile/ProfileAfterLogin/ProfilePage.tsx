import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaPlus, FaUser } from "react-icons/fa";
import DocumentsSection from "./DocumentsSection";
import { PlusCircle } from "lucide-react";
import axios from "axios";
import { getAuthHeader } from "../../utils/jwt";

const Profile: React.FC = () => {
  const [formData, setFormData] = useState({
    genre: "",
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
      genre: value
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


  const [contactFormData, setContactFormData] = useState({
    gender: "",
    last_name: "",
    first_name: "",
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

  const handleContactSubmit = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/contact`,
        formData,
        { headers: getAuthHeader() }
      );
      alert("Référence ajoutée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'envoi", error);
      alert("Une erreur est survenue");
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
                      name="genre"
                      checked={formData.genre === option}
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
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-sm text-gray-600">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <span className="text-base">{value || '-'}</span>
                </div>
              ))}
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
                  name="refGender"
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
                name="lastName"
                className="w-full p-3 border rounded mt-1"
                placeholder="Nom"
                value={contactFormData.first_name}
                onChange={handleChange}
              />
            </label>
            <label className="block">
              Prénom
              <input
                name="firstName"
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
            <div className="p-4 border rounded bg-gray-50 shadow">
              Web Designer - DIGIWEB
            </div>
            <div className="p-4 border rounded bg-gray-50 shadow">
              Web Designer - DIGIWEB
            </div>
            <div className="p-4 border rounded bg-gray-50 shadow">
              Web Designer - DIGIWEB
            </div>
            <div className="p-4 border rounded bg-gray-50 shadow">
              Web Designer - DIGIWEB
            </div>
          </div>
        </div>
      </div>
      {/* Updated Documents Section */}
      <DocumentsSection />
    </div>

  );
};

export default Profile;