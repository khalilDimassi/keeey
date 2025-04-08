import { useEffect, useState } from "react";
import { Save, Upload, Edit, X } from "lucide-react";
import axios from "axios";
import { getAuthHeader } from "../../../../../../utils/jwt";
import { PersonalData } from "../../types";

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
    img: "",
  });

  useEffect(() => {
    if (personalData) {
      setFormData(personalData || {
        first_name: "-",
        last_name: "-",
        title: "-",
        email: "-",
        phone: "-",
        gender: "-",
        street: "-",
        zip_code: "-",
        city: "-",
        birthdate: "-",
        birthplace: "-",
        driving_permit: "-",
        nationality: "-",
        linked_in: "-",
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
      phone: "-",
      gender: "-",
      street: "-",
      zip_code: "-",
      city: "-",
      birthdate: "-",
      birthplace: "-",
      driving_permit: "-",
      nationality: "-",
      linked_in: "-",
      description: "-",
      img: "-",
    });
    setChangedFields({});
    setIsEditing(false);
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
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="relative w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            {formData.img ? (
              <img src={formData.img} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="text-gray-400">Photo</div>
            )}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold text-gray-800">{formData.first_name} {formData.last_name}</h2>
            <div className="text-gray-600">{formData.title}</div>
            <div className="text-gray-500 text-sm">{formData.email} | {formData.phone}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-gray-500 text-sm">Civilité</label>
            <div className="mt-1 text-gray-800">{formData.gender}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-500 text-sm">Nom</label>
              <div className="mt-1 text-gray-800">{formData.last_name}</div>
            </div>
            <div>
              <label className="text-gray-500 text-sm">Prénom</label>
              <div className="mt-1 text-gray-800">{formData.first_name}</div>
            </div>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Titre</label>
            <div className="mt-1 text-gray-800">{formData.title}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-500 text-sm">Email</label>
              <div className="mt-1 text-gray-800">{formData.email}</div>
            </div>
            <div>
              <label className="text-gray-500 text-sm">Téléphone</label>
              <div className="mt-1 text-gray-800">{formData.phone}</div>
            </div>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Adresse</label>
            <div className="mt-1 text-gray-800">{formData.street}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-500 text-sm">Code postal</label>
              <div className="mt-1 text-gray-800">{formData.zip_code}</div>
            </div>
            <div>
              <label className="text-gray-500 text-sm">Ville</label>
              <div className="mt-1 text-gray-800">{formData.city}</div>
            </div>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Date de naissance</label>
            <div className="mt-1 text-gray-800">{formData.birthdate}</div>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Lieu de naissance</label>
            <div className="mt-1 text-gray-800">{formData.birthplace}</div>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Permis de conduire</label>
            <div className="mt-1 text-gray-800">{formData.driving_permit}</div>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Nationalité</label>
            <div className="mt-1 text-gray-800">{formData.nationality}</div>
          </div>

          <div>
            <label className="text-gray-500 text-sm">LinkedIn</label>
            <div className="mt-1 text-gray-800">{formData.linked_in}</div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
          >
            <Edit size={16} />
            Modifier
          </button>
        </div>
      </div>
    );
  }

  // Edit mode
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center group">
          {formData.img ? (
            <img src={formData.img} alt="Profile" className="w-full h-full rounded-full object-cover" />
          ) : (
            <div className="text-gray-400">Photo</div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Upload className="text-white" size={20} />
          </div>
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-semibold text-gray-800">{formData.first_name} {formData.last_name}</h2>
          <div className="text-gray-600">{formData.title}</div>
          <div className="text-gray-500 text-sm">{formData.email} | {formData.phone}</div>
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
        <div>
          <label className="text-gray-500 text-sm">Nom</label>
          <input
            type="text"
            name="last_name"
            placeholder="Nom"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-md mt-1"
          />
        </div>
        <div>
          <label className="text-gray-500 text-sm">Prénom</label>
          <input
            type="text"
            name="first_name"
            placeholder="Prénom"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-md mt-1"
          />
        </div>
      </div>

      <div>
        <label className="text-gray-500 text-sm">Titre</label>
        <input
          type="text"
          name="title"
          placeholder="Titre"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-md mt-1"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-gray-500 text-sm">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Adresse e-mail"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-md mt-1"
          />
        </div>
        <div>
          <label className="text-gray-500 text-sm">Téléphone</label>
          <input
            type="tel"
            name="phone"
            placeholder="Numéro de téléphone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-md mt-1"
          />
        </div>
      </div>

      <div>
        <label className="text-gray-500 text-sm">Adresse</label>
        <input
          type="text"
          name="street"
          placeholder="Adresse"
          value={formData.street}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-md mt-1"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-gray-500 text-sm">Code postal</label>
          <input
            type="text"
            name="zip_code"
            placeholder="Code postal"
            value={formData.zip_code}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-md mt-1"
          />
        </div>
        <div>
          <label className="text-gray-500 text-sm">Ville</label>
          <input
            type="text"
            name="city"
            placeholder="Ville"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-md mt-1"
          />
        </div>
      </div>

      <div>
        <label className="text-gray-500 text-sm">Date de naissance</label>
        <input
          type="date"
          name="birthdate"
          placeholder="Date de naissance"
          value={formData.birthdate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-md mt-1"
        />
      </div>
      <div>
        <label className="text-gray-500 text-sm">Lieu de naissance</label>
        <input
          type="text"
          name="birthplace"
          placeholder="Lieu de naissance"
          value={formData.birthplace}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-md mt-1"
        />
      </div>
      <div>
        <label className="text-gray-500 text-sm">Permis de conduire</label>
        <input
          type="text"
          name="driving_permit"
          placeholder="Permis de conduire"
          value={formData.driving_permit}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-md mt-1"
        />
      </div>
      <div>
        <label className="text-gray-500 text-sm">Nationalité</label>
        <input
          type="text"
          name="nationality"
          placeholder="Nationalité"
          value={formData.nationality}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-md mt-1"
        />
      </div>
      <div>
        <label className="text-gray-500 text-sm">LinkedIn</label>
        <input
          type="text"
          name="linked_in"
          placeholder="LinkedIn"
          value={formData.linked_in}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-md mt-1"
        />
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={handleCancel}
          disabled={isSaving}
          className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          <X size={16} />
          Annuler
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving || Object.keys(changedFields).length === 0}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {isSaving ? 'Sauvegarde en cours...' : 'Sauvegarder'}
        </button>
      </div>

      {saveError && (
        <div className="mt-2 text-red-500 text-sm">
          {saveError}
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;