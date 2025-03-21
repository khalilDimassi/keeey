import { useEffect, useState } from 'react';
import Sectors, { Sector, UserSelection } from './Sectors';
import Criteria from './Criteria';
import axios from 'axios';
import { getAuthHeader } from '../../../../../utils/jwt';

type SectorSuggestionsResponse = Sector[];
type InitialSelectionsResponse = UserSelection[];

type TagsState = {
  [key: string]: boolean;
};

type SearchCriteriaResponse = {
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
      const response = await axios.get<SearchCriteriaResponse>(
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

  const handleSelectionChange = async (selections: UserSelection[]) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/skill/v3`,
        selections,
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
        }
      );
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('Failed to update skills:', error);
    }
  };

  const toggleTag = (category: string, tag: string) => {
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

  const toggleMobility = (option: string) => {
    setMobility({ ...mobility, [option]: !mobility[option] });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
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
            setDistanceValue={setDistanceValue}
            setTransportMode={setTransportMode}
            setAvailability={setAvailability}
            location={location}
            setLocation={setLocation}
            refreshData={refreshData}
          />
        </div>
      </div>
    </div>
  );
};

export default CompetencesCriteres;