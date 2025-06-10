import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import KProfile from "./assets/k-profile.svg";
import KPlayer from "./assets/k-player.svg";
import KPartner from "./assets/k-partner.svg";
import KeeeyLogo from './assets/KeeyLogo';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className=" flex flex-col items-center py-4">
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
            className={`cursor-pointer flex  justify-center ${image.colSpan || ""}`}
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