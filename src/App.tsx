import { LayoutKPlayer, LayoutKProfile } from './pages/components/Layout';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import EmailVerifLayout from './pages/Auth/EmailVerifLayout';
import AuthPage from './pages/Auth/AuthPage';
import Home from './pages/home';

// TODO: unified
import LayoutKPartner from './pages/K-Partner/LayoutKPartner';



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
