import { useEffect, useState } from "react";
import { getLocalStorageData, isAuthenticated, loadGuestData, saveGuestData } from "../../../utils/jwt";
import { CompetenceSVG } from "../../components/SVGcomponents";
import { GuestData, GuestProfile, MinimalSector, Sector } from "./types";

import GeneralInfoTab from "./content/GeneralInfoTab";
import ResumeTab from "./content/ResumeTab";
import SectorsAndCriteriasTab from "./content/SectorsAndCriteriasTab";
import GuestSectors from "./mode guest/GuestSectors";
import GuestCriterias from "./mode guest/GuestCriterias";
import { fetchSectors, fetchUpdateGuestData } from "./services";
import GuestRequirements from "./mode guest/GuestRequirements";

const tabs = [
  { id: "Informations", label: "Informations Générales" },
  { id: "Compétences_Critères", label: "Compétences & Critères" },
  { id: "CV_compéténces", label: "CV / Dossier de compétences" },
];

const guest_tabs = [
  { id: "Compétences", label: "Compétences" },
  { id: "Critères", label: "Critères" },
];

const TabButton = ({ active, active_tab, onClick, children }: { active: string, active_tab: string, onClick: () => void, children: React.ReactNode }) => (
  <button
    className={`px-6 py-3 font-medium text-sm rounded-tl-xl rounded-tr-xl relative ${active !== "Informations" ? "-ml-1" : ""} ${active === active_tab
      ? 'text-black bg-white shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.1)] z-10'
      : 'text-gray-700 bg-slate-100 hover:bg-gray-300'
      }`}
    onClick={onClick}
  >
    {children}
  </button>
);

const ProfileKProfile = () => {
  const [activeTab, setActiveTab] = useState(isAuthenticated() ? "Informations" : "Compétences");
  const [sectorSuggestions, setSectorSuggestions] = useState<Sector[]>([]);
  const [guestData, setGuestData] = useState({} as GuestData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSectors()
      .then((sectors) => setSectorSuggestions(sectors))
      .catch((error) => console.error("Failed to fetch sectors:", error));
    fetchUpdateGuestData()
      .then((guestData) => {
        setGuestData(guestData)
        guestData.resume = loadGuestData().resume!;
        guestData.profile = loadGuestData().profile!;
      })
      .catch((error) => console.error("Failed to fetch guest data:", error))
  }, []);

  type GuestDataChange =
    | { section: "sectors"; data: MinimalSector[] }
    | { section: "criterias"; data: Partial<GuestProfile> }
    | { section: "requirements"; data: Partial<GuestData> };

  const onGuestDataChange = ({ section, data }: GuestDataChange) => {
    setLoading(true);
    setGuestData((prev) => {
      if (section === "sectors") {
        return {
          ...prev,
          resume: { ...prev.resume, sectors: data },
        };
      }
      if (section === "requirements") {
        return {
          ...prev,
          resume: { ...prev.resume, ...data },
        };
      }
      if (section === "criterias") {
        return {
          ...prev,
          profile: { ...prev.profile, ...data },
        };
      }
      return prev;
    });
  };


  const onSaveData = () => {
    if (!loading) return;

    console.info('🔍 Saving new guest data:', guestData);
    saveGuestData(guestData);

    fetchUpdateGuestData()
      .then((guestData) => setGuestData(guestData))
      .catch((error) => console.error("Failed to fetch guest data:", error))
      .finally(() => setLoading(false));
  }

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

      {isAuthenticated() ? (
        <>
          <div className="flex relative w-full">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={tab.id}
                active_tab={activeTab}
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
        <>
          <div className="flex relative w-full">
            {guest_tabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={tab.id}
                active_tab={activeTab}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </TabButton>
            ))}
          </div>

          {activeTab === "Compétences" && sectorSuggestions.length > 0 && <GuestSectors
            sectors={sectorSuggestions}
            guestSelection={guestData.resume?.sectors ?? []}
            updateGuestData={onGuestDataChange}
            onSave={onSaveData}
            loading={loading}
          />}

          {activeTab === "Critères" && <div className="bg-white w-full p-8 ml-[-4px] rounded-b-xl shadow-[4px_4px_6px_1px_rgba(0,0,0,0.1)] flex flex-row gap-12">
            {/* Left: resume requirements */}
            <GuestRequirements guestData={guestData} updateGuestData={onGuestDataChange} />

            {/* Right: profile criterias */}
            <GuestCriterias
              guestData={guestData}
              updateGuestData={onGuestDataChange}
              onSave={onSaveData}
              loading={loading}
            />
          </div>}
        </>
      )}
    </div>
  );
};

export default ProfileKProfile;