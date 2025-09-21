import { Route, Routes } from 'react-router-dom';
import { isAuthenticated } from '../utils/jwt';

import ProfileKProfile from '../pages/K-Profile/Competence/ProfileKProfile';
import ContactsKProfile from '../pages/K-Profile/Contact/ContactsKProfile';
import DashboardKProfile from '../pages/K-Profile/Dashboard/DashboardKProfile';
import OpportunitiesKprofle from '../pages/K-Profile/Bookmarks/OpportunitiesKprofile';
import GuestList from '../pages/K-Profile/Bookmarks/mod guest/GuestList';
import MissionsPage from '../pages/components/Missions/MissionsPage';
import SettingsPage from '../pages/components/Settings/SettingsPage';

const KProfileRoutes = () => {
    return (
        <Routes>
            <Route path="dashboard" element={isAuthenticated() ? <DashboardKProfile /> : <ProfileKProfile />} />
            <Route path="profile" element={<ProfileKProfile />} />
            <Route path="opportunities" element={isAuthenticated() ? <OpportunitiesKprofle /> : <GuestList />} />
            <Route path="contacts" element={isAuthenticated() ? <ContactsKProfile /> : <ProfileKProfile />} />
            <Route path="missions" element={isAuthenticated() ? <MissionsPage /> : <ProfileKProfile />} />
            <Route path="settings" element={isAuthenticated() ? <SettingsPage mainColor='#297280' /> : <ProfileKProfile />} />

            <Route path="*" element={<ProfileKProfile />} />
        </Routes>
    );
};

export default KProfileRoutes;