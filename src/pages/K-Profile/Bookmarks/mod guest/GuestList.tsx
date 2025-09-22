import { useEffect, useState, useMemo } from "react";
import { Bookmark, Building2, ChevronLeft, ChevronRight, Contact, List } from "lucide-react";
import { OpportunitiesSVG } from "../../../components/SVGcomponents";
import { fetchGuestMatches } from "../../Competence/services";
import { fetchOpportunities } from "../services";
import { OpportunityBase, Enhancements, OpportunityTabs } from "../types";

import OpportunityDetailModal from "../content/OpportunityDetailModal";


type ContractType = "ALL" | "CDI" | "CDD" | "CDI-C" | "CONSULTANT" | "PORTAGE" | "FREELANCE";

const GuestList = () => {
  const tabs = ["ALL", "CONTACTS", "CLIENTS", "INTERACTED"];
  const [activeTab, setActiveTab] = useState<OpportunityTabs>("ALL");
  const [opportunities, setOpportunities] = useState<OpportunityBase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // 🔹 Filtering states
  const [threshold, setThreshold] = useState(0);
  const [contractType, setContractType] = useState<ContractType>("ALL");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchOpportunities()
      .then(opps => {
        setOpportunities(opps);
      })
      .catch(err => {
        setOpportunities([]);
        setError(err instanceof Error ? err.message : 'Unknown error: trying to load opportunities');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (opportunities.length > 0) {
      fetchGuestMatches()
        .then((guestData) => {
          const matchMap = new Map(
            guestData.matchings.map(m => [m.opportunity_id, m.matching_result])
          );
          setOpportunities(prev =>
            prev.map(opportunity => {
              const match = matchMap.get(opportunity.opportunity_id);
              return match
                ? { ...opportunity, enhancements: { ...match } as Enhancements }
                : { ...opportunity, enhancements: null };
            })
          );
        })
        .catch((error) => console.error("Failed to fetch guest data:", error));
    }
  }, [opportunities.length]);

  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter(opportunity => {
        const matchPercent = opportunity.enhancements?.total_match_percentage ?? 0;
        const passThreshold = matchPercent >= threshold;
        const passContract = contractType === "ALL" || opportunity.contract_roles.includes(contractType);
        return passThreshold && passContract;
      })
      .sort((a, b) => {
        const matchA = a.enhancements?.total_match_percentage ?? 0;
        const matchB = b.enhancements?.total_match_percentage ?? 0;
        return matchB - matchA;
      });
  }, [opportunities, threshold, contractType]);


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

      <div className="flex gap-4 justify-between items-center">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as OpportunityTabs)}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm rounded-tl-xl rounded-tr-xl relative ${activeTab !== "ALL" ? "-ml-1" : ""} ${activeTab === tab
                ? 'text-black bg-white shadow-[0_-6px_12px_-2px_rgba(0,0,0,0.08)] z-10'
                : 'text-gray-700 bg-slate-100 hover:bg-gray-300'
                }`}
            >
              {tab === "ALL" && <List size={20} />}
              {tab === "CONTACTS" && <Contact size={20} />}
              {tab === "CLIENTS" && <Building2 size={20} />}
              {tab === "INTERACTED" && <Bookmark size={20} />}
              {tab === "ALL" && "Toutes" || tab === "CONTACTS" && "de mes contacts" || tab === "CLIENTS" && "de clients intéressés" || tab === "INTERACTED" && "Sauvegardes & Candidatures"}
            </button>
          ))}
        </div>
        <div className="flex gap-4 items-center">
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
            <input id="matchThreshold"
              type="range"
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

      {loading && (<div className="space-y-6 p-6 max-h-[70vh] overflow-y-auto">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white p-4 border-b border-gray-200 relative flex flex-col sm:flex-row gap-4" >
            <div className="w-16 h-16 rounded-full flex-shrink-0 mx-auto bg-gray-200 animate-pulse"></div>
            <div className="flex-1 min-w-0 space-y-3"> <div className="space-y-2">
              <div className="h-6 w-3/4 rounded bg-gray-300"></div>
              <div className="h-4 w-1/4 rounded bg-gray-200"></div>
            </div> <div className="flex items-center gap-2">
                <div className="h-6 w-16 rounded-xl bg-gray-300"></div>
                <div className="h-4 w-1/3 rounded bg-gray-200"></div>
              </div> <div className="space-y-2">
                <div className="h-4 w-full rounded bg-gray-200"></div>
                <div className="h-4 w-5/6 rounded bg-gray-200"></div>
              </div> </div> <div className="absolute top-2 right-3 flex gap-4">
              <div className="h-6 w-6 rounded-md bg-gray-300"></div>
              <div className="h-6 w-6 rounded-md bg-gray-300"></div>
            </div>
          </div>
        ))}
      </div>
      )}

      {!loading && error && (<>
        <div className="space-y-6 p-6 max-h-[70vh] overflow-y-auto">
          <div className="bg-white p-4 border-b border-red-500 relative flex flex-col sm:flex-row gap-4">
            <div className="w-16 h-16 rounded-full flex-shrink-0 mx-auto bg-red-200 animate-pulse"></div>
            <div className="flex-1 min-w-0 space-y-3"> <div className="space-y-2">
              <div className="h-6 w-3/4 rounded bg-red-300"></div>
              <div className="h-4 w-1/4 rounded bg-red-200"></div>
            </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-16 rounded-xl bg-red-300"></div>
                <div className="h-4 w-1/3 rounded bg-red-200"></div> </div>
              <div className="space-y-2"> <div className="h-4 w-full rounded bg-red-200"></div>
                <div className="h-4 w-5/6 rounded bg-red-200">
                  <span className="sr-only">Error loading content</span>
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-3 flex gap-4">
              <div className="h-6 w-6 rounded-md bg-red-300"></div>
              <div className="h-6 w-6 rounded-md bg-red-300"></div>
            </div>
          </div>
        </div>
        <div className="text-center py-4 text-red-500 font-medium"><p>{error}</p></div>
      </>
      )}

      {!loading && !error && activeTab != "ALL" && (
        <main className="w-full flex flex-col overflow-y-auto bg-white min-h-[75vh] p-6 shadow-md rounded-b-xl">
          <p className="text-center mt-8 py-4 text-gray-500 font-medium">Créez un compte pour accéder à cette fonctionnalité!</p>
        </main>
      )}

      {!loading && !error && activeTab === "ALL" && (
        <main className="w-full flex flex-col overflow-y-auto bg-white min-h-[75vh] p-6 shadow-md rounded-b-xl">
          {filteredOpportunities.map((opportunity, index) => (
            <div
              className="bg-slate-50 mb-3 p-4 rounded-xl hover:shadow transition-shadow flex flex-col sm:flex-row gap-4 border-b border-gray-200 relative cursor-pointer"
              key={index}
              onClick={() => {
                setSelectedOpportunity(opportunity.opportunity_id)
                setIsVisible(true)
              }}
            >
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-full flex-shrink-0 object-cover mx-auto flex items-center justify-center text-sm text-black font-bold"
                style={{ backgroundColor: getRandomColor(opportunity.title) }}
              >
                {getInitials(opportunity.title)}
              </div>

              {/* Job details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {opportunity.title}{" "}
                    <span className="text-sm text-gray-500">{formatTimeAgo(opportunity.created_at)}</span>
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
            </div>
          ))}
        </main>
      )}

      {selectedOpportunity !== 0 && (
        <OpportunityDetailModal
          opportunityID={selectedOpportunity}
          enchantments={opportunities.find(o => o.opportunity_id === selectedOpportunity)!.enhancements ?? {} as Enhancements}
          isVisible={isVisible}
          handleCloseModal={() => setSelectedOpportunity(0)}
          guest={true}
        />
      )}
    </div>
  );
};

export default GuestList;
