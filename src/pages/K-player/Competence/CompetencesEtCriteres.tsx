import React, { useEffect, useState } from "react";
import Competences, { Sector } from "./Competences";
import Criteres from "./Criteres";
import { Building2 } from "lucide-react";
import axios from "axios";

type SectorSuggestionsResponse = Sector[];

const CompetencesEtCriteres: React.FC = () => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedContract, setSelectedContract] = useState<string>("CDI");
  const [remoteWork, setRemoteWork] = useState<string>("Non");

  const fetchSectors = async () => {
    try {
      const response = await axios.get<SectorSuggestionsResponse>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/suggestions/sectors`
      );
      setSectors(response.data);
    } catch (err) {
      setError('Failed to fetch sectors. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectors();
  }, []);


  return (
    <div>
      <div className="flex ml-5 items-center space-x-3 mt-1 mb-1">
        <Building2 className="text-blue-800" size={40} />
        <h1 className="text-xl font-semibold">Compétences</h1>
      </div>
      <div className="p-4 flex gap-5">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <Competences
            sectors={sectors}
          // onSelectionChange={handleSelectionChange}
          />
        )}
        <Criteres
          selectedContract={selectedContract}
          setSelectedContract={setSelectedContract}
          remoteWork={remoteWork}
          setRemoteWork={setRemoteWork}
        />
      </div>
    </div>
  );
};

export default CompetencesEtCriteres;