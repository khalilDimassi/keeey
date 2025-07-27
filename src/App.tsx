import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import EmailVerifLayout from './pages/Auth/EmailVerifLayout';
import BaseLayout from './pages/components/BaseLayout';
import AuthPage from './pages/Auth/AuthPage';
import Home from './pages/Home';
import ProfileRoutes from './routes/ProfileRoutes';
import { SidebarProvider } from './pages/components/SidebarContext';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/:userType" element={<AuthPage />} />
        <Route path="/email-verification" element={<EmailVerifLayout />} />

        {/* Profile routes */}
        <Route path="/kprofile/*" element={<SidebarProvider><BaseLayout profileType="kprofile" /></SidebarProvider>}>
          <Route path="*" element={<ProfileRoutes profileType="kprofile" />} />
        </Route>

        {/* Player routes */}
        <Route path="/kplayer/*" element={<BaseLayout profileType="kplayer" />}>
          <Route path="*" element={<ProfileRoutes profileType="kplayer" />} />
        </Route>

        {/* Partner routes */}
        <Route path="/kpartner/*" element={<BaseLayout profileType="kpartner" />}>
          <Route path="*" element={<ProfileRoutes profileType="kpartner" />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
