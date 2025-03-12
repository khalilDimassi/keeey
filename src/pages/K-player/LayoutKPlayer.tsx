import { useState } from "react";
import NavbarKPlayer from "./NavbarKPlayer";
import SidebarKPlayer from "./SidebarKPlayer";
<<<<<<< HEAD
import CompetencesEtCriteres from "./Competances/CompetencesEtCriteres";
import CandidatesList from "./Competances/CandidatesList";
import Login from "./Login"; // Import the login popup component
=======
import CompetencesEtCriteres from "./Competence/CompetencesEtCriteres";
import CandidatesList from "./CandidatesList";
import Login from "./Login";
>>>>>>> d20a625c1091dc0f0a742e527aa2ae44693059da
import ProjetsBesoins from "./Projets-Besoins/ProjetsBesoins";
import ProfilePage from "./Profile/ProfilePage";
import Mission from "./Mission/Mission";
import ContactPage from "./Contact/ContactPage";
import Reglage from "./Reglage/Reglage";
import { isAuthenticated } from "../../utils/jwt";


type IconId =
  | "dashboard"
  | "company"
  | "userSearch"
  | "userStar"
  | "target"
  | "settings"
  | "profile"
  | null;

const LayoutKPlayer = () => {
  const [isOnline] = useState(isAuthenticated);
  const [activeComponent, setActiveComponent] = useState<IconId>(
    isOnline ? "dashboard" : "company"
  );
  const [showLoginPopup, setShowLoginPopup] = useState(!isOnline);

  const handleIconClick = (componentId: IconId) => {
    if (!isOnline && componentId !== "company") {
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

      {/* Sidebar + Content Layout */}
      <div className="flex w-full h-[calc(100%-64px)]">
        {/* Sidebar */}
        <div className="w-28">
          <SidebarKPlayer
            onIconClick={handleIconClick}
            defaultSelected={isOnline ? "dashboard" : "company"}
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
          {activeComponent === "userSearch" && <ProjetsBesoins />}

          {/* Show ProfilePage when userStar is clicked */}
          {activeComponent === "userStar" && <ProfilePage />}

          {/* Show Mission when target is clicked */}
          {activeComponent === "target" && <Mission />}

          {/* Show ContactPage when profile is clicked */}
          {activeComponent === "profile" && <ContactPage />}

          {/* ✅ Show Reglage when settings is clicked */}
          {activeComponent === "settings" && <Reglage />}
        </div>
      </div>

      {/* Login Popup */}
      {showLoginPopup && <Login onClose={() => setShowLoginPopup(false)} />}
    </div>
  );
};

export default LayoutKPlayer;
