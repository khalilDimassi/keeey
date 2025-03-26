// JobOpportunities.tsx - Main container component
import { useEffect, useState } from "react";
import { OpportunityListItem } from "./opportunities/types";
import { fetchOpportunitiesList, fetchSavedOpportunityIds, saveOpportunity, submitToOpportunity } from "./opportunities/services";

import OpportunityList from "./opportunities/OpportunityList";
import OpportunityDetailModal from "./opportunities/OpportunityDetailModal";
import { getUserId } from "../../../../utils/jwt";

const JobOpportunities = () => {
  const [activeTab, setActiveTab] = useState("Opportunités");
  const [contractType, setContractType] = useState("all");
  const [allOpportunities, setAllOpportunities] = useState<OpportunityListItem[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<OpportunityListItem[]>([]);
  const [contactOpportunities, setContactOpportunities] = useState<OpportunityListItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<OpportunityListItem[]>([]);
  const [selectedOpportunity, setSelectedOpportunityId] = useState<OpportunityListItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    filterAndSortItems();
  }, [activeTab, contractType, allOpportunities, savedOpportunities, contactOpportunities]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const opportunitiesData = await fetchOpportunitiesList(getUserId() ?? '');
      const savedOpportunityIds = await fetchSavedOpportunityIds();

      if (opportunitiesData.length === 0) {
        setError(`Failed to fetch opportunities. No record found!`);
        setLoading(false);
        return;
      }

      // Process opportunitiesData
      const processedItems = opportunitiesData.map(opp => ({
        ...opp,
        is_saved: savedOpportunityIds.includes(opp.opportunity_id)
      }));

      // Sort by matching percentage (highest to lowest)
      processedItems.sort((a, b) =>
        (b.matching?.total_match_percentage || 0) - (a.matching?.total_match_percentage || 0)
      );

      // Separate into different lists
      const allItems = processedItems.filter(item => !item.is_saved);
      const savedItems = processedItems.filter(item => item.is_saved);

      setAllOpportunities(allItems);
      setSavedOpportunities(savedItems);
      setContactOpportunities([]);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(`Failed to fetch opportunities. Please try again later: ${err}`);
      setLoading(false);
    }
  };

  const filterAndSortItems = () => {
    let itemsToFilter: OpportunityListItem[] = [];

    switch (activeTab) {
      case "Opportunités":
        itemsToFilter = [...allOpportunities];
        break;
      case "Opportunités sauvegardées":
        itemsToFilter = [...savedOpportunities];
        break;
      case "Opportunités selon mes contacts":
        itemsToFilter = [...contactOpportunities];
        break;
      default:
        itemsToFilter = [...allOpportunities];
    }

    // Apply contract type filter
    if (contractType !== "all") {
      itemsToFilter = itemsToFilter.filter(item =>
        item.contract_role === contractType
      );
    }

    setFilteredItems(itemsToFilter);
  };

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
    if (is_saved) {
      // Moving from all to saved
      const opportunity = allOpportunities.find(item => item.opportunity_id === opportunityId);
      if (opportunity) {
        setAllOpportunities(allOpportunities.filter(item => item.opportunity_id !== opportunityId));
        setSavedOpportunities([...savedOpportunities, { ...opportunity, is_saved: true }]);
      }
    } else {
      // Moving from saved to all
      const opportunity = savedOpportunities.find(item => item.opportunity_id === opportunityId);
      if (opportunity) {
        setSavedOpportunities(savedOpportunities.filter(item => item.opportunity_id !== opportunityId));
        setAllOpportunities([...allOpportunities, { ...opportunity, is_saved: false }]);
      }
    }

    saveOpportunity(opportunityId);
  };

  const handleSubmitOpportunity = (opportunityId: number, is_applied: boolean) => {
    if (!is_applied) {
      // Update the is_applied status in both lists if needed
      setAllOpportunities(allOpportunities.map(item =>
        item.opportunity_id === opportunityId ? { ...item, is_applied: true } : item
      ));
      setSavedOpportunities(savedOpportunities.map(item =>
        item.opportunity_id === opportunityId ? { ...item, is_applied: true } : item
      ));
    } else {
      setAllOpportunities(allOpportunities.map(item =>
        item.opportunity_id === opportunityId ? { ...item, is_applied: false } : item
      ));
      setSavedOpportunities(savedOpportunities.map(item =>
        item.opportunity_id === opportunityId ? { ...item, is_applied: false } : item
      ));
    }

    submitToOpportunity(opportunityId);
  };

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
                  ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(103, 109, 103, 0.14)"
                  : "none"
              }}
              className={`px-8 py-3 flex gap-2 font-medium transition-all relative ${activeTab === "Opportunités"
                ? "text-gray-900 bg-white rounded-t-xl z-10"
                : "text-gray-400 bg-gray-100/50"
                }`}
              onClick={() => handleTabChange("Opportunités")}
            >
              Toutes les opportunités correspondantes
            </button>
            <button
              style={{
                boxShadow: activeTab === "Opportunités sauvegardées"
                  ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(40, 44, 40, 0.14)"
                  : "none"
              }}
              className={`px-8 flex gap-2 py-3 font-medium transition-all relative ${activeTab === "Opportunités sauvegardées"
                ? "text-gray-900 bg-white rounded-t-xl z-10"
                : "text-gray-400 bg-gray-100/50"
                }`}
              onClick={() => handleTabChange("Opportunités sauvegardées")}
            >
              Opportunités de mes contacts
            </button>
            <button
              style={{
                boxShadow: activeTab === "Opportunités selon mes contacts"
                  ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(103, 109, 103, 0.14)"
                  : "none"
              }}
              className={`px-8 py-3 flex gap-2 font-medium transition-all relative ${activeTab === "Opportunités selon mes contacts"
                ? "text-gray-900 bg-white rounded-t-xl z-10"
                : "text-gray-400 bg-gray-100/50"
                }`}
              onClick={() => handleTabChange("Opportunités selon mes contacts")}
            >
              Clients étant intéressés
            </button>
          </div>

          {/* Category Selector */}
          <select
            className="ml-auto px-4 py-2 font-medium text-gray-500 border border-gray-200 rounded-md focus:ring-teal-500 focus:border-teal-500"
            value={contractType}
            onChange={(e) => setContractType(e.target.value)}
          >
            <option value="all">Tous les contrats</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>

        {/* Opportunity List Component */}
        <div className="bg-white" style={{ borderRadius: "0px 0px 20px 20px", boxShadow: "1px 10px 10px rgba(96, 105, 110, 0.29)" }}>
          <OpportunityList
            items={filteredItems}
            loading={loading}
            error={error}
            onItemClick={handleOpportunityClick}
            onSaveOpportunity={handleSaveOpportunity}
            onSubmitOpportunity={handleSubmitOpportunity}
          />
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunityId={selectedOpportunity.opportunity_id}
          opportunityMatch={selectedOpportunity.matching?.total_match_percentage ?? 0}
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