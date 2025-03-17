import React, { useState } from 'react';
import { Plus, Calendar, Search } from 'lucide-react';
import CandidatesList from './CandidatesList';

const Profile_besoin_specifique = () => {
    const [seniority, setSeniority] = useState(50);
   
    
  
  return (
    <div className="min-h-screen  ">
     

      <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Compétences */}
        <div className="bg-white p-6  rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Compétences</h2>
          
          {/* Secteur */}
          <div className="mb-6">
            <p className="  text-gray-600 mb-2">Secteur</p>
            <div className="flex flex-wrap gap-2">
              {['Automobile / Equipementiers', 'Ferroviaire', 'Aérospatial', 'Défense', 'Life Science', 'Energie', 'Naval', 'Industrie Mécanique / Electronique / Multi secteurs'].map((sector) => (
                <label key={sector} className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5  rounded-xl   border shadow">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className=" ">{sector}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Métier */}
          <div className="mb-6">
            <p className="  text-gray-600 mb-2">Métier</p>
            <div className="flex flex-wrap gap-2">
              {[
                { text: 'Développement et Programmation', active: true },
                { text: 'Infrastructures et Réseaux', active: true },
                { text: 'Gestion de Projet et Consulting', active: false },
                { text: 'Marketing Digital et Communication', active: false },
                { text: 'Cybersécurité', active: false },
                { text: 'Administration des Bases de Données', active: false },
                { text: 'Data et Intelligence Artificielle (IA)', active: false },
                { text: 'Web, Design et UX/UI', active: false },
              ].map((job) => (
                <button
                key={job.text}
                className={`flex items-center px-3 py-2 border  shadow rounded-xl  ${
                  job.active ? 'bg-[#B5A48B] text-white ' : ' border-black bg-gray-50 text-gray-700'
                }`}
              >
                  {job.text}
                  <Plus className="w-4 h-4 ml-1" />
                </button>
              ))}
            </div>
          </div>

          {/* Séniorité */}
          <div className="mb-6">
            <p className="  text-gray-600 mb-2">Séniorité</p>
            <input
              type="range"
              min="0"
              max="100"
              value={seniority}
              onChange={(e) => setSeniority(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200  rounded-xl appearance-none cursor-pointer"
            />
            <div className="flex justify-between   text-gray-500 mt-1">
              <span>junior</span>
              <span>expert</span>
            </div>
          </div>

          {/* Other Fields */}
          <div className="space-y-4">
            <div>
              <p className="  text-gray-600 mb-2">Outils / habilitations</p>
              <input type="text" className="w-full px-3 py-2 border  rounded-xl" />
            </div>
            <div>
              <p className="  text-gray-600 mb-2">Langue</p>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input type="text" placeholder="Langue" className="w-full px-3 py-2 border  rounded-xl" />
                </div>
                <div className="flex-1">
                  <input type="text" placeholder="Langue" className="w-full px-3 py-2 border  rounded-xl" />
                </div>
              </div>
            </div>
            <div>
              <p className="  text-gray-600 mb-2">Qualité Relationnelles</p>
              <input type="text" className="w-full px-3 py-2 border  rounded-xl" />
            </div>
          </div>
        </div>

        {/* Right Column - Critères */}
        <div className="bg-white p-6  rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Critères</h2>
          
          {/* Contract Type */}
          <div className="mb-6">
            <p className="  text-gray-600 mb-2">Type de de contrat proposé</p>
            <div className="flex gap-4">
              {['CDI', 'Freelance', 'Consultant'].map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    defaultChecked={type === 'CDI'}
                  />
                  <span className=" ">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="mb-6">
            <p className="  text-gray-600 mb-2">Date démarrage souhaité</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Date démarrage souhaité"
                  className="w-full px-3 py-2 border  rounded-xl pl-10"
                />
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Au plus tard"
                  className="w-full px-3 py-2 border  rounded-xl pl-10"
                />
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6">
            <p className="  text-gray-600 mb-2">Durée prévisionnelle</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Durée prévisionnelle"
                  className="w-full px-3 py-2 border  rounded-xl pl-10"
                />
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Au plus tard"
                  className="w-full px-3 py-2 border  rounded-xl pl-10"
                />
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Salary Range */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="  text-gray-600 mb-2">TJM ou salaire cible</p>
                <input
                  type="text"
                  placeholder="TJM ou salaire cible"
                  className="w-full px-3 py-2 border  rounded-xl"
                />
              </div>
              <div>
                <p className="  text-gray-600 mb-2">TJM ou salaire Max</p>
                <input
                  type="text"
                  placeholder="TJM ou salaire Max"
                  className="w-full px-3 py-2 border  rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <p className="  text-gray-600 mb-2">Localisation</p>
            <input
              type="text"
              placeholder="Localisation"
              className="w-full px-3 py-2 border  rounded-xl"
            />
          </div>

          {/* Remote Work */}
          <div>
            <p className="  text-gray-600 mb-2">Télétravail</p>
            <div className="flex gap-4">
              {['Oui', 'Non'].map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="remote"
                    className="rounded-full border-gray-300"
                  />
                  <span className=" ">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
}

export default Profile_besoin_specifique;