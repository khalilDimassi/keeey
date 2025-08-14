import { ArrowLeft, Ban, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFullOpportunity } from "./services";
import { fetchSectors } from "../OpportunityDetailsKPlayer/services";
import { OpportunityBasicInfo, OpportunityCriteria, OpportunityRequirements, OpportunitySectors, Sector } from "../OpportunityDetailsKPlayer/types";

import GeneralInformationForm from "./content/GeneralInformationForm";
import SkillsCriteriasForm from "./content/SkillsCriteriasForm";
import DiffusionForm from "./content/DiffusionForm";


type TabType = "Informations" | "Compétences_Critères" | "Diffusion";
const TabButton = ({ tab, activeTab, onClick, children }: { tab: TabType; activeTab: TabType; onClick: (tab: TabType) => void; children: React.ReactNode; }) => {
  const isActive = activeTab === tab;
  return (
    <button
      className={`px-6 py-2 flex items-center gap-2 font-medium transition-all relative ${isActive
        ? "text-gray-900 bg-white rounded-t-xl z-10"
        : "text-gray-400 bg-gray-100/50"
        }`}
      onClick={() => onClick(tab)}
    >
      {children}
    </button>
  );
};


const NewOpportunityKPlayer = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Informations");
  const [generalIndormation, setGeneralIndormation] = useState<OpportunityBasicInfo>({
    title: '',
    status: '',
    opportunity_role: '',
    operational_manager: '',
    reference: '',
    start_at: '',
    announce_at: '',
    responded_at: '',
    context: '',
    description: '',
    candidate_profile: '',
  });
  const [skills, setSkills] = useState<OpportunitySectors>({
    selected_sectors: []
  });
  const [criterias, setCriterias] = useState<OpportunityCriteria>({
    contract_roles: [],
    crit_start_date: '',
    crit_start_date_lastest: '',
    crit_duration: 0,
    crit_duration_lastest: 0,
    crit_target_rate: 0,
    crit_max_rate: 0,
    crit_location: '',
    crit_remote: false,
  });
  const [requirements, setRequirements] = useState<OpportunityRequirements>({
    tools: [],
    authorizations: [],
    languages: [],
    qualities: []
  });
  const [diffusion, setDiffusion] = useState({});
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [sbmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadSectors = async () => {
      try {
        const sectors = await fetchSectors();
        setSectors(sectors);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      }
    };

    loadSectors();
  }, []);

  const handleOnChange = (tab: TabType) => (data: any) => {
    switch (tab) {
      case "Informations":
        setGeneralIndormation(data as OpportunityBasicInfo);
        break;
      case "Compétences_Critères":
        setSkills(data.sectors as OpportunitySectors);
        setCriterias(data.criteria as OpportunityCriteria);
        setRequirements(data.requirements as OpportunityRequirements);
        break;
      case "Diffusion":
        setDiffusion(data);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    if (!generalIndormation || !skills || !criterias || !diffusion) {
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      if (generalIndormation.opportunity_role === "") {
        generalIndormation.opportunity_role = "LIVEWELL";
      }

      if (generalIndormation.status === "") {
        generalIndormation.status = "OPEN";
      }

      const response = await createFullOpportunity(generalIndormation, skills, criterias, requirements, diffusion);
      navigate("/kplayer/opportunities/" + response.opportunity_id);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="p-4 w-full mx-auto">
      {/* Header */}
      <div className="flex justify-between gap-3 items-end h-8 mb-4">
        <div className="flex justify-start gap-3 items-end">
          <ArrowLeft
            onClick={() => navigate("/kplayer/opportunities")}
            className="mb-1 text-gray-600"
            cursor={"pointer"}
            size={20}
          />
          <span className="text-lg font-medium">Creer une opportunité</span>
        </div>
        {error ? (
          <button
            className="px-3 py-1.5 flex items-center text-wrap gap-2 font-medium text-red-500 bg-red-100 rounded-full"
            onClick={() => handleSubmit()}
          >
            <Ban color="red" size={20} />
            Error : {error} Click to retry
          </button>
        ) : (
          <button
            className="px-4 py-2 flex items-center gap-2 font-medium text-white bg-[#215A96] rounded-full"
            onClick={() => handleSubmit()}
          >
            {sbmitting ? <Loader2 color="white" size={20} className=" animate-spin" /> : <Check color="white" size={20} />}
            Submit Opportunity
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex relative">
        <TabButton tab="Informations" activeTab={activeTab} onClick={setActiveTab} > Informations Générales </TabButton>
        <TabButton tab="Compétences_Critères" activeTab={activeTab} onClick={setActiveTab} > Compétences & Critères </TabButton>
        <TabButton tab="Diffusion" activeTab={activeTab} onClick={setActiveTab} >Diffusion</TabButton>
      </div>

      {/* tabs content */}
      <div className="min-h-[55svh] bg-white rounded-b-2xl p-4">
        {activeTab === "Informations" && <GeneralInformationForm onChange={handleOnChange("Informations")} formData={generalIndormation} />}
        {activeTab === "Compétences_Critères" && <SkillsCriteriasForm onChange={handleOnChange("Compétences_Critères")} sectors={sectors} skillsData={skills} criteriasData={criterias} requirementsData={requirements} mainColor="#215A96" />}
        {activeTab === "Diffusion" && <DiffusionForm onChange={handleOnChange("Diffusion")} formData={null} />}
      </div>
    </main>
  )
};

export default NewOpportunityKPlayer