import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuthHeader } from '../../../../../utils/jwt';

type CriteriaProps = {
  contractTags: { [key: string]: boolean };
  companyTags: { [key: string]: boolean };
  mobility: { [key: string]: boolean };
  distanceValue: number;
  transportMode: string;
  availability: string;
  location?: string;
  toggleTag: (category: string, tag: string) => void;
  toggleMobility: (option: string) => void;
  setDistanceValue: (value: number) => void;
  setTransportMode: (mode: string) => void;
  setAvailability: (availability: string) => void;
  setLocation?: (location: string) => void;
  refreshData: () => void;
};

type SearchCriteriaUpdateRequest = {
  contract_roles?: string[];
  organization_roles?: string[];
  crit_daily_rate?: number;
  crit_yearly_rate?: number;
  crit_mobility?: string;
  crit_location?: string;
  crit_distance?: string;
  availability?: string;
};

const Criteria: React.FC<CriteriaProps> = ({
  contractTags,
  companyTags,
  mobility,
  distanceValue,
  transportMode,
  availability,
  location = '',
  toggleTag,
  toggleMobility,
  setDistanceValue,
  setTransportMode,
  setAvailability,
  setLocation = () => { },
  refreshData
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleSaveCriteria = async () => {
    try {
      setIsSaving(true);

      // Prepare data in the required format
      const updateData: SearchCriteriaUpdateRequest = {};

      // Only include fields that have values
      const activeContractTags = Object.entries(contractTags)
        .filter(([_, active]) => active)
        .map(([tag]) => tag);

      const activeCompanyTags = Object.entries(companyTags)
        .filter(([_, active]) => active)
        .map(([tag]) => tag);

      // Only include non-empty arrays
      if (activeContractTags.length > 0) {
        updateData.contract_roles = activeContractTags;
      }

      if (activeCompanyTags.length > 0) {
        updateData.organization_roles = activeCompanyTags;
      }

      // Get the active mobility option(s)
      const activeMobilityOptions = Object.entries(mobility)
        .filter(([_, active]) => active)
        .map(([option]) => option);

      if (activeMobilityOptions.length > 0) {
        updateData.crit_mobility = activeMobilityOptions.join(',');
      }

      // Include location if it exists
      if (location.trim()) {
        updateData.crit_location = location;
      }

      // Include distance as string
      updateData.crit_distance = distanceValue.toString();

      // Include availability
      updateData.availability = availability.toUpperCase();

      // Send the PUT request to the API
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/criteria`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader()
          }
        }
      );

      console.log('Criteria updated successfully:', response.data);

      // Refresh data to update UI
      refreshData();

    } catch (error) {
      console.error('Failed to update criteria:', error);
    } finally {
      setIsSaving(false);
    }
  };

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
            <input
              type="text"
              placeholder="Ville"
              value={location}
              onChange={handleLocationChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
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

      <div className="mt-8">
        <button
          onClick={handleSaveCriteria}
          disabled={isSaving}
          className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer les critères'}
        </button>
      </div>
    </>
  );
};

export default Criteria;