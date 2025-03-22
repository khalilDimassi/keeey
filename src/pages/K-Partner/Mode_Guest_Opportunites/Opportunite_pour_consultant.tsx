import React, { useState } from 'react';
import { Plus } from 'lucide-react';



const Opportunite_pour_consultant = () => {
  const [distance, setDistance] = useState(0);
  const [seniority, setSeniority] = useState(50);

  return (
    <div className="min-h-screen ">
      <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Compétences */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Compétences</h2>

          {/* Secteur */}
          <div className="mb-6">
            <p className=" text-gray-600 mb-2">Secteur</p>
            <div className="flex flex-wrap gap-2">
              {[
                'Automobile / Equipementiers',
                'Ferroviaire',
                'Aérospatial',
                'Défense',
                'Life Science',
                'Energie',
                'Naval',
                'Industrie Mécanique / Electronique / Multi secteurs'
              ].map((sector) => (
                <label key={sector} className="flex items-center bg-gray-50 space-x-2 px-3 py-1.5 rounded-xl border shadow">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="">{sector}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Métier */}
          <div className="mb-6">
            <p className=" text-gray-600 mb-2">Métier</p>
            <div className="flex flex-wrap  gap-2">
              {[
                { text: 'Développement et Programmation', active: true },
                { text: 'Infrastructures et Réseaux', active: false },
                { text: 'Gestion de Projet et Consulting', active: false },
                { text: 'Marketing Digital et Communication', active: false },
                { text: 'Cybersécurité', active: false },
                { text: 'Administration des Bases de Données', active: false },
                { text: 'Data et Intelligence Artificielle (IA)', active: false },
                { text: 'Web, Design et UX/UI', active: false },
              ].map((job) => (
                <button
                  key={job.text}
                  className={`flex items-center px-3 py-2 border  shadow rounded-xl  ${job.active ?
                    'bg-[#B5A48B] text-white ' :
                    'border-black bg-gray-50 text-gray-700'
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
            <p className=" text-gray-600 mb-2">Séniorité</p>
            <input
              type="range"
              min="0"
              max="100"
              value={seniority}
              onChange={(e) => setSeniority(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between  text-gray-500 mt-1">
              <span>junior</span>
              <span>expert</span>
            </div>
          </div>

          {/* Other Fields */}
          <div className="space-y-4">
            <div>
              <p className=" text-gray-600 mb-2">Outils / habilitations</p>
              <input type="text" className="w-full px-3 py-2 border rounded-xl" />
            </div>
            <div>
              <p className=" text-gray-600 mb-2">Langue</p>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input type="text" placeholder="Langue" className="w-full px-3 py-2 border rounded-xl" />
                  <button className="absolute right-2 top-2.5 text-gray-400">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 relative">
                  <input type="text" placeholder="Langue" className="w-full px-3 py-2 border rounded-xl" />
                  <button className="absolute right-2 top-2.5 text-gray-400">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <p className=" text-gray-600 mb-2">Qualité Relationnelles</p>
              <input type="text" className="w-full px-3 py-2 border rounded-xl" />
            </div>
          </div>
        </div>

        {/* Right Column - Critères */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Critères</h2>

          {/* Location */}
          <div className="mb-6">
            <p className=" text-gray-600 mb-2">Localisation</p>
            <input
              type="text"
              placeholder="Ville"
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          {/* Distance */}
          <div className="mb-6">
            <div className="flex justify-between  text-gray-600">
              <span>Distance</span>
              <span>{distance} km</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={distance}
              onChange={(e) => setDistance(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
            />
            <div className="flex justify-between  text-gray-500 mt-1">
              <span>0 km</span>
              <span>100km</span>
            </div>
          </div>

          {/* Mode de transport */}
          <div className="mb-6">
            <p className=" text-gray-600 mb-2">Mode de transport</p>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="transport"
                  className="rounded-full border-gray-300 "
                />
                <span className="">Pas de contrainte : Véhicule personnel ou autre mode de transport</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="transport"
                  className="rounded-full border-gray-300"
                />
                <span className="">Modes doux ou transport en commun uniquement</span>
              </label>
            </div>
          </div>

          {/* Type de lieu de travail */}
          <div className="mb-6">
            <p className=" text-gray-600 mb-2">Type de lieu de travail</p>
            <div className="space-y-2">
              {['Sur site', 'Hybride', 'A distance'].map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="workLocation"
                    className="rounded-full border-gray-300"
                  />
                  <span className="">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Disponibilité */}
          <div className="mb-6">
            <p className=" text-gray-600 mb-2">Disponibilité</p>
            <div className="flex items-center gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="availability"
                  className="rounded-full border-gray-300"
                  defaultChecked
                />
                <span className="">Immédiate</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="availability"
                  className="rounded-full border-gray-300"
                />
                <span className="">&gt; 1 mois</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="availability"
                  className="rounded-full border-gray-300"
                />
                <span className="">&gt; 3 mois</span>
              </label>
              <input
                type="text"
                placeholder="jj/mm/AA"
                className="w-32 px-3 py-1 border rounded-xl "
              />
            </div>
          </div>

          {/* TJM cible */}
          <div>
            <p className=" text-gray-600 mb-2">TJM cible</p>
            <input
              type="text"
              placeholder="TJM cible"
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Opportunite_pour_consultant;