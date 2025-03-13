// ProjetsBesoins.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, ChevronRight, Search } from 'lucide-react';

import { MesBesoin } from './MesBesoin';
import { DefinieBesoin_Besoin } from './DefinieBesoin_Besoin';
import { VoirDetaile } from './VoireDetaille/VoirDetaile';
import { getAuthHeader } from '../../../utils/jwt';
import CandidatesList from '../Competances/CandidatesList';

export interface KProfile {
  first_name: string;
  last_name: string;
  user_id: string;
}

export interface Project {
  opportunity_id: number;
  title: string;
  reference: string;
  start_at: string;
  status: string;
  first_name: string;
  last_name: string;
  user_id: string;
  kprofiles: KProfile[];
  date?: string;
  participants?: string[];
  id?: number;
}

function ProjetsBesoins() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDefineNeed, setShowDefineNeed] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/personal`,
          { headers: { ...getAuthHeader() } }
        );

        setProjects(response.data ?? []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch projects');
        setLoading(false);
        console.error('Error fetching projects:', err);
      }
    };

    fetchProjects();
  }, []);

  const renderProjectsList = () => {
    if (loading) {
      return <div className="space-y-4 bg-white rounded-lg p-4" style={{ boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)", borderRadius: "10px" }}>
        <div className="p-8 text-center">Chargement...</div>
      </div>;
    }

    if (error) {
      return <div className="space-y-4 bg-white rounded-lg p-4" style={{ boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)", borderRadius: "10px" }}>
        <div className="p-8 text-center text-red-500">{error}</div>
      </div>;
    }

    if (projects.length === 0) {
      return <div className="space-y-4 bg-white rounded-lg p-4" style={{ boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)", borderRadius: "10px" }}>
        <div className="p-8 text-center">
          <p className="text-gray-600">Aucun projet trouvé</p>
        </div>
      </div>;
    }

    return <MesBesoin
      projects={projects}
      onSelectProject={setSelectedProject}
    />;
  };

  return (
    <div className="bg-gray-100">
      {showDefineNeed ? (
        <DefinieBesoin_Besoin onBack={() => setShowDefineNeed(false)} />
      ) : selectedProject ? (
        <VoirDetaile
          project={selectedProject}
          onBack={() => setSelectedProject(null)}
        />
      ) : (
        <div className="p-2 w-full mx-auto ml-2">
          <div className="flex flex-col gap-6 ">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3 mb-2">
                <Search className="" style={{ color: "#215A96" }} size={40} />
                <h1 className="text-xl font-semibold ">Projets/Besoins</h1>
              </div>

              <div className="flex mx-auto rounded-full">
                <button className="px-6 py-2 text-sm text-blue-700 bg-blue-200 border " style={{ borderRadius: "20px 0 0 20px", border: "solid 1px " }}>
                  Mes besoins
                </button>
                <button className="px-6 py-2 text-sm text-gray-600 bg-gray-50 border" style={{ border: "solid 1px " }}>
                  Besoins de ma société
                </button>
                <button className="px-6 py-2 text-sm text-gray-600 bg-gray-50 border" style={{ borderRadius: "0 20px 20px 0", border: "solid 1px " }}>
                  Besoins de mon réseau
                </button>
              </div>

              <button
                onClick={() => setShowDefineNeed(true)}
                className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-xl ml-auto"
                style={{ width: "12rem", backgroundColor: "#215A96" }}
              >
                <Plus size={15} />
                Définir un besoin
              </button>
            </div>
          </div>

          {renderProjectsList()}
        </div>
      )}


      <div className="mt-6">
        <CandidatesList />
      </div>
    </div>
  );
}

export default ProjetsBesoins; 