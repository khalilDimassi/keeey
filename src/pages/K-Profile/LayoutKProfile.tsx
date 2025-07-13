import { useState } from "react";
import { ArrowDownCircle } from "lucide-react";
import { isAuthenticated } from "../../utils/jwt";
import Navbar from "./content/Navbar";
import Dashboard from "./content/Dashboard/Dashboard";
import OpportunitiesTable from "./content/Bookmarks/OpportunitiesTable";
import Reglage from "./content/Settings/Reglage";
import Login from "./LoginPopup";
import MissionsTable from "./content/Missions/MissionsTable";
import KProfile from "./content/Competence/ProfilePage";
import JobOpportunities from "./content/Competence/content/JobOpportunities";
import Oportunite from "./content/Competence/mode guest/Oportunite";
import Contacts from "./content/Contact/ContactsPage";
import { SidebarKProfile } from "../assets/Sidebar";
import { ActiveComponent } from "../assets/types";

const LayoutKProfile = () => {
  const [isOnline] = useState(isAuthenticated);
  const [showLoginPopup, setShowLoginPopup] = useState(!isAuthenticated);

  const [showKProfile, setShowKProfile] = useState(true);
  const [activeComponent, setActiveComponent] = useState<ActiveComponent>("competence");
  const [isSidebarHorizontal, setIsSidebarHorizontal] = useState(false);


  const handleIconClick = (componentId: ActiveComponent) => {
    if (!isOnline && componentId !== "competence") {
      setShowLoginPopup(true);
      return;
    }

    setActiveComponent(componentId);
    setIsSidebarHorizontal(false);
    setShowKProfile(componentId === "competence");
  };

  const handleCloseKProfile = () => {
    setShowKProfile(false);
    setIsSidebarHorizontal(true);
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 p-2">
      {showLoginPopup && <Login onClose={() => setShowLoginPopup(false)} />}

      <Navbar />
      <div className={`flex ${isSidebarHorizontal ? "flex-col items-center" : "items-start"} gap-4 w-full h-full -mt-11 pt-16`} >
        <SidebarKProfile
          onIconClick={handleIconClick}
          defaultSelected="competence"
          horizontal={isSidebarHorizontal}
          setHorizontal={setIsSidebarHorizontal}
        />
        <div className="flex flex-col w-full mt-3 px-3">
          {activeComponent === "dashboard" && <Dashboard />}
          {activeComponent === "missions" && <MissionsTable />}
          {activeComponent === "bookmark" && <OpportunitiesTable />}
          {activeComponent === "contact" && <Contacts />}
          {activeComponent === "settings" && <Reglage />}
          {activeComponent === "competence" && (
            showKProfile ? (
              <KProfile onClose={handleCloseKProfile} />
            ) : isOnline ? (
              <>
                <div className="flex flex-col items-center justify-center">
                  <button onClick={() => handleIconClick("competence")}>
                    <ArrowDownCircle size={32} color="#297280" />
                  </button>
                </div>
                <JobOpportunities />
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center">
                  <button onClick={() => handleIconClick("competence")}>
                    <ArrowDownCircle size={32} color="#297280" />
                  </button>
                </div>
                <Oportunite />
              </>
            )
          )}
        </div>
      </div>
      <footer className="flex items-center justify-center w-full h-16 my-4 py-4 bg-slate-100 text-gray-600">
        <p className="text-sm">© 2025 Keeey. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LayoutKProfile; 