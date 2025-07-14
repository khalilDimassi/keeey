import { FC } from "react";
import { CriteriaFormData } from "../../types";


type CriteriaProps = {
  criteria: CriteriaFormData;
  onCriteriaChange: (updates: Partial<CriteriaFormData>) => void;
};

const Criteria: FC<CriteriaProps> = ({ criteria, onCriteriaChange }) => {
  const toggleTag = (category: 'contract' | 'company', tag: string) => {
    onCriteriaChange({
      [`${category}Tags`]: {
        ...criteria[`${category}Tags`],
        [tag]: !criteria[`${category}Tags`][tag]
      }
    });
  };

  const HandleSalaryChange = (field: 'crit_daily_rate' | 'crit_yearly_rate', value: number) => {
    onCriteriaChange({
      [field]: value,
    });
  }

  const toggleMobility = (option: string) => {
    onCriteriaChange({
      mobility: {
        ...criteria.mobility,
        [option]: !criteria.mobility[option]
      }
    });
  };

  const handleDistanceChange = (value: number) => {
    onCriteriaChange({ distanceValue: value });
  };

  const handleTransportModeChange = (mode: string) => {
    onCriteriaChange({ transportMode: mode });
  };

  const handleAvailabilityChange = (newAvailability: string) => {
    onCriteriaChange({ availability: newAvailability });
  };

  const handleLocationChange = (newLocation: string) => {
    onCriteriaChange({ location: newLocation });
  };

  const contractTranslations: Record<string, string> = {
    'FREELANCE': 'Freelance / Indépendant',
    'CONSULTANT': 'Consultant',
    'PORTAGE': 'Portage',
    'CDI': 'CDI',
    'CDD': 'CDD',
    'CDI-C': 'CDI Cadre'
  };

  const companyTranslations: Record<string, string> = {
    'LARGE': 'Greandes entreprises',
    'INDUSTRIAL': 'Entreprise industrielle / Client final',
    'PME/TPE': 'PME/TPE',
    'ESN': `Bureaux d'Études / ESN / Conseil`,
    'OTHER': 'Tout/Pas de critère'
  };
  const isDate = /^\d{4}-\d{2}-\d{2}$/.test(criteria.availability);

  return (
    <>
      <h3 className="mb-2 font-semibold">Type de contrat souhaité/accepté</h3>
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(criteria.contractTags).map(([tag, active]) => (
          <button
            key={tag}
            className={`px-4 py-2 rounded-xl text-sm flex items-center ${active
              ? 'bg-[#297280] border-gray-300 text-white'
              : 'bg-white border border-gray-300'
              }`}
            onClick={() => toggleTag('contract', tag)}
          >
            {contractTranslations[tag] || tag}
          </button>
        ))}
      </div>

      <h3 className="mb-2 font-semibold">Type d'entreprise visées</h3>
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(criteria.companyTags).map(([tag, active]) => (
          <button
            key={tag}
            className={`px-4 py-2 rounded-xl text-sm flex items-center ${active
              ? 'bg-[#297280] border-gray-300 text-white'
              : 'bg-white border border-gray-300'
              }`}
            onClick={() => toggleTag('company', tag)}
          >
            {companyTranslations[tag] || tag}
          </button>
        ))}
      </div>

      <h3 className="mb-2 font-semibold">TJM - Prétentions salarialess</h3>
      <div className="flex gap-3 my-3">
        <input
          type="number"
          value={criteria.crit_daily_rate}
          onChange={(e) => HandleSalaryChange('crit_daily_rate', Number(e.target.value))}
          className="border border-gray-300 rounded-xl p-2 w-1/5"
        />
        <label className="flex items-center justify-start w-1/5">€ HT / jour</label>
        <input
          type="number"
          value={criteria.crit_yearly_rate}
          onChange={(e) => HandleSalaryChange('crit_yearly_rate', Number(e.target.value))}
          className="border border-gray-300 rounded-xl p-2 w-1/5"
        />
        <label className="flex items-center justify-start w-1/5">€ brut / an</label>
      </div>

      <h3 className="mb-2 font-semibold">Mobilité</h3>
      <div className="mb-6">
        <div className="flex flex-wrap gap-6 mb-2">
          {Object.entries(criteria.mobility).map(([option, checked]) => (
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
          <input
            type="text"
            placeholder="Ville"
            value={criteria.location}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="border border-gray-300 rounded-xl p-2 w-1/3"
          />
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span>{criteria.distanceValue} km</span>
              <span>100 km</span>
            </div>
            <div
              className="relative w-full h-4 mb-1 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                handleDistanceChange(Math.round(percent * 100));
              }}
            >
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2"></div>
              <div
                className="absolute top-1/2 left-0 h-1 bg-[#297280] rounded-full transform -translate-y-1/2"
                style={{ width: `${criteria.distanceValue}%` }}
              ></div>
              <div
                className="absolute top-1/2 w-3 h-3 bg-[#297280] rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-sm"
                style={{ left: `${criteria.distanceValue}%` }}
              ></div>
              <input
                type="range"
                min="0"
                max="100"
                value={criteria.distanceValue}
                onChange={(e) => handleDistanceChange(parseInt(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            <div className="text-xs text-gray-500">Distance</div>
          </div>
        </div>
      </div>

      <h3 className="mb-2 font-semibold">Mode de transport</h3>
      <div className="mb-6">
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="transport"
              value="personal"
              checked={criteria.transportMode === 'personal'}
              onChange={() => handleTransportModeChange('personal')}
              className="mr-2"
            />
            Pas de contrainte : Véhicule personnel ou autre mode de transport
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="transport"
              value="public"
              checked={criteria.transportMode === 'public'}
              onChange={() => handleTransportModeChange('public')}
              className="mr-2"
            />
            Modes doux ou transport en commun uniquement
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="transport"
              value="remote"
              checked={criteria.transportMode === 'remote'}
              onChange={() => handleTransportModeChange('remote')}
              className="mr-2"
            />
            Télétravail uniquement
          </label>
        </div>
      </div>

      <h3 className="mb-2 font-semibold">Disponibilité</h3>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center">
            <input
              type="radio"
              name="availability"
              value="immediate"
              checked={criteria.availability === "immediate" && !isDate}
              onChange={() => handleAvailabilityChange("immediate")}
              className="mr-2"
            />
            Immédiate
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="availability"
              value="one_month"
              checked={criteria.availability === "one_month" && !isDate}
              onChange={() => handleAvailabilityChange("one_month")}
              className="mr-2"
            />
            &gt; 1 mois
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="availability"
              value="three_months"
              checked={criteria.availability === "three_months" && !isDate}
              onChange={() => handleAvailabilityChange("three_months")}
              className="mr-2"
            />
            &gt; 3 mois
          </label>
          <input
            type="date"
            placeholder="jj/mm/AA"
            value={isDate ? criteria.availability : ""}
            onChange={(e) => handleAvailabilityChange(e.target.value)}
            className="border border-gray-300 rounded-xl p-2 w-60"
          />
        </div>
      </div>
    </>
  );
};

export default Criteria;