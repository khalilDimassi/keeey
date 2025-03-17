// Modified DefinieBesoin_Besoin.tsx
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

import { Sector } from "../Competence/Competences";
import DefineBesoinForm from "./Define Besoin Vivier/DefineBesoinForm";
import DefineVivierForm from "./Define Besoin Vivier/DefineVivierForm";

export type SectorSuggestionsResponse = Sector[];
interface DefineNeedFormProps {
  onBack: () => void;
}

export const DefinieBesoin_Besoin: React.FC<DefineNeedFormProps> = ({ onBack }) => {
  const [isEmptyBox, setIsEmptyBox] = useState(false);
  const handleBesoinClick = () => setIsEmptyBox(false);
  const handleEmptyBoxClick = () => setIsEmptyBox(true);

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
    <div className="p-4 w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600">
          <ArrowLeft size={20} />
          <span className="text-lg font-medium">Détails du {isEmptyBox ? `Vivier` : `Besoin`}</span>
        </button>

        {/* Centered button group */}
        <div className="flex flex-1 justify-center items-center gap-4">
          <div className="inline-flex rounded-full border border-gray-300 mr-60">
            <button
              onClick={handleBesoinClick}
              className={`px-4 py-2 ${!isEmptyBox ? "bg-[#215A96] text-white" : "bg-white text-black"
                }`}
              style={{
                borderRadius: "20px 0 0 20px",
                border: "1px solid #215A96",
              }}
            >
              Besoin
            </button>
            <button
              onClick={handleEmptyBoxClick}
              className={`px-4 py-2 ${isEmptyBox ? "bg-[#215A96] text-white" : "bg-white text-black"
                }`}
              style={{
                borderRadius: "0 20px 20px 0",
                border: "1px solid #215A96",
              }}
            >
              Vivier
            </button>
          </div>
        </div>
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded-lg"
          style={{ backgroundColor: "#215A96", borderRadius: "20px" }}
        >
          Enregistrer
        </button>
      </div>

      {isEmptyBox ? (
        <div className="p+3">
          <DefineVivierForm sectors={sectors} loading={loading} error={error} />
        </div>
      ) : (
        loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <DefineBesoinForm sectors={sectors} loading={loading} error={error} />
        )
      )}
    </div>
  );
};