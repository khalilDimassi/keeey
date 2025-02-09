import { Pencil, Trash } from "lucide-react";
import { useState } from "react";

type FormationType = {
  nom: string;
  etablissement: string;
  ville: string;
  debut: string;
  fin: string;
  present: boolean;
  description: string;
};

const Formation = () => {
  const [formations, setFormations] = useState<FormationType[]>([]);
  const [currentFormation, setCurrentFormation] = useState<FormationType>({
    nom: "",
    etablissement: "",
    ville: "",
    debut: "",
    fin: "",
    present: false,
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setCurrentFormation({
      ...currentFormation,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddFormation = () => {
    setFormations([...formations, currentFormation]);
    setCurrentFormation({
      nom: "",
      etablissement: "",
      ville: "",
      debut: "",
      fin: "",
      present: false,
      description: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className=" p-4">
      
        <div className="space-y-4">
          <div >
            <label className="block text-sm font-medium text-gray-700 mb-3">Formation</label>
            <input 
              type="text" 
              name="nom"
              value={currentFormation.nom}
              onChange={handleChange}
              placeholder="Nom de la formation"
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Établissement</label>
              <input 
                type="text" 
                name="etablissement"
                value={currentFormation.etablissement}
                onChange={handleChange}
                placeholder="Établissement"
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Ville</label>
              <input 
                type="text" 
                name="ville"
                value={currentFormation.ville}
                onChange={handleChange}
                placeholder="Ville"
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Date de début</label>
              <input 
                type="date" 
                name="debut"
                value={currentFormation.debut}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
            {!currentFormation.present && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Date de fin</label>
                <input 
                  type="date" 
                  name="fin"
                  value={currentFormation.fin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md"
                />
              </div>
            )}
          </div>
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              name="present"
              checked={currentFormation.present}
              onChange={handleChange}
              className="text-teal-600"
            />
            <span>À ce jour</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Description</label>
            <textarea 
              name="description"
              value={currentFormation.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full px-3 py-2 border border-gray-200 rounded-md h-24"
            />
          </div>
          <button 
            onClick={handleAddFormation}
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
          >
            Enregistrer
          </button>
        </div>
      </div>

      {/* Liste des formations enregistrées */}
      <div className="space-y-2">
        {formations.map((formation, index) => (
          <div key={index} className="flex justify-between items-center border border-gray-200 p-3 rounded-md">
            <span>{formation.nom}</span>
            <div className="flex gap-2">
              <button className="text-gray-500 hover:text-gray-700">
                <Pencil size={18} />
              </button>
              <button 
                className="text-red-500 hover:text-red-700"
                onClick={() => setFormations(formations.filter((_, i) => i !== index))}
              >
                <Trash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Formation;
