import { useState } from "react";
import { Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DashbordSVG } from "../../components/SVGcomponents";

// Fake données pour le graphique
const chartData = [
  { name: "L", vues: 10, visibilite: 5, contacts: -10 },
  { name: "M", vues: 20, visibilite: 10, contacts: -5 },
  { name: "ME", vues: 50, visibilite: 30, contacts: 0 },
  { name: "J", vues: 20, visibilite: 15, contacts: 5 },
  { name: "V", vues: 30, visibilite: 25, contacts: 10 },
  { name: "S", vues: 40, visibilite: 30, contacts: 20 },
];

// Fake missions en cours
interface Mission {
  id: number;
  title: string;
  end: string;
  progress: number;
}

const fakeMissions: Mission[] = [
  { id: 1, title: "Renault - Chef de Projet", end: "31/12/2024", progress: 90 },
  { id: 2, title: "Renault - Chef de Projet", end: "31/12/2024", progress: 90 },
  { id: 3, title: "Renault - Chef de Projet / exemple", end: "31/12/2024", progress: 90 },
  { id: 4, title: "Renault - Chef de Projet", end: "31/12/2024", progress: 90 },
];

// Critères, compétences, contacts
const criteres = ["Mobile France", "Dispo imm", "Freelance ou CDI", "PS : 300 €/j"];
const competences = ["Naval", "Digital - IT", "Design", "Développeur Full-Stack"];
const contacts = ["NOM", "XXX", "XXX", "XXXX"];
interface BoxProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Accept className prop
}



const Box: React.FC<BoxProps> = ({ title, children, className }) => {
  return (
    <div className={`border p-4 rounded-lg shadow-md ${className}`}>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>

      {children}
    </div>
  );
};


const DashboardKProfile = () => {
  const [periode, setPeriode] = useState("cette semaine");

  return (
    <div className=" min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3 mt-1 mb-4">
          <DashbordSVG size={40} fill="#297280" />
          <h1 className="text-xl font-semibold ">Keeey-board </h1>
        </div>
        <button className="flex items-center bg-[#297280] text-white px-4 py-2 rounded-2xl shadow hover:bg-teal-900">
          <Plus className="w-5 h-5 mr-2" /> Ajouter widget
        </button>
      </div>

      <div className={`relative bg-yellow-400 top-0 left-0 right-0 h-8 my-5 z-10`}>
        <div className="absolute inset-0 bg-black bg-opacity-10 flex justify-center items-center">
          <div className="inline-flex items-center bg-black bg-opacity-20 text-black font-bold text-xs px-2 py-1 rounded mx-4">
            🚧 EN COURS DE CONSTRUCTION 🚧
          </div>
        </div>
      </div>

      {/* Layout en 2 colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne Gauche */}
        <div className="md:col-span-2 space-y-6">
          {/* Vue générale */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Vue générale</h3>
              <select
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
              >
                <option>cette semaine</option>
                <option>ce mois</option>
                <option>cette année</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="vues" stroke="#2563eb" name="Vues du profil" />
                <Line type="monotone" dataKey="visibilite" stroke="#f43f5e" name="Visibilité" />
                <Line type="monotone" dataKey="contacts" stroke="#10b981" name="Contacts" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Missions en cours */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Mes missions en cours</h3>
            {fakeMissions.map((mission) => (
              <div
                key={mission.id}
                className="mb-4 flex justify-between items-center gap-6"
              >
                {/* Infos Mission */}
                <div className="text-sm  w-1/3 text-gray-600 flex-1">
                  <span className="font-medium">{mission.title}</span> - fin le {mission.end}
                </div>

                {/* Progression à droite */}
                <div className="flex  gap-3 w-1/2 ">
                  <span className="text-sm font-medium text-gray-700">Progression:</span>

                  <div className="w-full bg-gray-200 rounded-full h-3.5"> {/* Barre plus grande */}
                    <div
                      className="bg-[#297280] h-3.5 rounded-full transition-all duration-300"
                      style={{ width: `${mission.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{mission.progress}%</span>
                </div>
              </div>
            ))}
          </div>


        </div>

        {/* Colonne Droite */}
        <div className="flex flex-col h-full space-y-6">
          {/* Mes critères */}
          <div className="flex-1">
            <Box title="Mes critères">
              <div className="flex flex-wrap gap-2 p-2">
                {criteres.map((critere, index) => (
                  <span
                    key={index}
                    className="bg-[#297280] text-white px-8 py-7 rounded text-sm flex items-center justify-center"
                    style={{ minWidth: "fit-content", height: "3rem", borderRadius: "7px" }}
                  >
                    {critere}
                  </span>
                ))}
              </div>
            </Box>
          </div>

          {/* Mes compétences */}
          <div className="flex-1">
            <Box title="Mes compétences">
              <div className="flex flex-wrap gap-2">
                {competences.map((comp, index) => (
                  <span
                    key={index}
                    className="bg-[#297280] text-white px-8 py-1 rounded text-sm flex items-center justify-center"
                    style={{ minWidth: "fit-content", height: "3rem", borderRadius: "7px" }}
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </Box>
          </div>

          {/* Mes contacts client */}
          <div className="flex-1">
            <Box title="Mes contacts client">
              <div className="flex flex-wrap gap-4">
                {contacts.map((contact, index) => (
                  <span
                    key={index}
                    className="bg-[#297280] text-white px-8 py-1 rounded-lg text-sm flex items-center justify-center"
                    style={{ minWidth: "fit-content", height: "3rem", borderRadius: "7px" }}
                  >
                    {contact}
                  </span>
                ))}
              </div>
            </Box>
          </div>
        </div>


      </div>
    </div>
  );
}

export default DashboardKProfile;