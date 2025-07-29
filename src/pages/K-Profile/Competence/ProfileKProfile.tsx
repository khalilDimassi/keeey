import { useEffect, useState } from "react";
import { isAuthenticated } from "../../../utils/jwt";
import { CompetenceSVG } from "../../components/SVGcomponents";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useSidebar } from "../../components/SidebarContext";

import GuestMode from "./GuestMode";
import JobOpportunities from "./content/JobOpportunities";
import GeneralInfoTab from "./content/GeneralInfoTab";
import ResumeTab from "./content/ResumeTab";
import SectorsAndCriteriasTab from "./content/SectorsAndCriteriasTab";

const ProfileKProfile = () => {
  const [isOnline] = useState(isAuthenticated);
  const [activeTab, setActiveTab] = useState("Informations");
  const { isHorizontal, toggleOrientation } = useSidebar();

  useEffect(() => {
    if (isHorizontal) {
      toggleOrientation();
    }
  }, []);

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
    <div className="w-full">
      <div className="flex items-center space-x-3 my-4">
        <CompetenceSVG
          className={`w-8 h-8 md:w-4 md:h-4 lg:w-8 lg:h-8 transition-all duration-500 `}
          color="#297280"
        />
        <h1 className="text-xl font-semibold text-black">
          {!isHorizontal ? "Mon Profil" : "Opportunités"}
        </h1>
      </div>

      {isOnline ? (
        !isHorizontal ? (
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
                  }}
                  cursor={"pointer"}
                  size={40}
                  className="absolute z-20 -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1 shadow-sm text-[#297280] border border-gray-200"
                />
              </div>
            </div>
          </>
        ) : (
          <></>
        )
      ) : (
        <GuestMode />
      )}
      <>
        {isHorizontal &&
          <ArrowDownCircle
            onClick={() => {
              toggleOrientation();
            }}
            cursor={"pointer"}
            size={40}
            className="absolute z-20 top-56 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1 shadow-sm text-[#297280] border border-gray-200"
          />
        }
        <JobOpportunities />
      </>
    </div>
  );
};

export default ProfileKProfile;