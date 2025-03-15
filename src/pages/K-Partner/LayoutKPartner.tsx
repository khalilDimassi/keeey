import React, { useState, useEffect } from "react";

import NavbarKPlayer from "./NavbarKPartner";
import SidebarKPlayer from "./SidebarKPartner";
import { isAuthenticated } from "../../utils/jwt";



type IconId = "dashboard" | "fileText1" | "bookmark" | "target" | "competence" | "user" | "settings" | "contact" | null;

const LayoutKPartner = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [isOnline] = useState(isAuthenticated); // Connection state
  const [activeComponent, setActiveComponent] = useState<IconId>(
    isOnline ? "dashboard" : "competence"
  );
  const [isSidebarHorizontal, setIsSidebarHorizontal] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(!isAuthenticated); // Login popup state
  const handleIconClick = (componentId: IconId) => {
    // Prevent navigation if not logged in (except for "competence")
    if (!isOnline && componentId !== "competence") {
      setShowLoginPopup(true);
      return;
    }

    setActiveComponent(componentId);
    setIsSidebarHorizontal(false);

    setShowProfile(componentId === "user");

  };


  return (
    <div className="w-full h-screen p-4">
      <div className="w-full h-12">
        <NavbarKPlayer />
      </div>
      <div className="flex w-full h-[calc(100%-64px)]">
        <div style={{ width: "7rem" }}>
          <SidebarKPlayer
            onIconClick={handleIconClick}
            defaultSelected={isOnline ? "dashboard" : "fileText1"}
            horizontal={isSidebarHorizontal}
            setHorizontal={setIsSidebarHorizontal}
          />
        </div>
        <div className="flex flex-col w-full" style={{ marginTop: "3rem" }}>

        </div>
      </div>
    </div>
  );
};



export default LayoutKPartner;
