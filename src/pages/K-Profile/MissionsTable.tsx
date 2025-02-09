import { useState } from "react";
import { Star, ArrowRight, Plus, Trash2, Target } from "lucide-react";
import MissionsDetails from "./MissionsDetails";

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

const fakeMissions: Mission[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  status: "en cours",
  company: "Digiewb",
  contact: "exemple",
  title: "CEO",
  start: "11/11/2024",
  end: "11/11/2024",
  rate: "Exemple",
  satisfaction: 0,
}));

export default function MissionsTable() {
  const [missions, setMissions] = useState<Mission[]>(fakeMissions);

  return (
    <div className=" min-h-screen w-full  flex flex-col ">
      {/* Header avec titre à gauche et bouton à droite */}
      <div className="flex justify-between items-center mb-4">
  {/* Left: Title & Icon */}
  <div className="flex items-center space-x-3 ">
    <Target className="text-teal-800" size={40} />
    <h1 className="text-xl font-semibold">Missions</h1>
  </div>

  {/* Right: Button (Aligned Right) */}
  <button className="ml-auto flex items-center bg-teal-800 text-white px-4 py-2 rounded-lg shadow hover:bg-teal-900">
    <Plus className="w-5 h-5 mr-2" /> Ajouter une mission
  </button>
</div>


      {/* Table */}
      <div className="w-full  bg-white p-4 rounded-lg shadow-md"style={{boxShadow: "0 0 4px 1px rgba(0, 128, 0, 0.2)" ,borderRadius:"10px"}}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead>
              <tr className="border-b text-gray-500 text-left">
                <td className="p-3">État</td>
                <td className="p-3">Société</td>
                <td className="p-3">Contact</td>
                <td className="p-3">Titre</td>
                <td className="p-3">Démarrage</td>
                <td className="p-3">Fin</td>
                <td className="p-3">TJM</td>
                <td className="p-3">Satisfaction (Note)</td>
                <td className="p-3">Actions</td>
              </tr>
            </thead>
            <tbody>
              
              {missions.map((mission) => (
                <tr key={mission.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <span className="bg-green-200 text-green-600 px-3 py-1 rounded-full text-sm">
                      {mission.status}
                    </span>
                  </td>
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
                  <td className="p-3 ">
                    <button className="text-gray-600 hover:text-gray-900">
                      <ArrowRight className="h-5 w-5" />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <MissionsDetails />
    </div>
  );
}