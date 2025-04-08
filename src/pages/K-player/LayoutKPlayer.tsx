import { useState } from "react";
import { isAuthenticated } from "../../utils/jwt";
import Login from "./LoginPopup";
import NavbarKPlayer from "./NavbarKPlayer";
import SidebarKPlayer, { ActiveComponent } from "./SidebarKPlayer";
import ProfilePage from "./Profile/ProfilePage";
import Mission from "./content/Mission/Mission";
import ContactPage from "./content/Contact/ContactPage";
import Reglage from "./content/Reglage/Reglage";
import CompetancePage from "./Competence/CompetancePage";
import ProjetsBesoinsPage from "./Projets-Besoins/ProjetsBesoinsPage";

const LayoutKPlayer = () => {
  const [isOnline] = useState(isAuthenticated);
  const [ActiveComponent, setActiveComponent] = useState<ActiveComponent>("companyPage");
  const [showLoginPopup, setShowLoginPopup] = useState(!isOnline);

  const handleIconClick = (componentId: ActiveComponent) => {
    if (!isOnline && componentId !== "companyPage") {
      setShowLoginPopup(true);
      return;
    }
    setActiveComponent(componentId);
  };

  return (
    <div className="w-full p-2 bg-gray-100">
      {/* Navbar */}
      <div className="w-full h-12">
        <NavbarKPlayer />
      </div>

      <div className="flex w-full h-[calc(100%-64px)]">
        {/* Sidebar */}
        <div className="w-28">
          <SidebarKPlayer
            onIconClick={handleIconClick}
            defaultSelected={isOnline ? "dashboardPage" : "companyPage"}
          />
        </div>

        {/* Content  */}
        <div className="flex flex-col w-full mt-14 px-6">
          {ActiveComponent === "dashboardPage" && <div>Dashboard Content Here</div>}
          {ActiveComponent === "companyPage" && <CompetancePage />}
          {ActiveComponent === "searchPage" && <ProjetsBesoinsPage />}
          {ActiveComponent === "profilePage" && <ProfilePage />}
          {ActiveComponent === "missionsPage" && <Mission />}
          {ActiveComponent === "contactsPage" && <ContactPage />}
          {ActiveComponent === "settingsPage" && <Reglage />}
        </div>
      </div>

      {/* Login Popup */}
      {showLoginPopup && <Login onClose={() => setShowLoginPopup(false)} />}
    </div>
  );
};

export default LayoutKPlayer;
