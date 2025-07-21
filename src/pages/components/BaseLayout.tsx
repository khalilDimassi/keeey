// BaseLayout.tsx
import { Outlet } from 'react-router-dom';
import { isAuthenticated } from "../../utils/jwt";
import { useState } from "react";
import { ProfileType } from "./types";
import { NavbarKProfile, NavbarKPlayer, NavbarKPartner } from './Navbar';
import { SidebarKProfile, SidebarKPlayer, SidebarKPartner } from './Sidebar';

import LoginPopup from './LoginPopup';

interface BaseLayoutProps {
    profileType: ProfileType;
}

const BaseLayout = ({ profileType }: BaseLayoutProps) => {
    const navbarComponents = {
        kprofile: NavbarKProfile,
        kplayer: NavbarKPlayer,
        kpartner: NavbarKPartner,
    };

    const sidebarComponents = {
        kprofile: SidebarKProfile,
        kplayer: SidebarKPlayer,
        kpartner: SidebarKPartner,
    };

    const NavbarComponent = navbarComponents[profileType];
    const SidebarComponent = sidebarComponents[profileType];
    const [showLoginPopup, setShowLoginPopup] = useState(!isAuthenticated);

    return (
        <div className={`w-full min-h-screen bg-slate-100 ${profileType === "kplayer" ? "overflow-hidden" : "p-2"}`}>
            {showLoginPopup && <LoginPopup profileType={profileType} onClose={() => setShowLoginPopup(false)} />}

            <NavbarComponent />
            <div className="flex items-start gap-4 w-full h-full px-4">
                <SidebarComponent />
                <div className="flex flex-col w-full mt-3 px-3">
                    <Outlet />
                </div>
            </div>
            <footer className="flex items-center justify-center w-full h-16 my-4 py-4 bg-slate-100 text-gray-600">
                <p className="text-sm">© 2025 Keeey. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default BaseLayout;