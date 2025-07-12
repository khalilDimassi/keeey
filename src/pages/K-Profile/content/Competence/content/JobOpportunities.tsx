import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { OpportunityListItem } from "./Opportunities/types";
import { fetchOpportunitiesList } from "./Opportunities/services";
import OpportunityList from "./Opportunities/OpportunityList";
import OpportunityDetailModal from "./Opportunities/OpportunityDetailModal";
import { getUserId } from "../../../../../utils/jwt";
import useOpportunitiesFilter, { ContractType, OpportunityTab } from "../hooks";

const JobOpportunities = () => {
  const [activeTab, setActiveTab] = useState<OpportunityTab>("Opportunités");
  const [contractType, setContractType] = useState<ContractType>("ALL");
  const [threshold, setThreshold] = useState(0);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityListItem | null>(null);
  const { loading, error, filteredItems, setRawOpportunities } = useOpportunitiesFilter({ activeTab, contractType, threshold });

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchOpportunitiesList(getUserId() ?? "");
        setRawOpportunities(data);
      } catch (err) {
        // Let the hook surface the error
        console.error(err);
      }
    })();
  }, [setRawOpportunities]);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", !!selectedOpportunity);
    return () => document.body.classList.remove("overflow-hidden");
  }, [selectedOpportunity]);

  const handleSaveOpportunity = (opportunityId: number, is_saved: boolean) => {
    setRawOpportunities(prev =>
      prev.map(item =>
        item.opportunity_id === opportunityId
          ? { ...item, is_saved: !is_saved }
          : item
      )
    );

    console.log("Opportunity saved:", opportunityId, is_saved);
  };


  const handleSubmitOpportunity = (opportunityId: number, is_applied: boolean) =>

    setRawOpportunities(prev =>
      prev.map(item =>
        item.opportunity_id === opportunityId
          ? { ...item, is_applied: !is_applied }
          : item
      )
    );

  return (
    <div className="mt-10">
      <div className="relative shadow-sm rounded-lg">
        <div className="flex items-center justify-between">
          {/* Tabs */}
          <div className="flex gap-2 h-16">
            {(["Opportunités",
              "Opportunités de mes contacts",
              "Clients étant intéressés"] as OpportunityTab[]).map(tab => (
                <button
                  key={tab}
                  style={{
                    boxShadow:
                      activeTab === tab
                        ? "0 -4px 4px -2px #6166611c, 4px 0 4px -2px #61666100, -4px 0 4px -2px #676d6724"
                        : "none"
                  }}
                  className={`px-8 py-3 flex gap-2 items-center font-medium transition-all relative ${activeTab === tab
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

          {/* Filter Toolbar */}
          <div
            className="flex items-center gap-4 bg-white h-16 border-t border-gray-100
               px-6 py-4 rounded-t-xl shadow-sm"
            style={{
              boxShadow:
                "0 -4px 4px -2px #6166611c, 4px 0 4px -2px #61666100, -4px 0 4px -2px #676d6724"
            }}
          >
            <div className="flex items-center">
              <label
                htmlFor="matchThreshold"
                className="text-sm font-medium text-gray-700 mr-3 whitespace-nowrap"
              >
                Compatibilité:
                <span className="font-semibold ml-2 text-teal-600">{threshold}%</span>
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

            {/* Contract selector */}
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

        {/* List */}
        <div className="overflow-y-auto bg-white rounded-b-xl shadow-lg p-6">
          <OpportunityList
            items={filteredItems}
            loading={loading}
            error={error}
            onItemClick={setSelectedOpportunity}
            onSaveOpportunity={handleSaveOpportunity}
            onSubmitOpportunity={handleSubmitOpportunity}
          />
        </div>
      </div>

      {/* Detail modal */}
      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunityId={selectedOpportunity.opportunity_id}
          matchings={selectedOpportunity.matching}
          onClose={() => setSelectedOpportunity(null)}
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
