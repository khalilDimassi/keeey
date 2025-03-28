
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Layout from './pages/K-Profile/Layout';
//  import LoginOptions from './pages/K-Profile/LoginPage_OptionKprofile/LoginOptions';
// import LoginPage from './pages/K-Profile/LoginPage_OptionKprofile/LoginPage';




import LoginOptionsKPlayer from './pages/K-player/LoginPage_OptionKplayer/LoginOptionsKPlayer';
import LoginPageKPlayer from './pages/K-player/LoginPage_OptionKplayer/LoginPageKPlayer';
import AddKPlayer from './pages/K-player/LoginPage_OptionKplayer/AddKPlayer';

import LayoutKPlayer from './pages/K-player/LayoutKPlayer';
import LayoutKPartner from './pages/K-Partner/LayoutKPartner';

import CandidatesList from './pages/K-player/Competances/CandidatesList';


import ProfilePage from './pages/K-player/Profile/ProfilePage';
import LoginContainer from './pages/K-Profile/LoginPage_OptionKprofile/LoginContainer';
// import CandidatesList from './pages/K-player/CandidatesList';

import AddProfile from './pages/K-Profile/LoginPage_OptionKprofile/AddProfile';
import LoginContainerKPlayer from './pages/K-player/LoginPage_OptionKplayer/LoginContainer';
import AddPartner from './pages/K-Partner/LoginPage_OptionKpartner/AddPartner';
import LoginContainerKPartner from './pages/K-Partner/LoginPage_OptionKpartner/LoginContainer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<ProfilePage />} />


        <Route path="/LayoutKPartner" element={<LayoutKPartner />} />
        
        <Route path="/AddPartner" element={<AddPartner />} />



        <Route path="/LayoutKPlayer" element={<LayoutKPlayer />} />
        <Route path="/LoginOptionsKPlayer" element={<LoginOptionsKPlayer />} />
        <Route path="/LoginPageKPlayer" element={<LoginPageKPlayer />} />
        <Route path="/AddKPlayer" element={<AddKPlayer />} />


        <Route path="/LoginKplayer" element={<LoginContainerKPlayer />} />
        <Route path="/Login" element={<LoginContainer />} />
        <Route path="/LoginKPartner" element={<LoginContainerKPartner />} />

        <Route path="/Layout" element={<Layout />} />
    

        <Route path="/Register" element={<AddProfile />} />

      </Routes>
    </Router>
  )
}

export default App
