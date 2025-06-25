// JobOpportunities.tsx - Main container component
import { useEffect, useState } from "react";
import { KPlayerListItem, OpportunityListItem } from "./Opportunities/types";
import { fetchInterestedKplayers, fetchOpportunitiesList, saveOpportunity, submitToOpportunity } from "./Opportunities/services";

import OpportunityList from "./Opportunities/OpportunityList";
import OpportunityDetailModal from "./Opportunities/OpportunityDetailModal";
import KPlayersList from "./Opportunities/KplayersList";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getUserId, isAuthenticated } from "../../../../../utils/jwt";

const JobOpportunities = () => {
  const [activeTab, setActiveTab] = useState("Opportunités");
  const [contractType, setContractType] = useState("ALL");
  const [opportunities, setOpportunities] = useState<OpportunityListItem[]>([]);
  const [contactsOpportunities, setContactsOpportunities] = useState<OpportunityListItem[]>([]);
  const [players, setPlayers] = useState<KPlayerListItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<OpportunityListItem[]>([]);
  const [threshold, setThreshold] = useState(0);
  const [selectedOpportunity, setSelectedOpportunityId] = useState<OpportunityListItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const opportunitiesData = await fetchOpportunitiesList(getUserId() ?? '');
      if (opportunitiesData.length === 0) {
        setLoading(false);
      }

      setOpportunities(opportunitiesData);
      setLoading(false);

      if (isAuthenticated()) {
        // TODO: fetch contacts opportunities
        // setContactsOpportunities()

        try {
          setLoading(true);
          const data = await fetchInterestedKplayers();
          setPlayers(data);
          setError(null);
        } catch (err) {
          setError('Failed to load interested players');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }

    } catch (err) {
      setError(`Failed to fetch opportunities: ${err}`);
      setLoading(false);
    }
  };

  const filterItems = () => {
    let itemsToFilter: OpportunityListItem[] = [];

    switch (activeTab) {
      case "Toutes les opportunités correspondantes":
        itemsToFilter = [...opportunities];
        break;
      case "Opportunités de mes contacts":
        itemsToFilter = [...contactsOpportunities];
        break;
      case "Clients étant intéressés":
        return;
      default:
        itemsToFilter = [...opportunities];
    }

    if (contractType !== "ALL") {
      itemsToFilter = itemsToFilter.filter(item =>
        item.contract_role === contractType
      );
    }

    itemsToFilter = itemsToFilter.filter(item =>
      item.matching?.total_match_percentage !== undefined &&
      item.matching.total_match_percentage >= threshold
    );

    itemsToFilter.sort((a, b) => {
      const aMatchPercentage = a.matching?.total_match_percentage ?? 0;
      const bMatchPercentage = b.matching?.total_match_percentage ?? 0;
      return bMatchPercentage - aMatchPercentage;
    });

    setFilteredItems(itemsToFilter);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    filterItems();
  }, [activeTab, contractType, opportunities, threshold]);

  useEffect(() => {
    if (selectedOpportunity) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedOpportunity]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleOpportunityClick = (selectedOpportunity: OpportunityListItem) => {
    setSelectedOpportunityId(selectedOpportunity);
  };

  const handleCloseModal = () => {
    setSelectedOpportunityId(null);
  };

  const handleSaveOpportunity = (opportunityId: number, is_saved: boolean) => {
    saveOpportunity(opportunityId);

    if (is_saved) {
      setOpportunities(opportunities.map(item =>
        item.opportunity_id === opportunityId ? { ...item, is_saved: true } : item
      ));
      setContactsOpportunities(contactsOpportunities.map(item =>
        item.opportunity_id === opportunityId ? { ...item, is_saved: true } : item
      ));
    } else {
      setOpportunities(opportunities.map(item =>
        item.opportunity_id === opportunityId ? { ...item, is_saved: false } : item
      ));
      setContactsOpportunities(contactsOpportunities.map(item =>
        item.opportunity_id === opportunityId ? { ...item, is_saved: false } : item
      ));
    }
  };

  const handleSubmitOpportunity = (opportunityId: number, is_applied: boolean) => {
    submitToOpportunity(opportunityId);

    if (!is_applied) {
      setOpportunities(opportunities.map(item =>
        item.opportunity_id === opportunityId ? { ...item, is_applied: true } : item
      ));
      setContactsOpportunities(contactsOpportunities.map(item =>
        item.opportunity_id === opportunityId ? { ...item, is_applied: true } : item
      ));
    } else {
      setOpportunities(opportunities.map(item =>
        item.opportunity_id === opportunityId ? { ...item, is_applied: false } : item
      ));
      setContactsOpportunities(contactsOpportunities.map(item =>
        item.opportunity_id === opportunityId ? { ...item, is_applied: false } : item
      ));
    }
  };

  const handleThresholdChange = (threshold: number) => {
    setThreshold(threshold);
  }

  return (
    <div className="mt-10">
      <div className="relative shadow-sm rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          {/* Tabs with spacing */}
          <div className="flex gap-2 relative">
            <button
              style={{
                boxShadow: activeTab === "Opportunités"
                  ? "0 -4px 4px -2px #6166611c, 4px 0 4px -2px #61666100, -4px 0 4px -2px #676d6724"
                  : "none"
              }}
              className={`px-8 py-3 flex gap-2 font-medium transition-all relative ${activeTab === "Opportunités"
                ? "text-gray-900 bg-white rounded-t-xl z-10"
                : "text-gray-400"
                }`}
              onClick={() => handleTabChange("Opportunités")}
            >
              Toutes les opportunités correspondantes
            </button>
            <button
              style={{
                boxShadow: activeTab === "Opportunités sauvegardées"
                  ? "0 -4px 4px -2px #6166611c, 4px 0 4px -2px #61666100, -4px 0 4px -2px #676d6724"
                  : "none"
              }}
              className={`px-8 flex gap-2 py-3 font-medium transition-all relative ${activeTab === "Opportunités sauvegardées"
                ? "text-gray-900 bg-white rounded-t-xl z-10"
                : "text-gray-400"
                }`}
              onClick={() => handleTabChange("Opportunités sauvegardées")}
            >
              Opportunités de mes contacts
            </button>

            <button
              style={{
                boxShadow: activeTab === "Clients étant intéressés"
                  ? "0 -4px 4px -2px #6166611c, 4px 0 4px -2px #61666100, -4px 0 4px -2px #676d6724"
                  : "none"
              }}
              className={`px-8 py-3 flex gap-2 font-medium transition-all relative ${activeTab === "Clients étant intéressés"
                ? "text-gray-900 bg-white rounded-t-xl z-10"
                : "text-gray-400"
                }`}
              onClick={() => handleTabChange("Clients étant intéressés")}
            >
              Clients étant intéressés
            </button>
          </div>

          {/* Threshold Filter - Added this section */}
          <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-between"  >
            <div className="flex  justify-center items-center max-w-md">
              <label htmlFor="matchThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                Filtre de compatibilité: <span className="font-semibold ml-3 text-teal-600">{threshold}%</span>
              </label>
              <div className="flex items-center ">
                <button
                  onClick={() => handleThresholdChange(Math.max(0, threshold - 1))}
                  className="text-gray-500 hover:text-teal-500 focus:outline-none"
                  aria-label="Decrease threshold"
                >
                  <ChevronLeft />
                </button>
                <input
                  type="range"
                  id="matchThreshold"
                  min="0"
                  max="100"
                  value={threshold}
                  onChange={(e) => handleThresholdChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-xl appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-500"
                />
                <button
                  onClick={() => handleThresholdChange(Math.min(100, threshold + 1))}
                  className="text-gray-500 hover:text-teal-500 focus:outline-none"
                  aria-label="Increase threshold"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>

          {/* Category Selector */}
          <select
            className="ml-auto px-4 py-2 font-medium text-gray-500 border border-gray-200 rounded-md focus:ring-teal-500 focus:border-teal-500"
            value={contractType}
            onChange={(e) => setContractType(e.target.value)}
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

        {/* Opportunity List Component */}
        <div className="bg-white" style={{ borderRadius: "0px 0px 20px 20px", boxShadow: "1px 10px 10px rgba(96, 105, 110, 0.29)" }}>
          {activeTab === "Clients étant intéressés" ? (
            <KPlayersList
              players={players}
              loading={loading}
              error={error}
            />
          ) : (
            <OpportunityList
              items={filteredItems}
              loading={loading}
              error={error}
              onItemClick={handleOpportunityClick}
              onSaveOpportunity={handleSaveOpportunity}
              onSubmitOpportunity={handleSubmitOpportunity}
            />
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunityId={selectedOpportunity.opportunity_id}
          matchings={selectedOpportunity.matching}
          onClose={handleCloseModal}
          is_saved={selectedOpportunity.is_saved}
          is_applied={selectedOpportunity.is_applied}
          onSaveOpportunity={handleSaveOpportunity}
          onSubmitOpportunity={handleSubmitOpportunity}
        />
      )}
    </div>
  );
};

export default JobOpportunities; 