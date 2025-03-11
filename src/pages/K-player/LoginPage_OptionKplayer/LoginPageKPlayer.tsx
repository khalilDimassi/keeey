import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FaGoogle, FaApple, FaGithub } from "react-icons/fa";
import { saveToken } from "../../../utils/jwt";
import { motion } from "framer-motion";

const LoginPageKPlayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user_role = location.state?.user_role || "K-PLAYER";

  const [formData, setFormData] = useState({ email: "", password: "", user_role });
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/api/v1/public/login",
        formData
      );
      const token = response?.data?.token;
      if (!token) throw new Error("Token is missing in the response.");
      saveToken(token);
      navigate("/LayoutKPlayer");
    } catch {
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <motion.div
      className="relative w-full max-w-sm sm:max-w-md md:max-w-lg bg-white p-6 sm:p-8 shadow-lg rounded-2xl "
      style={{ boxShadow: "0 1px 8px 3px rgba(49, 85, 205, 0.4)" }}
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h2 className="text-center text-lg font-bold text-gray-700 mb-4">
        Connectez-vous à votre compte K-Player
      </h2>

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <span className="block text-sm font-medium text-gray-600">Email</span>
          <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>
        <div>
          <span className="block text-sm font-medium text-gray-600">Mot de passe</span>
          <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>
        {error && <p className="text-red-500 text-xs text-center mt-1">{error}</p>}
        <div className="flex justify-center">
          <button
            className="w-1/3 p-2 mt-4 text-white rounded hover:bg-green-600 transition text-sm"
            style={{ background: "#215A96" }}
          >
            Go
          </button>
        </div>
      </form>
      <div className="space-y-3 mt-6">
        {[FaGoogle, FaApple, FaGithub].map((Icon, i) => (
          <button
            key={i}
            className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition text-xs sm:text-sm"
          >
            <Icon className={`text-${i === 0 ? "red-500" : i === 1 ? "black" : "gray-800"}`} />
            <span>Continuer avec {i === 0 ? "Google" : i === 1 ? "Apple" : "GitHub"}</span>
          </button>
        ))}
      </div>
    </motion.div>

  );
};

export default LoginPageKPlayer;