import { useState, useEffect } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import axios from 'axios';
import { EnhancedCandidate, OpportunityFormData, Sector } from '../types';
import { fetchCandidatesWithMatchData, fetchSectors } from '../services';
import { getAuthHeader } from '../../../../utils/jwt';

import CandidatesList from '../../Competence/content/CandidatesList';
import GeneralInformationTab from './content/GeneralInformationTab';
import SkillsAndCriterias from './content/SkillsAndCriteriaTab';
import StarredCandidatesComp from './content/StarredCandidatesTab';
import Diffusion from './content/DiffusionConfigTab';

interface ProjectDetailsProps {
  opportunity_id: string;
  onBack: () => void;
}

const ProjectDetails = ({ opportunity_id, onBack }: ProjectDetailsProps) => {
  const [activeTab, setActiveTab] = useState("Informations");
  const [candidatesTab, setCandidatesTab] = useState<"submitted" | "all">("all");
  const [opportunityDetails, setProjectDetails] = useState<OpportunityFormData | null>(null);
  const [starredCandidates, setStarredCandidates] = useState<EnhancedCandidate[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mapApiResponseToFormData = (apiData: any): OpportunityFormData => {
    return {
      // Basic Info
      title: apiData.title,
      announce_at: apiData.announce_at,
      responded_at: apiData.responded_at,
      start_at: apiData.start_at,
      duration: apiData.duration.toString(),
      rate: apiData.rate.toString(),
      description: apiData.description || '',
      context: apiData.context || '',
      mission: apiData.mission || '',
      candidat_profile: apiData.candidat_profile || '',
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

  const loadProjectDetails = async (opportunity_id: string) => {
    setLoading(true);
    try {
      const response = await axios.get<OpportunityFormData>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunity_id}`,
        { headers: getAuthHeader() }
      );
      setProjectDetails(mapApiResponseToFormData(response.data));
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load opportunity details.');
    } finally {
      setLoading(false);
    }
  };

  const loadSectors = async () => {
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

  const loadStarredCandidates = async (opportunity_id: string) => {
    try {
      setLoading(true);
      setError(null);
      const candidates = await fetchCandidatesWithMatchData("STARRED", opportunity_id);
      setStarredCandidates(candidates);
    } catch (err) {
      console.error("Failed to load candidates:", err);
      setError(err instanceof Error ? err.message : 'Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSectors();
    loadProjectDetails(opportunity_id);
    loadStarredCandidates(opportunity_id);
  }, [opportunity_id]);


  return (
    <div className="p-4 w-full mx-auto">
      <div className="flex justify-start gap-3 items-end h-8 mb-4">
        <ArrowLeft
          onClick={onBack}
          className="mb-1 text-gray-600"
          cursor={"pointer"}
          size={20}
        />
        <span className="text-lg font-medium">Détails du besoin:</span>
        <h1 className="ml-12 mb-1 text-2xl font-bold text-[#215A96]">{opportunityDetails?.title ?? "-"}</h1>
      </div>

      <div className="flex relative">
        <button
          style={{
            boxShadow: activeTab === "Informations"
              ? "0 -4px 4px -2px #6166611c, 4px 0 4px -2px #61666100, -4px 0 4px -2px #676d6724"
              : "none"
          }}
          className={`px-6 py-2 flex gap-2 font-medium transition-all relative ${activeTab === "Informations"
            ? "text-gray-900 bg-white rounded-t-xl z-10"
            : "text-gray-400 bg-gray-100/50"
            }`}
          onClick={() => setActiveTab("Informations")}
        >
          Informations Générales
        </button>
        <button
          style={{
            boxShadow: activeTab === "Compétences_Critères"
              ? "0 -4px 4px -2px #6166611c, 4px 0 4px -2px #61666100, -4px 0 4px -2px #282c2824"
              : "none"
          }}
          className={`px-6 flex gap-2 py-2 font-medium transition-all relative ${activeTab === "Compétences_Critères"
            ? "text-gray-900 bg-white rounded-t-xl z-10"
            : "text-gray-400 bg-gray-100/50"
            }`}
          onClick={() => setActiveTab("Compétences_Critères")}
        >
          Compétences & Critères
        </button>
        <button
          style={{
            boxShadow: activeTab === "Candidates"
              ? "0 -4px 4px -2px #6166611c, 4px 0 4px -2px #61666100, -4px 0 4px -2px #676d6724"
              : "none"
          }}
          className={`px-6 py-2 flex items-center justify-center gap-2 font-medium transition-all relative ${activeTab === "Candidates"
            ? "text-gray-900 bg-white rounded-t-xl z-10"
            : "text-gray-400 bg-gray-100/50"
            }`}
          onClick={() => setActiveTab("Candidates")}
        >
          Candidats <Star fill="white" size={18} className=' p-1 text-white bg-black rounded-full' />
        </button>
        <button
          style={{
            boxShadow: activeTab === "Diffusion"
              ? "0 -4px 4px -2px #6166611c, 4px 0 4px -2px #61666100, -4px 0 4px -2px #676d6724"
              : "none"
          }}
          className={`px-6 py-3 flex gap-2 font-medium transition-all relative ${activeTab === "Diffusion"
            ? "text-gray-900 bg-white rounded-t-xl z-10"
            : "text-gray-400 bg-gray-100/50"
            }`}
          onClick={() => setActiveTab("Diffusion")}
        >
          Diffusion
        </button>
      </div>

      <div className={`relative bg-white p-4 shadow-lg ${activeTab === "Informations"
        ? "rounded-b-xl rounded-r-xl"
        : "rounded-xl"
        }`}>
        <div className="hover-box p-4">
          {activeTab === "Informations" && (<GeneralInformationTab
            opportunity_id={opportunity_id}
            formData={{
              title: opportunityDetails?.title ?? "",
              status: opportunityDetails?.status ?? "",
              certainty: opportunityDetails?.certainty ?? "",
              operational_manager: opportunityDetails?.operational_manager ?? "",
              reference: opportunityDetails?.reference ?? "",
              announce_at: opportunityDetails?.announce_at ?? "",
              responded_at: opportunityDetails?.responded_at ?? "",
              start_at: opportunityDetails?.start_at ?? "",
              duration: opportunityDetails?.duration ?? 0,
              rate: opportunityDetails?.rate ?? 0,
              description: opportunityDetails?.description ?? "",
              context: opportunityDetails?.context ?? "",
              mission: opportunityDetails?.mission ?? "",
              candidat_profile: opportunityDetails?.candidat_profile ?? "",
            }}
            loading={loading}
            error={error}
          />)}
          {activeTab === "Compétences_Critères" && <SkillsAndCriterias
            opportunity_id={opportunity_id}
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
          {activeTab === "Candidates" && <StarredCandidatesComp
            opportunity_id={opportunity_id}
            candidates={starredCandidates}
            loading={loading}
            error={error}
          />}
          {activeTab === "Diffusion" && <Diffusion
            opportunity_id={opportunity_id}
          />}
        </div>
      </div>
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
          opportunityId={opportunity_id}
        />
      </div>
    </div>
  );
}

export default ProjectDetails;