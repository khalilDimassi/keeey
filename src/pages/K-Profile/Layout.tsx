import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Profile from "./ProfileAfterLogin/ProfilePage";
import KProfile from "./beforlogin/KProfile";
import Oportunite from "./beforlogin/Oportunite";
import JobOpportunities2 from "./JobOpportunities2";
import Cv from "./cv/Cv";
import Contacts from "./Contact/Contacts";
import Reglage from "./Reglage/Reglage";
import JobOpportunities from "./JobOpportunities";
import Dashboard from "./Dashboard";
import MissionsTable from "./MissionsTable";
import Login from "./Login"; // Import the login popup component
import { isAuthenticated } from "../utils/jwt";

type IconId =
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
  const [connecte] = useState(isAuthenticated); // Connection state

  const [showLoginPopup, setShowLoginPopup] = useState(false); // Login popup state
  const [showProfile, setShowProfile] = useState(false);
  const [showKProfile, setShowKProfile] = useState(true);

  const [activeComponent, setActiveComponent] = useState<IconId>(
    connecte ? "dashboard" : "competence"
  );
  const [isSidebarHorizontal, setIsSidebarHorizontal] = useState(false);

  const handleIconClick = (componentId: IconId) => {
    // Prevent navigation if not logged in (except for "competence")
    if (!connecte && componentId !== "competence") {
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

  return (
    <div className="w-full min-h-screen bg-gray-100 p-2">
      {/* Navbar */}
      <div className="w-full h-12">
        <Navbar />
      </div>

      {/* Sidebar & Main Content */}
      <div
        className={`flex ${isSidebarHorizontal ? "flex-col" : ""} w-full h-[calc(100%-64px)]`}
        style={{ marginTop: "20px" }}
      >
        {/* Sidebar */}
        <div className={`${isSidebarHorizontal ? "w-full h-16 flex justify-center" : "w-28 h-full"}`}>
          <Sidebar
            onIconClick={handleIconClick}
            defaultSelected={connecte ? "dashboard" : "competence"}
            horizontal={isSidebarHorizontal}
            setHorizontal={setIsSidebarHorizontal}
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col w-full gap-4 m-10">
          {/* Show Dashboard */}
          {activeComponent === "dashboard" && <Dashboard />}

          {/* Show KProfile */}
          {activeComponent === "competence" && showKProfile && (
            <KProfile onClose={handleCloseKProfile} />
          )}

          {/* If connecte is false, always show Oportunite */}
          {activeComponent === "competence" && !connecte && <Oportunite />}

          {/* If connecte is true, switch between JobOpportunities and JobOpportunities2 */}
          {activeComponent === "competence" && connecte && (
            showKProfile ? <JobOpportunities /> : <JobOpportunities2 />
          )}

          {/* Show Contacts & JobOpportunities2 when "contact" is selected */}
          {activeComponent === "contact" && (
            <div className="flex flex-col gap-4">
              {/* <Contacts onClose={() => setActiveComponent(null)} /> */}
              <Contacts />
              <JobOpportunities2 />
            </div>
          )}

          {/* Show Profile */}
          {activeComponent === "user" && showProfile && <Profile />}

          {/* Show CV */}
          {activeComponent === "fileText1" && <Cv />}

          {/* Show Reglage when "settings" is clicked */}
          {activeComponent === "settings" && <Reglage />}

          {/* Show MissionsTable when "target" is clicked */}
          {activeComponent === "target" && <MissionsTable />}
        </div>
      </div>

      {/* Login Popup */}
      {showLoginPopup && <Login onClose={() => setShowLoginPopup(false)} />}
    </div>
  );
};

export default Layout;
