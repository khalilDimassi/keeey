import { useState } from "react";
import { isAuthenticated } from "../../utils/jwt";

import Navbar from "./Navbar";
import JobOpportunities from "./Competence/mode online/JobOpportunities";
import _JobOpportunities2 from "./Competence/mode guest/JobOpportunities2";
import Profile from "./ProfileAfterLogin/ProfilePage";
import Oportunite from "./Competence/Oportunite";
import KProfile from "./Competence/KProfile";
import MissionsTable from "./MissionsTable";
import Contacts from "./Contact/Contacts";
import Reglage from "./Reglage/Reglage";
import Dashboard from "./Dashboard";
import Login from "./LoginPupap";
import Sidebar from "./Sidebar";
import Cv from "./cv/Cv";

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
  const [showProfile, setShowProfile] = useState(false);
  const [showKProfile, setShowKProfile] = useState(true);
  const [activeComponent, setActiveComponent] = useState<ActiveComponent>(
    isOnline ? "dashboard" : "competence"
  );
  const [isSidebarHorizontal, setIsSidebarHorizontal] = useState(false);

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

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <Dashboard />;

      case "competence":
        if (showKProfile) {
          return <KProfile onClose={handleCloseKProfile} />;
        }
        return <Oportunite />;

      case "fileText1":
        return <Cv />;

      // case "bookmark":
      //   return <SavedOpportunities />;

      case "target":
        return <MissionsTable />;

      case "contact":
        return <Contacts />;

      case "user":
        return showProfile && <Profile />;

      case "settings":
        return <Reglage />;

      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-2">
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

        <div className="flex flex-col w-full gap-4 m-10">
          {renderActiveComponent()}
        </div>
      </div>

      {showLoginPopup && <Login onClose={() => setShowLoginPopup(false)} />}
    </div>
  );
};


export default Layout;
