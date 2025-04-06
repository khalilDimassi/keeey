import { ChangeEvent, FC, useEffect, useState } from 'react';
import { PencilLine, Building2, Check, X } from 'lucide-react';
import DocumentsSection from '../../ProfileAfterLogin/DocumentsSection';
import { CompanyInfo, UserData } from '../types';
import { fetchUserData, updateUserData } from '../services';

const GeneralInfoTab: FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<UserData>({
    gender: "",
    first_name: "",
    last_name: "",
    email: "",
    occupation: "",
    phone: "",
    address: "",
    zip: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const userData = await fetchUserData();
      setFormData(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await updateUserData(formData);
      setIsEditing(false);
      await fetchUserData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
  };

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

  const GeneralInfoSkeleton = ({ error = false }: { error?: boolean }) => (
    <div className="w-full mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - Personal Information Skeleton */}
        <div className={`bg-white p-6 w-full md:w-[30%] ${error ? 'border border-red-500' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <div className={`h-6 w-40 rounded ${error ? 'bg-red-300' : 'bg-gray-300'}`}></div>
            <div className={`h-5 w-5 rounded-full ${error ? 'bg-red-300' : 'bg-gray-300'}`}></div>
          </div>

          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className={`h-4 w-20 rounded ${error ? 'bg-red-200' : 'bg-gray-200'}`}></div>
                <div className={`h-6 w-full rounded ${error ? 'bg-red-100' : 'bg-gray-100'}`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Company Info and Documents Skeleton */}
        <div className={`bg-white w-full md:w-[70%] ${error ? 'border border-red-500' : ''}`}>
          {/* Company Information Skeleton */}
          <div className={`bg-white rounded-lg shadow-sm p-6 mb-6 ${error ? 'border border-red-300' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`h-5 w-5 rounded-full ${error ? 'bg-red-300' : 'bg-gray-300'}`}></div>
                <div className={`h-6 w-32 rounded ${error ? 'bg-red-300' : 'bg-gray-300'}`}></div>
              </div>
              <div className={`h-5 w-5 rounded-full ${error ? 'bg-red-300' : 'bg-gray-300'}`}></div>
            </div>

            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-2">
                  <div className={`h-4 w-24 rounded ${error ? 'bg-red-200' : 'bg-gray-200'}`}></div>
                  <div className={`h-4 w-40 rounded ${error ? 'bg-red-100' : 'bg-gray-100'}`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents Section Skeleton */}
          <div className={`bg-white rounded-lg shadow-sm p-6 ${error ? 'border border-red-300' : ''}`}>
            <div className={`h-6 w-40 rounded mb-4 ${error ? 'bg-red-300' : 'bg-gray-300'}`}></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className={`p-4 rounded-lg border ${error ? 'border-red-200' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded ${error ? 'bg-red-200' : 'bg-gray-200'}`}></div>
                    <div className="flex-1 space-y-2">
                      <div className={`h-4 w-3/4 rounded ${error ? 'bg-red-200' : 'bg-gray-200'}`}></div>
                      <div className={`h-3 w-1/2 rounded ${error ? 'bg-red-100' : 'bg-gray-100'}`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="animate-pulse">
        <GeneralInfoSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <div className="animate-pulse">
          <GeneralInfoSkeleton error />
        </div>
        <div className="text-center py-4 text-red-500 font-medium">
          <p>{error}</p>
        </div>
      </>
    );
  }

  return (
    <div className=" ">
      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Personal Information Form */}
          <div className="bg-white p-6  w-full md:w-[30%]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Mes Informations générales</h2>
              {isEditing ? (
                <div className='flex gap-3'>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-600 hover:text-red-800 disabled:opacity-50"
                    title="Cancel"
                  >
                    <X size={24} />
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="text-gray-600 hover:text-green-800 disabled:opacity-50"
                    title="Save"
                  >
                    <Check size={24} />
                  </button>
                </div>
              ) : (
                <button
                  className="text-teal-600 hover:text-teal-700"
                  onClick={() => setIsEditing(true)}
                  title="Edit"
                >
                  <PencilLine className="h-5 w-5" />
                </button>
              )}
            </div>
            {isEditing ? (
              <>
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
                </div>
              </>
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

export default GeneralInfoTab;