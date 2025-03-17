import { useEffect, useState } from "react";
import NavbarKPlayer from "./NavbarKPlayer";
import SidebarKPlayer from "./SidebarKPlayer";


import ProjetsBesoins from "./Projets-Besoins/ProjetsBesoins";
import ProfilePage from "./Profile/ProfilePage";
import Mission from "./Mission/Mission";
import ContactPage from "./Contact/ContactPage";
import Reglage from "./Reglage/Reglage";
import { isAuthenticated } from "../../utils/jwt";
import CompetencesEtCriteres from "./Competence/CompetencesEtCriteres";
import CandidatesList from "./Competances/CandidatesList";
import axios from "axios";
import Login from "./Login";
import { SectorSuggestionsResponse } from "./Projets-Besoins/DefinieBesoin_Besoin";
import { Sector } from "./Competence/Competences";


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

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSectors = async () => {
    try {
      const response = await axios.get<SectorSuggestionsResponse>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/suggestions/sectors`
      );
      setSectors(response.data);
    } catch (err) {
      setError('Failed to fetch sectors. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectors();
  }, []);

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
              <CompetencesEtCriteres sectors={sectors} loading={loading} error={error} />
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
