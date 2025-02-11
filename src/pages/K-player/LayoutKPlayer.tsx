import React, { useState } from "react";
import NavbarKPlayer from "./NavbarKPlayer";
import SidebarKPlayer from "./SidebarKPlayer";
import CompetencesEtCriteres from "./CompetencesEtCriteres";
import CandidatesList from "./CandidatesList";
import Login from "./Login"; // Import the login popup component
import ProjetsBesoins from "./Projets-Besoins/ProjetsBesoins";


type IconId = "dashboard" | "company" | "userSearch" | "userStar" | "fileSettings" | "profile" | null;

const LayoutKPlayer = () => {
  const [connecte] = useState(true); // Connection state
  const [activeComponent, setActiveComponent] = useState<IconId>(connecte ? "dashboard" : "company");
  const [showLoginPopup, setShowLoginPopup] = useState(false); // Login popup state

  const handleIconClick = (componentId: IconId) => {
    if (!connecte && componentId !== "company") {
      setShowLoginPopup(true);
      return;
    }
    
    setActiveComponent(componentId); // Set the selected component
  };

  return (
    <div className="w-full  p-2 bg-gray-100">
      {/* Navbar */}
      <div className="w-full h-12">
        <NavbarKPlayer />
      </div>

      {/* Sidebar + Content Layout */}
      <div className="flex w-full h-[calc(100%-64px)]">
        {/* Sidebar */}
        <div className="w-28">
          <SidebarKPlayer 
            onIconClick={handleIconClick} 
            defaultSelected={connecte ? "dashboard" : "company"} 
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col w-full mt-14 px-6">
          {activeComponent === "company" && (
            <>
              <CompetencesEtCriteres />
              <div className="mt-6">
                <CandidatesList />
              </div>
            </>
          )}

          {activeComponent === "dashboard" && <div>Dashboard Content Here</div>}

          {/* Show ProjetsBesoins when userSearch is clicked */}
          {activeComponent === "userSearch" && (<ProjetsBesoins />
          
        )}
        </div>
      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <Login onClose={() => setShowLoginPopup(false)} />
      )}
    </div>
  );
};

export default LayoutKPlayer;
