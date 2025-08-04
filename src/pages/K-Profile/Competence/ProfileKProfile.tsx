import { useState } from "react";
import { isAuthenticated } from "../../../utils/jwt";
import { CompetenceSVG } from "../../components/SVGcomponents";

import GuestMode from "./GuestMode";
import GeneralInfoTab from "./content/GeneralInfoTab";
import ResumeTab from "./content/ResumeTab";
import SectorsAndCriteriasTab from "./content/SectorsAndCriteriasTab";

const ProfileKProfile = () => {
  const [isOnline] = useState(isAuthenticated);
  const [activeTab, setActiveTab] = useState("Informations");

  const tabs = [
    { id: "Informations", label: "Informations Générales" },
    { id: "Compétences_Critères", label: "Compétences & Critères" },
    { id: "CV_compéténces", label: "CV / Dossier de compétences" },
  ];

  const TabButton = ({ active, onClick, children }: { active: string, onClick: () => void, children: React.ReactNode }) => (
    <button
      className={`px-6 py-3 font-medium text-sm rounded-tl-xl rounded-tr-xl relative ${active !== "Informations" ? "-ml-1" : ""} ${active === activeTab
        ? 'text-black bg-white shadow-[0_0_8px_0_rgba(0,0,0,0.1)] z-10'
        : 'text-gray-700 bg-slate-100 hover:bg-gray-300'
        }`}
      onClick={onClick}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full">
      <div className="flex items-center space-x-3 my-4">
        <CompetenceSVG
          className={`w-8 h-8 md:w-4 md:h-4 lg:w-8 lg:h-8 transition-all duration-500 `}
          color="#297280"
        />
        <h1 className="text-xl font-semibold text-black">
          Mon Profil
        </h1>
      </div>

      {isOnline ? (
        <>
          <div className="flex relative w-full">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </TabButton>
            ))}
          </div>


          {activeTab === "Informations" && <GeneralInfoTab />}
          {activeTab === "Compétences_Critères" && <SectorsAndCriteriasTab />}
          {activeTab === "CV_compéténces" && <ResumeTab />}
        </>
      ) : (
        <GuestMode />
      )}
    </div>
  );
};

export default ProfileKProfile;