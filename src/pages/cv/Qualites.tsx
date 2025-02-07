import { Search, Trash } from "lucide-react";
import { useState } from "react";

const Qualites = () => {
    const [qualite, setQualite] = useState("");
    const [qualites, setQualites] = useState([
      "Leadership",
      "Communication",
      "Problem-solving",
      "Teamwork",
      "Adaptability",
      "Creativity",
      "Time Management",
      "Critical Thinking",
      "Collaboration",
      "Work Ethic"
    ]);
  
    const handleAddQualite = () => {
      if (qualite.trim() !== "") {
        setQualites([...qualites, qualite]);
        setQualite("");
      }
    };
  
    const handleDeleteQualite = (index: number) => {
        setQualites(qualites.filter((_, i) => i !== index));
      };
      
    return (
      <div className="p-4">
        {/* Champ de saisie avec icône Search */}
        <label className="block text-sm font-medium text-gray-700">
          Qualité
        </label>
        <div className="relative mb-4">
          <input
            type="text"
            value={qualite}
            onChange={(e) => setQualite(e.target.value)}
            placeholder='Ajouter une qualité'
            className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
          />
          <Search className="absolute right-3 top-3 text-gray-400" size={18} />
        </div>
  
        {/* Liste des qualités */}
        <div className="space-y-2">
          {qualites.map((qual, index) => (
            <div
              key={index}
              className="flex justify-between items-center border border-gray-300 px-4 py-2 rounded-md bg-gray-100"
            >
              <span>{qual}</span>
              <button 
                onClick={() => handleDeleteQualite(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash size={18} />
              </button>
            </div>
          ))}
        </div>
  
        {/* Bouton pour ajouter une qualité */}
        <button
          onClick={handleAddQualite}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Ajouter une qualité
        </button>
      </div>
    );
  };
  export default Qualites;