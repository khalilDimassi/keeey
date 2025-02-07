import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FileText, Award } from "lucide-react";
import SearchCriteria from "./SearchCriteria";
import Competencies from "./Competencies";


const KProfile = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState("criteria");

  return (
    <div className="w-full">
      <div className="relative bg-white shadow-sm rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200">
          {/* Tabs */}
          <div className="flex gap-2 p-2">
            <button
              className={`px-4 py-2 font-medium transition-all flex items-center gap-2 rounded-md ${
                activeTab === "criteria"
                  ? "text-teal-600 bg-white shadow-md border border-gray-100"
                  : "text-gray-500 hover:text-teal-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("criteria")}
            >
              <FileText className={`w-5 h-5 ${activeTab === "criteria" ? "text-teal-600" : "text-gray-400"}`} />
              Mes critères de recherche
            </button>
            <button
              className={`px-4 py-2 font-medium transition-all flex items-center gap-2 rounded-md ${
                activeTab === "competencies"
                  ? "text-teal-600 bg-white shadow-md border border-gray-100"
                  : "text-gray-500 hover:text-teal-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("competencies")}
            >
              <Award className={`w-5 h-5 ${activeTab === "competencies" ? "text-teal-600" : "text-gray-400"}`} />
              Mes Compétences
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 px-4">
            <button className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-md">Annuler</button>
            <button className="px-4 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700">
              Enregistrer
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="hover-box p-4">
          {activeTab === "criteria" ? <SearchCriteria /> : <Competencies />}
        </div>

        {/* Close Button */}
        <button
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1 shadow-sm border border-gray-200"
          onClick={onClose}
        >
          <AiOutlineCloseCircle className="w-6 h-6 text-teal-600 hover:text-teal-700" />
        </button>
      </div>
    
    </div>
  );
};

export default KProfile;
