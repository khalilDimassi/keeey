import { useState } from "react";
import { isAuthenticated } from "../../utils/jwt";

import Navbar from "./Navbar";
import Oportunite from "./Competence/mode guest/Oportunite";
import KProfile from "./Competence/ProfilePage";
import MissionsTable from "./MissionsTable";
import Contacts from "./Contact/Contacts";
import Reglage from "./Reglage/Reglage";
import Dashboard from "./Dashboard";
import Login from "./LoginPupap";


import OpportunitiesTable from "./Savinig/OpportunitiesTable";
import OpportunisteSaving from "./Savinig/OpportunisteSaving";


import Sidebar from "./Sidebar";
import JobOpportunities from "./Competence/content/JobOpportunities";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
type ActiveComponent =
  | "dashboard"
  | "fileText1"
  | "bookmark"
  | "target"
  | "competence"
  | "user"
  | "settings"
  | "contact"
  | null;

const Layout = () => {
  // Authentication state
  const [isOnline] = useState(isAuthenticated);
  const [showLoginPopup, setShowLoginPopup] = useState(!isAuthenticated);

  // UI state
  const [_showProfile, setShowProfile] = useState(false);
  const [showKProfile, setShowKProfile] = useState(true);
  const [showSaving, setShowSaving] = useState(true);
  const [activeComponent, setActiveComponent] = useState<ActiveComponent>(
    isOnline ? "dashboard" : "competence"
  );
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
    setShowProfile(componentId === "user");
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
                <ArrowDownCircle size={32} color="#039DAA" />
              </button>
            </div>
            <JobOpportunities />
          </> :
          <>
            <div className="flex flex-col items-center justify-center">
              <button onClick={() => handleIconClick("competence")}>
                <ArrowDownCircle size={32} color="#039DAA" />
              </button>
            </div>
            <Oportunite />
          </>;

      case "target":
        return <MissionsTable />;

      case "bookmark":
        if (showSaving) {
          return <OpportunitiesTable onClose={handleCloseSaving} />;
        }
        return <>
          <div className="flex flex-col items-center justify-center">
            <button onClick={() => handleIconClickSaving("bookmark")}>
              <ArrowDownCircle size={32} color="#039DAA" />
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
    <div className="w-full min-h-screen bg-[#FCFCFC] p-2">
      <Navbar />

      <div
        className={`flex ${isSidebarHorizontal ? "flex-col" : ""} w-full h-[calc(100%-64px)]`}
        style={{ marginTop: "20px" }}
      >
        <div className={`${isSidebarHorizontal ? "w-full h-16 flex justify-center" : "w-28 h-full"}`}>
          <Sidebar
            onIconClick={handleIconClick}
            defaultSelected={isOnline ? "dashboard" : "competence"}
            horizontal={isSidebarHorizontal}
            setHorizontal={setIsSidebarHorizontal}
          />
        </div>

        <div className="flex flex-col w-full ">
          {renderActiveComponent()}
        </div>
      </div>

      {showLoginPopup && <Login onClose={() => setShowLoginPopup(false)} />}
    </div>
  );
};


export default Layout;
