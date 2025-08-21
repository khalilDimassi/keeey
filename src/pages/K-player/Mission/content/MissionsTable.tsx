import { Star, ArrowUpRightIcon, Trash2Icon } from "lucide-react";
import { Mission } from "../types";

const MissionsTable = ({ missions, onSelectMission, onDelete, loading }: { missions: Mission[]; onSelectMission: (missionId: number) => void; onDelete: (missionId: number) => void; loading: boolean; }) => {

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="text-center py-8">Loading missions...</div>
      ) : missions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No missions available</div>
      ) : (
        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
          <thead>
            <tr className="text-gray-500 text-left">
              <td className="p-3">État</td>
              <td className="p-3">Société</td>
              <td className="p-3">Contact</td>
              <td className="p-3">Titre</td>
              <td className="p-3">Démarrage</td>
              <td className="p-3">Fin</td>
              <td className="p-3">TJM</td>
              <td className="p-3">Satisfaction (Note)</td>
              <td className="p-3"></td>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {missions.map((mission) => (
              <tr key={mission.id} className="hover:bg-gray-50">
                <td className="p-3">
                  <span className={`px-4 py-1 text-xs font-bold rounded-full ${mission.status === "ONGOING" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {mission.status === "ONGOING" ? "En cours" : "Terminée"}
                  </span>
                </td>
                <td className="p-3">{mission.company}</td>
                <td className="p-3">{mission.contact}</td>
                <td className="p-3">{mission.title}</td>
                <td className="p-3">{mission.start}</td>
                <td className="p-3">{mission.end}</td>
                <td className="p-3">{mission.rate}</td>
                <td className="p-3 flex">
                  {Array(5).fill(0).map((_, index) => (
                    <Star
                      key={index}
                      size={20}
                      fill={index < mission.satisfaction ? "#EAB308" : "none"}
                      className={`${index < mission.satisfaction ? "text-[#EAB308]" : "text-[#D1D5DB]"}`}
                    />
                  ))}
                </td>
                <td className="p-3">
                  <div className="flex gap-4">
                    <ArrowUpRightIcon
                      color="white"
                      size={25}
                      className="cursor-pointer bg-[#215A96] p-0.5 rounded-full hover:bg-blue-900"
                      onClick={() => onSelectMission(mission.id)}
                    />
                    <Trash2Icon
                      size={25}
                      className="cursor-pointer text-[#215A96] hover:text-red-900"
                      onClick={() => onDelete(mission.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MissionsTable