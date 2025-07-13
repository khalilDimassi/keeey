import { useState } from "react";
import { isAuthenticated } from "../../utils/jwt";
import { SidebarKPlayer } from "../assets/Sidebar";
import { ActiveComponent } from "../assets/types";

import Login from "./LoginPopup";
import CompetancePage from "./Competence/CompetancePage";
import NavbarKPlayer from "./NavbarKPlayer";
import ProfilePage from "./Profile/ProfilePage";
import ProjetsBesoinsPage from "./Projets-Besoins/ProjetsBesoinsPage";
import ContactPage from "./content/Contact/ContactPage";
import Mission from "./content/Mission/Mission";
import Reglage from "./content/Reglage/Reglage";

const LayoutKPlayer = () => {
  const [isOnline] = useState(isAuthenticated);
  const [ActiveComponent, setActiveComponent] = useState<ActiveComponent>("search");
  const [showLoginPopup, setShowLoginPopup] = useState(!isOnline);

  const handleIconClick = (id: ActiveComponent) => {
    if (!isOnline && id !== "search") {
      setShowLoginPopup(true);
      return;
    }
    setActiveComponent(id);
  };

  return (
    <div className="w-full bg-gray-100">
      {showLoginPopup && <Login onClose={() => setShowLoginPopup(false)} />}

      <NavbarKPlayer />
      <div className="flex w-full mx-4">
        <SidebarKPlayer
          onIconClick={handleIconClick}
          defaultSelected="search"
        />
        <div className="flex flex-col w-full mt-3 px-3">
          {ActiveComponent === "dashboard" && <div>Dashboard Content Here</div>}
          {ActiveComponent === "profile" && <ProfilePage />}
          {ActiveComponent === "company" && <ProjetsBesoinsPage />}
          {ActiveComponent === "contacts" && <ContactPage />}
          {ActiveComponent === "missions" && <Mission />}
          {ActiveComponent === "search" && <CompetancePage />}
          {ActiveComponent === "settings" && <Reglage />}
        </div>
      </div>
      <footer className="flex items-center justify-center w-full h-16 my-4 py-4 bg-slate-100 text-gray-600">
        <p className="text-sm">© 2025 Keeey. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LayoutKPlayer;
