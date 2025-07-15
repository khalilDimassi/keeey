import { Routes, Route, Navigate } from 'react-router-dom';
import { ProfileType } from '../pages/components/types';

import KProfileRoutes from './KProfileRoutes';
import KPartnerRoutes from './KPartnerRoutes';
import KPlayerRoutes from './KPlayerRoutes';

interface ProfileRoutesProps {
    profileType: ProfileType;
}

const ProfileRoutes = ({ profileType }: ProfileRoutesProps) => {
    const defaultRoutes = {
        kprofile: <Navigate to="/kprofile/profile" replace />,
        kplayer: <Navigate to="/kplayer/profile" replace />,
        kpartner: <Navigate to="/kpartner/profile" replace />
    };

    const profileRoutes = {
        kprofile: <KProfileRoutes />,
        kplayer: <KPlayerRoutes />,
        kpartner: <KPartnerRoutes />
    };

    return (
        <Routes>
            <Route path="/" element={defaultRoutes[profileType]} />
            <Route path="/*" element={profileRoutes[profileType]} />
        </Routes>
    );
};

export default ProfileRoutes;