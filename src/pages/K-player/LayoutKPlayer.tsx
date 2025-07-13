import { useState } from "react";
import { isAuthenticated } from "../../utils/jwt";
import { ActiveComponent, SidebarKPlayer } from "../assets/Sidebar";
import CompetancePage from "./Competence/CompetancePage";
import Login from "./LoginPopup";
import NavbarKPlayer from "./NavbarKPlayer";
import ProfilePage from "./Profile/ProfilePage";
import ProjetsBesoinsPage from "./Projets-Besoins/ProjetsBesoinsPage";
import ContactPage from "./content/Contact/ContactPage";
import Mission from "./content/Mission/Mission";
import Reglage from "./content/Reglage/Reglage";

const LayoutKPlayer = () => {
  const [isOnline] = useState(isAuthenticated);
  const [ActiveComponent, setActiveComponent] = useState<ActiveComponent>("company");
  const [showLoginPopup, setShowLoginPopup] = useState(!isOnline);

  const handleIconClick = (id: ActiveComponent) => {
    if (!isOnline && id !== "company") {
      setShowLoginPopup(true);
      return;
    }
    setActiveComponent(id);
  };

  return (
    <div className="w-full bg-gray-100">
      {/* Navbar */}
      <NavbarKPlayer />

      <div className="flex w-full mx-4">
        {/* Sidebar */}
        <SidebarKPlayer
          onIconClick={handleIconClick}
          defaultSelected="dashboard"
        />

        {/* Content  */}
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

      {/* Login Popup */}
      {showLoginPopup && <Login onClose={() => setShowLoginPopup(false)} />}
    </div>
  );
};

export default LayoutKPlayer;
