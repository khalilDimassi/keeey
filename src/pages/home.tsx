
import { useNavigate } from 'react-router-dom';
import logo from "./assets/logo.png";
import KProfile from "./assets/k-profile.png";
import KPlayer from "./assets/k-player.png";
import KPartner from "./assets/k-partner.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center py-6">
      {/* Logo aligné à gauche */}
      <div className="w-full px-6 mb-10 flex">
        <img src={logo} alt="Keeey Logo" className="w-40" />
      </div>

      {/* Sections avec images */}
      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10 px-6">
        {/* K-Profile */}
        <div 
          onClick={() => navigate("/LoginPage")} 
          className="cursor-pointer flex justify-center transform transition duration-300 hover:scale-105"
        >
          <img src={KProfile} alt="K-Profile" className="w-64 md:w-80 h-auto" />
        </div>

        {/* K-Player */}
        <div 
          onClick={() => navigate("/LoginPage")} 
          className="cursor-pointer flex justify-center transform transition duration-300 hover:scale-105"
        >
          <img src={KPlayer} alt="K-Player" className="w-64 md:w-80 h-auto" />
        </div>

        {/* K-Partner */}
        <div 
          onClick={() => navigate("/LoginPage")} 
          className="cursor-pointer flex justify-center md:col-span-2 transform transition duration-300 hover:scale-105"
        >
          <img src={KPartner} alt="K-Partner" className="w-72 md:w-96 h-auto" />
        </div>
      </div>
    </div>
  );
};

export default Home;
