import React, { useEffect, useState } from "react";
import { ArrowLeft, Edit } from "lucide-react";
import CompetencesEtCriteresDocument from "./CompetencesEtCriteresDocumetDefinirBesoin_Besoin";
import CompetencesEtCriteres from "../Competence/CompetencesEtCriteres";
import CandidatesList from "../CandidatesList";
import { Sector } from "../Competence/Competences";
import axios from "axios";
// import CandidatesListDefinirBesoin from "./CandidatesListDefinirBesoin";

type SectorSuggestionsResponse = Sector[];

interface DefineNeedFormProps {
  onBack: () => void;
}



export const DefinieBesoin_Besoin: React.FC<DefineNeedFormProps> = ({ onBack }) => {
  // const [title, setTitle] = useState("");
  // const [offerDate, setOfferDate] = useState("");
  // const [startDate, setStartDate] = useState("");
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
          <span className="text-lg font-medium">Détails du besoin</span>
          <span className="text-sm text-gray-400">voir le résultat ci-dessous</span>
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
              Vivre
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

      {!isEmptyBox && (
        <div className="mb-8 mt-8 ">
          <div
            className="bg-white shadow-lg rounded-lg p-6"
            style={{
              boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)",
              borderRadius: "10px",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Informations generale</h2>
              <Edit size={20} className="text-blue-800 cursor-pointer" />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Titre</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  placeholder="Titre"

                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date appelle d'offre</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  placeholder="Date appelle d'offre"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date démarrage</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  placeholder="Date démarrage"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Date réponse</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  placeholder="Date réponse"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Durée prévisionnelle</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  placeholder="Durée prévisionnelle"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">TJM cible</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  placeholder="TJM cible"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {isEmptyBox ? (
        <div className="p+3 ">
          <CompetencesEtCriteres />
        </div>
      ) : (
        // loading ? (
        //   <div className="text-center py-4">Loading...</div>
        // ) : error ? (
        //   <div className="text-center py-4 text-red-500">{error}</div>
        // ) : (
        //   <CompetencesEtCriteresDocument sectors={sectors} />
        // )
        <CompetencesEtCriteresDocument sectors={sectors} />
      )}

      <div className="mt-6">
        {/* <CandidatesListDefinirBesoin /> */}
        <CandidatesList />
      </div>
    </div>
  );
};
