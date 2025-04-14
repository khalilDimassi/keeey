import { ArrowLeft } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { OpportunityFormData, Sector } from "../types";
import { fetchSectors, submitOpportunity } from "../services";
import DefineBesoinForm from "./content/DefineBesoinForm";
import DefineVivierForm from "./content/DefineVivierForm";
import CandidatesList from "./CandidatesList";

interface CreateProjectProps {
  onBack: () => void;
}


const CreateProject: FC<CreateProjectProps> = ({ onBack }) => {
  const [isDefineBesoin, setIsDefineBesoin] = useState(true);
  const handleBesoinTabClick = () => setIsDefineBesoin(true);
  const handleVivierTabClick = () => setIsDefineBesoin(false);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<OpportunityFormData>({
    title: "",
    announce_date: "",
    response_date: "",
    startDate: "",
    duration: 0,
    rate: 0,
    selected_sectors: [],
    contract_role: "",
    crit_start_date: "",
    crit_start_date_lastest: "",
    crit_duration: 0,
    crit_duration_lastest: 0,
    crit_target_rate: 0,
    crit_max_rate: 0,
    crit_location: "",
    crit_remote: false,
    tools: [],
    authorizations: [],
    languages: [],
    qualities: [],
  });
  const [submitStatus, setSubmitStatus] = useState<{ loading: boolean; error: string | null; }>({
    loading: false,
    error: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const sectors = await fetchSectors();
        setSectors(sectors);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateFormData = <T extends keyof OpportunityFormData>(
    field: T,
    value: OpportunityFormData[T]
  ) => {
    console.log(">>> updateFormData", field, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSubmitStatus({ loading: true, error: null });
    try {
      const result = await submitOpportunity(formData);
      if (result.error) {
        setSubmitStatus({ loading: false, error: result.error });
      } else {
        setSubmitStatus({ loading: false, error: null });
        onBack();
      }
    } catch (err) {
      setSubmitStatus({
        loading: false,
        error: err instanceof Error ? err.message : "An unknown error occurred."
      });
    }
  };

  return (
    <div className="p-4 w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600">
          <ArrowLeft size={20} />
          <span className="text-lg font-medium">Creation du {isDefineBesoin ? `Besoin` : `Vivier`}</span>
        </button>

        {/* Centered button group */}
        <div className="flex flex-1 justify-center items-center gap-4">
          <div className="inline-flex rounded-full border border-gray-300 mr-60">
            <button
              onClick={handleBesoinTabClick}
              className={`px-4 py-2 ${isDefineBesoin ? "bg-[#215A96] text-white" : "bg-white text-black"
                }`}
              style={{
                borderRadius: "20px 0 0 20px",
                border: "1px solid #215A96",
              }}
            >
              Besoin
            </button>
            <button
              onClick={handleVivierTabClick}
              className={`px-4 py-2 ${!isDefineBesoin ? "bg-[#215A96] text-white" : "bg-white text-black"
                }`}
              style={{
                borderRadius: "0 20px 20px 0",
                border: "1px solid #215A96",
              }}
            >
              Vivier
            </button>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={submitStatus.loading}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          style={{ backgroundColor: "#215A96", borderRadius: "20px" }}
        >
          {submitStatus.loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      {!isDefineBesoin ? (
        <div className="p+3">
          <DefineVivierForm
            sectors={sectors}
            loading={loading}
            error={error}
            formData={formData}
            onFormDataChange={updateFormData}
          />
        </div>
      ) : <DefineBesoinForm
        sectors={sectors}
        loading={loading}
        error={error}
        formData={formData}
        onFormDataChange={updateFormData}
      />}

      <div className="mt-6">
        <CandidatesList />
      </div>
    </div>
  );
};

export default CreateProject;