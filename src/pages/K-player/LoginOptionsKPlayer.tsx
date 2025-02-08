import { useNavigate } from "react-router-dom";
import { FaGoogle, FaApple, FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";
import logo from "../assets/logoKeeePlayer.png";

const LoginOptionsKPlayer = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/AddKPlayer");
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gray-50">
      <motion.div 
        className="absolute top-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 2 }}
      >
        <img src={logo} alt="Keeey Logo" className="object-contain" style={{ width: "15rem" }} />
      </motion.div>

      <motion.div 
        className="relative w-full bg-white p-9 shadow-lg border-green-700"
        style={{ width: "40rem", boxShadow: "0 1px 10px 4px rgba(49, 85, 205, 0.4)", marginTop: "4rem", borderRadius: "20px" }}
        initial={{ x: -80, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ duration: 1 }}
      >
        <h2 className="text-center text-xl font-bold text-gray-700 mb-2">
          Créer un nouveau compte K-Player
        </h2>

        <div className="text-center text-sm text-gray-600 mb-6">
          Vous avez déjà un compte ?
          <a href="/LoginPageKPlayer" className="text-blue-700 ml-1 hover:underline">Connectez-vous</a>
        </div>

        <div className="space-y-3">
          <motion.button 
            className="w-full flex items-center justify-center gap-2 p-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaGoogle className="text-red-500" />
            <span>Continuer avec Google</span>
          </motion.button>

          <motion.button 
            className="w-full flex items-center justify-center gap-2 p-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaApple className="text-black" />
            <span>Continuer avec Apple</span>
          </motion.button>

          <motion.button 
            className="w-full flex items-center justify-center gap-2 p-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaFacebook className="text-blue-600" />
            <span>Continuer avec Facebook</span>
          </motion.button>

          <motion.button
            onClick={handleClick}
            className="w-full flex items-center justify-center gap-2 p-2.5 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition"
            style={{ borderRadius: "20px" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Continuer avec email</span>
          </motion.button>
        </div>

        <motion.button 
          className="w-full text-gray-500 text-sm mt-6 hover:underline"
          onClick={() => navigate("/home")}
          whileHover={{ scale: 1.02 }}
        >
          Continuer en tant qu'invité →
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LoginOptionsKPlayer;