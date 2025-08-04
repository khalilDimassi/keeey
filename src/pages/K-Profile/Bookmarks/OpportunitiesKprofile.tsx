import { useEffect, useMemo, useState } from "react";
import { OpportunitiesSVG } from "../../components/SVGcomponents";
import { OpportunityBase, OpportunityTabs } from "./types";
import { List, Contact, Building2, Bookmark, ChevronLeft, ChevronRight, MailCheck, MailX } from "lucide-react";
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

  const RenderOpportunityList = ({ opportunities, activeTab, select }: { opportunities: OpportunityBase[], activeTab: OpportunityTabs, select: (opportunity_id: number) => void }) => {
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
        {!loading && !loadingError && <RenderOpportunityList opportunities={opportunities} activeTab={activeTab} select={(id: number) => { setSelectedOpportunity(id); setIsVisible(true); }} />}
        {!loading && loadingError && (<><ErrorSkeleton />;<div className="text-center py-4 text-red-500 font-medium"><p>{loadingError}</p></div></>)}
        {loading && <LoadingSkeleton count={1} />}
      </main>
      {selectedOpportunity !== 0 && <OpportunityDetailModal opportunityID={selectedOpportunity} enchantments={opportunities.find(o => o.opportunity_id === selectedOpportunity)!.enhancements!} isVisible={isVisible} handleCloseModal={() => setSelectedOpportunity(0)} onSubmit={() => applyOpportunity(selectedOpportunity)} onSave={() => saveOpportunity(selectedOpportunity)} />}
    </div>
  )
};

export default OpportunitiesKprofle