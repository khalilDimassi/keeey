import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FaGoogle, FaApple, FaFacebook } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import logo from "../assets/logoKeeePlayer.svg";
import { saveToken } from "../../utils/jwt";
import { motion } from "framer-motion";

const LoginPageKPlayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user_role = location.state?.user_role || "K-PROFILE";

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
      navigate("/Layout");
    } catch {
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-2 bg-gray-50">
      <motion.div
        className="absolute top-6 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <img src={logo} alt="Keeey Logo" className="w-48 object-contain" onClick={() => navigate("/")} />
      </motion.div>

      <motion.div
        className="relative w-full bg-white p-6 shadow-lg"
        style={{ maxWidth: "28rem", boxShadow: "0 1px 8px 3px rgba(49, 85, 205, 0.4)", borderRadius: "18px" }}
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <button onClick={() => navigate("/")} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft size={20} />
        </button>

        <h2 className="text-center text-sm font-bold text-gray-700 mb-2">
          Connectez-vous à votre compte K-Player
        </h2>
        <div className="text-center text-xs text-gray-600 mb-4">
          Vous n'avez pas de compte ? <a href="/LoginOptionsKPlayer" className="text-blue-700 ml-1 hover:underline">Inscrivez-vous ici</a>
        </div>
        <form className="space-y-3" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-600 text-xs">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-xs">Mot de passe</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          {error && <p className="text-red-500 text-xs text-center mt-1">{error}</p>}
          <button className="w-full flex items-center justify-center gap-2 p-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition text-xs">Se connecter</button>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition text-xs">
              <FaGoogle className="text-red-500" />
              <span>Continuer avec Google</span>
            </button>
            <button className="w-full flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition text-xs">
              <FaApple className="text-black" />
              <span>Continuer avec Apple</span>
            </button>
            <button className="w-full flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition text-xs">
              <FaFacebook className="text-blue-600" />
              <span>Continuer avec Facebook</span>
            </button>
          </div>
        </form>
        <button className="w-full text-gray-500 text-xs mt-3 hover:underline" onClick={() => navigate("/LayoutKPlayer")}>
          Continuer en tant qu'invité →
        </button>
      </motion.div>
    </div>
  );
};

export default LoginPageKPlayer;