import { useState } from "react";
import { Star, ArrowRight, Plus, Trash2, Target, ArrowLeft } from "lucide-react";
import {  Trash, Edit } from "lucide-react";
import DocumentsSectionMissionKplayer from "./DocumentsSectionMissionKplayer";


interface Mission {
  id: number;
  status: string;
  company: string;
  contact: string;
  title: string;
  start: string;
  end: string;
  rate: string;
  satisfaction: number;
}

// Fake Data pour le premier tableau (Missions)
const missions: Mission[] = [
  {
    id: 1,
    status: "En cours",
    company: "Exemple Corp",
    contact: "Jean Dupont",
    title: "CEO",
    start: "11/11/2024",
    end: "11/11/2024",
    rate: "800€/jour",
    satisfaction: 4,
  },
];

interface MissionsDetailsProps {
    mission: Mission;
    onBack: () => void;
  }
  
  export default function Missionsdetails({ mission, onBack }: MissionsDetailsProps) {
    return (
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center ">
          <div className="flex items-center space-x-3">
          <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600"
        >
          <ArrowLeft size={20} />
  
        </button>
            <Target style={{ color: "#215A96" }} size={40} />
            <h1 className="text-xl font-semibold">Missions - Détails</h1>
          </div>
          {/* Right: Button (Aligned Right) */}
        <div className="ml-auto flex items-center   px-4 ">
           <button className="ml-auto flex items-center space-x-2">
  {/* Bouton Modifier */}
  <button
    style={{
      backgroundColor: "#D1D5DB", // gray-300
      color: "#000",
      padding: "0.5rem 1rem",
      borderRadius: "1.5rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s",
    }}
 >
    <Edit className="w-5 h-5" /> Modifier
  </button>

  {/* Bouton Supprimer */}
  <button
    style={{
      backgroundColor: "#215A96", // Bleu personnalisé
      color: "white", 
       padding: "0.5rem 1rem",
      borderRadius: "1.5rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s",
    }}
  >
    <Trash className="w-5 h-5" /> Supprimer
  </button>
</button>
        </div>
  
          
        </div>
  
        {/* Première Table: Missions */}
        <div className="w-full bg-white p-4 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="border-b text-gray-500 text-left">
                  <th className="p-3">État</th>
                  <th className="p-3">Société</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Titre</th>
                  <th className="p-3">Démarrage</th>
                  <th className="p-3">Fin</th>
                  <th className="p-3">TJM</th>
                  <th className="p-3">Satisfaction</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3"><span className="px-4 py-1 bg-green-200 text-green-700 rounded">{mission.status}</span></td>
                  <td className="p-3">{mission.company}</td>
                  <td className="p-3">{mission.contact}</td>
                  <td className="p-3">{mission.title}</td>
                  <td className="p-3">{mission.start}</td>
                  <td className="p-3">{mission.end}</td>
                  <td className="p-3">{mission.rate}</td>
                  <td className="p-3 flex">
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <Star key={index} className={`h-5 w-5 ${index < mission.satisfaction ? "text-yellow-500" : "text-gray-300"}`} />
                      ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        {/* Deuxième Table: Détails */}
        <div className="w-full bg-white p-4 rounded-lg shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="border-b text-gray-500 text-left">
                  <th className="p-3 text-center">Année</th>
                  <th className="p-3 text-center">Mois</th>
                  <th className="p-3 text-center">Statut</th>
                  <th className="p-3 text-center">Nb jours travaillés</th>
                  <th className="p-3 text-center">Frais</th>
                  <th className="p-3 text-center">Descriptif Frais</th>
                  <th className="p-3 text-center">Écart</th>
                  <th className="p-3 text-center">Montant HT</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b ">
                <td className="text-center"><span className="m-1 px-4 py-2 bg-gray-200 rounded">2024</span></td>
                  <td className="text-center" ><span className=" m-1 px-4 py-2 bg-gray-200  rounded">Novembre</span></td>
                  <td className="text-center"><span className=" m-1 px-4 py-2 bg-gray-200  rounded">Validé</span></td>
                  <td className="text-center"><span className=" m-1 px-4 py-2 bg-gray-200  rounded">20</span></td>
                  <td className="text-center"><span className=" m-1 px-4 py-2 bg-gray-200  rounded">200€</span></td>
                  <td className="text-center"><span className=" m-1 px-4 py-2 bg-gray-200  rounded">Repas & transport</span></td>
                  <td className="text-center"><span className=" m-1 px-4 py-2 bg-gray-200  rounded">0€</span></td>
                  <td className="text-center"><span className=" m-1 px-4 py-2 bg-gray-200  rounded">16 000€</span></td>
                  <td className="p-3 text-center">
                    <button  
                      style={{
                        backgroundColor: "#215A96",
                        color: "white",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "1rem",
                        transition: "background-color 0.2s",
                      }}
                    >
                      Valider le CRA
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        {/* Upload Documents */}
        <div className="w-full bg-white p-4 rounded-lg shadow-md">
          <DocumentsSectionMissionKplayer />
        </div>
      </div>
    );
  }
  