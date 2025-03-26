import React, { useEffect, useState } from "react";
import Competences, { Sector } from "./Competences";
import Criteres from "./Criteres";
import { Building2 } from "lucide-react";
import axios from "axios";
import { SectorSuggestionsResponse } from "../Projets-Besoins/DefinieBesoin_Besoin";


const CompetencesEtCriteres = () => {
  const [selectedContract, setSelectedContract] = useState<string>("CDI");
  const [remoteWork, setRemoteWork] = useState<string>("Non");
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="flex justify-between mr-5 ml-5 items-center space-x-3 mt-1 mb-1">
        <span className="flex items-center gap-4">
          <Building2 className="text-blue-800" size={40} />
          <h1 className="text-xl font-semibold">Compétences</h1>
        </span>
        <button
          // onClick={ }
          className="flex items-center justify-center  bg-blue-700 text-white px-4 py-2 rounded-xl ml-auto"
          style={{ width: "8rem", backgroundColor: "#215A96" }}
        >
          Search
        </button>
      </div>
      <div className="p-4 flex gap-5">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <Competences
            sectors={sectors}
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