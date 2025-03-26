import { useState } from "react";
import { isAuthenticated } from "../../utils/jwt";

import Navbar from "./Navbar";
import JobOpportunities from "./Competence/mode online/JobOpportunities";

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
        
        return isOnline ? <> 
        <div className="flex flex-col items-center justify-center">

        


        <button onClick={() => handleIconClick("competence")}> 
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_7087_10654)">
        <path d="M28 15.1078V39.1078" stroke="#30797F" stroke-width="3" stroke-linecap="round"/>
        <path d="M20 29.1078L28 39.1078" stroke="#30797F" stroke-width="3" stroke-linecap="round"/>
        <path d="M36 29.1078L28 39.1078" stroke="#30797F" stroke-width="3" stroke-linecap="round"/>
        <mask id="path-4-inside-1_7087_10654" fill="white">
        <path d="M46 27.5539C46 17.8591 37.9411 9.99998 28 9.99998C18.0589 9.99998 10 17.8591 10 27.5539C10 37.2486 18.0589 45.1078 28 45.1078C37.9411 45.1078 46 37.2486 46 27.5539ZM12.0581 27.5539C12.0581 18.9676 19.1955 12.0071 28 12.0071C36.8045 12.0071 43.9419 18.9676 43.9419 27.5539C43.9419 36.1402 36.8045 43.1007 28 43.1007C19.1955 43.1007 12.0581 36.1402 12.0581 27.5539Z"/>
        </mask>
        <path d="M46 27.5539C46 17.8591 37.9411 9.99998 28 9.99998C18.0589 9.99998 10 17.8591 10 27.5539C10 37.2486 18.0589 45.1078 28 45.1078C37.9411 45.1078 46 37.2486 46 27.5539ZM12.0581 27.5539C12.0581 18.9676 19.1955 12.0071 28 12.0071C36.8045 12.0071 43.9419 18.9676 43.9419 27.5539C43.9419 36.1402 36.8045 43.1007 28 43.1007C19.1955 43.1007 12.0581 36.1402 12.0581 27.5539Z" fill="#30797F" stroke="#30797F" stroke-width="2" mask="url(#path-4-inside-1_7087_10654)"/>
        </g>
        <defs>
        <filter id="filter0_d_7087_10654" x="0" y="0" width="56" height="55.1078" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="5"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_7087_10654"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_7087_10654" result="shape"/>
        </filter>
        </defs>
        </svg>
        </button>
        </div>
         <JobOpportunities /></> : <Oportunite />;
       

      //case "fileText1":
       // return <Cv />;

      // case "bookmark":
      //   return <SavedOpportunities />;

      case "target":
        return <MissionsTable />;

      case "contact":
        return <Contacts />;

     // case "user":
      //  return showProfile && <Profile />;

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

        <div className="flex flex-col w-full ">
          {renderActiveComponent()}
        </div>
      </div>

      {showLoginPopup && <Login onClose={() => setShowLoginPopup(false)} />}
    </div>
  );
};


export default Layout;
