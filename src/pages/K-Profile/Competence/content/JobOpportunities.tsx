import { useEffect, useRef, useState } from "react";
import { getUserId } from "../../../../utils/jwt";
import { AlertCircle, ArrowLeft, Bookmark, Building, ChevronLeft, ChevronRight, Loader2, MailCheck, MailX, MapPin, User } from "lucide-react";
import { fetchOpportunitiesList, fetchOpportunityCompetences, fetchOpportunityDetails, saveOpportunity, submitToOpportunity } from "../services";
import { OpportunityListItem, MatchPercentages, Opportunity, OpportunityCompetences } from "../types";
import useOpportunitiesFilter, { ContractType, OpportunityTab } from "../hooks";

// Utility functions
const formatTimeAgo = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInMonths = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 30));
  const diffInDays = Math.floor((diffInMilliseconds % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor((diffInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  let timeAgo = "il y a";
  if (diffInMonths > 0) timeAgo += ` ${diffInMonths} mois`;
  if (diffInDays > 0) timeAgo += ` ${diffInDays} jours`;
  if (diffInHours > 0) timeAgo += ` ${diffInHours}h`;
  return timeAgo.trim();
};

const calculateMatchPercentage = (opportunity: OpportunityListItem): string => {
  return `${Math.round(opportunity.matching?.total_match_percentage ?? 0)}%`;
};

const getInitials = (title: string) => {
  const words = title.split(/\s+/).filter(word => word.length > 0);
  return words.slice(0, 3).map(word => word[0].toUpperCase()).join('');
};

const getRandomColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  const s = 10 + Math.abs(hash) % 15;
  const l = 40 + Math.abs(hash) % 10;
  return `hsl(${h}, ${s}%, ${l}%)`;
};

const getTagColorClass = (score: number) => {
  if (score >= 90) return 'bg-green-100 text-green-700';
  if (score >= 80) return 'bg-teal-100 text-teal-700';
  if (score >= 70) return 'bg-blue-100 text-blue-700';
  if (score >= 60) return 'bg-indigo-100 text-indigo-700';
  if (score >= 50) return 'bg-purple-100 text-purple-700';
  if (score >= 40) return 'bg-yellow-100 text-yellow-700';
  if (score >= 30) return 'bg-amber-100 text-amber-700';
  if (score >= 20) return 'bg-orange-100 text-orange-700';
  if (score >= 10) return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
};

const calculateCompetenceScore = (scores: MatchPercentages | null): number => {
  if (!scores) return 0;
  return (
    (scores.jobs_match_percentage * 0.75) +
    (scores.languages_match_percentage * 0.125) +
    (scores.qualities_match_percentage * 0.025) +
    (scores.tools_match_percentage * 0.075) +
    (scores.authorizations_match_percentage * 0.025)
  );
};

// Sub-components
const OpportunitySkeleton = ({ listError = false, count = 3 }: { listError?: boolean; count?: number }) => (
  <div className="space-y-6 p-6 max-h-[70vh] overflow-y-auto">
    {[...Array(count)].map((_, index) => (
      <div
        key={index}
        className={`bg-white p-4 border-b border-gray-200 relative flex flex-col sm:flex-row gap-4 ${listError ? 'border-red-500' : ''}`}
      >
        <div className={`w-16 h-16 rounded-full flex-shrink-0 mx-auto ${listError ? 'bg-red-200' : 'bg-gray-200'} animate-pulse`}></div>
        <div className="flex-1 min-w-0 space-y-3">
          <div className="space-y-2">
            <div className={`h-6 w-3/4 rounded ${listError ? 'bg-red-300' : 'bg-gray-300'}`}></div>
            <div className={`h-4 w-1/4 rounded ${listError ? 'bg-red-200' : 'bg-gray-200'}`}></div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-6 w-16 rounded-xl ${listError ? 'bg-red-300' : 'bg-gray-300'}`}></div>
            <div className={`h-4 w-1/3 rounded ${listError ? 'bg-red-200' : 'bg-gray-200'}`}></div>
          </div>
          <div className="space-y-2">
            <div className={`h-4 w-full rounded ${listError ? 'bg-red-200' : 'bg-gray-200'}`}></div>
            <div className={`h-4 w-5/6 rounded ${listError ? 'bg-red-200' : 'bg-gray-200'}`}></div>
          </div>
        </div>
        <div className="absolute top-2 right-3 flex gap-4">
          <div className={`h-6 w-6 rounded-md ${listError ? 'bg-red-300' : 'bg-gray-300'}`}></div>
          <div className={`h-6 w-6 rounded-md ${listError ? 'bg-red-300' : 'bg-gray-300'}`}></div>
        </div>
      </div>
    ))}
  </div>
);

const LoadingContent = ({ isVisible }: { isVisible: boolean }) => (
  <div className={`transform transition-all duration-300 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
    <div className="bg-white rounded-xl w-full max-w-2xl mx-auto shadow-xl p-8 flex flex-col items-center justify-center min-h-[300px]">
      <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
      <p className="text-gray-600 text-lg font-medium">Chargement des détails de l'opportunité...</p>
      <div className="mt-4 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-green-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
      </div>
    </div>
  </div>
);

const ErrorContent = ({ isVisible, error, onClose, onRetry }: {
  isVisible: boolean,
  error: string,
  onClose: () => void,
  onRetry: () => void
}) => (
  <div className={`transform transition-all duration-300 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
    <div className="bg-white rounded-xl w-full max-w-2xl mx-auto shadow-xl p-8 flex flex-col items-center justify-center min-h-[300px]">
      <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
      <p className="text-gray-600 text-center mb-6">{error}</p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Fermer
        </button>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  </div>
);

const OpportunityDetailModal = ({
  opportunity,
  competences,
  matchings,
  isSaved,
  isApplied,
  isVisible,
  onClose,
  onSave,
  onSubmit
}: {
  opportunity: Opportunity | null,
  competences: OpportunityCompetences | null,
  matchings: MatchPercentages | null,
  isSaved: boolean,
  isApplied: boolean,
  isVisible: boolean,
  onClose: () => void,
  onSave: () => void,
  onSubmit: () => void
}) => {
  if (!opportunity) return null;

  const hasDescriptions = opportunity.description || opportunity.context ||
    opportunity.candidate_profile || opportunity.mission;
  const hasCompetences = competences && (
    (competences.sectors?.length > 0) ||
    (competences.jobs?.length > 0) ||
    (competences.tools?.length > 0) ||
    (competences.qualities?.length > 0) ||
    (competences.languages?.length > 0)
  );

  const gridColumns = !hasDescriptions && !hasCompetences ? "grid-cols-1" : "grid-cols-2";

  return (
    <div className={`transform transition-all duration-500 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
      <div className="bg-white rounded-xl shadow-xl relative flex flex-col overflow-y-hidden pb-4">
        {/* Header */}
        <div className="flex flex-row gap-10 justify-between items-center py-4 pr-8">
          <div className="flex flex-row gap-2">
            <button onClick={onClose} className="flex justify-self-start pl-2 rounded-lg transition-colors hover:bg-gray-100">
              <ArrowLeft size={25} className="text-gray-600" />
            </button>
            <div className="w-24 h-24 bg-green-400 rounded-full flex items-center justify-center transform transition-transform hover:scale-105">
              <User className="h-16 w-16 text-green-900" />
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-gray-900">{opportunity.title}</h2>
              <span className="bg-green-200 text-green-800 text-sm px-2 py-1 rounded font-medium w-fit">
                {matchings?.total_match_percentage ? matchings.total_match_percentage.toFixed(2) : "0.00"}%
              </span>
              <div className="flex flex-row items-center justify-start gap-4 text-sm text-gray-600 ">
                {opportunity.organization && (
                  <span className="flex items-center gap-1">
                    <Building size={15} />
                    {opportunity.organization}
                  </span>
                )}
                {opportunity.crit_location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={15} />
                    {opportunity.crit_location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Match indicators */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2 w-full">
              {['Compétences', 'Séniorité', 'Dispo', 'Mobilité', 'TJM'].map((label, idx) => {
                const score = idx === 0 ? calculateCompetenceScore(matchings) :
                  idx === 1 ? matchings?.seniority_match_percentage ?? 0 :
                    idx === 2 ? matchings?.availability_match_percentage ?? 0 :
                      idx === 3 ? matchings?.mobility_match_percentage ?? 0 :
                        matchings?.rate_match_percentage ?? 0;

                return (
                  <div key={label} className="relative group">
                    <span className={`px-3 py-1 rounded-full font-medium text-sm transition-all hover:scale-105 ${getTagColorClass(score)}`}>
                      {label}
                    </span>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-full p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      Score: {Math.round(score)}%
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-row items-center justify-end gap-6 w-full">
              <select className="px-3 py-2 w-1/3 mr-5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value={"Saved"}>Saved</option>
                <option value={"Applied"}>Applied</option>
              </select>
              {isApplied ? (
                <MailX
                  className="hover:text-red-500 text-green-600 transition-all duration-200 transform hover:scale-110"
                  cursor={"pointer"}
                  onClick={onSubmit}
                  aria-label="Cancel"
                  size={30}
                />
              ) : (
                <MailCheck
                  className="hover:text-green-500 transition-all duration-200 transform hover:scale-110"
                  cursor={"pointer"}
                  onClick={onSubmit}
                  aria-label="Apply"
                  size={30}
                />
              )}
              <Bookmark
                className="hover:bg-gray-100 transition-all transform hover:scale-110"
                onClick={onSave}
                fill={isSaved ? "#fbbf24" : "none"}
                cursor={"pointer"}
                size={30}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#30797F] h-[2px] mx-8" />

        {/* Content */}
        <div className={`grid gap-px bg-[#30797F] mx-1 ${gridColumns}`}>
          {/* Left Column - Always show Critères */}
          <div className="bg-white px-4 pb-4">
            <h1 className="text-xl font-semibold text-gray-900 my-2">Critères</h1>
            {/* Contract Type */}
            {opportunity.contract_roles && (
              <div className="flex flex-row items-center gap-3 mb-3">
                <label className="block text-xs font-medium text-gray-700">Contrats proposés</label>
                {opportunity.contract_roles.map((item, index) => (
                  <div key={index} className="bg-green-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-green-300">
                    {item}
                  </div>
                ))}
              </div>
            )}

            {/* Other criteria */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de démarrage</label>
                <span className="block border border-gray-300 rounded-xl px-2 py-1 bg-gray-50 text-sm text-gray-700 transition-all hover:bg-gray-100">
                  {opportunity.start_at ? new Date(opportunity.start_at).toLocaleDateString('fr-FR') : '25/12/2024'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durée initiale</label>
                <span className="block px-2 py-1 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700 transition-all hover:bg-gray-100">
                  {opportunity.duration} mois
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                <span className="block px-2 py-1 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700 transition-all hover:bg-gray-100">
                  {opportunity.crit_location ?? "-"}
                </span>
              </div>
              {opportunity.crit_remote && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Télétravail</label>
                  <span className="block px-2 py-1 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700 transition-all hover:bg-gray-100">
                    {opportunity.crit_remote ? "Oui" : "-"}
                  </span>
                </div>
              )}
            </div>

            {/* Competences section if needed */}
            {hasDescriptions && hasCompetences && competences && (
              <CompetencesSection competences={competences} />
            )}
          </div>

          {/* Right Column - Show either descriptions or competences */}
          {(hasDescriptions || hasCompetences) && (
            <div className="bg-white px-4 pb-4 overflow-y-scroll">
              {hasDescriptions ? (
                <DescriptionsSection opportunity={opportunity} />
              ) : (
                competences && <CompetencesSection competences={competences} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DescriptionsSection = ({ opportunity }: { opportunity: Opportunity }) => (
  <>
    <h1 className="text-xl font-semibold text-gray-900 my-2">Description du poste</h1>
    {opportunity.description && (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description :</label>
        <div className="p-2 border border-gray-300 bg-[#d4e3e6] rounded-xl min-h-7">
          <div className="text-sm text-black">{opportunity.description}</div>
        </div>
      </div>
    )}
    {opportunity.context && (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">Contexte :</label>
        <div className="p-2 border border-gray-300 bg-[#d4e3e6] rounded-xl min-h-7">
          <div className="text-sm text-black">{opportunity.context}</div>
        </div>
      </div>
    )}
    {opportunity.mission && (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">Missions :</label>
        <div className="p-2 border border-gray-300 bg-[#d4e3e6] rounded-xl min-h-7">
          <div className="text-sm text-black">{opportunity.mission}</div>
        </div>
      </div>
    )}
    {opportunity.candidate_profile && (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">Profil attendu :</label>
        <div className="p-2 border border-gray-300 bg-[#d4e3e6] rounded-xl min-h-7">
          <div className="text-sm text-black">{opportunity.candidate_profile}</div>
        </div>
      </div>
    )}
  </>
);

const CompetencesSection = ({ competences }: { competences: OpportunityCompetences }) => (
  <div className="space-y-4">
    <h1 className="text-xl my-2 font-semibold text-gray-900">Compétences</h1>
    {competences.sectors && competences.sectors.length > 0 && (
      <CompetenceCategory label="Secteurs" items={competences.sectors} />
    )}
    {competences.jobs && competences.jobs.length > 0 && (
      <CompetenceCategory label="Métiers" items={competences.jobs} />
    )}
    {competences.tools && competences.tools.length > 0 && (
      <CompetenceCategory label="Outils" items={competences.tools} />
    )}
    {competences.qualities && competences.qualities.length > 0 && (
      <CompetenceCategory label="Qualités" items={competences.qualities} />
    )}
    {competences.languages && competences.languages.length > 0 && (
      <CompetenceCategory label="Langues" items={competences.languages} />
    )}
  </div>
);

const CompetenceCategory = ({ label, items }: { label: string; items: string[] }) => (
  <div className="grid grid-cols-5 gap-3 items-center">
    <label className="col-span-1 text-xs font-medium text-gray-700">{label}</label>
    <div className="col-span-4 flex flex-wrap gap-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-green-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-green-300 hover:scale-105"
        >
          {item}
        </div>
      ))}
    </div>
  </div>
);

// Main component
const JobOpportunities = ({ selectedID, onClose }: { selectedID?: number, onClose?: () => void }) => {
  const [activeTab, setActiveTab] = useState<OpportunityTab>("Opportunités");
  const [contractType, setContractType] = useState<ContractType>("ALL");
  const [threshold, setThreshold] = useState(0);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityListItem | null>(null);
  const { listLoading, listError, filteredItems, setRawOpportunities } = useOpportunitiesFilter({
    activeTab,
    contractType,
    threshold
  });

  useEffect(() => {
    if (selectedID) {
      setSelectedOpportunity(filteredItems.find(i => i.opportunity_id === selectedID));
    }
  }, [filteredItems, selectedID]);

  // Pagination state
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const displayedItems = filteredItems.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = displayedItems.length < filteredItems.length;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  // Opportunity detail state
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [opportunityCompetences, setOpportunityCompetences] = useState<OpportunityCompetences | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Fetch opportunities list on mount
  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const data = await fetchOpportunitiesList(getUserId() ?? "");
        setRawOpportunities(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadOpportunities();
  }, [setRawOpportunities]);

  // Handle body overflow when modal is open
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", !!selectedOpportunity);
    return () => document.body.classList.remove("overflow-hidden");
  }, [selectedOpportunity]);

  // Infinite scroll setup
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    }, { threshold: 0.5 });

    if (lastItemRef.current) observerRef.current.observe(lastItemRef.current);

    return () => observerRef.current?.disconnect();
  }, [hasMore, filteredItems]);

  const loadDetails = async (selectedOpportunity: OpportunityListItem) => {
    setLoading(true);
    setError(null);
    setIsVisible(false);

    try {
      const [details, competences] = await Promise.all([
        fetchOpportunityDetails(selectedOpportunity.opportunity_id),
        fetchOpportunityCompetences(selectedOpportunity.opportunity_id)
      ]);

      setOpportunity(details);
      setOpportunityCompetences(competences);
      setTimeout(() => setIsVisible(true), 50);
    } catch (err) {
      console.error(err);
      setError('Failed to load opportunity details.');
      setIsVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // Load opportunity details when selected
  useEffect(() => {
    if (!selectedOpportunity) return;

    loadDetails(selectedOpportunity);
  }, [selectedOpportunity]);

  const handleSaveOpportunity = async (opportunityId: number, is_saved: boolean) => {
    await saveOpportunity(opportunityId);

    setRawOpportunities(prev =>
      prev.map(item =>
        item.opportunity_id === opportunityId
          ? { ...item, is_saved: !is_saved }
          : item
      )
    );
  };

  const handleSubmitOpportunity = async (opportunityId: number, is_applied: boolean) => {
    await submitToOpportunity(opportunityId);

    setRawOpportunities(prev =>
      prev.map(item =>
        item.opportunity_id === opportunityId
          ? { ...item, is_applied: !is_applied }
          : item
      )
    );
  };

  const handleCloseModal = () => {
    setIsVisible(false);
    setTimeout(() => setSelectedOpportunity(null), 300);

    if (onClose) onClose();
  };

  if (listLoading && displayedItems.length === 0) {
    return <OpportunitySkeleton count={1} />;
  }

  if (listError) {
    return (
      <>
        <OpportunitySkeleton listError count={1} />
        <div className="text-center py-4 text-red-500 font-medium">
          <p>{listError}</p>
        </div>
      </>
    );
  }

  return (
    <div className="mt-10">
      <div className="relative shadow-sm rounded-lg">
        {/* Tabs and Filters */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 h-16">
            {(["Opportunités", "Opportunités de mes contacts", "Clients étant intéressés"] as OpportunityTab[]).map(tab => (
              <button
                key={tab}
                style={{
                  boxShadow: activeTab === tab
                    ? "0 -4px 4px -2px #6166611c, 4px 0 4px -2px #61666100, -4px 0 4px -2px #676d6724"
                    : "none"
                }}
                className={`px-8 py-3 sm:text-sm md:text-md flex gap-2 items-center font-medium transition-all relative ${activeTab === tab
                  ? "text-gray-900 bg-white rounded-t-xl z-10"
                  : "text-gray-400"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "Opportunités"
                  ? "Toutes les opportunités correspondantes"
                  : tab === "Opportunités de mes contacts"
                    ? "Opportunités de mes contacts"
                    : "Clients étant intéressés"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 bg-white h-16 border-t border-gray-100 px-6 py-4 rounded-t-xl shadow-sm"
            style={{
              boxShadow: "0 -4px 4px -2px #6166611c, 4px 0 4px -2px #61666100, -4px 0 4px -2px #676d6724"
            }}
          >
            {/* Match threshold slider */}
            <div className="flex items-center">
              <label htmlFor="matchThreshold" className="text-sm font-medium text-gray-700 mr-3 whitespace-nowrap">
                Compatibilité: <span className="font-semibold ml-2 text-teal-600">{threshold}%</span>
              </label>
              <button
                onClick={() => setThreshold(t => Math.max(0, t - 1))}
                className="text-gray-500 hover:text-teal-500 focus:outline-none"
              >
                <ChevronLeft size={18} />
              </button>
              <input
                type="range"
                id="matchThreshold"
                min="0"
                max="100"
                value={threshold}
                onChange={e => setThreshold(Number(e.target.value))}
                className="w-28 h-2 mx-2 bg-gray-200 rounded-xl appearance-none
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-teal-500"
              />
              <button
                onClick={() => setThreshold(t => Math.min(100, t + 1))}
                className="text-gray-500 hover:text-teal-500 focus:outline-none"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Contract type selector */}
            <select
              className="px-4 py-2 font-medium text-gray-500 border border-gray-200 rounded-xl
                 focus:ring-teal-500 focus:border-teal-500"
              value={contractType}
              onChange={e => setContractType(e.target.value as ContractType)}
            >
              <option value="ALL">Tous les contrats</option>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="CDI-C">CDI Cadre</option>
              <option value="CONSULTANT">Consultant</option>
              <option value="PORTAGE">Portage</option>
              <option value="FREELANCE">Freelance / Indépendant</option>
            </select>
          </div>
        </div>

        {/* Opportunities List */}
        <div className="overflow-y-auto bg-white rounded-b-xl shadow-lg p-6">
          {(displayedItems.length === 0) ? (
            <div className="text-center py-10 text-gray-500">
              <p>Aucune opportunité disponible.</p>
            </div>
          ) : (displayedItems.map((item, index) => {
            const isLastItem = index === displayedItems.length - 1;
            return (
              <div
                className="bg-slate-50 mb-3 p-4 rounded-xl hover:shadow transition-shadow flex flex-col sm:flex-row gap-4 border-b border-gray-200 relative cursor-pointer"
                key={item.opportunity_id}
                ref={isLastItem ? lastItemRef : null}
                onClick={() => setSelectedOpportunity(item)}
              >
                {/* Avatar */}
                <div
                  className="w-16 h-16 rounded-full flex-shrink-0 object-cover mx-auto flex items-center justify-center text-sm text-black font-bold"
                  style={{ backgroundColor: getRandomColor(item.title) }}
                >
                  {getInitials(item.title)}
                </div>

                {/* Job details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      {item.title} <span className="text-sm text-gray-500">{formatTimeAgo(item.created_at)}</span>
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="px-3 rounded-xl bg-[#9FC5C8] text-[#297280] text-sm font-bold">
                        {calculateMatchPercentage(item)}
                      </div>
                      <span className="text-sm text-gray-700">Correspondent à votre profil</span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mt-3 line-clamp-2">
                    {item.description || "Description non disponible"}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="absolute top-3 right-5 flex gap-4">
                  {item.is_applied ? (
                    <MailX
                      className="hover:text-red-500 text-green-600 transition-all duration-200 transform hover:scale-110 mt-1"
                      cursor={"pointer"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubmitOpportunity(item.opportunity_id, item.is_applied);
                      }}
                      aria-label="Applied"
                      size={30}
                    />
                  ) : (
                    <MailCheck
                      className="hover:text-green-500 transition-all duration-200 transform hover:scale-110 mt-1"
                      cursor={"pointer"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubmitOpportunity(item.opportunity_id, item.is_applied);
                      }}
                      aria-label="Apply"
                      size={30}
                    />
                  )}
                  <Bookmark
                    className={`mt-1 transition-all duration-200 ${item.is_saved ? "text-black hover:text-red-500" : "text-black hover:text-yellow-400"
                      }`}
                    size={30}
                    fill={item.is_saved ? "yellow" : "none"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveOpportunity(item.opportunity_id, item.is_saved);
                    }}
                  />
                </div>
              </div>
            );
          }))}
        </div>
      </div>

      {/* Opportunity Detail Modal */}
      {selectedOpportunity && (
        <div
          onClick={handleCloseModal}
          className={`fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4 transform transition-all duration-500 ease-in-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
        >
          <div className="w-4/6" onClick={(e) => e.stopPropagation()}>
            {loading ? (
              <LoadingContent isVisible={isVisible} />
            ) : error ? (
              <ErrorContent
                isVisible={isVisible}
                error={error}
                onClose={handleCloseModal}
                onRetry={() => {
                  setError(null);
                  setLoading(true);
                  loadDetails(selectedOpportunity);
                }}
              />
            ) : (
              <OpportunityDetailModal
                opportunity={opportunity}
                competences={opportunityCompetences}
                matchings={selectedOpportunity.matching}
                isSaved={selectedOpportunity.is_saved}
                isApplied={selectedOpportunity.is_applied}
                isVisible={isVisible}
                onClose={handleCloseModal}
                onSave={() => handleSaveOpportunity(selectedOpportunity.opportunity_id, selectedOpportunity.is_saved)}
                onSubmit={() => handleSubmitOpportunity(selectedOpportunity.opportunity_id, selectedOpportunity.is_applied)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobOpportunities;