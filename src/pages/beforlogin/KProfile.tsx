import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import SearchCriteria from "./SearchCriteria";
import Competencies from "./Competencies";

function KProfile() {
  const [activeTab, setActiveTab] = useState("criteria");

  return (
    <div className="h-screen w-full bg-gray-50 flex justify-center items-center p-4">
      <div className="relative w-full h-full bg-white shadow-md rounded-lg flex flex-col border border-gray-300 container mx-auto">

      <div className="flex flex-col md:flex-row bg-gray-100 justify-between items-center px-4">
  {/* Tabs */}
  <div className="flex w-full md:w-auto flex-wrap">
    <button
      className={`w-full md:w-auto px-6 py-4 font-medium transition-all ${
        activeTab === "criteria"
          ? "text-teal-600 bg-white rounded-t-lg" // Rounded top corners for the active tab
          : "text-gray-500 hover:bg-gray-200 rounded-b-lg" // Rounded bottom corners for the non-active tabs
      }`}
      onClick={() => setActiveTab("criteria")}
    >
      Mes critères de recherche
    </button>
    <button
      className={`w-full md:w-auto px-6 py-4 font-medium transition-all ${
        activeTab === "competencies"
          ? "text-teal-600 bg-white rounded-t-lg" // Rounded top corners for the active tab
          : "text-gray-500 hover:bg-gray-200 rounded-b-lg" // Rounded bottom corners for the non-active tabs
      }`}
      onClick={() => setActiveTab("competencies")}
    >
      Mes Compétences
    </button>
  </div>







          {/* Buttons Annuler & Enregistrer (responsive) */}
          <div className="flex w-full md:w-auto space-x-2 flex-wrap">
            <button className="w-full md:w-auto text-gray-600 font-medium px-4 py-2 rounded-md hover:bg-gray-200 transition">
              Annuler
            </button>
            <button className="w-full md:w-auto bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition">
              Enregistrer
            </button>
          </div>
        </div>

        {/* Content Section (Hauteur complète sans débordement) */}
        <div className="flex-grow overflow-auto p-6">
          {activeTab === "criteria" ? <SearchCriteria /> : <Competencies />}
        </div>

        {/* Icône de fermeture bien centrée et fixée */}
        <button className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-full p-1 shadow-md">
          <AiOutlineCloseCircle className="w-8 h-8 text-teal-700 hover:text-teal-600" />
        </button>
      </div>
    </div>
  );
}
export default KProfile;