import { useState, ChangeEvent } from "react";
import { ArrowLeft } from "lucide-react";
import logo from "../assets/logoKeeePartner.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AddPartner = () => {
  const navigate = useNavigate();

  // Define the form data type
  interface FormData {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    password: string;
    confirmPassword: string;
  }

  // State for form data
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
  });

  // Handle input change with proper TypeScript type
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full bg-white p-9 shadow-lg border-green-700"
        style={{
          width: "40rem",
          boxShadow: "0 1px 10px 4px rgba(120, 103, 36, 0.4)",
          borderRadius: "20px",
        }}
      >
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/LoginOptionsPartner")}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-bold text-gray-700 flex-grow text-center pr-6">
            Créer votre compte K-Profile
          </h2>
        </div>

        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-sm">Nom</label>
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
                value={formData.nom}
                onChange={handleChange}
                style={{ borderRadius: "15px" }}
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm">Prénom</label>
              <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
                value={formData.prenom}
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
              name="telephone"
              placeholder="Votre numéro"
              className="w-1/2 p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
              value={formData.telephone}
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

          <div className="mt-6 space-y-4 flex">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              style={{ borderRadius: "20px", backgroundColor: "rgba(83, 68, 11, 0.55)" }}
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

export default AddPartner;
