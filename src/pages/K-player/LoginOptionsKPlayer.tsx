import { useNavigate } from "react-router-dom";
import { FaGoogle, FaApple, FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";
import logo from "../assets/logoKeeePlayer.png";

const LoginOptionsKPlayer = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen px-2 bg-gray-50">
      <motion.div
        className="absolute top-14 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <img
          src={logo}
          alt="Keeey Logo"
          className="object-contain cursor-pointer"
          style={{ width: "13rem" }}
          onClick={() => navigate("/")}
        />
      </motion.div>

      <motion.div
        className="relative w-full max-w-xl  bg-white p-10 shadow-md"
        style={{
          boxShadow: "0 1px 6px 2px rgba(49, 85, 205, 0.3)",
          marginTop: "3rem",
          borderRadius: "15px",
        }}
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-center text-lg font-bold text-gray-700 mb-2">
          Créer un nouveau compte K-Player
        </h2>

        <div className="text-center text-xs text-gray-600 mb-4">
          Vous avez déjà un compte ?
          <a
            href="/LoginPageKPlayer"
            className="text-blue-700 ml-1 hover:underline"
          >
            Connectez-vous
          </a>
        </div>

        <div className="space-y-2">
          {[
            { Icon: FaGoogle, text: "Google", color: "text-red-500" },
            { Icon: FaApple, text: "Apple", color: "text-black" },
            { Icon: FaFacebook, text: "Facebook", color: "text-blue-600" },
          ].map((item, index) => (
            <motion.button
              key={item.text}
              className="w-full flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              initial={{ x: -15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.Icon className={item.color} />
              <span>Continuer avec {item.text}</span>
            </motion.button>
          ))}

          <motion.button
            onClick={() => navigate("/AddKPlayer")}
            className="w-full flex items-center justify-center gap-2 p-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition mt-4"
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Continuer avec email</span>
          </motion.button>
        </div>

        <motion.button
          className="w-full text-gray-500 text-xs mt-4 hover:underline"
          onClick={() => navigate("/LayoutKPlayer")}
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

export default LoginOptionsKPlayer;
