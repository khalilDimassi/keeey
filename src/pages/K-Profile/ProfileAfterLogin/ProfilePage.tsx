import React, { useState } from "react";
import { FaPencilAlt, FaPlus, FaUser } from "react-icons/fa";
import DocumentsSection from "./DocumentsSection";
import { PlusCircle } from "lucide-react";
import axios from "axios";
import { getAuthHeader } from "../../utils/jwt";

const Profile: React.FC = () => {
  const [formData, setFormData] = useState({
    genre: "",
    nom: "",
    prenom: "",
    email: "",
    fonction: "",
    telephone: "",
    adresse: "",
    codePostal: ""
  });


  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

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

  const handleSubmit = () => {
    setIsFormSubmitted(true);
  };



  const [contactformData, setContactFormData] = useState({
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
      ...contactformData,
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
    <div className="p-4 space-y-6 min-h-screen" style={{ marginLeft: "-40px" }}>
      <div className="flex items-center space-x-4 ml-20 mt-10">
        <FaUser className="text-3xl text-green-800 " />
        <span className="text-2xl text-gray-800" style={{ fontWeight: "bold" }}>
          Profile
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <div
          className="bg-white p-6 rounded-2xl shadow-md border w-full md:w-[30%]"
          style={{ boxShadow: "0 0 4px 1px rgba(0, 128, 0, 0.2)" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Mes Informations générales
            </h2>
            {isFormSubmitted && (
              <button
                className="text-green-600 hover:text-green-700"
                onClick={() => setIsFormSubmitted(false)}
              >
                <FaPencilAlt />
              </button>
            )}
          </div>

          {!isFormSubmitted ? (
            // Form Input View
            <div className="space-y-4">
              <div className="flex space-x-4 mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="genre"
                    checked={formData.genre === "Mr."}
                    onChange={() => handleRadioChange("Mr.")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span>Mr.</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="genre"
                    checked={formData.genre === "Madame"}
                    onChange={() => handleRadioChange("Madame")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span>Madame</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="genre"
                    checked={formData.genre === "Autre"}
                    onChange={() => handleRadioChange("Autre")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span>Autre</span>
                </label>
              </div>

              <label className="block">
                Nom
                <input
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded mt-1"
                  placeholder="Nom"
                />
              </label>

              <label className="block">
                Prénom
                <input
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded mt-1"
                  placeholder="Prénom"
                />
              </label>

              <label className="block">
                Email
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded mt-1"
                  placeholder="Email"
                />
              </label>

              <label className="block">
                Fonction principale / Titre
                <input
                  name="fonction"
                  value={formData.fonction}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded mt-1"
                  placeholder="Fonction principale / Titre"
                />
              </label>

              <label className="block mb-2">Numéro de téléphone</label>
              <div className="flex items-center space-x-2 mb-2">
                <select className="p-3 border rounded bg-white">
                  <option>🇫🇷</option>
                  <option>🇬🇧</option>
                </select>
                <input
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded mt-1"
                  placeholder="Numéro de téléphone"
                />
              </div>

              <label className="block">
                Adresse postale
                <input
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded mt-1"
                  placeholder="Adresse postale"
                />
              </label>

              <label className="block">
                Code Postal
                <input
                  name="codePostal"
                  value={formData.codePostal}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded mt-1"
                  placeholder="Code Postal"
                />
              </label>

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-green-800 hover:bg-green-600 text-white font-bold py-2 px-7 rounded transition duration-200 ease-in-out"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            // Display View (after save)
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Genre</span>
                <span className="text-base">{formData.genre}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Nom</span>
                <span className="text-base">{formData.nom}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Prénom</span>
                <span className="text-base">{formData.prenom}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Email</span>
                <span className="text-base">{formData.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">
                  Fonction principale / Titre
                </span>
                <span className="text-base">{formData.fonction}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Numéro de téléphone</span>
                <span className="text-base">{formData.telephone}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Adresse postale</span>
                <span className="text-base">{formData.adresse}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Code Postal</span>
                <span className="text-base">{formData.codePostal}</span>
              </div>
            </div>
          )}
        </div>

        {/* Mes Références Section */}
        <div
          className="bg-white p-6 rounded-2xl shadow-md border w-full md:w-[60%]"
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
                  checked={contactformData.gender === label}
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
                value={contactformData.last_name}
                onChange={handleChange}
              />
            </label>
            <label className="block">
              Prénom
              <input
                name="firstName"
                className="w-full p-3 border rounded mt-1"
                placeholder="Prénom"
                value={contactformData.first_name}
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
              value={formData.email}
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
              value={contactformData.phone}
              onChange={handleChange}
            />
          </div>
          <label className="block mb-2">
            Entreprise
            <input
              name="company"
              className="w-full p-3 border rounded mt-1"
              placeholder="Entreprise"
              value={contactformData.company}
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