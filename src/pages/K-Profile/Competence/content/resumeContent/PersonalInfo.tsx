import { useEffect, useState } from "react";
import { Save, Upload, Edit, X, Link, AlertTriangle, BadgeCheck, Linkedin } from "lucide-react";
import { getAuthHeader } from "../../../../../utils/jwt";
import { PersonalData } from "../../types";
import { FileImagePopup, LinkImagePopup } from "./pfpUpload";
import axios from "axios";

const PersonalInfo = ({ personalData, onDataUpdated }: { personalData: PersonalData | null, onDataUpdated: () => void }) => {
  const [changedFields, setChangedFields] = useState<Partial<PersonalData>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PersonalData>({
    first_name: "",
    last_name: "",
    title: "",
    email: "",
    verified: true,
    phone: "",
    gender: "",
    street: "",
    zip_code: "",
    city: "",
    birthdate: "",
    birthplace: "",
    driving_permit: "",
    nationality: "",
    linkedin: "",
    description: "",
    img: "",
  });

  useEffect(() => {
    if (personalData) {
      setFormData(personalData || {
        first_name: "-",
        last_name: "-",
        title: "-",
        email: "-",
        verified: true,
        phone: "-",
        gender: "-",
        street: "-",
        zip_code: "-",
        city: "-",
        birthdate: "-",
        birthplace: "-",
        driving_permit: "-",
        nationality: "-",
        linkedin: "-",
        description: "-",
        img: "-",
      });
    }
  }, [personalData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "radio" ? (checked ? value : formData.gender) : value;

    const key = name as keyof PersonalData;
    const originalValue = personalData ? personalData[key] : undefined;

    setFormData({
      ...formData,
      [key]: newValue,
    });

    if (newValue !== originalValue) {
      setChangedFields(prev => ({
        ...prev,
        [key]: newValue
      }));
    } else {
      setChangedFields(prev => {
        const newChangedFields = { ...prev };
        delete newChangedFields[key];
        return newChangedFields;
      });
    }
  };

  const handleSave = async () => {
    if (Object.keys(changedFields).length === 0) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/personal/v2`,
        changedFields,
        {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          },
        }
      );

      setChangedFields({});
      onDataUpdated();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving personal data:", error);
      setSaveError("Erreur lors de la sauvegarde des informations personnelles");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(personalData || {
      first_name: "-",
      last_name: "-",
      title: "-",
      email: "-",
      verified: true,
      phone: "-",
      gender: "-",
      street: "-",
      zip_code: "-",
      city: "-",
      birthdate: "-",
      birthplace: "-",
      driving_permit: "-",
      nationality: "-",
      linkedin: "-",
      description: "-",
      img: "-",
    });
    setChangedFields({});
    setIsEditing(false);
  };

  const handleResendVerification = async () => {
    try {
      await axios.get(import.meta.env.VITE_API_BASE_URL + '/api/v1/private/request-verification-email', {
        headers: {
          ...getAuthHeader()
        }
      });
    } catch (error) {
      console.error('Failed to resend verification email:', error);
    }
  };

  // Loading skeleton
  if (personalData === null) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="h-6 bg-gray-200 rounded w-16"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>

        <div className="h-10 bg-gray-200 rounded"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>

        <div className="h-10 bg-gray-200 rounded"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>

        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }
  // View mode
  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl border ">
          <div className="relative w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center shadow-lg ring-4 ring-[#297280]">
            {formData.img ? (
              <img src={formData.img} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="text-[#297280] font-medium">Photo</div>
            )}
          </div>
          <div className="text-center sm:text-left">
            <div className="flex gap-2">
              <h2 className="text-2xl font-bold text-gray-800">{formData.gender}</h2>
              <h2 className="text-2xl font-bold text-gray-800">{formData.first_name} {formData.last_name}</h2>
            </div>
            <div className="text-lg text-[#297280] font-medium">{formData.title}</div>
            <div className="text-gray-600 mt-1">{formData.email} | {formData.phone}</div>
          </div>
        </div>

        {/* Personal Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="mt-1 w-2 h-2 bg-teal-500 rounded-full"></div>
              Informations personnelles
            </h3>
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Civilité</label>
                  <div className="mt-1 text-gray-800 font-medium">{formData.gender}</div>
                </div>
                <div className="w-1/2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nationalité</label>
                  <div className="mt-1 text-gray-800 font-medium">{formData.nationality}</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nom</label>
                  <div className="mt-1 text-gray-800 font-medium">{formData.last_name}</div>
                </div>
                <div className="w-1/2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Prénom</label>
                  <div className="mt-1 text-gray-800 font-medium">{formData.first_name}</div>
                </div>
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
                  {formData.verified ? (
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
                <div className="mt-1 text-gray-800 font-medium">{formData.email}</div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Téléphone</label>
                <div className="mt-1 text-gray-800 font-medium">{formData.phone}</div>
              </div>
              <div>
                <div className="flex gap-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">LinkedIn</label>
                  <button
                    className="-mt-1"
                    onClick={() => {
                      if (formData.linkedin) {
                        let url = formData.linkedin.trim();
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
                <div className="mt-1 text-gray-800 font-medium">{formData.linkedin}</div>
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
                <div className="mt-1 text-gray-800 font-medium">{formData.street}</div>
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Code postal</label>
                  <div className="mt-1 text-gray-800 font-medium">{formData.zip_code}</div>
                </div>
                <div className="w-1/2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ville</label>
                  <div className="mt-1 text-gray-800 font-medium">{formData.city}</div>
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
                  <div className="mt-1 text-gray-800 font-medium">{formData.birthdate}</div>
                </div>
                <div className="w-1/2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Lieu de naissance</label>
                  <div className="mt-1 text-gray-800 font-medium">{formData.birthplace}</div>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Permis de conduire</label>
                <div className="mt-1 text-gray-800 font-medium">{formData.driving_permit}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-[#297280] text-white px-6 py-3 rounded-xl"
          >
            <Edit size={18} />
            Modifier
          </button>
        </div>
      </div>
    );
  }

  // Edit mode
  return (
    <div className="space-y-6">
      {/* Edit Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  checked={formData.gender === 'M.'}
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
                  checked={formData.gender === 'Mme'}
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
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg mt-1 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Prénom</label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="Prénom"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg mt-1 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Titre</label>
              <input
                type="text"
                name="title"
                placeholder="Titre professionnel"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg mt-1 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nationalité</label>
              <input
                type="text"
                name="nationality"
                placeholder="Nationalité"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg mt-1 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
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
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Téléphone</label>
              <input
                type="tel"
                name="phone"
                placeholder="+33 1 23 45 67 89"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">LinkedIn</label>
              <input
                type="text"
                name="linkedin"
                placeholder="linkedin.com/in/profil"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
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
                name="street"
                placeholder="123 Rue de la Paix"
                value={formData.street}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg mt-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Code postal</label>
                <input
                  type="text"
                  name="zip_code"
                  placeholder="75001"
                  value={formData.zip_code}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg mt-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ville</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Paris"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg mt-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
                  value={formData.birthdate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Lieu de naissance</label>
                <input
                  type="text"
                  name="birthplace"
                  placeholder="Paris, France"
                  value={formData.birthplace}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Permis de conduire</label>
              <input
                type="text"
                name="driving_permit"
                placeholder="B, A2"
                value={formData.driving_permit}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg mt-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={handleCancel}
          disabled={isSaving}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
        >
          <X size={18} />
          Annuler
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving || Object.keys(changedFields).length === 0}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
        >
          <Save size={18} />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      {saveError && (
        <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="text-red-600 text-sm font-medium">{saveError}</div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;