// JobOpportunities.tsx - Main container component
import { useEffect, useState } from "react";
import { OpportunityListItem } from "./opportunities/types";
import { fetchOpportunitiesList, fetchSavedOpportunityIds } from "./opportunities/services";

import OpportunityList from "./opportunities/OpportunityList";
import OpportunityDetailModal from "./opportunities/OpportunityDetailModal";
import { getUserId } from "../../../../utils/jwt";

const JobOpportunities = () => {
  const [activeTab, setActiveTab] = useState("Opportunités");
  const [contractType, setContractType] = useState("all");
  const [opportunityItems, setOpportunityItems] = useState<OpportunityListItem[]>([]);
  const [savedOpportunityItems, setSavedOpportunityItems] = useState<OpportunityListItem[]>([]);
  const [contactOpportunityItems, _setContactOpportunityItems] = useState<OpportunityListItem[]>([]);
  const [currentItems, setCurrentItems] = useState<OpportunityListItem[]>([]);
  const [selectedOpportunity, setSelectedOpportunityId] = useState<OpportunityListItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    updateCurrentItems();
  }, [activeTab, opportunityItems, savedOpportunityItems, contactOpportunityItems]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const opportunitiesData = await fetchOpportunitiesList(getUserId() ?? '');
      const savedOpportunityIds = await fetchSavedOpportunityIds();


      if (opportunitiesData.length === 0) {
        setOpportunityItems([]);
        setSavedOpportunityItems([]);
        setError(`Failed to fetch opportunities. No record found!`);
        setLoading(false);
        return;
      }

      if (savedOpportunityIds.length === 0) {
        setSavedOpportunityItems([]);
      }

      // Process opportunitiesData if valid
      const listItems = opportunitiesData.map(opp => ({
        opportunity_id: opp.opportunity_id,
        title: opp.title,
        description: opp.description,
        contract_role: opp.contract_role,
        created_at: opp.created_at,
        crit_location: opp.crit_location,
        crit_remote: opp.crit_remote,
        matching: opp.matching,
        is_saved: opp.is_saved,
        is_applied: opp.is_applied
      }));

      setOpportunityItems(listItems);

      // Filter saved items only if savedOpportunityIds is valid
      if (savedOpportunityIds && savedOpportunityIds.length > 0) {
        const savedItems = listItems.filter(item =>
          savedOpportunityIds.includes(item.opportunity_id)
        );
        setSavedOpportunityItems(savedItems);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(`Failed to fetch opportunities. Please try again later: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentItems = () => {
    switch (activeTab) {
      case "Opportunités":
        setCurrentItems(opportunityItems);
        break;
      case "Opportunités sauvegardées":
        setCurrentItems(savedOpportunityItems);
        break;
      case "Opportunités selon mes contacts":
        setCurrentItems(contactOpportunityItems);
        break;
      default:
        setCurrentItems(opportunityItems);
    }
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
              Opportunités
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
              Opportunités sauvegardées
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
              Opportunités selon mes contacts
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
            items={currentItems}
            loading={loading}
            error={error}
            onItemClick={handleOpportunityClick}
          />
        </div>
      </div>

      {/* Detail Modal - Only rendered when an opportunity is selected */}
      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunityId={selectedOpportunity.opportunity_id}
          opportunityMatch={selectedOpportunity.matching?.total_match_percentage ?? 0}
          onClose={handleCloseModal}
          is_saved={selectedOpportunity.is_saved}
          is_applied={selectedOpportunity.is_applied}
        />
      )}
    </div>
  );
};

export default JobOpportunities; 