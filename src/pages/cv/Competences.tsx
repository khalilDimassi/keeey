import { Search, Trash } from "lucide-react";
import { useState } from "react";

const Competences = () => {
    const [competence, setCompetence] = useState("");
    const [competences, setCompetences] = useState([
      "JavaScript",
      "React",
      "Node.js",
      "CSS",
      "HTML",
      "Python",
      "MongoDB",
      "Git",
      "SQL",
      "Vue.js"
    ]);
  
    const handleAddCompetence = () => {
      if (competence.trim() !== "") {
        setCompetences([...competences, competence]);
        setCompetence("");
      }
    };
  
    const handleDeleteCompetence = (index: number) => {
        setCompetences(competences.filter((_, i) => i !== index));
      };
      
  
    return (
      <div className="p-4">
        {/* Champ de saisie avec icône Search */}
         <label className="block text-sm font-medium text-gray-700">
            Compétences : 
          </label>
        <div className="relative mb-4">
          <input
            type="text"
            value={competence}
            onChange={(e) => setCompetence(e.target.value)}
            placeholder='exemple "Digital" "IT"'
            className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
          />
          <Search className="absolute right-3 top-3 text-gray-400" size={18} />
        </div>
  
        {/* Liste des compétences */}
        <div className="space-y-2">
          {competences.map((comp, index) => (
            <div
              key={index}
              className="flex justify-between items-center border border-gray-300 px-4 py-2 rounded-md bg-gray-100"
            >
              <span>{comp}</span>
              <button 
                onClick={() => handleDeleteCompetence(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
  export default Competences;