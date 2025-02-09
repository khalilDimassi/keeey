import { Upload } from "lucide-react";

interface PersonalData {
  first_name: string
  last_name: string
  title: string
  email: string
  phone: string
  gender: string
  street: string
  zip_code: string
  city: string
  birthdate: string
  birthplace: string
  driving_permit: string
  nationality: string
  linked_in: string
}

const PersonalInfo = ({ data }: { data: PersonalData }) => {
  if (!data) {
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
          <div className="text-gray-600">{data.first_name} {data.last_name}</div>
          <div className="text-gray-400 text-sm">{data.title}</div>
          <div className="text-gray-400 text-sm">{data.email} | {data.phone}</div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input type="radio" name="gender" className="text-teal-600" checked={data.gender === 'Mr'} />
          <span>Mr.</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="gender" className="text-teal-600" checked={data.gender === 'Madame'} />
          <span>Madame</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="gender" className="text-teal-600" checked={data.gender === 'Autre'} />
          <span>Autre</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="text" placeholder="Nom" value={data.last_name} className="w-full px-3 py-2 border border-gray-200 rounded-md" readOnly />
        <input type="text" placeholder="Prénom" value={data.first_name} className="w-full px-3 py-2 border border-gray-200 rounded-md" readOnly />
      </div>

      <input type="text" placeholder="Titre" value={data.title} className="w-full px-3 py-2 border border-gray-200 rounded-md" readOnly />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="email" placeholder="Adresse e-mail" value={data.email} className="w-full px-3 py-2 border border-gray-200 rounded-md" readOnly />
        <input type="tel" placeholder="Numéro de téléphone" value={data.phone} className="w-full px-3 py-2 border border-gray-200 rounded-md" readOnly />
      </div>

      <input type="text" placeholder="Adresse" value={data.street} className="w-full px-3 py-2 border border-gray-200 rounded-md" readOnly />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="text" placeholder="Code postal" value={data.zip_code} className="w-full px-3 py-2 border border-gray-200 rounded-md" readOnly />
        <input type="text" placeholder="Ville" value={data.city} className="w-full px-3 py-2 border border-gray-200 rounded-md" readOnly />
      </div>

      <input type="date" placeholder="Date de naissance" value={data.birthdate} className="w-full px-3 py-2 border border-gray-200 rounded-md" readOnly />
      <input type="text" placeholder="Lieu de naissance" value={data.birthplace} className="w-full px-3 py-2 border border-gray-200 rounded-md" readOnly />
      <input type="text" placeholder="Permis de conduire" value={data.driving_permit} className="w-full px-3 py-2 border border-gray-200 rounded-md" readOnly />
      <input type="text" placeholder="Nationalité" value={data.nationality} className="w-full px-3 py-2 border border-gray-200 rounded-md" readOnly />
      <input type="text" placeholder="LinkedIn" value={data.linked_in} className="w-full px-3 py-2 border border-gray-200 rounded-md" readOnly />
    </div>
  );
};

export default PersonalInfo;