import { Route, Routes } from 'react-router-dom';

import ContactsKPlayer from '../pages/K-player/Contact/ContactsKPlayer';
import ProfileKPlayer from '../pages/K-player/Profile/ProfileKPlayer';
import OpportunitiesKPlayer from '../pages/K-player/Opportunities/OpportunitiesKPlayer';
import OpportunityDetailsKPlayer from '../pages/K-player/Opportunities/content/OpportunityDetailsKPlayer/OpportunityDetailsKPlayer';
import NewOpportunityKPlayer from '../pages/K-player/Opportunities/content/NewOpportunityKPlayer/NewOpportunityKPlayer';
import SettingsPage from '../pages/components/Settings/SettingsPage';
import MissionsPage from '../pages/components/Missions/MissionsPage';

const KPlayerRoutes = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<div>Dashboard Placeholder</div>} />
            <Route path="profile" element={<ProfileKPlayer />} />
            <Route path="opportunities" element={<OpportunitiesKPlayer />} />
            <Route path="opportunities/:id" element={<OpportunityDetailsKPlayer />} />
            <Route path="opportunities/new" element={<NewOpportunityKPlayer />} />
            <Route path="contacts" element={<ContactsKPlayer />} />
            <Route path="missions" element={<MissionsPage />} />
            <Route path="settings" element={<SettingsPage mainColor='#215A96' />} />

            <Route path="*" element={<ProfileKPlayer />} />
        </Routes>
    );
};

export default KPlayerRoutes;