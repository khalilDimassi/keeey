import React from 'react';

type CriteriaProps = {
  contractTags: { [key: string]: boolean };
  companyTags: { [key: string]: boolean };
  mobility: { [key: string]: boolean };
  distanceValue: number;
  transportMode: string;
  availability: string;
  toggleTag: (category: string, tag: string) => void;
  toggleMobility: (option: string) => void;
  setDistanceValue: (value: number) => void;
  setTransportMode: (mode: string) => void;
  setAvailability: (availability: string) => void;
};

const Criteria: React.FC<CriteriaProps> = ({
  contractTags,
  companyTags,
  mobility,
  distanceValue,
  transportMode,
  availability,
  toggleTag,
  toggleMobility,
  setDistanceValue,
  setTransportMode,
  setAvailability
}) => {
  return (
    <>
      <h3 className="text-gray-600 mb-3 text-sm">Type de contrat souhaité/accepté</h3>
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(contractTags).map(([tag, active]) => (
          <button
            key={tag}
            className={`px-4 py-2 rounded-full text-sm flex items-center ${active ? 'bg-teal-700 text-white' : 'bg-white border border-gray-300'}`}
            onClick={() => toggleTag('contract', tag)}
          >
            {tag} <span className="ml-1">+</span>
          </button>
        ))}
      </div>

      <h3 className="text-gray-600 mb-3 text-sm">Type d'entreprise visées</h3>
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(companyTags).map(([tag, active]) => (
          <button
            key={tag}
            className={`px-4 py-2 rounded-full text-sm flex items-center ${active ? 'bg-teal-700 text-white' : 'bg-white border border-gray-300'}`}
            onClick={() => toggleTag('company', tag)}
          >
            {tag} <span className="ml-1">+</span>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <label className="block font-bold mb-2">Mobilité</label>
        <div className="flex flex-wrap gap-6 mb-3">
          {Object.entries(mobility).map(([option, checked]) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleMobility(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
        <div className='flex gap-2 items-center justify-center'>
          <div>
            <input type="text" placeholder="Ville" className="border border-gray-300 rounded p-2 w-full" />
          </div>
          <div className='w-full'>
            <div className="flex justify-between text-sm mb-1">
              <span>0 km</span>
              <span>100km</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={distanceValue}
              onChange={(e) => setDistanceValue(parseInt(e.target.value))}
              className="w-full mb-1"
            />
            <div className="text-sm">Distance</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-bold mb-2">Mode de transport</label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="transport"
              value="personal"
              checked={transportMode === 'personal'}
              onChange={() => setTransportMode('personal')}
              className="mr-2"
            />
            Pas de contrainte : Véhicule personnel ou autre mode de transport
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="transport"
              value="public"
              checked={transportMode === 'public'}
              onChange={() => setTransportMode('public')}
              className="mr-2"
            />
            Modes doux ou transport en commun uniquement
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="transport"
              value="remote"
              checked={transportMode === 'remote'}
              onChange={() => setTransportMode('remote')}
              className="mr-2"
            />
            Télétravail uniquement
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-bold mb-2">Disponibilité</label>
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center">
            <input
              type="radio"
              name="availability"
              value="immediate"
              checked={availability === 'immediate'}
              onChange={() => setAvailability('immediate')}
              className="mr-2"
            />
            Immédiate
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="availability"
              value="one_month"
              checked={availability === 'one_month'}
              onChange={() => setAvailability('one_month')}
              className="mr-2"
            />
            &gt; 1 mois
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="availability"
              value="three_months"
              checked={availability === 'three_months'}
              onChange={() => setAvailability('three_months')}
              className="mr-2"
            />
            &gt; 3 mois
          </label>
          <input type="text" placeholder="jj/mm/AA" className="border border-gray-300 rounded p-2 w-32" />
        </div>
      </div>
    </>
  );
};

export default Criteria;