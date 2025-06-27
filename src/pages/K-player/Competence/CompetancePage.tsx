import { Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { OpportunityFormData, Sector } from "./types";
import { fetchInitialSectorsCriterias, saveAndSearchOpportunities } from "./services";
import Competences from "./content/Competences";
import Criteres from "./content/Criteres";
import CandidatesList from "./content/CandidatesList";
import { getUserId } from "../../../utils/jwt";

const CompetancePage = () => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const initialFormData: OpportunityFormData = {
    selected_sectors: [],
    contract_roles: [],
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
    const loadData = async () => {
      try {
        setLoading(true);
        const { sectors, formData } = await fetchInitialSectorsCriterias(getUserId());
        setSectors(sectors);
        setFormData(formData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFormDataChange = (newData: Partial<OpportunityFormData>) => {
    setFormData(prev => ({ ...prev, ...newData, }));
  };

  const handleSubmit = async () => {
    setSubmitStatus({ loading: true, error: null });

    const { searchResults, error } = await saveAndSearchOpportunities(formData);

    if (error) {
      setSubmitStatus({ loading: false, error });
    } else {
      setSubmitStatus({ loading: false, error: null });
      // TODO: Handle search results if needed
      console.log("Search results:", searchResults);
    }
  };

  return (
    <>
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

      <div className="mt-6">
        <CandidatesList />
      </div>
    </>
  );
};

export default CompetancePage;
