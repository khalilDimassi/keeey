import { useNavigate } from "react-router-dom";
import { FaGoogle, FaApple, FaEnvelope, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

const LoginOptionsKPlayer = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl space-y-6 bg-white p-9 sm:p-12 shadow-md rounded-2xl min-h-[490px] flex flex-col justify-center"
      style={{
        boxShadow: "0 1px 8px 3px rgba(49, 85, 205, 0.4)"
      }}
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-center text-lg font-bold text-gray-700 mb-4">
        Créer un nouveau compte K-Player
      </h2>
      <div className="space-y-4">
        {[
          { Icon: FaGoogle, text: "Google", color: "text-red-500" },
          { Icon: FaApple, text: "Apple", color: "text-black" },
          { Icon: FaGithub, text: "Github", color: "text-gray-600" },
        ].map((item, index) => (
          <motion.button
            key={item.text}
            className="w-full flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition text-sm sm:text-base"
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
          className="w-full flex items-center justify-center gap-2 p-4 text-white rounded-xl hover:bg-green-600 transition mt-4 text-sm sm:text-base"
          style={{ background: "#215A96" }}
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaEnvelope className="text-white" />
          <span>Continuer avec email</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default LoginOptionsKPlayer;
