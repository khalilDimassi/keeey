import { useEffect, useMemo, useState } from "react";
import { OpportunitiesSVG } from "../../components/SVGcomponents";
import { Enhancements, OpportunityBase, OpportunityStatus, OpportunityTabs } from "./types";
import { List, Contact, Building2, Bookmark, ChevronLeft, ChevronRight, MailCheck, MailX, ArrowUpRight, Trash2 } from "lucide-react";
import { ContractType } from "./hooks";
import { applyOpportunity, fetchOpportunities, saveOpportunity } from "./services";
import OpportunityDetailModal from "./content/OpportunityDetailModal";
import { EmptySkeleton, ErrorSkeleton, LoadingSkeleton } from "./content/OpportunitySkeleton";

const OpportunitiesKprofle = () => {
  const tabs = ["ALL", "CONTACTS", "CLIENTS", "INTERACTED"];
  const [activeTab, setActiveTab] = useState<OpportunityTabs>("ALL");
  const [threshold, setThreshold] = useState(0);
  const [contractType, setContractType] = useState<ContractType>("ALL");
  const [opportunities, setOpportunities] = useState<OpportunityBase[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const opps = await fetchOpportunities();
      setOpportunities(opps);
    } catch (err) {
      setLoadingError(err instanceof Error ? err.message : 'Unknown error: trying to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

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

  const handleComment = (id: number, comment: string) => {
    console.log(`Commentaire pour l'opportunité ${id}: ${comment}`);
  };

  interface RenderOpportunityListProps {
    opportunities: OpportunityBase[];
    activeTab: OpportunityTabs;
    onSelect: (id: number) => void;
    onComment: (id: number, comment: string) => void;
    onApply: (id: number) => void;
    onUnbookmark: (id: number) => void;
  }

  const RenderOpportunityList = ({ opportunities, activeTab, onSelect, onComment, onApply, onUnbookmark }: RenderOpportunityListProps) => {
    const filteredOpportunities = useMemo(() => {
      let filtered = [...opportunities];

      // Apply tab filter
      switch (activeTab) {
        case "CONTACTS":
          filtered = filtered.filter(o => o.contact_id !== 0 && o.contact_id !== undefined);
          break;
        case "CLIENTS":
          filtered = filtered.filter(o => o.client_id !== "" && o.client_id !== undefined);
          break;
        case "INTERACTED":
          filtered = filtered.filter(o => o.enhancements?.is_saved || o.enhancements?.is_applied);
          filtered = filtered.sort((a, _) => (a.enhancements?.is_applied ? -1 : 1));
          break;
        default:
          break;
      }

      // Apply compatibility threshold filter
      if (threshold > 0) {
        filtered = filtered.filter(o =>
          Math.round(o.enhancements?.total_match_percentage ?? 0) >= threshold
        );
      }

      // Apply contract type filter
      if (contractType !== "ALL") {
        filtered = filtered.filter(o => o.contract_roles.includes(contractType));
      }

      return filtered;
    }, [opportunities, activeTab, threshold, contractType]);

    if (filteredOpportunities.length === 0) {
      return <EmptySkeleton />;
    }

    const getTagColorClass = (score: number) => {
      if (score >= 90) return 'bg-green-300';
      if (score >= 80) return 'bg-teal-300';
      if (score >= 70) return 'bg-blue-300';
      if (score >= 60) return 'bg-indigo-300';
      if (score >= 50) return 'bg-purple-300';
      if (score >= 40) return 'bg-yellow-300';
      if (score >= 30) return 'bg-amber-300';
      if (score >= 20) return 'bg-orange-300';
      if (score >= 10) return 'bg-red-300';
      return 'bg-gray-300';
    };

    const calculateCompetenceScore = (scores: Enhancements | null): number => {
      if (!scores) return 0;
      return (
        (scores.jobs_match_percentage * 0.75) +
        (scores.languages_match_percentage * 0.125) +
        (scores.qualities_match_percentage * 0.025) +
        (scores.tools_match_percentage * 0.075) +
        (scores.authorizations_match_percentage * 0.025)
      );
    };

    const StatusBadge = ({ status }: { status: OpportunityStatus }) => {
      const statusConfig: Record<OpportunityStatus, { text: string; bgColor: string; textColor: string }> = {
        SAVED: {
          text: 'Sauvegardé',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800'
        },
        CLIENT_INTERESTED: {
          text: 'Intérêt du client',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800'
        },
        APPLICATION_SENT: {
          text: 'Demande d\'emploi envoyée',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800'
        },
        VIEWED_BY_CLIENT: {
          text: 'Vu par le client',
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-800'
        },
        IN_REVIEW: {
          text: 'En revue',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800'
        },
        REJECTED: {
          text: 'Rejeté',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800'
        },
        INTERVIEW_PENDING: {
          text: 'Interview en attente',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800'
        },

        OPEN: {
          text: 'Ouverte',
          bgColor: 'bg-teal-100',
          textColor: 'text-teal-800'
        },
        PENDING: {
          text: 'En attente',
          bgColor: 'bg-indigo-100',
          textColor: 'text-indigo-800'
        },
        ACCEPTED: {
          text: 'Accepté',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800'
        },
        ONGOING: {
          text: 'En cours',
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-800'
        },
        CONCLUDED: {
          text: 'Concluée',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800'
        },
        CLOSED: {
          text: 'Fermée',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800'
        }
      };

      const { text, bgColor, textColor } = statusConfig[status];
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
          {text}
        </span>
      );
    };

    if (activeTab !== "INTERACTED") {
      return filteredOpportunities.map((opportunity, index) => (
        <div
          className="bg-slate-50 mb-3 p-4 rounded-xl hover:shadow transition-shadow flex flex-col sm:flex-row gap-4 border-b border-gray-200 relative cursor-pointer"
          key={index}
          onClick={() => select(opportunity.opportunity_id)}
        >
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-full flex-shrink-0 object-cover mx-auto flex opportunitys-center items-center justify-center text-sm text-black font-bold"
            style={{ backgroundColor: getRandomColor(opportunity.title) }}
          >
            {getInitials(opportunity.title)}
          </div>

          {/* Job details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {opportunity.title} <span className="text-sm text-gray-500">{formatTimeAgo(opportunity.created_at)}</span>
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <div className="px-3 rounded-xl bg-[#9FC5C8] text-[#297280] text-sm font-bold">
                  {`${Math.round(opportunity.enhancements?.total_match_percentage ?? 0)}%`}
                </div>
                <span className="text-sm text-gray-700">Correspondent à votre profil</span>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mt-3 line-clamp-2">
              {opportunity.description || "Description non disponible"}
            </p>
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 right-5 flex gap-4">
            {opportunity.enhancements?.is_applied ? (
              <MailX
                className="hover:text-red-500 text-green-600 transition-all duration-200 transform hover:scale-110 mt-1"
                cursor={"pointer"}
                onClick={(e) => {
                  e.stopPropagation();
                  applyOpportunity(opportunity.opportunity_id);
                  loadOpportunities();
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
                  applyOpportunity(opportunity.opportunity_id);
                  loadOpportunities();
                }}
                aria-label="Apply"
                size={30}
              />
            )}
            <Bookmark
              className={`mt-1 transition-all duration-200 ${opportunity.enhancements?.is_saved ? "text-black hover:text-red-500" : "text-black hover:text-yellow-400"
                }`}
              size={30}
              fill={opportunity.enhancements?.is_saved ? "yellow" : "none"}
              onClick={(e) => {
                e.stopPropagation();
                saveOpportunity(opportunity.opportunity_id);
                loadOpportunities();
              }}
            />
          </div>
        </div>
      ));
    } else {
      return (
        <table className="w-full table-auto">
          <thead>
            <tr className="text-gray-500 text-left">
              <td className="p-3 text-center">% Matching</td>
              {/* <td className="p-3">Société</td> */}
              <td className="p-3">Titre</td>
              {/* <td className="p-3">Démarrage</td> */}
              {/* <td className="p-3">Durée</td> */}
              <td className="p-3">Localisation</td>
              <td className="p-3 w-32 text-center">TJM</td>
              <td className="p-3 w-32 text-center">Compétences</td>
              <td className="p-3 w-32 text-center">Séniorité</td>
              <td className="p-3">Commentaire</td>
              <td className="p-3">Statut</td>
              <td className="p-3"></td>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white text-left">
            {filteredOpportunities.map((opportunity, index) => {
              const competenceScore = calculateCompetenceScore(opportunity.enhancements ?? null);
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 text-center"><span className="py-1 px-2 rounded-full bg-blue-100 text-blue-600 text-sm">{Math.round(opportunity.enhancements?.total_match_percentage ?? 0) || "0%"}%</span></td>
                  {/* <td className="p-3"> {opportunity.organization ?? "-"} </td> */}
                  <td className="p-3"> {opportunity.title ?? "-"} </td>
                  {/* <td className="p-3"> {opportunity.crit_start_date ?? "-"} </td> */}
                  {/* <td className="p-3"> {opportunity.duration ?? "-"} </td> */}
                  <td className="p-3"> {opportunity.crit_location ? opportunity.crit_location : opportunity.crit_remote ? "Remote" : "Non disponible"} </td>
                  <td className="p-3">
                    <div className="relative group mx-auto w-6 h-6">
                      <div className={`w-6 h-6 rounded-full border shadow-sm mx-auto ${getTagColorClass(opportunity.enhancements?.rate_match_percentage ?? 0)}`}></div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10 text-nowrap">
                        Score: {Math.round(opportunity.enhancements?.rate_match_percentage ?? 0)}%
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="relative group mx-auto w-6 h-6">
                      <div className={`w-6 h-6 rounded-full border shadow-sm mx-auto ${getTagColorClass(competenceScore)}`}></div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10 text-nowrap">
                        <span className="flex items-center gap-2 justify-between"><p>Score:</p> <p>{Math.round(competenceScore)}%</p></span>
                        <hr />
                        <span className="flex items-center gap-2 justify-between"><p>Emplois:</p> <p>{Math.round(opportunity.enhancements?.jobs_match_percentage ?? 0)}%</p></span>
                        <span className="flex items-center gap-2 justify-between"><p>Langues:</p> <p>{Math.round(opportunity.enhancements?.languages_match_percentage ?? 0)}%</p></span>
                        <span className="flex items-center gap-2 justify-between"><p>Outils:</p> <p>{Math.round(opportunity.enhancements?.tools_match_percentage ?? 0)}%</p></span>
                        <span className="flex items-center gap-2 justify-between"><p>Qualités:</p> <p>{Math.round(opportunity.enhancements?.qualities_match_percentage ?? 0)}%</p></span>
                        <span className="flex items-center gap-2 justify-between"><p>Autorisations:</p> <p>{Math.round(opportunity.enhancements?.authorizations_match_percentage ?? 0)}%</p></span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="relative group mx-auto w-6 h-6">
                      <div className={`w-6 h-6 rounded-full border shadow-sm mx-auto ${getTagColorClass(opportunity.enhancements?.seniority_match_percentage ?? 0)}`}></div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10 text-nowrap">
                        Score: {Math.round(opportunity.enhancements?.seniority_match_percentage ?? 0)}%
                      </div>
                    </div>
                  </td>
                  <td className="p-3"
                    onClick={(e) => e.stopPropagation()}
                  >{opportunity.enhancements?.comment ??
                    <input className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="Ajouter un commentaire..."
                      title="Ce commentaire n'est vu que par vous"
                      onSubmit={(e) => { onComment(opportunity.opportunity_id, e.currentTarget.value) }}
                    />
                    }
                  </td>
                  <td className="p-3">
                    <StatusBadge status={opportunity.enhancements?.status ?? "SAVED"} />
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2 gap-4">
                      <ArrowUpRight
                        className="bg-[#297280] hover:bg-gray-500 text-white rounded-full transition-all duration-200 transform hover:scale-110"
                        cursor={"pointer"}
                        size={30}
                        strokeWidth={2.5}
                        onClick={() => { onSelect(opportunity.opportunity_id) }}
                      />
                      {opportunity.enhancements?.is_applied ? (
                        <MailX
                          className="text-green-500 hover:text-red-500 transition-all duration-200 transform hover:scale-110"
                          cursor={"pointer"}
                          size={30}
                          strokeWidth={2.5}
                          onClick={() => { onApply(opportunity.opportunity_id) }}
                        />
                      ) : (
                        <MailCheck
                          className="text-[#297280] hover:text-green-500 transition-all duration-200 transform hover:scale-110"
                          cursor={"pointer"}
                          size={30}
                          strokeWidth={2.5}
                          onClick={() => { onApply(opportunity.opportunity_id) }}
                        />
                      )}
                      <Trash2
                        className="text-[#297280] hover:text-red-500 transition-all duration-200 transform hover:scale-110"
                        cursor={"pointer"}
                        size={30}
                        strokeWidth={2.5}
                        onClick={() => onUnbookmark(opportunity.opportunity_id)}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="flex items-center space-x-3 my-4">
        <OpportunitiesSVG
          size={35}
          color="#297280"
        />
        <h1 className="text-xl font-semibold text-black">
          Opportunités
        </h1>
      </div>
      {/* Tabs */}
      <div className="flex gap-2 justify-between overflow-x-auto">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as OpportunityTabs)}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm rounded-tl-xl rounded-tr-xl relative ${activeTab !== "ALL" ? "-ml-1" : ""} ${activeTab === tab
                ? 'text-black bg-white shadow-[0_0_8px_0_rgba(0,0,0,0.1)] z-10'
                : 'text-gray-700 bg-slate-100 hover:bg-gray-300'
                }`}
            >
              {tab === "ALL" && <List size={20} />}
              {tab === "CONTACTS" && <Contact size={20} />}
              {tab === "CLIENTS" && <Building2 size={20} />}
              {tab === "INTERACTED" && <Bookmark size={20} />}

              {tab === "ALL" && "Toutes" ||
                tab === "CONTACTS" && "de mes contacts" ||
                tab === "CLIENTS" && "de clients intéressés" ||
                tab === "INTERACTED" && "Sauvegardes & Candidatures"}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          <div className="flex items-center">
            <label htmlFor="matchThreshold" className="text-sm font-medium text-gray-700 mr-3 flex gap-2 whitespace-nowrap">
              Compatibilité: <span className="font-semibold text-teal-600 min-w-[35px] text-right">{threshold}%</span>
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
      {/* Content */}
      <main className="w-full flex flex-col overflow-y-auto bg-white min-h-[75vh] p-6 shadow-md rounded-b-xl">
        {!loading && !loadingError && <RenderOpportunityList opportunities={opportunities} activeTab={activeTab} onSelect={(id: number) => { setSelectedOpportunity(id); setIsVisible(true); }} onComment={(id: number, comment: string) => handleComment(id, comment)} onApply={(id: number) => applyOpportunity(id)} onUnbookmark={(id: number) => saveOpportunity(id)} />}
        {!loading && loadingError && (<><ErrorSkeleton />;<div className="text-center py-4 text-red-500 font-medium"><p>{loadingError}</p></div></>)}
        {loading && <LoadingSkeleton count={1} />}
      </main>
      {selectedOpportunity !== 0 && <OpportunityDetailModal opportunityID={selectedOpportunity} enchantments={opportunities.find(o => o.opportunity_id === selectedOpportunity)!.enhancements!} isVisible={isVisible} handleCloseModal={() => setSelectedOpportunity(0)} onSubmit={() => applyOpportunity(selectedOpportunity)} onSave={() => saveOpportunity(selectedOpportunity)} />}
    </div>
  )
};

export default OpportunitiesKprofle