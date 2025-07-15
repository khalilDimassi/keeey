import { Route, Routes } from 'react-router-dom';

import ContactsKPlayer from '../pages/K-player/Contact/ContactsKPlayer';
import MissionsKplayer from '../pages/K-player/Mission/MissionsKplayer';
import ProfileKPlayer from '../pages/K-player/Profile/ProfileKPlayer';
import ProjetsBesoinsKPlayer from '../pages/K-player/Projets-Besoins/ProjetsBesoinsKPlayer';
import ReglageKPlayer from '../pages/K-player/Reglage/ReglageKPlayer';

const KPlayerRoutes = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<div>Dashboard Placeholder</div>} />
            <Route path="profile" element={<ProfileKPlayer />} />
            <Route path="projects" element={<ProjetsBesoinsKPlayer />} />
            <Route path="contacts" element={<ContactsKPlayer />} />
            <Route path="missions" element={<MissionsKplayer />} />
            <Route path="settings" element={<ReglageKPlayer />} />

            <Route path="*" element={<ProfileKPlayer />} />
        </Routes>
    );
};

export default KPlayerRoutes;