import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { getAuthHeader } from '../../../../utils/jwt';
import axios from 'axios';

import CandidatesList from '../../Competances/CandidatesList';
import Informations from './GeneralInformationTab';
import SkillsAndCriterias from './SkillsAndCriteriaTab';
import Diffusion from './DiffusionConfigTab';
import StarredCandidatesComp from './StarredCandidatesTab';

export interface OpportunityDetails {
  opportunity_id: number;
  user_id: string;
  title: string;
  description: string;
  rate: number;
  responded_at: string;
  start_at: string;
  announce_at: string;
  contract_role: string;
  opportunity_role: string;
  status: string;
  satisfaction: number;
  duration: number;
  crit_start_date: string;
  crit_start_date_lastest: string;
  crit_duration: number;
  crit_duration_lastest: number;
  crit_target_rate: number;
  crit_max_rate: number;
  crit_location: string;
  crit_remote: boolean;
  created_at: string;
  updated_at: string;
}

export interface MatchPercentages {
  total_match_percentage: number;
  jobs_match_percentage: number;
  seniority_match_percentage: number;
  availability_match_percentage: number;
  rate_match_percentage: number;
  mobility_match_percentage: number;
  languages_match_percentage: number;
  tools_match_percentage: number;
  authorizations_match_percentage: number;
  qualities_match_percentage: number;
}

export interface StarredCandidates {
  id: string;
  first_name: string;
  last_name: string;
  occupation: string;
  status: string;
  matching_scores: MatchPercentages;
}

interface OpportunityDetailsProps {
  opportunity_id: number;
  onBack: () => void;
}

export function OpportunityDetails({ opportunity_id, onBack }: OpportunityDetailsProps) {
  const [activeTab, setActiveTab] = useState("Informations");
  const [opportunityDetails, setOpportunityDetails] = useState<OpportunityDetails | null>(null);
  const [starredCandidates, setStarredCandidates] = useState<StarredCandidates[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const fetchStarredCandidates = async (opportunity_id: number) => {
    try {
      const response = await axios.get<StarredCandidates[]>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunity_id}/candidates/starred`,
        { headers: getAuthHeader(), }
      );

      if (!response.data || response.data.length === 0) {
        setStarredCandidates([])
        return
      }

      const candidates = response.data.map((candidate: StarredCandidates) => ({
        ...candidate
      }));

      for (const candidate of candidates) {
        try {
          const matchResponse = await axios.get<MatchPercentages>(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${opportunity_id}/${candidate.id}/matching`
          );

          candidate.matching_scores = matchResponse.data;

        } catch (error) {
          console.error(`Error fetching match percentages for candidate ${candidate.id}:`, error);
        }
      }

      setStarredCandidates(candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setLoading(false);
    }
  };

  const loadOpportunityDetails = async (opportunity_id: number) => {
    setLoading(true);
    try {
      const response = await axios.get<OpportunityDetails>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${opportunity_id}`
      );

      setOpportunityDetails(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load opportunity details.');
    } finally {
      setLoading(false);
    }

    fetchStarredCandidates(opportunity_id);
  };

  useEffect(() => {
    loadOpportunityDetails(opportunity_id);
  }, [opportunity_id]);

  const updateOpportunityDetails = async (changedData: Partial<OpportunityDetails>) => {
    setSaving(true);
    try {
      const response = await axios.put<OpportunityDetails>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunity_id}`,
        changedData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          }
        }
      );

      setOpportunityDetails(response.data);
      setError(null);
      // return response.data;
      return
    } catch (err) {
      console.error('Failed to update opportunity:', err);
      setError('Failed to update opportunity details.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

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

      {loading ? (
        <div className="text-center py-8">Chargement des détails...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <>
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
              className={`px-6 py-2 flex gap-2 font-medium transition-all relative ${activeTab === "Candidates"
                ? "text-gray-900 bg-white rounded-t-xl z-10"
                : "text-gray-400 bg-gray-100/50"
                }`}
              onClick={() => setActiveTab("Candidates")}
            >
              Candidates
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.33203 23.5002L14.9987 19.1793L20.6654 23.5002L18.5404 16.4877L24.207 12.4502H17.2654L14.9987 5.0835L12.732 12.4502H5.79036L11.457 16.4877L9.33203 23.5002ZM14.9987 29.1668C13.039 29.1668 11.1973 28.795 9.4737 28.0512C7.75009 27.3075 6.25078 26.2981 4.97578 25.0231C3.70078 23.7481 2.69141 22.2488 1.94766 20.5252C1.20391 18.8016 0.832031 16.9599 0.832031 15.0002C0.832031 13.0404 1.20391 11.1988 1.94766 9.47516C2.69141 7.75155 3.70078 6.25225 4.97578 4.97725C6.25078 3.70225 7.75009 2.69287 9.4737 1.94912C11.1973 1.20537 13.039 0.833496 14.9987 0.833496C16.9584 0.833496 18.8001 1.20537 20.5237 1.94912C22.2473 2.69287 23.7466 3.70225 25.0216 4.97725C26.2966 6.25225 27.306 7.75155 28.0497 9.47516C28.7935 11.1988 29.1654 13.0404 29.1654 15.0002C29.1654 16.9599 28.7935 18.8016 28.0497 20.5252C27.306 22.2488 26.2966 23.7481 25.0216 25.0231C23.7466 26.2981 22.2473 27.3075 20.5237 28.0512C18.8001 28.795 16.9584 29.1668 14.9987 29.1668Z" fill="#1D1B20" />
              </svg>
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
              {activeTab === "Informations" && (
                <Informations
                  opportunityData={opportunityDetails}
                  onSave={updateOpportunityDetails}
                  isSaving={saving}
                />
              )}
              {activeTab === "Compétences_Critères" && <SkillsAndCriterias
                opportunityData={opportunityDetails}
                onSave={updateOpportunityDetails}
                isSaving={saving}
              />}
              {activeTab === "Candidates" && <StarredCandidatesComp candidates={starredCandidates} />}
              {activeTab === "Diffusion" && <Diffusion />}
            </div>
          </div>

          <div className="mt-6">
            <CandidatesList ApiType='SUBMITTED' OpportunityID={opportunity_id} />
          </div>
        </>
      )}
    </div>
  );
}