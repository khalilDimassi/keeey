import LoginPage from "./LoginPage";
import LoginOptions from "./LoginOptions";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/logo.svg";
import { ArrowLeft } from "lucide-react";

const LoginContainer = () => {
  const navigate = useNavigate();
  return (
    <div className="px-4">
      <header className="w-full mt-4 h-16 flex items-center relative">
        <button
          onClick={() => navigate("/")}
          className="ml-4 p-2 rounded-full hover:bg-gray-200 transition duration-300"
        >
          <ArrowLeft size={24} strokeWidth={2} className="text-gray-700 hover:text-gray-900" />
        </button>
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <img
            src={logo}
            alt="Keeey Logo"
            className="w-26 sm:w-30 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </motion.div>
      </header>

      <main>
        <div className="flex gap-10 px-20 flex-col md:flex-row w-full rounded-lg">
          {/* First 1/3 - Features/Benefits Section */}
          <motion.div
            className="w-full mt-6 md:w-1/3 my-6 rounded-lg relative max-w-sm sm:max-w-md md:max-w-lg py-16 bg-white sm:p-2 shadow-lg"
            style={{ boxShadow: "0 1px 6px 2px rgba(34, 146, 34, 0.3)", borderRadius: "16px" }}
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="max-w-sm mx-auto p-4 text-black">
              <ul className="list-disc pl-10 text-lg font-semibold">
                <li>Freelance</li>
                <li>Indépendant</li>
                <li>Consultant</li>
              </ul>

              <p className="mt-4">
                Vous êtes à la <span className="text-teal-600 font-semibold">recherche de vos prochaines missions</span>
              </p>

              <p className="mt-4 font-bold">Et vous souhaitez :</p>

              <ul className="mt-2 space-y-2">
                <li>
                  <span className="text-teal-600 font-semibold">Garder le contact</span> avec vos anciens clients et votre réseau
                </li>
                <li>
                  <span className="text-teal-600 font-semibold">Garder le contrôle</span> sur la visibilité de votre profil
                </li>
                <li>
                  Gérer facilement votre <span className="text-teal-600 font-semibold">dossier de compétences</span>
                </li>
                <li>
                  Centraliser vos <span className="text-teal-600 font-semibold">références professionnelles</span>
                </li>
                <li>
                  <span className="text-teal-600 font-semibold">Suivre vos missions</span>
                </li>
                <li>
                  <span className="text-teal-600 font-semibold">Rester informé(e)</span> de la tendance du marché
                </li>
              </ul>
            </div>
          </motion.div>

          <div className="w-full md:w-1/3 py-6 rounded-lg">
            <LoginPage />
          </div>

          <div className="w-full md:w-1/3 py-6 rounded-lg">
            <LoginOptions />
          </div>
        </div>
      </main>

      <footer className="w-full mt-auto p-4 bg-white">
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/Layout")}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-6 py-3 text-white rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-teal-800 transition duration-300"
            style={{ background: "#307A7D" }}
          >
            Essayer la plateforme en Mode Invité
            <svg width="20" height="30" viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25.1545 35.5678V0.432617H29.6205V35.5678H25.1545ZM0.591797 35.5678V0.432617L20.6886 18.0002L0.591797 35.5678Z" fill="white" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LoginContainer;