import { Route, Routes } from 'react-router-dom';

import ProfileKProfile from '../pages/K-Profile/Competence/ProfileKProfile';
import ContactsKProfile from '../pages/K-Profile/Contact/ContactsKProfile';
import DashboardKProfile from '../pages/K-Profile/Dashboard/DashboardKProfile';
import OpportunitiesKprofle from '../pages/K-Profile/Bookmarks/OpportunitiesKprofile';
import MissionsPage from '../pages/components/Missions/MissionsPage';
import SettingsPage from '../pages/components/Settings/SettingsPage';

const KProfileRoutes = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<DashboardKProfile />} />
            <Route path="profile" element={<ProfileKProfile />} />
            <Route path="opportunities" element={<OpportunitiesKprofle />} />
            <Route path="contacts" element={<ContactsKProfile />} />
            <Route path="missions" element={<MissionsPage />} />
            <Route path="settings" element={<SettingsPage mainColor='#297280' />} />

            <Route path="*" element={<DashboardKProfile />} />
        </Routes>
    );
};

export default KProfileRoutes;