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
    
<svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M29.4252 6.92488C25.8218 5.32271 21.7745 5.0195 17.9726 6.06693C14.1708 7.11436 10.8498 9.44761 8.57546 12.6691C6.3011 15.8906 5.21411 19.8011 5.49972 23.7342C5.78532 27.6673 7.42584 31.3797 10.1418 34.2389C12.8577 37.098 16.4809 38.927 20.3942 39.4142C24.3074 39.9014 28.2685 39.0166 31.6026 36.9107C34.9367 34.8048 37.4374 31.608 38.6786 27.8649C39.9199 24.1219 39.8249 20.0643 38.4099 16.3835L35.8158 17.3807C37.0001 20.4614 37.0796 23.8574 36.0407 26.9901C35.0018 30.1229 32.9089 32.7984 30.1184 34.561C27.328 36.3236 24.0127 37.064 20.7375 36.6563C17.4623 36.2485 14.4298 34.7178 12.1568 32.3248C9.88368 29.9318 8.51065 26.8247 8.27161 23.5329C8.03257 20.2411 8.94232 16.9683 10.8458 14.272C12.7494 11.5758 15.5289 9.62294 18.7108 8.7463C21.8928 7.86965 25.2802 8.12342 28.296 9.46435L29.4252 6.92488Z" fill="url(#paint0_linear_587_4531)"/>
<path d="M27.7421 11.2489C25.1266 10.0301 22.1682 9.76065 19.3755 10.4869C16.5828 11.2132 14.1304 12.8898 12.4401 15.2284C10.7497 17.567 9.92702 20.4216 10.1134 23.3011C10.2998 26.1806 11.4837 28.9053 13.4615 31.0064C15.4393 33.1076 18.0873 34.454 20.9503 34.8142C23.8134 35.1743 26.7124 34.5256 29.1489 32.9797C31.5855 31.4338 33.4072 29.0873 34.301 26.3436C35.1947 23.6 35.1046 20.6306 34.0461 17.9462L31.0333 19.1342C31.8157 21.1182 31.8823 23.3128 31.2217 25.3406C30.5612 27.3684 29.2147 29.1026 27.4139 30.2452C25.6131 31.3877 23.4705 31.8671 21.3545 31.601C19.2385 31.3348 17.2814 30.3397 15.8197 28.7867C14.3579 27.2338 13.483 25.2201 13.3452 23.0919C13.2074 20.9637 13.8155 18.854 15.0648 17.1255C16.3141 15.3971 18.1266 14.1579 20.1906 13.6212C22.2546 13.0844 24.4411 13.2836 26.3742 14.1844L27.7421 11.2489Z" fill="url(#paint1_linear_587_4531)"/>
<path d="M24.5603 15.5202C23.0601 15.0765 21.4568 15.1281 19.9883 15.6675C18.5198 16.207 17.2644 17.2054 16.4081 18.5147C15.5519 19.824 15.1405 21.3745 15.235 22.936C15.3296 24.4976 15.925 25.9871 16.9329 27.1836C17.9408 28.38 19.3076 29.2197 20.8304 29.5781C22.3533 29.9364 23.9511 29.7943 25.3868 29.1728C26.8225 28.5514 28.0196 27.4836 28.8005 26.1281C29.5815 24.7725 29.9047 23.2013 29.7221 21.6476L27.493 21.9094C27.6193 22.9838 27.3958 24.0703 26.8558 25.0077C26.3158 25.9451 25.488 26.6834 24.4952 27.1131C23.5024 27.5428 22.3975 27.6411 21.3445 27.3933C20.2915 27.1455 19.3464 26.5649 18.6494 25.7376C17.9524 24.9102 17.5407 23.8802 17.4753 22.8004C17.41 21.7206 17.6944 20.6485 18.2865 19.7431C18.8786 18.8377 19.7468 18.1473 20.7622 17.7743C21.7777 17.4013 22.8863 17.3656 23.9237 17.6724L24.5603 15.5202Z" fill="url(#paint2_linear_587_4531)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M33.6064 6.84752L39.9316 0.985168L40.2448 4.8003L41.0482 4.02208L41.6419 4.63492L40.8256 5.42565L44.7082 5.93006L38.381 11.8326L34.539 11.5154L23.5305 22.1792L24.9474 23.6419L20.3175 24.6977L21.52 20.1036L22.9369 21.5663L33.9398 10.9079L33.6064 6.84752ZM35.3313 10.7479L38.0522 10.9725L42.8245 6.52053L40.0653 6.16208L35.3313 10.7479ZM34.7102 10.1617L34.468 7.21227L39.2475 2.7825L39.4745 5.54656L34.7102 10.1617Z" fill="url(#paint3_linear_587_4531)"/>
<defs>
<linearGradient id="paint0_linear_587_4531" x1="6.92516" y1="15.5746" x2="38.0748" y2="29.4249" gradientUnits="userSpaceOnUse">
<stop stop-color="#30797F"/>
<stop offset="1" stop-color="#039DAA"/>
</linearGradient>
<linearGradient id="paint1_linear_587_4531" x1="11.3934" y1="16.9574" x2="33.6055" y2="28.0411" gradientUnits="userSpaceOnUse">
<stop stop-color="#30797F"/>
<stop offset="1" stop-color="#039DAA"/>
</linearGradient>
<linearGradient id="paint2_linear_587_4531" x1="15.5205" y1="20.4329" x2="29.473" y2="24.5599" gradientUnits="userSpaceOnUse">
<stop stop-color="#30797F"/>
<stop offset="1" stop-color="#039DAA"/>
</linearGradient>
<linearGradient id="paint3_linear_587_4531" x1="28.8147" y1="11.4892" x2="33.7306" y2="16.564" gradientUnits="userSpaceOnUse">
<stop stop-color="#30797F"/>
<stop offset="1" stop-color="#039DAA"/>
</linearGradient>
</defs>
</svg>

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