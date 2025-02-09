
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';


import AddProfile from './pages/K-Profile/AddProfile';
import LoginOptions from './pages/K-Profile/LoginOptions';
import LoginPage from './pages/K-Profile/LoginPage';
import Layout from './pages/K-Profile/Layout';




import LoginOptionsKPlayer from './pages/K-player/LoginOptionsKPlayer';
import LoginPageKPlayer from './pages/K-player/LoginPageKPlayer';
import AddKPlayer from './pages/K-player/AddKPlayer';
import LoginOptionsPartner from './pages/K-Partner/LoginOptionsPartner';
import LoginPagePartner from './pages/K-Partner/LoginPagePartner';
import AddPartner from './pages/K-Partner/AddPartner';
import LayoutKPlayer from './pages/K-player/LayoutKPlayer';
import LayoutKPartner from './pages/K-Partner/LayoutKPartner';

import JobOpportunities2 from './pages/K-Profile/JobOpportunities2';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<JobOpportunities2 />} />

        <Route path="/LayoutKPartner" element={<LayoutKPartner />} />
        <Route path="/LoginOptionsPartner" element={<LoginOptionsPartner />} />
        <Route path="/LoginPagePartner" element={<LoginPagePartner />} />
        <Route path="/AddPartner" element={<AddPartner />} />



        <Route path="/LayoutKPlayer" element={<LayoutKPlayer />} />
        <Route path="/LoginOptionsKPlayer" element={<LoginOptionsKPlayer />} />
        <Route path="/LoginPageKPlayer" element={<LoginPageKPlayer />} />
        <Route path="/AddKPlayer" element={<AddKPlayer />} />




        <Route path="/Layout" element={<Layout />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/LoginOptions" element={<LoginOptions />} />
        <Route path="/Register" element={<AddProfile />} />

      </Routes>
    </Router>
  )
}

export default App
