import { SidebarKProfile, SidebarKPlayer, SidebarKPartner } from "../components/Sidebar";
import { NavbarKProfile, NavbarKPlayer, NavbarKPartner } from "../components/Navbar";
import { ActiveComponent } from "../components/types";
import { isAuthenticated } from "../../utils/jwt";
import { ArrowDownCircle } from "lucide-react";
import { ProfileType } from "./types";
import { useState } from "react";

// Import all content components  
import LoginPopup from "./LoginPopup";

import DashboardKProfile from "../K-Profile/Dashboard/DashboardKProfile";
import JobOpportunities from "../K-Profile/Competence/content/JobOpportunities";
import Oportunite from "../K-Profile/Competence/mode guest/Oportunite";
import ProfileKProfile from "../K-Profile/Competence/ProfileKProfile";
import ContactsKProfile from "../K-Profile/Contact/ContactsKProfile";
import MissionsKProfile from "../K-Profile/Missions/MissionsKProfile";
import ReglageKProfile from "../K-Profile/Settings/ReglageKProfile";
import BookmarksKProfile from "../K-Profile/Bookmarks/BookmarksKprofile";

import ContactsKPlayer from "../K-player/Contact/ContactsKPlayer";
import MissionsKplayer from "../K-player/Mission/MissionsKplayer";
import ReglageKPlayer from "../K-player/Reglage/ReglageKPlayer";
import ProfileKPlayer from "../K-player/Profile/ProfileKPlayer";
import ProjetsBesoinsKPlayer from "../K-player/Projets-Besoins/ProjetsBesoinsKPlayer";


interface LayoutConfig {
    navbar: React.ComponentType;
    sidebar: React.ComponentType<any>;
    defaultComponent: ActiveComponent;
    contentComponents: Record<ActiveComponent, React.ComponentType>;
    mainColor: string;
}

type UnifiedLayoutProps = {
    profileType: ProfileType;
};

const UnifiedLayout = ({ profileType }: UnifiedLayoutProps) => {
    const layoutConfigs: Record<ProfileType, LayoutConfig> = {
        kprofile: {
            navbar: NavbarKProfile,
            sidebar: SidebarKProfile,
            defaultComponent: "competence",
            mainColor: "#297280",
            contentComponents: {
                dashboard: DashboardKProfile,
                missions: MissionsKProfile,
                bookmark: BookmarksKProfile,
                contact: ContactsKProfile,
                settings: ReglageKProfile,
                competence: () => <ProfileKProfile onClose={() => { }} />,
                company: () => <div>Placeholder</div>,
                search: () => <div>Placeholder</div>,
                profile: () => <div>Placeholder</div>,
                contacts: () => <div>Placeholder</div>,
                fileText1: () => <div>Placeholder</div>,
                target: () => <div>Placeholder</div>,
                user: () => <div>Placeholder</div>
            },
        },
        kplayer: {
            navbar: NavbarKPlayer,
            sidebar: SidebarKPlayer,
            defaultComponent: "profile",
            mainColor: "#215A96",
            contentComponents: {
                dashboard: () => <div>Dashboard Placeholder</div>,
                profile: ProfileKPlayer,
                search: ProjetsBesoinsKPlayer,
                contacts: ContactsKPlayer,
                missions: MissionsKplayer,
                settings: ReglageKPlayer,
                competence: () => <div>Placeholder</div>,
                bookmark: () => <div>Placeholder</div>,
                contact: () => <div>Placeholder</div>,
                company: () => <div>Placeholder</div>,
                fileText1: () => <div>Placeholder</div>,
                target: () => <div>Placeholder</div>,
                user: () => <div>Placeholder</div>
            },
        },
        kpartner: {
            navbar: NavbarKPartner,
            sidebar: SidebarKPartner,
            defaultComponent: "profile",
            mainColor: "#A89B7B",
            contentComponents: {
                dashboard: () => <div>Placeholder</div>,
                competence: () => <div>Placeholder</div>,
                bookmark: () => <div>Placeholder</div>,
                contact: () => <div>Placeholder</div>,
                missions: () => <div>Placeholder</div>,
                settings: () => <div>Placeholder</div>,
                company: () => <div>Placeholder</div>,
                search: () => <div>Placeholder</div>,
                profile: () => <div>Placeholder</div>,
                contacts: () => <div>Placeholder</div>,
                fileText1: () => <div>Placeholder</div>,
                target: () => <div>Placeholder</div>,
                user: () => <div>Placeholder</div>
            },
        },
    };

    const config = layoutConfigs[profileType];
    const NavbarComponent = config.navbar;
    const SidebarComponent = config.sidebar;

    const [isOnline] = useState(isAuthenticated);
    const [showLoginPopup, setShowLoginPopup] = useState(!isAuthenticated);
    const [activeComponent, setActiveComponent] = useState<ActiveComponent>(config.defaultComponent);
    const [isSidebarHorizontal, setIsSidebarHorizontal] = useState(false);
    const [showKProfile, setShowKProfile] = useState(profileType === "kprofile");

    const handleIconClick = (componentId: ActiveComponent) => {
        if (!isOnline && componentId !== config.defaultComponent) {
            setShowLoginPopup(true);
            return;
        }
        setActiveComponent(componentId);
        if (profileType === "kprofile") {
            setIsSidebarHorizontal(false);
            setShowKProfile(componentId === "competence");
        }
    };

    const handleCloseKProfile = () => {
        setShowKProfile(false);
        setIsSidebarHorizontal(true);
    };

    const renderContent = () => {
        const ContentComponent = config.contentComponents[activeComponent];

        if (profileType === "kprofile" && activeComponent === "competence") {
            return showKProfile ? (
                <ProfileKProfile onClose={handleCloseKProfile} />
            ) : isOnline ? (
                <>
                    <div className="flex flex-col items-center justify-center">
                        <button onClick={() => handleIconClick("competence")}>
                            <ArrowDownCircle size={32} color={config.mainColor} />
                        </button>
                    </div>
                    <JobOpportunities />
                </>
            ) : (
                <>
                    <div className="flex flex-col items-center justify-center">
                        <button onClick={() => handleIconClick("competence")}>
                            <ArrowDownCircle size={32} color={config.mainColor} />
                        </button>
                    </div>
                    <Oportunite />
                </>
            );
        }

        return <ContentComponent />;
    };

    return (
        <div className={`w-full min-h-screen bg-slate-100 ${profileType === "kplayer" ? "overflow-hidden" : "p-2"}`}>
            {showLoginPopup && <LoginPopup profileType={profileType} onClose={() => setShowLoginPopup(false)} />}

            <NavbarComponent />
            <div className={`flex ${isSidebarHorizontal ? "flex-col items-center" : "items-start"} gap-4 w-full h-full px-4`}>
                <SidebarComponent
                    onIconClick={handleIconClick}
                    defaultSelected={config.defaultComponent}
                    horizontal={isSidebarHorizontal}
                    setHorizontal={profileType === "kprofile" ? setIsSidebarHorizontal : undefined}
                />
                <div className="flex flex-col w-full mt-3 px-3">
                    {renderContent()}
                </div>
            </div>
            <footer className="flex items-center justify-center w-full h-16 my-4 py-4 bg-slate-100 text-gray-600">
                <p className="text-sm">© 2025 Keeey. All rights reserved.</p>
            </footer>
        </div>
    );
};

export const LayoutKProfile = () => <UnifiedLayout profileType="kprofile" />;
export const LayoutKPlayer = () => <UnifiedLayout profileType="kplayer" />;
export const LayoutKPartner = () => <UnifiedLayout profileType="kpartner" />;

export default UnifiedLayout;