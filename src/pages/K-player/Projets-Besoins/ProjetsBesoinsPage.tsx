import { Plus, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchOpportunities } from './services';
import { Opportunity } from './types';

import ProjectDetails from './ProjectDetailsContent/ProjectDetails';
import CreateProject from './CreateProjectContent/CreateProject';
import ProjectsList from './CreateProjectContent/projectsList';

type ViewState =
  | { type: 'LIST'; activeTab: 'personal' | 'organization' | 'network' }
  | { type: 'CREATE' }
  | { type: 'DETAILS'; opportunityId: string };

const ProjetsBesoinsPage = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewState, setViewState] = useState<ViewState>({ type: 'LIST', activeTab: 'personal' });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const filter = viewState.type === 'LIST' ? viewState.activeTab : 'personal';
        const filteredData = await fetchOpportunities(filter);
        setOpportunities(filteredData);
        applyFilter(filteredData, viewState.type === 'LIST' ? viewState.activeTab : 'personal');
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [viewState.type === 'LIST' ? viewState.activeTab : null]);

  // TODO: clean up
  const applyFilter = (data: Opportunity[], _tab: 'personal' | 'organization' | 'network') => {
    // This is where you would implement your actual filtering logic
    // For now, we'll just return all data as a placeholder
    setFilteredOpportunities(data);

    // Example filtering logic (you'll need to replace with your actual criteria):
    /*
    switch (tab) {
      case 'personal':
        setFilteredOpportunities(data.filter(opp => opp.type === 'personal'));
        break;
      case 'organization':
        setFilteredOpportunities(data.filter(opp => opp.type === 'organization'));
        break;
      case 'network':
        setFilteredOpportunities(data.filter(opp => opp.type === 'network'));
        break;
      default:
        setFilteredOpportunities(data);
    }
    */
  };

  const handleBackToList = () => setViewState(
    {
      type: 'LIST',
      activeTab: viewState.type === 'LIST' ? viewState.activeTab : 'personal'
    }
  );

  const handleCreateNew = () => setViewState(
    { type: 'CREATE' }
  );

  const handleViewDetails = (opportunity: Opportunity) =>
    setViewState(
      {
        type: 'DETAILS',
        opportunityId: opportunity.opportunity_id.toString()
      }
    );

  const handleTabChange = (tab: 'personal' | 'organization' | 'network') => {
    if (viewState.type === 'LIST') {
      setViewState({ ...viewState, activeTab: tab });
      applyFilter(opportunities, tab);
    }
  };

  return (
    <div className="bg-gray-100">
      {(() => {
        switch (viewState.type) {
          case 'CREATE':
            return <CreateProject onBack={handleBackToList} />;
          case 'DETAILS':
            return <ProjectDetails
              opportunity_id={viewState.opportunityId}
              onBack={handleBackToList}
            />;
          case 'LIST':
          default:
            return (
              <div className="p-2 w-full mx-auto ml-2">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3 mb-2">
                      <Search className="" style={{ color: "#215A96" }} size={40} />
                      <h1 className="text-xl font-semibold">Projets/Besoins</h1>
                    </div>

                    <div className="flex mx-auto rounded-full">
                      <button
                        onClick={() => handleTabChange('personal')}
                        className={`px-6 py-2 text-sm border ${viewState.activeTab === 'personal'
                          ? 'text-blue-700 bg-blue-200'
                          : 'text-gray-600 bg-gray-50'
                          }`}
                        style={{ borderRadius: "20px 0 0 20px", border: "solid 1px" }}
                      >
                        Mes besoins
                      </button>
                      <button
                        onClick={() => handleTabChange('organization')}
                        className={`px-6 py-2 text-sm border ${viewState.activeTab === 'organization'
                          ? 'text-blue-700 bg-blue-200'
                          : 'text-gray-600 bg-gray-50'
                          }`}
                        style={{ border: "solid 1px" }}
                      >
                        Besoins de ma société
                      </button>
                      <button
                        onClick={() => handleTabChange('network')}
                        className={`px-6 py-2 text-sm border ${viewState.activeTab === 'network'
                          ? 'text-blue-700 bg-blue-200'
                          : 'text-gray-600 bg-gray-50'
                          }`}
                        style={{ borderRadius: "0 20px 20px 0", border: "solid 1px" }}
                      >
                        Besoins de mon réseau
                      </button>
                    </div>

                    <button
                      onClick={handleCreateNew}
                      className="flex items-center gap-2 text-white px-4 py-2 rounded-xl ml-auto"
                      style={{ width: "12rem", backgroundColor: "#215A96" }}
                    >
                      <Plus size={15} />
                      Définir un besoin
                    </button>
                  </div>
                </div>

                <ProjectsList
                  Opportunities={filteredOpportunities}
                  onSelectOpportunity={handleViewDetails}
                  loading={loading}
                  error={error || ""}
                />
              </div>
            );
        }
      })()}
    </div>
  );
};

export default ProjetsBesoinsPage;