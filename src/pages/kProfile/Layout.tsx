import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Profile from "../ProfileAfterLogin/ProfilePage";
import KProfile from "../beforlogin/KProfile";

type IconId =
  | "dashboard"
  | "fileText1"
  | "bookmark"
  | "target"
  | "users"
  | "user"
  | "settings"
  | null;

const Layout = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [activeComponent, setActiveComponent] = useState<IconId>("fileText1"); // Set default to fileText1

  const handleIconClick = (componentId: IconId) => {
    setActiveComponent(componentId);
    if (componentId === "user") {
      setShowProfile(true);
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "fileText1":
        return <KProfile />;
      case "user":
        return showProfile ? <Profile /> : null;
      default:
        return "Div 3";
    }
  };

  return (
    <div className="w-full h-screen p-2">
      <div className="w-full h-12">
        <Navbar />
      </div>
      <div className="flex w-full h-[calc(100%-64px)]">
        <div style={{ width: "7rem" }}>
          <Sidebar onIconClick={handleIconClick} defaultSelected="fileText1" />
        </div>
        <div className="flex flex-col w-full" style={{ marginTop: "3rem" }}>
          <div>{renderComponent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;