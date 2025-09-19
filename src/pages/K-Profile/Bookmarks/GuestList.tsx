import { useEffect, useState } from "react";
import { Enhancements, OpportunityBase } from "./types";
import { OpportunitiesSVG } from "../../components/SVGcomponents";
import { fetchOpportunities } from "./services";
import { fetchGuestMatches } from "../Competence/services";
import OpportunityDetailModal from "./content/OpportunityDetailModal";

const GuestList = () => {
  const [opportunities, setOpportunities] = useState<OpportunityBase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

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
      {loading && <div className="space-y-6 p-6 max-h-[70vh] overflow-y-auto">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-white p-4 border-b border-gray-200 relative flex flex-col sm:flex-row gap-4"
          >
            <div className="w-16 h-16 rounded-full flex-shrink-0 mx-auto bg-gray-200 animate-pulse"></div>
            <div className="flex-1 min-w-0 space-y-3">
              <div className="space-y-2">
                <div className="h-6 w-3/4 rounded bg-gray-300"></div>
                <div className="h-4 w-1/4 rounded bg-gray-200"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-16 rounded-xl bg-gray-300"></div>
                <div className="h-4 w-1/3 rounded bg-gray-200"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-gray-200"></div>
                <div className="h-4 w-5/6 rounded bg-gray-200"></div>
              </div>
            </div>
            <div className="absolute top-2 right-3 flex gap-4">
              <div className="h-6 w-6 rounded-md bg-gray-300"></div>
              <div className="h-6 w-6 rounded-md bg-gray-300"></div>
            </div>
          </div>
        ))}
      </div>}

      {!loading && error && <>
        <div className="space-y-6 p-6 max-h-[70vh] overflow-y-auto">
          <div className="bg-white p-4 border-b border-red-500 relative flex flex-col sm:flex-row gap-4">
            <div className="w-16 h-16 rounded-full flex-shrink-0 mx-auto bg-red-200 animate-pulse"></div>
            <div className="flex-1 min-w-0 space-y-3">
              <div className="space-y-2">
                <div className="h-6 w-3/4 rounded bg-red-300"></div>
                <div className="h-4 w-1/4 rounded bg-red-200"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-16 rounded-xl bg-red-300"></div>
                <div className="h-4 w-1/3 rounded bg-red-200"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-red-200"></div>
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
      </>}

      {!loading && !error && <main className="w-full flex flex-col overflow-y-auto bg-white min-h-[75vh] p-6 shadow-md rounded-xl">
        {opportunities.map((opportunity, index) => (
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
          </div>
        ))}
      </main>}

      {selectedOpportunity !== 0 && <OpportunityDetailModal
        opportunityID={selectedOpportunity}
        enchantments={opportunities.find(o => o.opportunity_id === selectedOpportunity)!.enhancements!}
        isVisible={isVisible}
        handleCloseModal={() => setSelectedOpportunity(0)}
        guest={true}
      />}
    </div>
  );
};

export default GuestList