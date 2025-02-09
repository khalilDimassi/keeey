import logo from "../assets/logo.png";
import axios from "axios";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveToken } from "../utils/jwt";
import { motion } from "framer-motion";

const AddProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user_role = location.state?.user_role || "K-PROFILE";

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    user_role: user_role,
  });

  const [error, setError] = useState<string | null>(null);

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
      navigate("/Layout");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Une erreur est survenue. Veuillez réessayer."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gray-50">
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
      
        <img src={logo} alt="Keeey Logo" className="object-contain" style={{ width: "15rem" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-full bg-white p-9 shadow-lg border-green-700"
        style={{
          width: "40rem",
          boxShadow: "0 1px 10px 4px rgba(0, 128, 0, 0.4)",
          marginTop: "4rem",
          borderRadius: "20px",
        }}
      >
        <div className="flex items-center mb-6">
          <button onClick={() => navigate("/LoginOptions")} className="text-gray-600 hover:text-gray-800">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-bold text-gray-700 flex-grow text-center pr-6">
            Créer votre compte K-Profile
          </h2>
        </div>

        <form onSubmit={handleRegister}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-sm">Nom</label>
              <input
                type="text"
                name="first_name"
                placeholder="Nom"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
                value={formData.first_name}
                onChange={handleChange}
                style={{ borderRadius: "15px" }}
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm">Prénom</label>
              <input
                type="text"
                name="last_name"
                placeholder="Prénom"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
                value={formData.last_name}
                onChange={handleChange}
                style={{ borderRadius: "15px" }}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-600 text-sm">Adresse mail</label>
            <input
              type="email"
              name="email"
              placeholder="exemple@mail.com"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
              value={formData.email}
              onChange={handleChange}
              style={{ borderRadius: "15px" }}
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-600 text-sm">Numéro de téléphone</label>
            <input
              type="tel"
              name="phone"
              placeholder="Votre numéro"
              className="w-1/2 p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
              value={formData.phone}
              onChange={handleChange}
              style={{ borderRadius: "15px" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-600 text-sm">Mot de passe</label>
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
                value={formData.password}
                onChange={handleChange}
                style={{ borderRadius: "15px" }}
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm">Confirmer le mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmer le mot de passe"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{ borderRadius: "15px" }}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

          <div className="mt-6 space-y-4 flex">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-green-800 text-white py-2 rounded-lg hover:bg-green-700 transition"
              style={{ borderRadius: "20px" }}
            >
              Inscrivez-vous
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full text-gray-500 text-sm hover:underline"
              onClick={() => navigate("/Layout")}
            >
              Continuer en tant qu'invité →
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProfile;
