import { ArrowUpCircle } from "lucide-react";
import { useState } from "react";

import GeneralInfoTab from "./content/GeneralInfoTab";
import SectorsAndCriteriasTab from "./content/SectorsAndCriteriasTab";
import ResumeTab from "./content/ResumeTab";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../components/SidebarContext";

const OnlineMode = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Informations");
  const { isHorizontal, toggleOrientation } = useSidebar();

  const tabs = [
    { id: "Informations", label: "Informations Générales" },
    { id: "Compétences_Critères", label: "Compétences & Critères" },
    { id: "CV_compéténces", label: "CV / Dossier de compétences" },
  ];


  const TabButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
    <button
      className={`px-4 py-2 flex gap-2 font-medium transition-all relative ${active ? "text-gray-900 bg-white rounded-t-xl z-10" : ""
        }`}
      style={{
        boxShadow: active
          ? "0 -4px 4px -2px #6166611c, 4px 0 4px -2px #61666100, -4px 0 4px -2px #676d6724"
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

          <ArrowUpCircle
            onClick={() => {
              toggleOrientation();
              navigate("/kprofile/opportunities");
            }}
            cursor={"pointer"}
            size={40}
            className="absolute z-20 -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1 shadow-sm text-[#297280] border border-gray-200"
          />
        </div>
      </div>
    </>
  );
};

export default OnlineMode;