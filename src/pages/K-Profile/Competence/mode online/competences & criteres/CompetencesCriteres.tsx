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


const CompetencesCriteres: React.FC = () => {
  const [initialSelections, setInitialSelections] = useState<UserSelection[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchSectors();
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
          />
        </div>
      </div>
    </div>
  );
};

export default CompetencesCriteres;