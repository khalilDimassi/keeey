import React, { useEffect, useState } from 'react';
import { Building2, PencilLine } from 'lucide-react';
import axios from 'axios';
import { getAuthHeader } from '../../../../utils/jwt';
import DocumentsSection from '../../ProfileAfterLogin/DocumentsSection';


interface CompanyInfo {
  name: string;
  address: string;
  siret: string;
}

function InformationsGnerales() {
  const handleRadioChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
  };

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const companyInfo: CompanyInfo = {
    name: 'exemple',
    address: 'exemple',
    siret: 'exemple',
  };

  // const documents = [
  //   { id: 'kbis', name: 'K-BIS' },
  //   { id: 'rib', name: 'RIB' },
  //   { id: 'urssaf', name: 'Attestation Urssaf' },
  //   { id: 'cv', name: 'CV' },
  //   { id: 'portfolio', name: 'Portefolio' },
  // ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className=" ">
      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Personal Information Form */}
          <div className="bg-white p-6  w-full md:w-[30%]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Mes Informations générales</h2>
              {!isEditing && (
                <button
                  className="text-green-600 hover:text-green-700"
                  onClick={() => setIsEditing(true)}
                >
                  <button className="text-teal-600 hover:text-teal-700">
                    <PencilLine className="h-5 w-5" />
                  </button>
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
                    className="bg-gradient-to-b from-[#30797F] to-[#039DAA] hover:bg-green-600 text-white font-bold py-2 px-7 rounded transition duration-200 ease-in-out"
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

          {/* Right Column - Company Info and Documents */}
          <div className="bg-white   w-full md:w-[70%]">
            {/* Company Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Entreprise
                  <span className="text-sm font-normal text-gray-500">(si concerné)</span>
                </h2>
                <button className="text-teal-600 hover:text-teal-700">
                  <PencilLine className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">Nom : </span>
                  <span className="text-gray-600">{companyInfo.name}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Adresse : </span>
                  <span className="text-gray-600">{companyInfo.address}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">SIREN/SIRET : </span>
                  <span className="text-gray-600">{companyInfo.siret}</span>
                </div>
              </div>
            </div>

            <DocumentsSection />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InformationsGnerales;