import axios from "axios";
import { Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getAuthHeader, getUserId } from "../../../utils/jwt";
import Competences from "./Competences";
import Criteres from "./Criteres";

export interface SectorSelection {
  id: number;
  seniority: number;
  jobs: {
    id: number;
    skills: number[];
  }[];
}

export interface OpportunityFormData {
  selected_sectors: SectorSelection[];
  contract_role: string;
  crit_start_date: string;
  crit_start_date_lastest: string;
  crit_duration: number;
  crit_duration_lastest: number;
  crit_target_rate: number;
  crit_max_rate: number;
  crit_location: string;
  crit_remote: boolean;
  tools: string[];
  authorizations: string[];
  languages: string[];
  qualities: string[];
}

export interface Sector {
  includes(id: number): unknown;
  id: number;
  sector?: string;
  jobs: Job[] | null;
}

interface Job {
  id: number;
  job?: string;
  skills: Skill[] | null;
}

interface Skill {
  id: number;
  skill?: string;
}

const CompetencesEtCriteres = () => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const initialFormData: OpportunityFormData = {
    selected_sectors: [],
    contract_role: '',
    crit_start_date: '',
    crit_start_date_lastest: '',
    crit_duration: 0,
    crit_duration_lastest: 0,
    crit_target_rate: 0,
    crit_max_rate: 0,
    crit_location: '',
    crit_remote: false,
    tools: [],
    authorizations: [],
    languages: [],
    qualities: []
  };
  const [formData, setFormData] = useState<OpportunityFormData>(initialFormData);
  const [submitStatus, setSubmitStatus] = useState<{ loading: boolean; error: string | null; }>({
    loading: false,
    error: null,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const sectorsResponse = await axios.get<Sector[]>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/suggestions/sectors`
      );
      setSectors(sectorsResponse.data);

      const userDataResponse = await axios.get<OpportunityFormData>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/default-search`,
        {
          headers: getAuthHeader(),
        }
      );
      setFormData(userDataResponse.data);
    } catch (err) {
      setError('Failed to fetch initial data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormDataChange = (newData: Partial<OpportunityFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...newData,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitStatus({ loading: true, error: null });

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${getUserId()}/v2`,
        formData,
        {
          headers: getAuthHeader(),
        }
      );

      // Perform search after saving
      // const searchResponse = await axios.post(
      //   `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/search`,
      //   formData,
      //   {
      //     headers: getAuthHeader(),
      //   }
      // ); 
      // // Handle search results here
      // console.log("Search results:", searchResponse.data);

    } catch (err) {
      setSubmitStatus({ loading: false, error: 'Failed to save/search. Please try again.' });
      console.error(err);
    } finally {
      setSubmitStatus(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div>
      <div className="flex justify-between mr-5 ml-5 items-center space-x-3 mt-1 mb-1">
        <span className="flex items-center gap-4">
          <Building2 className="text-blue-800" size={40} />
          <h1 className="text-xl font-semibold">Compétences</h1>
        </span>
        <button
          type="button"
          className="flex items-center justify-center bg-blue-700 text-white px-4 py-2 rounded-xl ml-auto"
          style={{ width: "8rem", backgroundColor: "#215A96" }}
          onClick={handleSubmit}
          disabled={submitStatus.loading}
        >
          {submitStatus.loading ? "Searching..." : "Search"}
        </button>
      </div>
      <div className="p-4 flex gap-5">
        <Competences
          formData={formData}
          sectors={sectors}
          loading={loading}
          error={error}
          onFormDataChange={handleFormDataChange}
        />
        <Criteres
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />
      </div>
    </div>
  );
};

export default CompetencesEtCriteres;
