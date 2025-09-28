import { useEffect, useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getAuthHeader, isAuthenticated, loadGuestOpportunities } from "../../../../../utils/jwt";
import { fetchCandidatesWithMatchData, fetchSectors } from "./services";
import { OpportunityFormData, EnhancedCandidate, Sector } from "./types";

import axios from "axios";
import Diffusion from "./content/DiffusionConfigTab";
import GeneralInformationTab from "./content/GeneralInformationTab";
import SkillsAndCriterias from "./content/SkillsAndCriteriaTab";
import StarredCandidatesComp from "./content/StarredCandidatesTab";
import CandidatesList from "../CandidatesList/CandidatesList";

type TabType = "Informations" | "Compétences_Critères" | "Candidates" | "Diffusion";

const TabButton = ({ tab, activeTab, onClick, children, icon }: { tab: TabType; activeTab: TabType; onClick: (tab: TabType) => void; children: React.ReactNode; icon?: React.ReactNode; }) => {
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
      {icon}
    </button>
  );
};

const OpportunityDetailsKPlayer = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Informations");
  const [candidatesTab, setCandidatesTab] = useState<"submitted" | "all">("all");
  const [opportunityDetails, setProjectDetails] = useState<OpportunityFormData | null>(null);
  const [starredCandidates, setStarredCandidates] = useState<EnhancedCandidate[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  const isAuth = isAuthenticated();
  const navigate = useNavigate();
  let params = useParams<{ id: string }>();

  const mapApiResponseToFormData = (apiData: any): OpportunityFormData => {
    return {
      // Basic Info
      title: apiData.title,
      operational_manager: apiData.operational_manager,
      announce_at: apiData.announce_at,
      responded_at: apiData.responded_at,
      start_at: apiData.start_at,
      description: apiData.description || '',
      context: apiData.context || '',
      candidate_profile: apiData.candidate_profile || '',
      status: apiData.status || 'PENDING',
      reference: apiData.reference || '',
      opportunity_role: apiData.opportunity_role || 'REQUIREMENT',
      satisfaction: apiData.satisfaction || 0,

      // Sectors
      selected_sectors: apiData.selected_sectors?.map((sector: any) => ({
        id: sector.id,
        seniority: sector.seniority,
        jobs: sector.jobs?.map((job: any) => ({
          id: job.id,
          skills: job.skills || []
        })) || []
      })) || [],

      // Criteria
      contract_roles: apiData.contract_roles || [],
      crit_start_date: apiData.crit_start_date || '',
      crit_start_date_lastest: apiData.crit_start_date_lastest || '',
      crit_duration: apiData.crit_duration || 0,
      crit_duration_lastest: apiData.crit_duration_lastest || 0,
      crit_target_rate: apiData.crit_target_rate || 0,
      crit_max_rate: apiData.crit_max_rate || 0,
      crit_location: apiData.crit_location || '',
      crit_remote: apiData.crit_remote || false,

      // Requirements
      tools: apiData.tools || [],
      authorizations: apiData.authorizations || [],
      languages: apiData.languages || [],
      qualities: apiData.qualities || []
    };
  };

  useEffect(() => {
    // Load sectors
    setLoading(true);
    fetchSectors()
      .then((sectors) => {
        setSectors(sectors);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      })
      .finally(() => {
        setLoading(false);
      });

    if (params.id && isAuth) {
      // Load project details
      setLoading(true);
      axios.get<OpportunityFormData>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${params.id}`,
        { headers: getAuthHeader() }
      )
        .then((response) => {
          setProjectDetails(mapApiResponseToFormData(response.data));
          setError(null);
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to load opportunity details.');
        })
        .finally(() => {
          setLoading(false);
        });

      // Load starred candidates
      setLoading(true);
      fetchCandidatesWithMatchData("STARRED", params.id)
        .then((candidates) => {
          setStarredCandidates(candidates);
          setError(null);
        })
        .catch((err) => {
          console.error("Failed to load candidates:", err);
          setError(err instanceof Error ? err.message : 'Failed to load candidates');
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (params.id && !isAuth) {
      try {
        const opportunity = loadGuestOpportunities().find((opportunity) => opportunity.id.toString() === params.id);
        if (opportunity) {
          const { id, created_at, expire_at, ...projectDetails } = opportunity;
          setProjectDetails(projectDetails);
          setError(null);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred while fetching opportunity details.');
      } finally {
        setStarredCandidates([]);
        setError(null);
        setLoading(false);
      }
    }
  }, [params.id, isAuth]);

  return (
    <main className="p-4 w-full mx-auto">
      {/* header */}
      <div className="flex justify-start gap-3 items-end h-8 mb-4">
        <ArrowLeft
          onClick={() => navigate("/kplayer/opportunities")}
          className="mb-1 text-gray-600"
          cursor={"pointer"}
          size={20}
        />
        <span className="text-lg font-medium">Détails du besoin:</span>
        <h1 className="ml-12 mb-1 text-2xl font-bold text-[#215A96]">{opportunityDetails?.title ?? "-"}</h1>
      </div>

      <div className="flex relative">
        <TabButton tab="Informations" activeTab={activeTab} onClick={setActiveTab} > Informations Générales </TabButton>
        <TabButton tab="Compétences_Critères" activeTab={activeTab} onClick={setActiveTab} > Compétences & Critères </TabButton>
        <TabButton tab="Candidates" activeTab={activeTab} onClick={setActiveTab} icon={<Star fill="white" size={18} className='p-1 text-white bg-black rounded-full' />}> Candidats </TabButton>
        <TabButton tab="Diffusion" activeTab={activeTab} onClick={setActiveTab} >Diffusion</TabButton>
      </div>

      {/* tabs content */}
      <div className="min-h-[55svh]">
        {activeTab === "Informations" && (<GeneralInformationTab opportunity_id={params.id || ""}
          formData={{
            title: opportunityDetails?.title ?? "",
            status: opportunityDetails?.status ?? "",
            opportunity_role: opportunityDetails?.opportunity_role ?? "",
            operational_manager: opportunityDetails?.operational_manager ?? "",
            reference: opportunityDetails?.reference ?? "",
            announce_at: opportunityDetails?.announce_at ?? "",
            responded_at: opportunityDetails?.responded_at ?? "",
            start_at: opportunityDetails?.start_at ?? "",
            description: opportunityDetails?.description ?? "",
            context: opportunityDetails?.context ?? "",
            candidate_profile: opportunityDetails?.candidate_profile ?? "",
          }}
          loading={loading}
          error={error}
        />)}
        {activeTab === "Compétences_Critères" && <SkillsAndCriterias opportunity_id={params.id || ""}
          sectors={sectors}
          loading={loading}
          error={error}
          initialFormData={{
            sectors: {
              selected_sectors: opportunityDetails?.selected_sectors ?? [],
            },
            criteria: {
              contract_roles: opportunityDetails?.contract_roles ?? [],
              crit_start_date: opportunityDetails?.crit_start_date ?? "",
              crit_start_date_lastest: opportunityDetails?.crit_start_date_lastest ?? "",
              crit_duration: opportunityDetails?.crit_duration ?? 0,
              crit_duration_lastest: opportunityDetails?.crit_duration_lastest ?? 0,
              crit_target_rate: opportunityDetails?.crit_target_rate ?? 0,
              crit_max_rate: opportunityDetails?.crit_max_rate ?? 0,
              crit_location: opportunityDetails?.crit_location ?? "",
              crit_remote: opportunityDetails?.crit_remote ?? false,
            },
            requirements: {
              tools: opportunityDetails?.tools ?? [],
              authorizations: opportunityDetails?.authorizations ?? [],
              languages: opportunityDetails?.languages ?? [],
              qualities: opportunityDetails?.qualities ?? [],
            },
          }}
        />}
        {activeTab === "Candidates" && <StarredCandidatesComp opportunity_id={params.id || ""}
          onSelectedCandidate={setSelectedCandidateId}
          candidates={starredCandidates}
          loading={loading}
          error={error}
        />}
        {activeTab === "Diffusion" && <Diffusion opportunity_id={params.id || ""} />}
      </div>

      {/* candidates list */}
      <div className="mt-6">
        <div className="flex mb-4 border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium ${candidatesTab === "all"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setCandidatesTab("all")}
          >
            All Profiles
          </button>
          <button
            className={`py-2 px-4 font-medium ${candidatesTab === "submitted"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setCandidatesTab("submitted")}
          >
            Submitted Profiles
          </button>
        </div>

        <CandidatesList
          apiType={candidatesTab === "submitted" ? 'SUBMITTED' : 'ALL'}
          opportunityId={params.id || ""}
          selectedCandidateId={selectedCandidateId ?? ""}
          onClodeModal={() => setSelectedCandidateId(null)}
        />
      </div>
    </main>
  )
};

export default OpportunityDetailsKPlayer