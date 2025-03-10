import React, { useState } from 'react';

type TagsState = {
  [key: string]: boolean;
};

const CompetencesCriteres = () => {
  const [sectorTags, setSectorTags] = useState<TagsState>({
    'Automobile / Équipementiers': false,
    'Ferroviaire': false,
    'Aérospatial': false,
    'Défense': false,
    'Life Science': false,
    'Énergie': false,
    'Naval': false,
    'Industrie Mécanique / Électronique / Multi secteurs': false,
    'Digital IT': true  // Setting this as true initially
  });

  const [activeSector, setActiveSector] = useState('Digital IT');
  const [jobTags, setJobTags] = useState<TagsState>({
    'Développement et Programmation': true,
    'Infrastructures et Réseaux': false,
    'Gestion de Projet et Consulting': false,
    'Marketing Digital et Communication': false,
    'Cybersécurité': false,
    'Administration des Bases de Données': false,
    'Data et Intelligence Artificielle (IA)': false,
    'Web, Design et UX/UI': false
  });

  const [contractTags, setContractTags] = useState<TagsState>({
    'Freelance / Indépendant': false,
    'Portage': false,
    'CDI': false,
    'CDD': false,
    'CDI-C': false
  });

  const [companyTags, setCompanyTags] = useState<TagsState>({
    'Tout / Pas de critère': false,
    'Entreprise Industrielle / Client final': false,
    'Bureaux d\'Études / ESN / Conseil': false,
    'Grandes Entreprises': false,
    'PME/TPE': false
  });

  const [mobility, setMobility] = useState<TagsState>({
    'Locale': true,
    'Régionale': false,
    'France': false,
    'Internationale': false
  });

  const [distanceValue, setDistanceValue] = useState(30);
  const [transportMode, setTransportMode] = useState('personal');
  const [availability, setAvailability] = useState('immediate');
  
  const toggleTag = (category: string, tag: string) => {
    switch(category) {
      case 'sector':
        // Get current selected tags count
        const currentSelectedCount = Object.values(sectorTags).filter(Boolean).length;
        
        // If trying to select a new tag and already have 3 selected, return
        if (!sectorTags[tag] && currentSelectedCount >= 3) {
          return;
        }
        
        const newSectorTags = {...sectorTags, [tag]: !sectorTags[tag]};
        setSectorTags(newSectorTags);
        
        // If we're activating a tag, also set it as the active sector
        if (!sectorTags[tag]) {
          setActiveSector(tag);
        } else if (activeSector === tag) {
          // If we're deactivating the current active sector, pick a new one
          const nextActive = Object.keys(newSectorTags).find(key => newSectorTags[key]);
          if (nextActive) {
            setActiveSector(nextActive);
          }
        }
        break;
      case 'job':
        setJobTags({...jobTags, [tag]: !jobTags[tag]});
        break;
      case 'contract':
        setContractTags({...contractTags, [tag]: !contractTags[tag]});
        break;
      case 'company':
        setCompanyTags({...companyTags, [tag]: !companyTags[tag]});
        break;
      default:
        break;
    }
  };

  const toggleMobility = (option: string) => {
    setMobility({...mobility, [option]: !mobility[option]});
  };

  // Get the selected sectors for the bottom display
  const selectedSectors = Object.keys(sectorTags).filter(tag => sectorTags[tag]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-wrap -mx-4">
        {/* Left Column */}
        <div className="w-full md:w-1/2 px-4 mb-8">
          <h3 className="text-gray-600 mb-3 text-sm">Secteur</h3>
          
          {/* All sector tags in one div */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(sectorTags).map(([tag, active]) => (
              <button 
                key={tag}
                className={`px-4 py-2 rounded-full text-sm flex items-center ${active ? 'bg-teal-700 text-white' : 'bg-white border border-gray-300'}`}
                onClick={() => toggleTag('sector', tag)}
              >
                {tag} <span className="ml-1">{active ? '-' : '+'}</span>
              </button>
            ))}
          </div>

          {/* Selected sectors display */}
       <div className="flex justify-center items-center ">
  {/* Selected sectors display */}
  <div
    className="inline-flex border border-gray-300 rounded-md overflow-hidden mb-6"
    style={{ borderRadius: "20px" }}
  >
    {selectedSectors.map((sector) => (
      <button
        key={sector}
        className={`px-4 py-2 ${
          activeSector === sector
            ? "bg-teal-700 text-white"
            : "bg-white border-r border-gray-300"
        }`}
        onClick={() => setActiveSector(sector)}
      >
        {activeSector === sector && (
          <span className="inline-flex items-center justify-center w-4 h-4 bg-teal-700 text-white rounded-full mr-1 text-xs">
            ✓
          </span>
        )}
        {sector}
      </button>
    ))}
  </div>
</div>

    
              <div className="mb-6">
                <div className=" items-center justify-between">
                  <div className="flex justify-between items-center">
                 
                    <span>Junior</span>
                    <span>20 ans +</span>
                  </div>
                  
                  <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={distanceValue} 
                  onChange={(e) => setDistanceValue(parseInt(e.target.value))}
                  className="w-full mb-1"
                /> 
                </div>
               
              </div>
    
              <h3 className="text-gray-600 mb-3 text-sm">Métier</h3>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {Object.entries(jobTags).slice(0, 2).map(([tag, active]) => (
                  <button 
                    key={tag}
                    className={`px-4 py-2 rounded-full text-sm flex items-center ${active ? 'bg-teal-700 text-white' : 'bg-white border border-gray-300'}`}
                    onClick={() => toggleTag('job', tag)}
                  >
                    {tag} <span className="ml-1">+</span>
                  </button>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {Object.entries(jobTags).slice(2, 4).map(([tag, active]) => (
                  <button 
                    key={tag}
                    className={`px-4 py-2 rounded-full text-sm flex items-center ${active ? 'bg-teal-700 text-white' : 'bg-white border border-gray-300'}`}
                    onClick={() => toggleTag('job', tag)}
                  >
                    {tag} <span className="ml-1">+</span>
                  </button>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {Object.entries(jobTags).slice(4, 6).map(([tag, active]) => (
                  <button 
                    key={tag}
                    className={`px-4 py-2 rounded-full text-sm flex items-center ${active ? 'bg-teal-700 text-white' : 'bg-white border border-gray-300'}`}
                    onClick={() => toggleTag('job', tag)}
                  >
                    {tag} <span className="ml-1">+</span>
                  </button>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(jobTags).slice(6).map(([tag, active]) => (
                  <button 
                    key={tag}
                    className={`px-4 py-2 rounded-full text-sm flex items-center ${active ? 'bg-teal-700 text-white' : 'bg-white border border-gray-300'}`}
                    onClick={() => toggleTag('job', tag)}
                  >
                    {tag} <span className="ml-1">+</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Right Column */}
            <div className="w-full md:w-1/2 px-4">
              <h3 className="text-gray-600 mb-3 text-sm">
                Type de contrat souhaité/accepté 
                <span className="text-xs text-gray-500 ml-1">(Plusieurs réponses possibles)</span>
              </h3>
              
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
              
              <h3 className="text-gray-600 mb-3 text-sm">
                Type d'entreprise visées 
                <span className="text-xs text-gray-500 ml-1">(Plusieurs réponses possibles)</span>
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {Object.entries(companyTags).slice(0, 3).map(([tag, active]) => (
                  <button 
                    key={tag}
                    className={`px-4 py-2 rounded-full text-sm flex items-center ${active ? 'bg-teal-700 text-white' : 'bg-white border border-gray-300'}`}
                    onClick={() => toggleTag('company', tag)}
                  >
                    {tag} <span className="ml-1">+</span>
                  </button>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(companyTags).slice(3).map(([tag, active]) => (
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
                <label className="block font-bold mb-2">TJM - Prétentions salariales</label>
                <div className="flex flex-wrap items-center gap-2">
                  <input type="text" placeholder="TJM" className="border border-gray-300 rounded p-2 w-24" />
                  <span>€ HT / jour</span>
                  <input type="text" placeholder="Salaire" className="border border-gray-300 rounded p-2 w-24" />
                  <span>€ brut / an</span>
                </div>
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
               
             
                <div className='flex gap-2  items-center justify-center'>
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
                /> <div className="text-sm">Distance</div>
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
            </div>
          </div>
        </div>
      );
    };
export default CompetencesCriteres;