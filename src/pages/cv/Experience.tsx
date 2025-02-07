import { Pencil, Trash } from "lucide-react";
import { useState } from "react";

type ExperienceType = {
  nom: string;
  etablissement: string;
  ville: string;
  debut: string;
  fin: string;
  present: boolean;
  description: string;
};

const Experience = () => {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [currentExperience, setCurrentExperience] = useState<ExperienceType>({
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
    setCurrentExperience((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddExperience = () => {
    setExperiences([...experiences, currentExperience]);
    setCurrentExperience({
      nom: "",
      etablissement: "",
      ville: "",
      debut: "",
      fin: "",
      present: false,
      description: "",
    });
  };

  const handleDeleteExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-md p-4">
        <h3 className="font-medium mb-2">Ajouter une expérience</h3>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="nom" className="mb-1 text-gray-600">Nom du poste</label>
            <input
              type="text"
              name="nom"
              id="nom"
              value={currentExperience.nom}
              onChange={handleChange}
              placeholder="Nom du poste"
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="etablissement" className="mb-1 text-gray-600">Nom de l'entreprise</label>
            <input
              type="text"
              name="etablissement"
              id="etablissement"
              value={currentExperience.etablissement}
              onChange={handleChange}
              placeholder="Nom de l'entreprise"
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="ville" className="mb-1 text-gray-600">Ville</label>
            <input
              type="text"
              name="ville"
              id="ville"
              value={currentExperience.ville}
              onChange={handleChange}
              placeholder="Ville"
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="debut" className="mb-1 text-gray-600">Date de début</label>
            <input
              type="date"
              name="debut"
              id="debut"
              value={currentExperience.debut}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
          {!currentExperience.present && (
            <div className="flex flex-col">
              <label htmlFor="fin" className="mb-1 text-gray-600">Date de fin</label>
              <input
                type="date"
                name="fin"
                id="fin"
                value={currentExperience.fin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
          )}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="present"
              checked={currentExperience.present}
              onChange={handleChange}
              className="text-teal-600"
            />
            <span>À ce jour</span>
          </label>
          <div className="flex flex-col">
            <label htmlFor="description" className="mb-1 text-gray-600">Description</label>
            <textarea
              name="description"
              id="description"
              value={currentExperience.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full px-3 py-2 border border-gray-200 rounded-md h-24"
            />
          </div>
          <button
            onClick={handleAddExperience}
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
          >
            Enregistrer
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {experiences.map((experience, index) => (
          <div key={index} className="flex justify-between items-center border border-gray-200 p-3 rounded-md">
            <span>{experience.nom}</span>
            <div className="flex gap-2">
              <button className="text-gray-500 hover:text-gray-700">
                <Pencil size={18} />
              </button>
              <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteExperience(index)}>
                <Trash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
