import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";
import { FaGoogle, FaApple, FaFacebook, FaEnvelope } from "react-icons/fa";

const LoginOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen px-1 bg-gray-50">
      <motion.div 
        className="absolute top-7 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <img src={logo} alt="Keeey Logo" className="object-contain" style={{ width: "15rem" }} />
      </motion.div>

      <motion.div 
        className="relative w-full bg-white p-9 shadow-lg"
        style={{ width: "40rem", boxShadow: "0 1px 10px 4px rgba(34, 146, 34, 0.4)", marginTop: "4rem", borderRadius: "20px" }}
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-center text-xl font-bold text-gray-700 mb-2">
          Créer un nouveau compte K-Profil
        </h2>
        
        <div className="text-center text-sm text-gray-600 mb-6">
          Vous avez déjà un compte ? 
          <a href="/LoginPage" className="text-green-700 ml-1 hover:underline">Connectez-vous</a>
        </div>

        <div className="space-y-1 mt-6 p-3">
          {[
            { Icon: FaGoogle, text: "Continuer avec Google", color: "text-red-500" },
            { Icon: FaApple, text: "Continuer avec Apple", color: "text-black" },
            { Icon: FaFacebook, text: "Continuer avec Facebook", color: "text-blue-600" }
          ].map((item, index) => (
            <motion.button
              key={item.text}
              className="w-full flex items-center justify-center gap-2 p-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.Icon className={item.color} />
              <span>{item.text}</span>
            </motion.button>
          ))}

          <motion.button
            onClick={() => navigate('/Register')}
            className="w-full flex items-center justify-center gap-2 p-2.5 bg-green-700 text-white rounded-lg hover:bg-green-600 transition mt-7"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaEnvelope className="text-white" />
            <span>Continuer avec email</span>
          </motion.button>
        </div>

        <motion.button 
          className="w-full text-gray-500 text-sm mt-6 hover:underline"
          onClick={() => navigate("/Layout")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          Continuer en tant qu'invité →
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LoginOptions;