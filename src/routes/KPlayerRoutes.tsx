import { Route, Routes } from 'react-router-dom';

import ContactsKPlayer from '../pages/K-player/Contact/ContactsKPlayer';
import MissionsKplayer from '../pages/K-player/Mission/MissionsKplayer';
import ReglageKPlayer from '../pages/K-player/Reglage/ReglageKPlayer';
import ProfileKPlayer from '../pages/K-player/Profile/ProfileKPlayer';
import OpportunitiesKPlayer from '../pages/K-player/Opportunities/OpportunitiesKPlayer';
import OpportunityDetailsKPlayer from '../pages/K-player/Opportunities/content/OpportunityDetailsKPlayer/OpportunityDetailsKPlayer';
import NewOpportunityKPlayer from '../pages/K-player/Opportunities/content/NewOpportunityKPlayer/NewOpportunityKPlayer';

const KPlayerRoutes = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<div>Dashboard Placeholder</div>} />
            <Route path="profile" element={<ProfileKPlayer />} />
            <Route path="opportunities" element={<OpportunitiesKPlayer />} />
            <Route path="opportunities/:id" element={<OpportunityDetailsKPlayer />} />
            <Route path="opportunities/new" element={<NewOpportunityKPlayer />} />
            <Route path="contacts" element={<ContactsKPlayer />} />
            <Route path="missions" element={<MissionsKplayer />} />
            <Route path="settings" element={<ReglageKPlayer />} />

            <Route path="*" element={<ProfileKPlayer />} />
        </Routes>
    );
};

export default KPlayerRoutes;