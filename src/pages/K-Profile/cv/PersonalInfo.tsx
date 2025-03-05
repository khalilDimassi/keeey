import { useEffect, useState } from "react";
import { Save, Upload } from "lucide-react";
import axios from "axios";
import { getAuthHeader } from "../../../utils/jwt";

interface PersonalData {
  first_name: string;
  last_name: string;
  title: string;
  email: string;
  phone: string;
  gender: string;
  street: string;
  zip_code: string;
  city: string;
  birthdate: string;
  birthplace: string;
  driving_permit: string;
  nationality: string;
  linked_in: string;
  description: string;
}

const PersonalInfo = ({ personalData, onDataUpdated }: { personalData: PersonalData, onDataUpdated: () => void }) => {
  const [formData, setFormData] = useState<PersonalData>({
    first_name: "",
    last_name: "",
    title: "",
    email: "",
    phone: "",
    gender: "",
    street: "",
    zip_code: "",
    city: "",
    birthdate: "",
    birthplace: "",
    driving_permit: "",
    nationality: "",
    linked_in: "",
    description: "",
  });

  const [changedFields, setChangedFields] = useState<Partial<PersonalData>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (personalData) {
      setFormData(personalData);
    }
  }, [personalData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "radio" ? (checked ? value : formData.gender) : value;

    // Track changes compared to original data
    const key = name as keyof PersonalData;
    const originalValue = personalData[key];

    setFormData({
      ...formData,
      [key]: newValue,
    });

    // Only add to changedFields if the value is different from original
    if (newValue !== originalValue) {
      setChangedFields(prev => ({
        ...prev,
        [key]: newValue
      }));
    } else {
      // Type-safe removal of field
      setChangedFields(prev => {
        const newChangedFields = { ...prev };
        delete newChangedFields[key];
        return newChangedFields;
      });
    }
  };

  const handleSave = async () => {
    if (Object.keys(changedFields).length === 0) {
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

      // Reset changed fields after successful save
      setChangedFields({});
      onDataUpdated();
    } catch (error) {
      console.error("Error saving personal data:", error);
      setSaveError("Erreur lors de la sauvegarde des informations personnelles");
    } finally {
      setIsSaving(false);
    }
  };

  if (personalData === null) {
    return <div className="text-gray-500">Chargement des informations personnelles...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center group">
          <div className="text-gray-400">Photo</div>
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Upload className="text-white" size={20} />
          </div>
        </div>
        <div className="text-center sm:text-left">
          <div className="text-gray-600">{formData.first_name} {formData.last_name}</div>
          <div className="text-gray-400 text-sm">{formData.title}</div>
          <div className="text-gray-400 text-sm">{formData.email} | {formData.phone}</div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="gender"
            value="Mr"
            checked={formData.gender === 'Mr'}
            onChange={handleChange}
            className="text-teal-600"
          />
          <span>Mr.</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="gender"
            value="Madame"
            checked={formData.gender === 'Madame'}
            onChange={handleChange}
            className="text-teal-600"
          />
          <span>Madame</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="gender"
            value="Autre"
            checked={formData.gender === 'other'}
            onChange={handleChange}
            className="text-teal-600"
          />
          <span>Autre</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="last_name"
          placeholder="Nom"
          value={formData.last_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-md"
        />
        <input
          type="text"
          name="first_name"
          placeholder="Prénom"
          value={formData.first_name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-md"
        />
      </div>

      <input
        type="text"
        name="title"
        placeholder="Titre"
        value={formData.title}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-200 rounded-md"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="email"
          name="email"
          placeholder="Adresse e-mail"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-md"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Numéro de téléphone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-md"
        />
      </div>

      <input
        type="text"
        name="street"
        placeholder="Adresse"
        value={formData.street}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-200 rounded-md"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="zip_code"
          placeholder="Code postal"
          value={formData.zip_code}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-md"
        />
        <input
          type="text"
          name="city"
          placeholder="Ville"
          value={formData.city}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-md"
        />
      </div>

      <input
        type="date"
        name="birthdate"
        placeholder="Date de naissance"
        value={formData.birthdate}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-200 rounded-md"
      />
      <input
        type="text"
        name="birthplace"
        placeholder="Lieu de naissance"
        value={formData.birthplace}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-200 rounded-md"
      />
      <input
        type="text"
        name="driving_permit"
        placeholder="Permis de conduire"
        value={formData.driving_permit}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-200 rounded-md"
      />
      <input
        type="text"
        name="nationality"
        placeholder="Nationalité"
        value={formData.nationality}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-200 rounded-md"
      />
      <input
        type="text"
        name="linked_in"
        placeholder="LinkedIn"
        value={formData.linked_in}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-200 rounded-md"
      />
      {/* Save Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          <Save size={20} />
          {isSaving ? 'Sauvegarde en cours...' : 'Sauvegarder'}
        </button>
      </div>

      {/* Error Message */}
      {saveError && (
        <div className="mt-2 text-red-500 text-sm">
          {saveError}
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;  