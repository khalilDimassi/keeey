import React, { useState } from "react";
import NavbarKPlayer from "./NavbarKPlayer";
import SidebarKPlayer from "./SidebarKPlayer";
import CompetencesEtCriteres from "./CompetencesEtCriteres";
import CandidatesList from "./CandidatesList";

type IconId = "dashboard" | "company" | "userSearch" | "userStar" | "fileSettings" | "profile" | null;

const LayoutKPlayer = () => {
  const [activeComponent, setActiveComponent] = useState<IconId>(null);

  const handleIconClick = (componentId: IconId) => {
    setActiveComponent(componentId);
  };

  return (
    <div className="w-full h-screen p-2">
      {/* Navbar */}
      <div className="w-full h-12">
        <NavbarKPlayer />
      </div>

      {/* Sidebar + Content Layout */}
      <div className="flex w-full h-[calc(100%-64px)]">
        {/* Sidebar */}
        <div className="w-28"> {/* Set the width here for the sidebar */}
          <SidebarKPlayer onIconClick={handleIconClick} defaultSelected={null} />
        </div>

        {/* Content Section */}
        <div className="flex flex-col w-full mt-14 px-6">
          {activeComponent === "company" && (
            <>
              <CompetencesEtCriteres />
            </>
          )}

          {/* CandidatesList under Sidebar when "company" is active */}
          {activeComponent === "company" && (
            <div className="mt-6">
              <CandidatesList />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LayoutKPlayer;
