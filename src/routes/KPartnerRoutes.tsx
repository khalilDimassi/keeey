import { Route, Routes } from 'react-router-dom';

const KPartnerRoutes = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<div>Dashboard Placeholder</div>} />
            {/* Add other partner routes as needed */}

            <Route path="*" element={<div>Dashboard Placeholder</div>} />
        </Routes>
    );
};

export default KPartnerRoutes;