import { useState } from "react";
import { Plus, ArrowUpRight, LayoutGrid } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

export default function Dashboard() {
  const [periode, setPeriode] = useState("cette semaine");

  return (
    <div className=" min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3 mt-1 mb-4">

          <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.5 21.0519C3.5 20.5072 3.71071 19.9848 4.08579 19.5996C4.46086 19.2144 4.96957 18.998 5.5 18.998H11.5C12.0304 18.998 12.5391 19.2144 12.9142 19.5996C13.2893 19.9848 13.5 20.5072 13.5 21.0519V27.2136C13.5 27.7583 13.2893 28.2807 12.9142 28.6659C12.5391 29.0511 12.0304 29.2675 11.5 29.2675H5.5C4.96957 29.2675 4.46086 29.0511 4.08579 28.6659C3.71071 28.2807 3.5 27.7583 3.5 27.2136V21.0519Z" fill="url(#paint0_linear_567_3764)" />
            <path d="M2.5 7.70232C2.5 7.1576 2.71071 6.63518 3.08579 6.25001C3.46086 5.86483 3.96957 5.64844 4.5 5.64844H11.5C12.0304 5.64844 12.5391 5.86483 12.9142 6.25001C13.2893 6.63518 13.5 7.1576 13.5 7.70232V14.8909C13.5 15.4356 13.2893 15.958 12.9142 16.3432C12.5391 16.7284 12.0304 16.9448 11.5 16.9448H4.5C3.96957 16.9448 3.46086 16.7284 3.08579 16.3432C2.71071 15.958 2.5 15.4356 2.5 14.8909V7.70232ZM15.5 21.0526C15.5 20.5078 15.7107 19.9854 16.0858 19.6002C16.4609 19.2151 16.9696 18.9987 17.5 18.9987H24.5C25.0304 18.9987 25.5391 19.2151 25.9142 19.6002C26.2893 19.9854 26.5 20.5078 26.5 21.0526V28.2411C26.5 28.7859 26.2893 29.3083 25.9142 29.6935C25.5391 30.0786 25.0304 30.295 24.5 30.295H17.5C16.9696 30.295 16.4609 30.0786 16.0858 29.6935C15.7107 29.3083 15.5 28.7859 15.5 28.2411V21.0526Z" fill="url(#paint1_linear_567_3764)" />
            <path d="M15.5 4.62127C15.5 4.07654 15.7107 3.55413 16.0858 3.16895C16.4609 2.78377 16.9696 2.56738 17.5 2.56738H27.5C28.0304 2.56738 28.5391 2.78377 28.9142 3.16895C29.2893 3.55413 29.5 4.07654 29.5 4.62127V14.8907C29.5 15.4354 29.2893 15.9578 28.9142 16.343C28.5391 16.7282 28.0304 16.9446 27.5 16.9446H17.5C16.9696 16.9446 16.4609 16.7282 16.0858 16.343C15.7107 15.9578 15.5 15.4354 15.5 14.8907V4.62127Z" fill="url(#paint2_linear_567_3764)" />
            <defs>
              <linearGradient id="paint0_linear_567_3764" x1="8.5" y1="18.998" x2="8.5" y2="29.2675" gradientUnits="userSpaceOnUse">
                <stop stopColor="#30797F" />
                <stop offset="1" stopColor="#039DAA" />
              </linearGradient>
              <linearGradient id="paint1_linear_567_3764" x1="14.5" y1="5.64844" x2="14.5" y2="30.295" gradientUnits="userSpaceOnUse">
                <stop stopColor="#30797F" />
                <stop offset="1" stopColor="#039DAA" />
              </linearGradient>
              <linearGradient id="paint2_linear_567_3764" x1="22.5" y1="2.56738" x2="22.5" y2="16.9446" gradientUnits="userSpaceOnUse">
                <stop stopColor="#30797F" />
                <stop offset="1" stopColor="#039DAA" />
              </linearGradient>
            </defs>
          </svg>

          <h1 className="text-xl font-semibold ">Keeey-board </h1>
        </div>
        <button className="flex items-center bg-teal-800 text-white px-4 py-2 rounded-2xl shadow hover:bg-teal-900">
          <Plus className="w-5 h-5 mr-2" /> Ajouter widget
        </button>
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
                      className="bg-teal-800 h-3.5 rounded-full transition-all duration-300"
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
                    className="bg-teal-800 text-white px-8 py-7 rounded text-sm flex items-center justify-center"
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
                    className="bg-teal-800 text-white px-8 py-1 rounded text-sm flex items-center justify-center"
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
                    className="bg-teal-800 text-white px-8 py-1 rounded-lg text-sm flex items-center justify-center"
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