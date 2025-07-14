import { FC, useEffect, useState } from 'react';
import { PencilLine, Check, X, AlertTriangle, BadgeCheck, Linkedin } from 'lucide-react';
import { ApiUserResponse, CompanyInfo, ProfileData, UserData } from '../types';
import { fetchUserData, updateUserData } from '../services';
import { getAuthHeader } from '../../../../utils/jwt';
import DocumentsSection from './DocumentsSection';
import axios from 'axios';

const GeneralInfoTab: FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [_changedFields, setChangedFields] = useState<Partial<ApiUserResponse>>({});
  const [formData, setFormData] = useState<ApiUserResponse>({
    profile: {
      id: "",
      title: "",
      description: "",
      nationality: "",
      birthplace: "",
      birthdate: "",
      driving_permit: "",
      linked_in: "",
      created_at: "",
      updated_at: "",
    } as ProfileData,
    user: {
      ID: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      user_role: "",
      gender: "",
      occupation: "",
      address: "",
      city: "",
      zip: "",
      email_verified: false,
      verification_token: "",
      created_at: "",
      updated_at: "",
    } as UserData,
  });

  useEffect(() => {
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

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "radio" ? (checked ? value : formData.user.gender) : value;

    // Check if the field belongs to user or profile
    const userFields = ['first_name', 'last_name', 'email', 'phone', 'gender', 'occupation', 'address', 'city', 'zip'];
    const profileFields = ['title', 'nationality', 'birthplace', 'birthdate', 'driving_permit', 'linked_in'];

    setFormData(prevData => {
      if (userFields.includes(name)) {
        const updatedUser = {
          ...prevData.user,
          [name]: newValue
        };

        // Track changed fields for user
        setChangedFields(prev => ({
          ...prev,
          user: {
            ...prev.user,
            [name]: newValue
          }
        }));

        return {
          ...prevData,
          user: updatedUser
        };
      } else if (profileFields.includes(name)) {
        const updatedProfile = {
          ...prevData.profile,
          [name]: newValue
        };

        // Track changed fields for profile
        setChangedFields(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            [name]: newValue
          }
        }));

        return {
          ...prevData,
          profile: updatedProfile
        };
      }

      return prevData;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      await updateUserData(formData);
      setIsEditing(false);
      setChangedFields({});

      const updatedData = await fetchUserData();
      setFormData(updatedData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const companyInfo: CompanyInfo = {
    name: 'UNICEF',
    address: 'Rue du Lac de Windermere – 1053- Les Berges du Lac 1, Tunis, Tunisia',
    siret: '784 671 695 00087',
  };

  const handleResendVerification = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await axios.get(import.meta.env.VITE_API_BASE_URL + '/api/v1/private/request-verification-email', {
        headers: {
          ...getAuthHeader()
        }
      });
    } catch (error) {
      console.error('Failed to resend verification email:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || error) {
    const SimpleStatusCard = ({ status }: { status: "loading" | "error" }) => (
      <div className={`p-5 rounded-xl border ${status === "error"
        ? "border-red-200 bg-red-50"
        : "border-gray-200 bg-gray-50"
        }`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2 h-2 rounded-full ${status === "error" ? "bg-red-500" : "bg-gray-300"
            }`} />
          <div className={`font-medium ${status === "error" ? "text-red-600" : "text-gray-500"
            }`}>
            {status === "error" ? "Error loading data" : "Loading..."}
          </div>
        </div>
        <div className="space-y-2 text-sm text-gray-500">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      </div>
    );

    return (
      <div className="w-full mx-auto relative pt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(() => (
          <SimpleStatusCard key={Math.random()} status={error ? "error" : "loading"} />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full mx-auto relative pt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="absolute top-0 right-0 items-center m-2">
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
          {/* Personal Info */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <div className="mt-1 w-2 h-2 bg-teal-500 rounded-full"></div>
              Informations personnelles
            </h3>

            {/* Gender Selection */}
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Civilité</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="M."
                    checked={formData.user.gender === 'M.'}
                    onChange={handleChange}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-gray-700">M.</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="Mme"
                    checked={formData.user.gender === 'Mme'}
                    onChange={handleChange}
                    className="text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-gray-700">Mme</span>
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nom</label>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Nom"
                    value={formData.user.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Prénom</label>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="Prénom"
                    value={formData.user.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  placeholder="Titre professionnel"
                  value={formData.user.occupation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full"></div>
              Contact
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="adresse@email.com"
                  value={formData.user.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+33 1 23 45 67 89"
                  value={formData.user.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">LinkedIn</label>
                <input
                  type="text"
                  name="linked_in"
                  placeholder="linkedin.com/in/profil"
                  value={formData.profile.linked_in}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Organization Info */}
          <div className="relative bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            {/* Stylish Work in Progress Overlay */}
            <div className="absolute inset-0 bg-gray-100/80 z-10 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,_#e5e7eb_0,_#e5e7eb_25px,_transparent_25px,_transparent_50px)] opacity-60"></div>
              </div>
              <div className="bg-white border-2 border-gray-300 px-8 py-4 rounded-xl shadow-lg z-10">
                <span className="text-l font-bold text-gray-700">EN COURS DE CONSTRUCTION</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="mt-1 w-2 h-2 bg-orange-500 rounded-full"></div>
              Organization Information
            </h3>
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nom de l'Entreprise</label>
                  <div className="mt-1 text-gray-800 font-medium">{companyInfo.name}</div>
                </div>
                <div className="w-1/2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address de l'Entreprise</label>
                  <div className="mt-1 text-gray-800 font-medium">{companyInfo.address}</div>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">SIREN/SIRET de l'Entreprise</label>
                <div className="mt-1 text-gray-800 font-medium">{companyInfo.siret}</div>
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <div className="mt-1 w-2 h-2 bg-purple-500 rounded-full"></div>
              Adresse
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Rue</label>
                <input
                  type="text"
                  name="address"
                  placeholder="123 Rue de la Paix"
                  value={formData.user.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex gap-4">
                <div className="w-2/5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Code postal</label>
                  <input
                    type="text"
                    name="zip"
                    placeholder="75001"
                    value={formData.user.zip}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="w-3/5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ville</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Paris"
                    value={formData.user.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Birth & Additional Info */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <div className="mt-1 w-2 h-2 bg-orange-500 rounded-full"></div>
              Autres informations
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date de naissance</label>
                  <input
                    type="date"
                    name="birthdate"
                    value={formData.profile.birthdate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Lieu de naissance</label>
                  <input
                    type="text"
                    name="birthplace"
                    placeholder="Paris, France"
                    value={formData.profile.birthplace}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className='w-1/2'>
                  <label className="block h-8 text-xs  font-medium text-gray-500 uppercase tracking-wide">Nationalité</label>
                  <input
                    type="text"
                    name="nationality"
                    placeholder="Nationalité"
                    value={formData.profile.nationality}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block h-8 text-xs font-medium text-gray-500 uppercase tracking-wide">Authorization de travail en France</label>
                  <input
                    type="text"
                    name="fr_work_permit"
                    placeholder="-"
                    disabled
                    value={formData.profile.fr_work_permit ? formData.profile.fr_work_permit : "-"}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Permis de conduire</label>
                <input
                  type="text"
                  name="driving_permit"
                  placeholder="B, A2"
                  value={formData.profile.driving_permit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mt-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Personal Documents */}
          <div className="relative bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            {/* Stylish Work in Progress Overlay */}
            <div className="absolute inset-0 bg-gray-100/80 z-10 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,_#e5e7eb_0,_#e5e7eb_25px,_transparent_25px,_transparent_50px)] opacity-60"></div>
              </div>
              <div className="bg-white border-2 border-gray-300 px-8 py-4 rounded-xl shadow-lg z-10">
                <span className="text-l font-bold text-gray-700">EN COURS DE CONSTRUCTION</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="mt-1 w-2 h-2 bg-orange-500 rounded-full"></div>
              Personal Documents
            </h3>
            <div className="space-y-3">
              <DocumentsSection />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Basic Info */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="mt-1 w-2 h-2 bg-teal-500 rounded-full"></div>
              Informations personnelles
            </h3>
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="w-1/5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Civilité</label>
                  <div className="mt-1 text-gray-800 font-medium">{formData.user.gender}</div>
                </div>
                <div className="w-2/5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nom</label>
                  <div className="mt-1 text-gray-800 font-medium">{formData.user.last_name}</div>
                </div>
                <div className="w-2/5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Prénom</label>
                  <div className="mt-1 text-gray-800 font-medium">{formData.user.first_name}</div>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Occupation</label>
                <div className="mt-1 text-gray-800 font-medium">{formData.user.occupation ? formData.user.occupation : "-"}</div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full"></div>
              Contact
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex gap-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                  {formData.user.email_verified ? (
                    <div className="-mt-0.5">
                      <BadgeCheck
                        size={20}
                        strokeWidth={2}
                        fill="#297280"
                        color='white'
                      />
                    </div>
                  ) : (
                    <button
                      onClick={handleResendVerification}
                      className="w-3 h-3 mt-0.5 bg-orange-400 hover:bg-orange-500 rounded-full flex items-center justify-center  group"
                      title="Email not verified - Click to resend"
                    >
                      <AlertTriangle
                        size={20}
                        className={`w-2 h-2 -mt-0.5 ml-0.5 text-white`}
                        strokeWidth={2}
                      />
                    </button>
                  )}
                </div>
                <div className="mt-1 text-gray-800 font-medium">{formData.user.email}</div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Téléphone</label>
                <div className="mt-1 text-gray-800 font-medium">{formData.user.phone}</div>
              </div>
              <div>
                <div className="flex gap-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">LinkedIn</label>
                  <button
                    className="-mt-1"
                    onClick={() => {
                      if (formData.profile.linked_in) {
                        let url = formData.profile.linked_in.trim();
                        if (!url.startsWith('http://') && !url.startsWith('https://')) {
                          url = 'https://' + url;
                        }
                        if (url.includes('linkedin.com')) {
                          window.open(url, '_blank');
                        } else {
                          console.warn('Invalid LinkedIn URL:', url);
                        }
                      }
                    }}
                    title="Visit LinkedIn Profile ?"
                  >
                    <Linkedin
                      size={20}
                      strokeWidth={0}
                      color="white"
                      fill="#0077B5"
                    />
                  </button>
                </div>
                <div className="mt-1 text-gray-800 font-medium">{formData.profile.linked_in}</div>
              </div>
            </div>
          </div>

          {/* Organization Info */}
          <div className="relative bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            {/* Stylish Work in Progress Overlay */}
            <div className="absolute inset-0 bg-gray-100/80 z-10 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,_#e5e7eb_0,_#e5e7eb_25px,_transparent_25px,_transparent_50px)] opacity-60"></div>
              </div>
              <div className="bg-white border-2 border-gray-300 px-8 py-4 rounded-xl shadow-lg z-10">
                <span className="text-l font-bold text-gray-700">EN COURS DE CONSTRUCTION</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="mt-1 w-2 h-2 bg-orange-500 rounded-full"></div>
              Organization Information
            </h3>
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nom de l'Entreprise</label>
                  <div className="mt-1 text-gray-800 font-medium">{companyInfo.name}</div>
                </div>
                <div className="w-1/2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Address de l'Entreprise</label>
                  <div className="mt-1 text-gray-800 font-medium">{companyInfo.address}</div>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">SIREN/SIRET de l'Entreprise</label>
                <div className="mt-1 text-gray-800 font-medium">{companyInfo.siret}</div>
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="mt-1 w-2 h-2 bg-purple-500 rounded-full"></div>
              Adresse
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Rue</label>
                <div className="mt-1 text-gray-800 font-medium">{formData.user.address}</div>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Code postal</label>
                  <div className="mt-1 text-gray-800 font-medium">{formData.user.zip}</div>
                </div>
                <div className="w-1/2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ville</label>
                  <div className="mt-1 text-gray-800 font-medium">{formData.user.city}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Birth & Additional Info */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="mt-1 w-2 h-2 bg-orange-500 rounded-full"></div>
              Autres informations
            </h3>
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date de naissance</label>
                  <div className="mt-1 text-gray-800 font-medium">{formData.profile.birthdate}</div>
                </div>
                <div className="w-1/2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Lieu de naissance</label>
                  <div className="mt-1 text-gray-800 font-medium">{formData.profile.birthplace}</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block h-8 text-xs font-medium text-gray-500 uppercase tracking-wide">Nationalité</label>
                  <div className="mt-1 text-gray-800 font-medium">{formData.profile.nationality}</div>
                </div>
                <div className="w-1/2">
                  <label className="block h-8 text-xs font-medium text-gray-500 uppercase tracking-wide">Authorization de travail en France</label>
                  {/* TODO */}
                  <div className="mt-1 text-gray-800 font-medium">{formData.profile.fr_work_permit == null ? "-" : formData.profile.fr_work_permit === "true" ? "Oui" : "Non"}</div>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Permis de conduire</label>
                <div className="mt-1 text-gray-800 font-medium">{formData.profile.driving_permit}</div>
              </div>
            </div>
          </div>

          {/* Personal Documents */}
          <div className="relative bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            {/* Stylish Work in Progress Overlay */}
            <div className="absolute inset-0 bg-gray-100/80 z-10 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,_#e5e7eb_0,_#e5e7eb_25px,_transparent_25px,_transparent_50px)] opacity-60"></div>
              </div>
              <div className="bg-white border-2 border-gray-300 px-8 py-4 rounded-xl shadow-lg z-10">
                <span className="text-l font-bold text-gray-700">EN COURS DE CONSTRUCTION</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="mt-1 w-2 h-2 bg-orange-500 rounded-full"></div>
              Personal Documents
            </h3>
            <div className="space-y-3">
              <DocumentsSection />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default GeneralInfoTab;