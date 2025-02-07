import { Upload } from "lucide-react";

const PersonalInfo = () => {return(
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center group">
          <div className="text-gray-400">Photo</div>
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Upload className="text-white" size={20} />
          </div>
        </div>
        <div className="text-center sm:text-left">
          <div className="text-gray-600">Mr exemple</div>
          <div className="text-gray-400 text-sm">Titre</div>
          <div className="text-gray-400 text-sm">exemple123@exemple.com | +33 123 123 123</div>
        </div>
      </div>
  
      <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input type="radio" name="gender" className="text-teal-600" />
          <span>Mr.</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="gender" className="text-teal-600" />
          <span>Madame</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="gender" className="text-teal-600" />
          <span>Autre</span>
        </label>
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="text" placeholder="Nom" className="w-full px-3 py-2 border border-gray-200 rounded-md" />
        <input type="text" placeholder="Prénom" className="w-full px-3 py-2 border border-gray-200 rounded-md" />
      </div>
  
      <input type="text" placeholder="Titre" className="w-full px-3 py-2 border border-gray-200 rounded-md" />
  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="email" placeholder="Adresse e-mail" className="w-full px-3 py-2 border border-gray-200 rounded-md" />
        <input type="tel" placeholder="Numéro de téléphone" className="w-full px-3 py-2 border border-gray-200 rounded-md" />
      </div>
  
      <input type="text" placeholder="Adresse" className="w-full px-3 py-2 border border-gray-200 rounded-md" />
  
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="text" placeholder="Code postal" className="w-full px-3 py-2 border border-gray-200 rounded-md" />
        <input type="text" placeholder="Ville" className="w-full px-3 py-2 border border-gray-200 rounded-md" />
      </div>
  
      <input type="date" placeholder="Date de naissance" className="w-full px-3 py-2 border border-gray-200 rounded-md" />
      <input type="text" placeholder="Lieu de naissance" className="w-full px-3 py-2 border border-gray-200 rounded-md" />
      <input type="text" placeholder="Permis de conduire" className="w-full px-3 py-2 border border-gray-200 rounded-md" />
      <input type="text" placeholder="Nationalité" className="w-full px-3 py-2 border border-gray-200 rounded-md" />
      <input type="text" placeholder="LinkedIn" className="w-full px-3 py-2 border border-gray-200 rounded-md" />
    </div>
  );}
  
  export default PersonalInfo;