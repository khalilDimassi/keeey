import React from 'react';
import { ArrowLeft, Edit, Info } from 'lucide-react';
import CompetencesEtCriteres from '../CompetencesEtCriteres';
import CompetencesEtCriteresVoirDetaille from './CompetencesEtCriteresVoirDetaille';
import Documents from './Documents';
import CandidatesList from '../CandidatesList';
import CandidatesListDefinirBesoin from './CandidatesListDefinirBesoin';


interface ProjectDetailsProps {
  project: Project;
  onBack: () => void;
}
export interface Project {
    id: number;
    title: string;
    reference: string;
    date: string;
    status: string;
    participants: string[];
  }
export function VoirDetaile({ project, onBack }: ProjectDetailsProps) {
    
  return (
    <div className="p-4 w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600"
        >
          <ArrowLeft size={20} />
          <span className="text-lg font-medium">Détails du besoin</span>
          <span className="text-sm text-gray-400">voir le résultat ci-dessous</span>
        </button>
        <button className=" text-white px-4 py-2 rounded-lg"style={{backgroundColor:"#215A96" ,borderRadius:"10px"}}>
          Sauvegarder
        </button>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="space-y-6">
        <div className="bg-white shadow-lg rounded-lg p-6" style={{boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)" ,borderRadius:"10px"}}>
          <div className="flex justify-between items-start  pb-4">
            <h2 className="text-lg font-medium">Informations générale</h2>
            <Edit size={20} className="text-blue-800 cursor-pointer" />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Titre</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                value={project.title}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date appelle d'offre</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                placeholder="Date appelle d'offre"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date démarrage</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                placeholder="Date démarrage"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Date réponse</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                placeholder="Date réponse"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Durée prévisionnelle</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                placeholder="Durée prévisionnelle"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">TJM cible</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                placeholder="TJM cible"
              />
            </div>
             </div>
</div>
          <CompetencesEtCriteresVoirDetaille />

      <Documents />
        </div>
        
      </div>
      <div className="mt-6">
           <CandidatesListDefinirBesoin />
         </div>
       
    </div>
  );
}