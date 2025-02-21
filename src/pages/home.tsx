import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';  // Import Framer Motion
import logo from "./assets/logo.svg";
import KProfile from "./assets/k-profile.svg";
import KPlayer from "./assets/k-player.svg";
import KPartner from "./assets/k-partner.svg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center py-6">
      {/* Logo aligné à gauche */}
      <div className="w-full px-6 mb-10 flex">
        <motion.img
          src={logo}
          alt="Keeey Logo"
          className="w-40"
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Sections avec images */}
      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10 px-6">
        {/* K-Profile */}
        <motion.div 
          onClick={() => navigate("/LoginPage")}
          className="cursor-pointer flex justify-center"
          whileHover={{ scale: 1.05 }} // Scale effect on hover
          whileTap={{ scale: 0.95 }}   // Slight reduction on click
          transition={{ duration: 0.3 }}
        >
          <img src={KProfile} alt="K-Profile" className="w-64 md:w-80 h-auto" />
        </motion.div>

        {/* K-Player */}
        <motion.div 
          onClick={() => navigate("/LoginPageKPlayer")}
          className="cursor-pointer flex justify-center"
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <img src={KPlayer} alt="K-Player" className="w-64 md:w-80 h-auto" />
        </motion.div>

        {/* K-Partner */}
        <motion.div 
          onClick={() => navigate("/LoginPagePartner")} 
          className="cursor-pointer flex justify-center md:col-span-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <img src={KPartner} alt="K-Partner" className="w-72 md:w-96 h-auto" />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
