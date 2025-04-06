import { useState, useEffect } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { getAuthHeader } from '../../../../utils/jwt';
import axios from 'axios';

import SkillsAndCriterias from './content/SkillsAndCriteriaTab';
import Diffusion from './content/DiffusionConfigTab';
import StarredCandidatesComp from './content/StarredCandidatesTab';
import CandidatesList from '../../Competence/content/CandidatesList';
import GeneralInformationTab from './content/GeneralInformationTab';
import { EnhancedCandidate, OpportunityFormData, Sector } from '../types';
import { fetchCandidatesWithMatchData, fetchSectors } from '../services';

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

  const mapApiResponseToFormData = (apiData: any): OpportunityFormData => {
    return {
      // Basic Info
      title: apiData.title,
      announceDate: apiData.announce_at,
      responseDate: apiData.responded_at,
      startDate: apiData.start_at,
      duration: apiData.duration.toString(),
      targetRate: apiData.rate.toString(),
      description: apiData.description || '',
      status: apiData.status || 'PENDING',
      opportunity_role: apiData.opportunity_role || 'REQUIREMENT',
      satisfaction: apiData.satisfaction || 0,

      // Sectors
      selected_sectors: apiData.sectors?.map((sector: any) => ({
        id: sector.id,
        seniority: sector.seniority,
        jobs: sector.jobs?.map((job: any) => ({
          id: job.id,
          skills: job.skills || []
        })) || []
      })) || [],

      // Criteria
      contract_role: apiData.contract_role || 'FREELANCE',
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

  useEffect(() => {
    loadSectors();
    loadProjectDetails(opportunity_id);
    loadStarredCandidates(opportunity_id);
  }, [opportunity_id]);



  return (
    <div className="p-4 w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600"
        >
          <ArrowLeft size={20} />
          <span className="text-lg font-medium">Détails du besoin</span>
        </button>
      </div>

      <div className="flex relative">
        <button
          style={{
            boxShadow: activeTab === "Informations"
              ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(103, 109, 103, 0.14)"
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
              ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(40, 44, 40, 0.14)"
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
              ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(103, 109, 103, 0.14)"
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
              ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(103, 109, 103, 0.14)"
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
              announceDate: opportunityDetails?.announceDate ?? "",
              responseDate: opportunityDetails?.responseDate ?? "",
              startDate: opportunityDetails?.startDate ?? "",
              duration: opportunityDetails?.duration ?? "",
              targetRate: opportunityDetails?.targetRate ?? "",
              context: opportunityDetails?.context ?? "",
              description: opportunityDetails?.description ?? "",
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
                contract_role: opportunityDetails?.contract_role ?? "",
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