import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Profile from "./ProfileAfterLogin/ProfilePage";
import KProfile from "../beforlogin/KProfile";
import Oportunite from "../beforlogin/Oportunite";
import JobOpportunities2 from "./JobOpportunities2";
import Cv from "../cv/Cv";
import Contacts from "./Contact/Contacts";
import Reglage from "./Reglage/Reglage";


type IconId =
  | "dashboard"
  | "fileText1"
  | "bookmark"
  | "target"
  | "users"
  | "user"
  | "settings"
  | "settings2"
  | null;

const Layout = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showKProfile, setShowKProfile] = useState(true);
  const [showJobOpportunities, setShowJobOpportunities] = useState(true);
  const [activeComponent, setActiveComponent] = useState<IconId>("fileText1");
  const [isSidebarHorizontal, setIsSidebarHorizontal] = useState(false);

  const handleIconClick = (componentId: IconId) => {
    setActiveComponent(componentId);
    setIsSidebarHorizontal(false);

    setShowProfile(componentId === "user");
    setShowKProfile(componentId === "fileText1");
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
      <div
        className={`flex ${
          isSidebarHorizontal ? "flex-col" : ""
        } w-full h-[calc(100%-64px)]`}
        style={{ marginTop: "40px" }}
      >
        {/* Sidebar */}
        <div
          className={`${
            isSidebarHorizontal ? "w-full h-16 flex justify-center" : "w-28 h-full"
          }`}
        >
          <Sidebar
            onIconClick={handleIconClick}
            defaultSelected="fileText1"
            horizontal={isSidebarHorizontal}
            setHorizontal={setIsSidebarHorizontal}
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col w-full gap-4">
          {/* Show KProfile */}
          <AnimatePresence>
            {activeComponent === "fileText1" && showKProfile && (
              <KProfile onClose={handleCloseKProfile} />
            )}
          </AnimatePresence>

          {/* Toggle between JobOpportunities2 and Oportunite */}
          {activeComponent === "fileText1" && (
            <AnimatePresence mode="wait">
              <motion.div
                key={showJobOpportunities ? "job-opportunities2" : "oportunite"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {showJobOpportunities ? <JobOpportunities2 /> : <Oportunite />}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Show Users Section */}
          {activeComponent === "users" && (
            <AnimatePresence mode="wait">
              <motion.div
                key="job-opportunities2-contacts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex flex-col gap-4"
              >
                <Contacts onClose={() => setActiveComponent(null)} />
                <JobOpportunities2 />
              </motion.div>
            </AnimatePresence>
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

          {/* Show CV */}
          <AnimatePresence>
            {activeComponent === "bookmark" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Cv />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Show Reglage when "settings" is clicked */}
          <AnimatePresence>
            {activeComponent === "settings" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Reglage />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Layout;
