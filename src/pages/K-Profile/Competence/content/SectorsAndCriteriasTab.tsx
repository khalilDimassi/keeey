import { useEffect, useState } from 'react';
import Criteria from './SectorsAndCriteriasContent/Criteria'
import { CriteriaFormData, MinimalSector, Sector } from '../types';
import Competences from './SectorsAndCriteriasContent/Competences';
import { fetchResumeSearchDetails, fetchSectors, saveCriteria, saveSectors } from '../services';


const SectorsAndCriteriasTab: React.FC = () => {
  const [state, setState] = useState({
    sectors: [] as Sector[],
    loading: true,
    error: null as string | null,
    sectorsChanged: false,
    selections: [] as MinimalSector[],
    criteriaChanged: false,
    criteria: {
      location: '',
      contractTags: {
        'FREELANCE': false,
        'PORTAGE': false,
        'CDI': false,
        'CDD': false,
        'CDI-C': false
      },
      companyTags: {
        'OTHER': false,
        'LARGE': false,
        'INDUSTRIAL': false,
        'PME/TPE': false,
        'ESN': false,
      },
      mobility: {
        'Locale': false,
        'Régionale': false,
        'France': false,
        'Internationale': false
      },
      distanceValue: 30,
      transportMode: 'personal',
      availability: 'immediate',
      crit_daily_rate: 0,
      crit_yearly_rate: 0
    } as CriteriaFormData
  });

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      const [sectors, searchDetails] = await Promise.all([
        fetchSectors(),
        fetchResumeSearchDetails()
      ]);

      // Process sectors data
      setState(prev => ({
        ...prev,
        sectors,
        loading: false,
        selections: searchDetails.selected_sectors || []
      }));

      // Process criteria data
      const newCriteria: Partial<CriteriaFormData> = {};

      // Contract tags
      if (searchDetails.contract_roles?.length) {
        newCriteria.contractTags = Object.keys(state.criteria.contractTags)
          .reduce((acc, key) => ({
            ...acc,
            [key]: (searchDetails.contract_roles ?? []).includes(key)
          }), {});
      }

      // Company tags
      if (searchDetails.organization_roles?.length) {
        newCriteria.companyTags = Object.keys(state.criteria.companyTags)
          .reduce((acc, key) => ({
            ...acc,
            [key]: (searchDetails.organization_roles ?? []).includes(key)
          }), {});
      }

      // Mobility
      if (searchDetails.crit_mobility) {
        const mobilityOptions = searchDetails.crit_mobility.split(',');
        newCriteria.mobility = Object.keys(state.criteria.mobility)
          .reduce((acc, key) => ({
            ...acc,
            [key]: mobilityOptions.includes(key)
          }), {});
      }

      // Other fields
      if (searchDetails.crit_location) newCriteria.location = searchDetails.crit_location;
      if (searchDetails.crit_distance) newCriteria.distanceValue = parseInt(searchDetails.crit_distance) || 30;
      if (searchDetails.availability) newCriteria.availability = searchDetails.availability.toLowerCase();
      if (searchDetails.crit_daily_rate) newCriteria.crit_daily_rate = searchDetails.crit_daily_rate;
      if (searchDetails.crit_yearly_rate) newCriteria.crit_yearly_rate = searchDetails.crit_yearly_rate;

      updateCriteria(newCriteria);

    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load data'
      }));
    }
  };

  const updateCriteria = (updates: Partial<CriteriaFormData>) => {
    setState(prev => ({
      ...prev,
      criteriaChanged: true,
      criteria: { ...prev.criteria, ...updates }
    }));
  };

  const handleSaveAll = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      if (state.sectorsChanged) {
        await saveSectors(state.selections);
        setState(prev => ({ ...prev, sectorsChanged: false }));
      }

      if (state.criteriaChanged) {
        const criteriaData = {
          contract_roles: Object.entries(state.criteria.contractTags)
            .filter(([_, active]) => active)
            .map(([tag]) => tag),
          organization_roles: Object.entries(state.criteria.companyTags)
            .filter(([_, active]) => active)
            .map(([tag]) => tag),
          crit_mobility: Object.entries(state.criteria.mobility)
            .filter(([_, active]) => active)
            .map(([option]) => option)
            .join(','),
          crit_location: state.criteria.location.trim(),
          crit_distance: state.criteria.distanceValue.toString(),
          availability: state.criteria.availability.toUpperCase(),
          crit_daily_rate: state.criteria.crit_daily_rate,
          crit_yearly_rate: state.criteria.crit_yearly_rate
        };

        await saveCriteria(criteriaData);
        setState(prev => ({ ...prev, criteriaChanged: false }));
      }
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };


  return (
    <div className="w-full flex flex-wrap -mx-4">
      <div className="w-full md:w-1/2 px-4 mb-8">
        <Competences
          sectors={state.sectors}
          loading={state.loading}
          error={state.error}
          initialSelections={state.selections}
          onSelectionChange={(newSelections) => setState(prev => ({
            ...prev,
            selections: newSelections,
            sectorsChanged: true
          }))}
        />
      </div>
      <div className="w-full md:w-1/2 px-4">
        <Criteria
          criteria={state.criteria}
          onCriteriaChange={(updates) => setState(prev => ({
            ...prev,
            criteriaChanged: true,
            criteria: { ...prev.criteria, ...updates }
          }))}
        />
        {/* Add the shared save button */}
        <button
          onClick={handleSaveAll}
          disabled={state.loading || !(state.criteriaChanged || state.sectorsChanged)}
          className="bg-[#297280] text-white px-6 py-3 rounded-xl shadow-lg  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 disabled:opacity-50 flex justify-self-start ml-10"
        >
          {state.loading ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
};

export default SectorsAndCriteriasTab;