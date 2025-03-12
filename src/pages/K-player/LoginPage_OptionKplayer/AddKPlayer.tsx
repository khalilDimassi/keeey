import { useState, ChangeEvent } from "react";
import { ArrowLeft } from "lucide-react";
import logo from "../../assets/logoKeeePlayer.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { saveToken } from "../../../utils/jwt";
import axios from "axios";

const AddKPlayer = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user_role = location.state?.user_role || "K-PLAYER";

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    user_role: user_role,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/register`,
        formData
      );

      const token = response?.data?.token;
      if (!token) {
        throw new Error("Token is missing in the response.");
      }

      saveToken(token);
      navigate("/LayoutKPlayer");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Une erreur est survenue. Veuillez réessayer."
      );
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen px-2 bg-gray-50">
      <motion.div
        className="absolute top-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <img src={logo} alt="Keeey Logo" className="object-contain" style={{ width: "12rem" }} onClick={() => navigate("/")} />
      </motion.div>

      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full bg-white p-6 shadow-lg border-blue-700"
        style={{
          width: "30rem",
          boxShadow: "0 1px 8px 3px rgba(49, 85, 205, 0.35)",
          borderRadius: "15px",
        }}
      >
        <div className="flex items-center mb-5">
          <button onClick={() => navigate("/LoginKplayer")} className="text-gray-600 hover:text-gray-800">
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-lg font-bold text-gray-700 flex-grow text-center pr-4">
            Créer votre compte K-Player
          </h2>
        </div>

        <form onSubmit={handleRegister}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-600 text-sm">Prénom</label>
              <input
                type="text"
                name="first_name"
                placeholder="Prénom"
                className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                value={formData.first_name}
                onChange={handleChange}
                style={{ borderRadius: "12px" }}
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm">Nom</label>
              <input
                type="text"
                name="last_name"
                placeholder="Nom"
                className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                value={formData.last_name}
                onChange={handleChange}
                style={{ borderRadius: "12px" }}
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-gray-600 text-sm">Email</label>
            <input
              type="email"
              name="email"
              placeholder="exemple@mail.com"
              className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={formData.email}
              onChange={handleChange}
              style={{ borderRadius: "12px" }}
            />
          </div>

          <div className="mt-3">
            <label className="block text-gray-600 text-sm">Téléphone</label>
            <input
              type="tel"
              name="phone"
              placeholder="Votre numéro"
              className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={formData.phone}
              onChange={handleChange}
              style={{ borderRadius: "12px" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-gray-600 text-sm">Mot de passe</label>
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                value={formData.password}
                onChange={handleChange}
                style={{ borderRadius: "12px" }}
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm">Confirmer</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmer le mot de passe"
                className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{ borderRadius: "12px" }}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

          <div className="mt-5 flex space-x-3">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-1/2 bg-blue-800 text-white py-1.5 rounded hover:bg-blue-700 transition"
              style={{ borderRadius: "12px" }}
            >
              Inscrivez-vous
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-1/2 text-gray-500 text-sm hover:underline"
              onClick={() => navigate("/LayoutKPlayer")}
            >
              Continuer en tant qu'invité →
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddKPlayer;
