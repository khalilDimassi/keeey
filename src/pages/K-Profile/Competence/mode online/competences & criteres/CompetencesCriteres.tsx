import { useCallback, useEffect, useState } from 'react';
import Sectors, { Sector, UserSelection } from './Sectors';
import Criteria from './Criteria';
import axios from 'axios';
import { getAuthHeader } from '../../../../../utils/jwt';

type SectorSuggestionsResponse = Sector[];
type InitialSelectionsResponse = UserSelection[];

type TagsState = {
  [key: string]: boolean;
};

export type SearchCriteria = {
  contract_roles?: string[];
  organization_roles?: string[];
  crit_daily_rate?: number;
  crit_yearly_rate?: number;
  crit_mobility?: string;
  crit_location?: string;
  crit_distance?: string;
  availability?: string;
};

const CompetencesCriteres: React.FC = () => {
  const [initialSelections, setInitialSelections] = useState<UserSelection[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('');

  const [contractTags, setContractTags] = useState<TagsState>({
    'FREELANCE': false,
    'CONSULTANT': false,
    'PORTAGE': false,
    'CDI': false,
    'CDD': false,
    'CDI-C': false
  });

  const [companyTags, setCompanyTags] = useState<TagsState>({
    'LARGE': false,
    'INDUSTRUAL': false,
    'PME/TPE': false,
    'ESN': false,
    'OTHER': false,
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

  const fetchSectors = async () => {
    try {
      const response = await axios.get<SectorSuggestionsResponse>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/suggestions/sectors`
      );
      setSectors(response.data);
    } catch (err) {
      setError('Failed to fetch sectors. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInitialSelection = async () => {
    try {
      const response = await axios.get<InitialSelectionsResponse>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/sectors`,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      setInitialSelections(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCriteria = async () => {
    try {
      const response = await axios.get<SearchCriteria>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/search-criteria`,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );

      const data = response.data;

      // Reset all tags to false first
      const resetContractTags: TagsState = Object.keys(contractTags).reduce((acc, key) => ({
        ...acc,
        [key]: false
      }), {});

      const resetCompanyTags: TagsState = Object.keys(companyTags).reduce((acc, key) => ({
        ...acc,
        [key]: false
      }), {});

      // Set active contract tags   
      if (data.contract_roles && data.contract_roles.length > 0) {
        data.contract_roles.forEach(tag => {
          if (resetContractTags.hasOwnProperty(tag)) {
            resetContractTags[tag] = true;
          }
        });
      }
      setContractTags(resetContractTags);

      // Set active company tags
      if (data.organization_roles && data.organization_roles.length > 0) {
        data.organization_roles.forEach(tag => {
          if (resetCompanyTags.hasOwnProperty(tag)) {
            resetCompanyTags[tag] = true;
          }
        });
      }
      setCompanyTags(resetCompanyTags);

      // Set mobility options
      if (data.crit_mobility) {
        const mobilityOptions = data.crit_mobility.split(',');
        const resetMobility = Object.keys(mobility).reduce((acc, key) => ({
          ...acc,
          [key]: mobilityOptions.includes(key)
        }), {});
        setMobility(resetMobility);
      }


      // Set location
      if (data.crit_location) {
        setLocation(data.crit_location);
      }

      // Set distance
      if (data.crit_distance) {
        setDistanceValue(parseInt(data.crit_distance) || 30);
      }

      // Set availability
      if (data.availability) {
        setAvailability(data.availability.toLowerCase());
      }

    } catch (err) {
      console.error('Failed to fetch criteria:', err);
    }
  };

  const refreshData = () => {
    fetchCriteria();
    fetchInitialSelection();
  };

  useEffect(() => {
    fetchSectors();
    fetchCriteria();
    fetchInitialSelection();
  }, []);


  const [sectorsChanged, setSectorsChanged] = useState(false);
  const [criteriaChanged, setCriteriaChanged] = useState(false);
  const [currentSelections, setCurrentSelections] = useState<UserSelection[]>([]);

  const handleSelectionChange = useCallback(async (selections: UserSelection[]) => {
    setCurrentSelections(selections);
    setSectorsChanged(true);
  }, []);

  // New function to handle saving both sectors and criteria
  const handleSaveAll = async () => {
    try {
      setLoading(true);

      // Save sectors if changed
      if (sectorsChanged) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/skill/v3`,
          currentSelections,
          {
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeader(),
            },
          }
        );
        setSectorsChanged(false);
      }

      // Save criteria if changed
      if (criteriaChanged) {
        const updateData: SearchCriteria = {};

        const activeContractTags = Object.entries(contractTags)
          .filter(([_, active]) => active)
          .map(([tag]) => tag);

        const activeCompanyTags = Object.entries(companyTags)
          .filter(([_, active]) => active)
          .map(([tag]) => tag);

        if (activeContractTags.length > 0) {
          updateData.contract_roles = activeContractTags;
        }

        if (activeCompanyTags.length > 0) {
          updateData.organization_roles = activeCompanyTags;
        }

        const activeMobilityOptions = Object.entries(mobility)
          .filter(([_, active]) => active)
          .map(([option]) => option);

        if (activeMobilityOptions.length > 0) {
          updateData.crit_mobility = activeMobilityOptions.join(',');
        }

        if (location.trim()) {
          updateData.crit_location = location;
        }

        updateData.crit_distance = distanceValue.toString();
        updateData.availability = availability.toUpperCase();

        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/search-criteria`,
          updateData,
          {
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeader()
            }
          }
        );
        setCriteriaChanged(false);
      }

      // Refresh data after saving
      refreshData();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setLoading(false);
    }
  };

  // Modify toggleTag to track criteria changes
  const toggleTag = (category: string, tag: string) => {
    setCriteriaChanged(true);
    switch (category) {
      case 'contract':
        setContractTags({ ...contractTags, [tag]: !contractTags[tag] });
        break;
      case 'company':
        setCompanyTags({ ...companyTags, [tag]: !companyTags[tag] });
        break;
      default:
        break;
    }
  };

  // Modify other criteria-related functions to track changes
  const toggleMobility = (option: string) => {
    setCriteriaChanged(true);
    setMobility({ ...mobility, [option]: !mobility[option] });
  };

  const handleDistanceChange = (value: number) => {
    setCriteriaChanged(true);
    setDistanceValue(value);
  };

  const handleTransportModeChange = (mode: string) => {
    setCriteriaChanged(true);
    setTransportMode(mode);
  };

  const handleAvailabilityChange = (availability: string) => {
    setCriteriaChanged(true);
    setAvailability(availability);
  };

  const handleLocationChange = (location: string) => {
    setCriteriaChanged(true);
    setLocation(location);
  };

  return (
    <div className="w-full mx-auto p-6">
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/2 px-4 mb-8">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <Sectors
              sectors={sectors}
              initialSelections={initialSelections}
              onSelectionChange={handleSelectionChange}
            />
          )}
        </div>
        <div className="w-full md:w-1/2 px-4">
          <Criteria
            contractTags={contractTags}
            companyTags={companyTags}
            mobility={mobility}
            distanceValue={distanceValue}
            transportMode={transportMode}
            availability={availability}
            toggleTag={toggleTag}
            toggleMobility={toggleMobility}
            setDistanceValue={handleDistanceChange}
            setTransportMode={handleTransportModeChange}
            setAvailability={handleAvailabilityChange}
            location={location}
            setLocation={handleLocationChange}
            refreshData={refreshData}
          />
          {/* Add the shared save button */}
          {(sectorsChanged || criteriaChanged) && (
            <div className="bottom-4 right-4">
              <button
                onClick={handleSaveAll}
                disabled={loading}
                className="bg-gradient-to-b from-[#30797F] to-[#039DAA] text-white px-6 py-3 rounded-lg shadow-lg  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompetencesCriteres;