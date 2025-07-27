import { Route, Routes } from 'react-router-dom';
import { isAuthenticated } from '../utils/jwt';

import BookmarksKProfile from '../pages/K-Profile/Bookmarks/BookmarksKprofile';
import JobOpportunities from '../pages/K-Profile/Competence/content/JobOpportunities';
import Oportunite from '../pages/K-Profile/Competence/mode guest/Oportunite';
import ProfileKProfile from '../pages/K-Profile/Competence/ProfileKProfile';
import ContactsKProfile from '../pages/K-Profile/Contact/ContactsKProfile';
import DashboardKProfile from '../pages/K-Profile/Dashboard/DashboardKProfile';
import MissionsKProfile from '../pages/K-Profile/Missions/MissionsKProfile';
import ReglageKProfile from '../pages/K-Profile/Settings/ReglageKProfile';
import OpportunitiesListKprofile from '../pages/K-Profile/Competence/OpportunitiesListKprofile';

const KProfileRoutes = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<DashboardKProfile />} />
            <Route path="bookmarks" element={<BookmarksKProfile />} />
            <Route path="contacts" element={<ContactsKProfile />} />
            <Route path="missions" element={<MissionsKProfile />} />
            <Route path="settings" element={<ReglageKProfile />} />

            <Route path="profile" element={<ProfileKProfile />} />
            <Route path="opportunities" element={<OpportunitiesListKprofile />} />

            <Route path="*" element={isAuthenticated() ? <JobOpportunities /> : <Oportunite />} />
        </Routes>
    );
};

export default KProfileRoutes;