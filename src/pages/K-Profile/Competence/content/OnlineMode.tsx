import { useState } from "react";
import CloseButton from "./CloseButton";
import GeneralInfoTab from "./GeneralInfoTab";
import SectorsAndCriteriasTab from "./SectorsAndCriteriasTab";
import ResumeTab from "./ResumeTab";

const OnlineMode = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState("Informations");

  const tabs = [
    { id: "Informations", label: "Informations Générales" },
    { id: "Compétences_Critères", label: "Compétences & Critères" },
    { id: "CV_compéténces", label: "CV / Dossier de compéténces" },
  ];


  const TabButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
    <button
      className={`px-4 py-2 flex gap-2 font-medium transition-all relative ${active ? "text-gray-900 bg-white rounded-t-xl z-10" : ""
        }`}
      style={{
        boxShadow: active
          ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(103, 109, 103, 0.14)"
          : "none",
        fontWeight: 500,
        fontSize: '20px',
        lineHeight: '1.5',
        letterSpacing: '0.00938em',
        textAlign: 'center',
        verticalAlign: 'middle'
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );


  return (
    <>
      <div className="flex gap-2 relative">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>

      <div className="relative bg-white">
        <div className="hover-box p-4 shadow-lg rounded-2xl">
          {activeTab === "Informations" && <GeneralInfoTab />}
          {activeTab === "Compétences_Critères" && <SectorsAndCriteriasTab />}
          {activeTab === "CV_compéténces" && <ResumeTab />}
          <CloseButton onClick={onClose} />
        </div>
      </div>
    </>
  );
};

export default OnlineMode;