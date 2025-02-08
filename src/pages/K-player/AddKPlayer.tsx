import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../assets/logoKeeePlayer.png";
import { Navigate, useNavigate } from "react-router-dom";

const AddKPlayer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
  });

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gray-50">
      <motion.div 
        className="absolute top-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 2 }}
      >
        <img src={logo} alt="Keeey Logo" className="object-contain" style={{width:"15rem"}}/>
      </motion.div>

      <motion.div 
        className="relative w-full bg-white p-9 shadow-lg border-green-700" 
        style={{width:"40rem", boxShadow: "0 1px 10px 4px rgba(49, 85, 205, 0.4)", marginTop:"4rem", borderRadius:"20px"}}
        initial={{ x: -80, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ duration: 1 }}
      >
        <div className="flex items-center mb-6">
          <motion.button 
            onClick={() => navigate("/LoginOptionsKPlayer")} 
            className="text-gray-600 hover:text-gray-800"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={24} />
          </motion.button>
          <h2 className="text-xl font-bold text-gray-700 flex-grow text-center pr-6">
            Créer votre compte K-Player
          </h2>
        </div>

        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-gray-600 text-sm">Nom</label>
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
                value={formData.nom}
                style={{borderRadius:"15px"}}
              />
            </motion.div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-gray-600 text-sm">Prénom</label>
              <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
                value={formData.prenom}
                style={{borderRadius:"15px"}}
              />
            </motion.div>
          </div>

          <motion.div 
            className="mt-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-gray-600 text-sm">Adresse mail</label>
            <input
              style={{borderRadius:"15px"}}
              type="email"
              name="email"
              placeholder="exemple@mail.com"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
              value={formData.email}
            />
          </motion.div>

          <motion.div 
            className="mt-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-gray-600 text-sm">Numéro de téléphone</label>
            <input
              style={{borderRadius:"15px"}}
              type="tel"
              name="telephone"
              placeholder="Votre numéro"
              className="w-1/2 p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
              value={formData.telephone}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-gray-600 text-sm">Mot de passe</label>
              <input
                style={{borderRadius:"15px"}}
                type="password"
                name="password"
                placeholder="Mot de passe"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
                value={formData.password}
              />
            </motion.div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-gray-600 text-sm">
                Confirmer le mot de passe
              </label>
              <input
                style={{borderRadius:"15px"}}
                type="password"
                name="confirmPassword"
                placeholder="Confirmer le mot de passe"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
                value={formData.confirmPassword}
              />
            </motion.div>
          </div>

          <div className="mt-6 space-y-4 flex">
            <motion.button
              type="submit"
              className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              style={{borderRadius:"20px"}}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Inscrivez-vous
            </motion.button>

            <motion.button
              type="button"
              className="w-full text-gray-500 text-sm hover:underline"
              onClick={() => navigate("/home")}
              whileHover={{ scale: 1.02 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
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