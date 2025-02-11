import { useState, ChangeEvent } from "react";
import { ArrowLeft } from "lucide-react";
import logo from "../assets/logoKeeePartner.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AddPartner = () => {
  const navigate = useNavigate();

  interface FormData {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    password: string;
    confirmPassword: string;
  }

  const [formData, setFormData] = useState<FormData>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        className="relative w-full bg-white p-6 shadow-lg border-green-700"
        style={{
          width: "30rem",
          boxShadow: "0 1px 8px 3px rgba(120, 103, 36, 0.35)",
          borderRadius: "15px",
        }}
      >
        <div className="flex items-center mb-5">
          <button onClick={() => navigate("/LoginOptionsPartner")} className="text-gray-600 hover:text-gray-800">
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-lg font-bold text-gray-700 flex-grow text-center pr-4">
            Créer votre compte K-Profile
          </h2>
        </div>

        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-600 text-sm">Nom</label>
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                value={formData.nom}
                onChange={handleChange}
                style={{ borderRadius: "12px" }}
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm">Prénom</label>
              <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                value={formData.prenom}
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
              className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              value={formData.email}
              onChange={handleChange}
              style={{ borderRadius: "12px" }}
            />
          </div>

          <div className="mt-3">
            <label className="block text-gray-600 text-sm">Téléphone</label>
            <input
              type="tel"
              name="telephone"
              placeholder="Votre numéro"
              className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              value={formData.telephone}
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
                className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:border-green-500"
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
                className="w-full p-1.5 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{ borderRadius: "12px" }}
              />
            </div>
          </div>

          <div className="mt-5 flex space-x-3">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-1/2 bg-blue-800 text-white py-1.5 rounded hover:bg-blue-700 transition"
              style={{ borderRadius: "15px", backgroundColor: "rgba(83, 68, 11, 0.55)" }}
            >
              Inscrivez-vous
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-1/2 text-gray-500 text-sm hover:underline"
              onClick={() => navigate("/LayoutKPartner")}
            >
              Continuer en tant qu'invité →
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddPartner;