import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Profile from "../ProfileAfterLogin/ProfilePage";
import KProfile from "../beforlogin/KProfile";
import Oportunite from "../beforlogin/Oportunite";
import Cv from "../cv/cv";


type IconId = "dashboard" | "fileText1" | "bookmark" | "target" | "users" | "user" | "settings" | null;

const Layout = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showKProfile, setShowKProfile] = useState(true);
  const [activeComponent, setActiveComponent] = useState<IconId>("fileText1");
  const [isSidebarHorizontal, setIsSidebarHorizontal] = useState(false);

  const handleIconClick = (componentId: IconId) => {
    setActiveComponent(componentId);
    setIsSidebarHorizontal(false);

    if (componentId === "user") {
      setShowProfile(true);
    } else {
      setShowProfile(false);
    }

    if (componentId !== "fileText1") {
      setShowKProfile(false);
    } else {
      setShowKProfile(true);
    }
  };

  const handleCloseKProfile = () => {
    setShowKProfile(false);
    setIsSidebarHorizontal(true);
  };

  return (
    <div className="w-full h-screen p-2">
      {/* Navbar */}
      <div className="w-full h-12">
        <Navbar />
      </div>

      {/* Sidebar & Main Content */}
      <div className={`flex ${isSidebarHorizontal ? "flex-col" : ""} w-full h-[calc(100%-64px)]`} style={{ marginTop: "40px" }}>
        {/* Sidebar */}
        <div className={`${isSidebarHorizontal ? "w-full h-16 flex justify-center" : "w-28 h-full"}`}>
          <Sidebar 
            onIconClick={handleIconClick} 
            defaultSelected="fileText1" 
            horizontal={isSidebarHorizontal} 
            setHorizontal={setIsSidebarHorizontal} 
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col w-full gap-4">
          {/* Show KProfile and Opportunities */}
          {activeComponent === "fileText1" && (
            <>
              <AnimatePresence>
                {showKProfile && <KProfile onClose={handleCloseKProfile} />}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
              >
                <Oportunite />
              </motion.div>
            </>
          )}

          {/* Show Profile */}
          <AnimatePresence>
            {activeComponent === "user" && showProfile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Profile />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Show CV when bookmark is clicked */}
          <AnimatePresence>
            {activeComponent === "bookmark" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Cv/>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Layout;
