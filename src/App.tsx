
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';


import AddProfile from './pages/AddProfile';
import LoginOptions from './pages/LoginOptions';
import LoginPage from './pages/LoginPage';
import Layout from './pages/K-Profile/Layout';



import AddProfilePlayer from './pages/K-player/AddProfilePlayer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<AddProfilePlayer />} />
        <Route path="/home" element={<Layout />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/LoginOptions" element={<LoginOptions />} />
        <Route path="/Register" element={<AddProfile />} />

      </Routes>
    </Router>
  )
}

export default App
