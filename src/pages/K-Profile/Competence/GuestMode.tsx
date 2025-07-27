import { useState } from "react";
import Competencies from "./mode guest/Competencies";
import SearchCriteria from "./mode guest/SearchCriteria";
import { useNavigate } from "react-router-dom";
import { ArrowUpCircle } from "lucide-react";
import { useSidebar } from "../../components/SidebarContext";


const GuestMode = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("criteria");
  const { isHorizontal, toggleOrientation } = useSidebar();

  const tabs = [
    { id: "competencies", label: "Mes Compétences" },
    { id: "criteria", label: "Mes critères de recherche" },
  ];

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

      <div className="relative bg-white rounded-xl">
        <div className="hover-box p-4 shadow-lg rounded-2xl">
          {activeTab === "criteria" ? <SearchCriteria /> : <Competencies />}
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

      {/* <Oportunite /> */}
    </>
  );
};

const TabButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
  <button
    className={`px-8 py-2 flex gap-2 font-medium transition-all relative ${active ? "text-gray-900 bg-white rounded-t-xl z-10" : "text-gray-400 bg-gray-100/50"
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

export default GuestMode;