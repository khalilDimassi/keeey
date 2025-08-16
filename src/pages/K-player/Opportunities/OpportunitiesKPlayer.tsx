import { Plus, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOpportunities } from './services';
import { Opportunity } from './types';

import OpportunitiesList from './content/projectsList';

const OpportunitiesListPage = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'organization' | 'network'>('personal');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchOpportunities()
      .then(data => { setOpportunities(data); })
      .catch(error => {
        setOpportunities([]);
        setError(error instanceof Error ? error.message : "An unknown error occurred.");
      })
      .finally(() => { setLoading(false); });
  }, []);


  return (
    <div className="bg-gray-100">
      <div className="p-2 w-full mx-auto ml-2">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3 mb-2">
              <Search className="" style={{ color: "#215A96" }} size={40} />
              <h1 className="text-xl font-semibold">Projets/Besoins</h1>
            </div>
            <div className="flex mx-auto rounded-full">
              <button
                onClick={() => setActiveTab('personal')}
                className={`px-6 py-2 text-sm border ${activeTab === 'personal'
                  ? 'text-blue-700 bg-blue-200'
                  : 'text-gray-600 bg-gray-50'
                  }`}
                style={{ borderRadius: "20px 0 0 20px", border: "solid 1px" }}
              >
                Mes besoins
              </button>
              <button
                onClick={() => setActiveTab('organization')}
                className={`px-6 py-2 text-sm border ${activeTab === 'organization'
                  ? 'text-blue-700 bg-blue-200'
                  : 'text-gray-600 bg-gray-50'
                  }`}
                style={{ border: "solid 1px" }}
              >
                Besoins de ma société
              </button>
              <button
                onClick={() => setActiveTab('network')}
                className={`px-6 py-2 text-sm border ${activeTab === 'network'
                  ? 'text-blue-700 bg-blue-200'
                  : 'text-gray-600 bg-gray-50'
                  }`}
                style={{ borderRadius: "0 20px 20px 0", border: "solid 1px" }}
              >
                Besoins de mon réseau
              </button>
            </div>
            <button
              onClick={() => navigate('/kplayer/opportunities/new')}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-xl ml-auto"
              style={{ width: "12rem", backgroundColor: "#215A96" }}
            >
              <Plus size={15} />
              Définir un besoin
            </button>
          </div>
        </div>
        <OpportunitiesList
          Opportunities={opportunities.filter((opportunity) => opportunity.source === activeTab)}
          loading={loading}
          error={error || ""}
        />
      </div>
    </div>
  );
};

export default OpportunitiesListPage;