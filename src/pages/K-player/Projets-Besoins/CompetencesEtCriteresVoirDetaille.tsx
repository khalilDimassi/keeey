import React from "react";
import { Edit } from "lucide-react";

const CompetencesEtCriteresVoirDetaille = () => {
  return (
    <div className=" w-full mx-auto grid grid-cols-2 gap-6">
      {/* Compétences Card */}
      <div className=" bg-white shadow-lg rounded-lg p-6"style={{boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)" ,borderRadius:"10px"}}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Compétences</h2>
            <Edit size={20} className="text-blue-800 cursor-pointer" />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm text-gray-600">Secteur</h3>
            <div className="border p-2 rounded-lg text-gray-700">✔ Automobile / Equipementiers</div>
          </div>

          <div>
            <h3 className="text-sm text-gray-600">Métier</h3>
            <div className="flex gap-2">
              <button className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold" style={{backgroundColor:"#215A96" ,borderRadius:"10px"}}>
                Développement et Programmation
              </button>
              <button className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold" style={{backgroundColor:"#215A96" ,borderRadius:"10px"}}>
                Infrastructures et Réseaux
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-gray-600">Niveau</h3>
            <div className="flex items-center" >
          <input type="range" className="w-full" />
          <span className="ml-2 text-gray-700">Expert</span>
        </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm text-gray-600">Outils / habilitations</h3>
              <input type="text" className="w-full border rounded-lg p-2" placeholder="Outils / habilitations" />
            </div>
            <div>
              <h3 className="text-sm text-gray-600">Qualité Relationnelles</h3>
              <input type="text" className="w-full border rounded-lg p-2" placeholder="Qualité Relationnelles" />
            </div>
          </div>

          <div>
            <h3 className="text-sm text-gray-600">Langue</h3>
            <div className="flex gap-2">
              <input type="text" className="border rounded-lg p-2 w-24" placeholder="Langue" />
              <input type="text" className="border rounded-lg p-2 w-24" placeholder="Langue" />
            </div>
          </div>
        </div>
      </div>

      {/* Critères Card */}
      <div className="bg-white shadow-lg rounded-lg p-6" style={{boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)" ,borderRadius:"10px"}}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Critères</h2>
            <Edit size={20} className="text-blue-800 cursor-pointer" />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm text-gray-600">Type de contrat proposé</h3>
            <div className="text-gray-700">✔ CDI</div>
          </div>

          <div className="grid grid-cols-2 ">
            <div>
              <h3 className="text-sm text-gray-600">Date démarrage souhaité</h3>
              
              <div className="space-x-4">

              <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded">
              25/12/2024
            </span>
            <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded">
              25/12/2024
            </span>
            </div>
            </div>
            <div>
              <h3 className="text-sm text-gray-600">Durée prévisionnelle</h3>
              <div className="space-x-4">
              <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded"> 15 jours </span>
              <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded"> 15 jours </span>
</div>


            </div>
          </div>

          <div className="grid grid-cols-2 ">
            <div>
              <h3 className="text-sm text-gray-600">TJM ou salaire cible / Max</h3>
              <div className="space-x-4">
              <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded"> exemple  </span>
              <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded"> exemple </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm text-gray-600">Localisation</h3>
              
              <span className="bg-gray-200 text-gray-700 px-3 py-1 text-xs rounded"> France  </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-gray-600">Télétravail</h3>
            <span className="bg-gray-200 text-gray-700 px-3 py-1 text-xs rounded"> oui  </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetencesEtCriteresVoirDetaille;
