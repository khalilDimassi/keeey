
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/home';
import AuthPage from './pages/Auth/AuthPage';
import LayoutKPlayer from './pages/K-player/LayoutKPlayer';
import LayoutKPartner from './pages/K-Partner/LayoutKPartner';
import LayoutKProfile from './pages/K-Profile/LayoutKProfile';
import EmailVerifLayout from './pages/Auth/EmailVerifLayout';


function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/test" element={<ProfilePage />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/Login/:userType" element={<AuthPage />} />
        <Route path="/Layout/kprofile" element={<LayoutKProfile />} />
        <Route path="/Layout/kplayer" element={<LayoutKPlayer />} />
        <Route path="/Layout/kpartner" element={<LayoutKPartner />} />

        <Route path="/email-verification" element={<EmailVerifLayout />} />

      </Routes>
    </Router>
  )
}

export default App
