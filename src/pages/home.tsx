import { isAuthenticated, getAuthHeader, saveUserId } from '../utils/jwt';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import KPartner from "./assets/k-partner.svg";
import KProfile from "./assets/k-profile.svg";
import KPlayer from "./assets/k-player.svg";
import KeeeyLogo from './assets/KeeyLogo';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // First check if user is authenticated
      if (!isAuthenticated()) {
        setIsLoading(false);
        return;
      }

      // If authenticated, fetch profile and redirect
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/profile`,
          {
            headers: getAuthHeader(),
          }
        );

        const { ID, user_role } = response.data.user;
        saveUserId(ID);

        // Redirect based on role
        if (user_role) {
          const normalizedRole = user_role.toLowerCase().replace(/-/g, '');
          navigate(`/Layout/${normalizedRole.toLowerCase()}`);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="mb-8">
          <KeeeyLogo color="#297280" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#297280]"></div>
          <span className="text-lg text-gray-600">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-4">
      {/* Logo aligné à gauche */}
      <div className="w-full px-6 mb-4 flex">
        <motion.div
          className="w-full px-6 mb-4 flex"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <KeeeyLogo color="#297280" />
        </motion.div>
      </div>

      {/* Titre et sous-titre */}
      <motion.div
        className="text-center mb-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.7 }}
      >
        <h1 className="text-xl md:text-2xl font-medium mb-4">
          La plateforme de mise en relation professionnelle all-in-one qui vous fait gagner du temps.
        </h1>
        <h2 className="text-lg md:text-xl font-medium">
          Sélectionnez votre environnement et laissez vous guider !
        </h2>
      </motion.div>

      {/* Sections avec images */}
      <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 px-6">
        {[
          { src: KProfile, alt: "kprofile" },
          { src: KPlayer, alt: "kplayer" },
          { src: KPartner, alt: "kpartner", colSpan: "md:col-span-2" }
        ].map((image, index) => (
          <motion.div
            key={index}
            onClick={() => navigate(`/Login/${image.alt}`)}
            className={`cursor-pointer flex justify-center ${image.colSpan || ""}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-72 md:w-96 h-auto"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;