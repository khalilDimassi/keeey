import { useState, useEffect } from "react";
import { isAuthenticated } from "../../utils/jwt";
import { Search } from "lucide-react";
import { SidebarKPartner } from "../components/Sidebar";
import { ActiveComponent } from "../components/types";
import CandidatesList from "./Mode_Guest_Opportunites/CandidatesList";
import Profile_besoin_specifique from "./Mode_Guest_Opportunites/Profile_besoin_specifique";
import Opportunite from "./Mode_Guest_Opportunites/Opportunite";
import Opportunite_pour_consultant from "./Mode_Guest_Opportunites/Opportunite_pour_consultant";
import Login from "./LoginPopup";
import { NavbarKPartner } from "../components/Navbar";

const LayoutKPartner = () => {
  const [_showProfile, setShowProfile] = useState(false);
  const [isOnline] = useState(isAuthenticated); // Connection state
  const [activeComponent, setActiveComponent] = useState<ActiveComponent>(
    isOnline ? "dashboard" : "competence"
  );
  const [showLoginPopup, setShowLoginPopup] = useState(!isAuthenticated); // Login popup state

  // New state for controlling visibility of different components
  const [showProfileSearch, setShowProfileSearch] = useState(true);
  const [showOpportunitySearch, setShowOpportunitySearch] = useState(false);
  const [showCandidatesList, setShowCandidatesList] = useState(true);
  const [showOpportuniteList, setShowOpportuniteList] = useState(false);
  const [activeView, setActiveView] = useState<'profile' | 'opportunite'>('profile');

  // Added from older code
  const [isSidebarHorizontal, setIsSidebarHorizontal] = useState(false);
  useEffect(() => {
    if (!isAuthenticated()) {
      setActiveComponent("competence");
    }
  }, []);

  const handleIconClick = (id: ActiveComponent) => {
    if (!isOnline && id !== "competence") {
      setShowLoginPopup(true);
      return;
    }

    setActiveComponent(id);

    // When clicking competence icon, show the appropriate components
    if (id === "competence") {
      // Reset sidebar to vertical when accessing competence
      setIsSidebarHorizontal(false);

      if (activeView === 'profile') {
        setShowProfileSearch(true);
        setShowCandidatesList(true);
        setShowOpportunitySearch(false);
        setShowOpportuniteList(false);
      } else {
        setShowProfileSearch(false);
        setShowCandidatesList(false);
        setShowOpportunitySearch(true);
        setShowOpportuniteList(true);
      }
    } else {
      setShowProfile(id === "user");
    }
  };

  const handleCloseProfile = () => {
    setShowProfileSearch(false);
    setShowOpportunitySearch(false);

    // Added from older code - set sidebar to horizontal when closing
    setIsSidebarHorizontal(true);
  };

  const handleProfileButtonClick = () => {
    setActiveView('profile');
    setShowProfileSearch(true);
    setShowCandidatesList(true);
    setShowOpportunitySearch(false);
    setShowOpportuniteList(false);
  };

  const handleOpportunityButtonClick = () => {
    setActiveView('opportunite');
    setShowProfileSearch(false);
    setShowCandidatesList(false);
    setShowOpportunitySearch(true);
    setShowOpportuniteList(true);
  };

  // Close button component
  const CloseButton = () => (
    <div className="flex justify-center mt-4 mb-6">
      <button
        name='close'
        className="rounded-full p-1"
        onClick={handleCloseProfile}
      >
        <svg width="40" height="40" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_d_931_7172)">
            <path d="M16 27.5537H40" stroke="#A58E56" strokeWidth="3" strokeLinecap="round" />
            <mask id="path-2-inside-1_931_7172" fill="white">
              <path d="M46 27.5539C46 37.2487 37.9411 45.1078 28 45.1078C18.0589 45.1078 10 37.2487 10 27.5539C10 17.8592 18.0589 10 28 10C37.9411 10 46 17.8592 46 27.5539ZM12.0581 27.5539C12.0581 36.1402 19.1955 43.1007 28 43.1007C36.8045 43.1007 43.9419 36.1402 43.9419 27.5539C43.9419 18.9676 36.8045 12.0071 28 12.0071C19.1955 12.0071 12.0581 18.9676 12.0581 27.5539Z" />
            </mask>
            <path d="M46 27.5539C46 37.2487 37.9411 45.1078 28 45.1078C18.0589 45.1078 10 37.2487 10 27.5539C10 17.8592 18.0589 10 28 10C37.9411 10 46 17.8592 46 27.5539ZM12.0581 27.5539C12.0581 36.1402 19.1955 43.1007 28 43.1007C36.8045 43.1007 43.9419 36.1402 43.9419 27.5539C43.9419 18.9676 36.8045 12.0071 28 12.0071C19.1955 12.0071 12.0581 18.9676 12.0581 27.5539Z" fill="#A58E56" stroke="#A58E56" strokeWidth="2" mask="url(#path-2-inside-1_931_7172)" />
          </g>
          <defs>
            <filter id="filter0_d_931_7172" x="0" y="0" width="56" height="55.1079" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset />
              <feGaussianBlur stdDeviation="5" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_931_7172" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_931_7172" result="shape" />
            </filter>
          </defs>
        </svg>
      </button>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <NavbarKPartner />

      {isSidebarHorizontal ? (
        // Horizontal sidebar layout when closed
        <div className="w-full flex flex-col px-10">
          <div className="w-[98%]">
            <SidebarKPartner
              onIconClick={handleIconClick}
              defaultSelected={isOnline ? "dashboard" : "competence"}
              horizontal={isSidebarHorizontal}
              setHorizontal={setIsSidebarHorizontal}
            />
          </div>
          {/* List Components */}
          <div className="w-full mt-28">
            {showCandidatesList && <CandidatesList />}
            {showOpportuniteList && <Opportunite />}
          </div>
        </div>
      ) : (
        // Vertical sidebar layout - original layout
        <div className="flex w-full px-3">
          <SidebarKPartner
            onIconClick={handleIconClick}
            defaultSelected={isOnline ? "dashboard" : "competence"}
            horizontal={isSidebarHorizontal}
            setHorizontal={setIsSidebarHorizontal}
          />

          <div className="flex flex-col w-full" style={{ marginTop: "3rem" }}>
            {activeComponent === "competence" && !isOnline && (
              <>
                {(showProfileSearch || showOpportunitySearch) && (
                  <>
                    {/* Search Buttons - centered */}
                    <div className="flex justify-center w-full mb-8">
                      <div className="flex flex-col sm:flex-row gap-4 max-w-5xl w-full">
                        <button
                          className={`flex-1 px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-colors ${activeView === 'profile'
                            ? 'bg-[#B5A48B] text-white hover:bg-[#a39379]'
                            : 'bg-white  border-[#B5A48B] text-[#B5A48B] hover:bg-gray-50'
                            }`}
                          onClick={handleProfileButtonClick}
                        >
                          <Search className="w-5 h-5" />
                          <span>Vous recherchez un Profile pour un besoin spécifique</span>
                        </button>
                        <button
                          className={`flex-1 px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-colors ${activeView === 'opportunite'
                            ? 'bg-[#B5A48B] text-white hover:bg-[#a39379]'
                            : 'bg-white  border-[#B5A48B] text-[#B5A48B] hover:bg-gray-50'
                            }`}
                          onClick={handleOpportunityButtonClick}
                        >
                          <Search className="w-5 h-5" />
                          <span>Vous recherchez une opportunité pour votre consultant</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Profile Components with Close Button directly underneath */}
                {showProfileSearch && (
                  <>
                    <Profile_besoin_specifique />
                    <CloseButton />
                  </>
                )}

                {showOpportunitySearch && (
                  <>
                    <Opportunite_pour_consultant />
                    <CloseButton />
                  </>
                )}

                {/* List Components */}
                <div className="w-full mt-5">
                  {showCandidatesList && <CandidatesList />}
                  {showOpportuniteList && <Opportunite />}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {showLoginPopup && <Login onClose={() => setShowLoginPopup(false)} />}
    </div>
  );
};

export default LayoutKPartner;