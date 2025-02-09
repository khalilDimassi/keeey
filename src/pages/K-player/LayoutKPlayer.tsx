import React, { useState, useEffect } from "react";

import NavbarKPlayer from "./NavbarKPlayer";
import SidebarKPlayer from "./SidebarKPlayer";



type IconId = "dashboard" | "fileText1" | "bookmark" | "target" | "users" | "user" | "settings" | null;

const LayoutKPlayer = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [activeComponent, setActiveComponent] = useState<IconId>("fileText1"); // Set default to fileText1

  const handleIconClick = (componentId: IconId) => {
    setActiveComponent(componentId);
    if (componentId === "user") {
      setShowProfile(true);
    }
  };

  
  return (
    <div className="w-full h-screen p-2">
      <div className="w-full h-12">
        <NavbarKPlayer />
      </div>
      <div className="flex w-full h-[calc(100%-64px)]">
        <div style={{ width: "7rem" }}>
          <SidebarKPlayer onIconClick={handleIconClick} defaultSelected={null} />
        </div>
        <div className="flex flex-col w-full" style={{ marginTop: "3rem" }}>
          
        </div>
      </div>
    </div>
  );
};



export default LayoutKPlayer;
