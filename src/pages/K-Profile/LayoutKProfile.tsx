import { useState } from "react";
import { ArrowDownCircle } from "lucide-react";
import { isAuthenticated } from "../../utils/jwt";

import Navbar from "./content/Navbar";
import Dashboard from "./content/Dashboard/Dashboard";
import OpportunisteSaving from "./content/Bookmarks/OpportunisteSaving";
import OpportunitiesTable from "./content/Bookmarks/OpportunitiesTable";
import Reglage from "./content/Settings/Reglage";
import Login from "./LoginPopup";

import Sidebar, { ActiveComponent } from "./Sidebar";
import MissionsTable from "./content/Missions/MissionsTable";
import KProfile from "./content/Competence/ProfilePage";
import JobOpportunities from "./content/Competence/content/JobOpportunities";
import Oportunite from "./content/Competence/mode guest/Oportunite";
import Contacts from "./content/Contact/ContactsPage";

const LayoutKProfile = () => {
  const [isOnline] = useState(isAuthenticated);
  const [showLoginPopup, setShowLoginPopup] = useState(!isAuthenticated);

  const [showKProfile, setShowKProfile] = useState(true);
  const [showSaving, setShowSaving] = useState(true);
  const [activeComponent, setActiveComponent] = useState<ActiveComponent>("competence");
  const [isSidebarHorizontal, setIsSidebarHorizontal] = useState(false);

  const handleIconClickSaving = (componentId: ActiveComponent) => {
    if (!isOnline && componentId !== "bookmark") {
      setShowLoginPopup(true);
      return;
    }
    setActiveComponent(componentId);
    setIsSidebarHorizontal(false);
    setShowSaving(true);
  };

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

  const handleCloseSaving = () => {
    setShowSaving(false);
    setIsSidebarHorizontal(true);
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <Dashboard />;

      case "competence":
        if (showKProfile) {
          return <KProfile onClose={handleCloseKProfile} />;
        }

        return isOnline ?
          <>
            <div className="flex flex-col items-center justify-center">
              <button onClick={() => handleIconClick("competence")}>
                <ArrowDownCircle size={32} color="#297280" />
              </button>
            </div>
            <JobOpportunities />
          </> :
          <>
            <div className="flex flex-col items-center justify-center">
              <button onClick={() => handleIconClick("competence")}>
                <ArrowDownCircle size={32} color="#297280" />
              </button>
            </div>
            <Oportunite />
          </>;

      case "missions":
        return <MissionsTable />;

      case "bookmark":
        if (showSaving) {
          return <OpportunitiesTable onClose={handleCloseSaving} />;
        }
        return <>
          <div className="flex flex-col items-center justify-center">
            <button onClick={() => handleIconClickSaving("bookmark")}>
              <ArrowDownCircle size={32} color="#297280" />
            </button>
          </div>
          <OpportunisteSaving /></>
          ;

      case "contact":
        return <Contacts />;

      case "settings":
        return <Reglage />;

      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 p-2">
      <Navbar />
      <div
        className={`flex ${isSidebarHorizontal ? "flex-col" : ""} w-full h-full -mt-11 pt-16`}
      >
        <div className={`${isSidebarHorizontal ? "w-full h-16 flex justify-center" : "w-28 h-full"}`}>
          <Sidebar
            onIconClick={handleIconClick}
            defaultSelected="competence"
            horizontal={isSidebarHorizontal}
            setHorizontal={setIsSidebarHorizontal}
          />
        </div>
        <div className="flex flex-col w-full ">
          {renderActiveComponent()}
        </div>
      </div>
      {showLoginPopup &&
        <Login onClose={() => setShowLoginPopup(false)} />
      }
    </div>
  );
};

export default LayoutKProfile; 