import React, { useState } from "react";
import { Star, Bookmark, ArrowUpRight, ChevronDown, Plus } from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  rating: number;
  level: string;
  availability: string;
  matchPercentage: string;
  skills: string[];
  extraSkills: number;
}

const StarButton = () => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div
      className="bg-blue-400 p-2 rounded-full flex items-center justify-center cursor-pointer"
      onClick={() => setIsClicked(!isClicked)}
    >
      <Star size={18} className={isClicked ? "text-yellow-500" : "text-white"} />
    </div>
  );
};
const candidates: Candidate[] = [
  {
    id: 1,
    name: "Nom Prenom",
    rating: 4.2,
    level: "Intermédiaire",
    availability: "Immédiate",
    matchPercentage: "80%",
    skills: ["exp", "exp", "exp", "exp"],
    extraSkills: 4,
  },
  {
    id: 2,
    name: "Nom Prenom",
    rating: 4.2,
    level: "Intermédiaire",
    availability: "Immédiate",
    matchPercentage: "80%",
    skills: ["exp", "exp", "exp", "exp"],
    extraSkills: 4,
  },
  {
    id: 3,
    name: "Nom Prenom",
    rating: 4.2,
    level: "Intermédiaire",
    availability: "Immédiate",
    matchPercentage: "80%",
    skills: ["exp", "exp", "exp", "exp"],
    extraSkills: 4,
  },
];

const CandidatesListDefinirBesoin: React.FC = () => {
  return (
    <div className="p-4 ">
      {/* Titre + Sélecteur */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Candidats <span className="text-gray-500">(10 Candidats)</span>
        </h2>
        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-md border border-gray-300 shadow-sm">
          Matching <ChevronDown size={16} />
        </button>
      </div>

      {/* Liste des candidats */}
      <div className="space-y-3">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between gap-4"style={{boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)" ,borderRadius:"10px"}}
          >
            {/* Badge correspondance */}
            <span className="bg-blue-300 text-blue-800 px-3 py-1 text-sm font-semibold rounded-md">
              {candidate.matchPercentage} correspondant
            </span>

            {/* Nom + Détails */}
            <span className="font-semibold">{candidate.name}</span>

            {/* Évaluation */}
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-500" />
              <span className="text-gray-600">{candidate.rating}</span>
            </div>

            {/* Niveau */}
            <span className="text-gray-500">{candidate.level}</span>

            {/* Disponibilité */}
            <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded">
              {candidate.availability}
            </span>

            {/* Compétences */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-sm">Compétences :</span>
              {candidate.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-300 text-blue-800 w-14 px-2 py-1 text-xs rounded items-center"
                >
                  {skill}
                </span>
              ))}
              {candidate.extraSkills > 0 && (
                <span className="bg-black text-white w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full">
                  +{candidate.extraSkills}
                </span>
              )}
            </div>

            {/* Actions à droite */}
            <div className="flex items-center gap-4" >
      <StarButton />
            <div className="bg-blue-800 p-2 rounded-full flex items-center justify-center" style={{backgroundColor:"#215A96" }}>
            
                <ArrowUpRight size={15} className="text-white top-4 right-4" />
              
              </div>
              <button className="bg-blue-800 text-white px-4 py-2 rounded-3xl flex items-center gap-2" style={{backgroundColor:"#215A96" ,borderRadius:"10px"}}>
               ✓ Valider l’intérêt
              </button>
             
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidatesListDefinirBesoin;