import React from "react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/logoKeeePlayer.svg";
import { ArrowLeft } from "lucide-react";
import LoginOptionsKPlayer from "./LoginOptionsKPlayer";
import LoginPageKPlayer from "./LoginPageKPlayer";

const LoginContainerKPlayer = () => {
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
                 
<svg width="160" height="61" viewBox="0 0 160 61" fill="none" xmlns="http://www.w3.org/2000/svg"   onClick={() => navigate("/")} >
<rect y="3" width="42" height="56" fill="#215A96"/>
<path d="M61 49.5C58.1667 49.5 55.7 48.95 53.6 47.85C51.5 46.7167 49.8667 45.15 48.7 43.15C47.5667 41.15 47 38.85 47 36.25C47 33.6167 47.5667 31.3167 48.7 29.35C49.8667 27.35 51.4833 25.8 53.55 24.7C55.6167 23.5667 58.0167 23 60.75 23C63.3833 23 65.6667 23.5333 67.6 24.6C69.5333 25.6667 71.0333 27.15 72.1 29.05C73.1667 30.95 73.7 33.1833 73.7 35.75C73.7 36.2833 73.6833 36.7833 73.65 37.25C73.6167 37.6833 73.5667 38.1 73.5 38.5H51.4V33.55H67.45L66.15 34.45C66.15 32.3833 65.65 30.8667 64.65 29.9C63.6833 28.9 62.35 28.4 60.65 28.4C58.6833 28.4 57.15 29.0667 56.05 30.4C54.9833 31.7333 54.45 33.7333 54.45 36.4C54.45 39 54.9833 40.9333 56.05 42.2C57.15 43.4667 58.7833 44.1 60.95 44.1C62.15 44.1 63.1833 43.9 64.05 43.5C64.9167 43.1 65.5667 42.45 66 41.55H73.05C72.2167 44.0167 70.7833 45.9667 68.75 47.4C66.75 48.8 64.1667 49.5 61 49.5ZM90.1992 49.5C87.3659 49.5 84.8992 48.95 82.7992 47.85C80.6992 46.7167 79.0659 45.15 77.8992 43.15C76.7659 41.15 76.1992 38.85 76.1992 36.25C76.1992 33.6167 76.7659 31.3167 77.8992 29.35C79.0659 27.35 80.6826 25.8 82.7492 24.7C84.8159 23.5667 87.2159 23 89.9492 23C92.5826 23 94.8659 23.5333 96.7992 24.6C98.7326 25.6667 100.233 27.15 101.299 29.05C102.366 30.95 102.899 33.1833 102.899 35.75C102.899 36.2833 102.883 36.7833 102.849 37.25C102.816 37.6833 102.766 38.1 102.699 38.5H80.5992V33.55H96.6492L95.3492 34.45C95.3492 32.3833 94.8492 30.8667 93.8492 29.9C92.8826 28.9 91.5492 28.4 89.8492 28.4C87.8826 28.4 86.3492 29.0667 85.2492 30.4C84.1826 31.7333 83.6492 33.7333 83.6492 36.4C83.6492 39 84.1826 40.9333 85.2492 42.2C86.3492 43.4667 87.9826 44.1 90.1492 44.1C91.3492 44.1 92.3826 43.9 93.2492 43.5C94.1159 43.1 94.7659 42.45 95.1992 41.55H102.249C101.416 44.0167 99.9826 45.9667 97.9492 47.4C95.9492 48.8 93.3659 49.5 90.1992 49.5ZM119.398 49.5C116.565 49.5 114.098 48.95 111.998 47.85C109.898 46.7167 108.265 45.15 107.098 43.15C105.965 41.15 105.398 38.85 105.398 36.25C105.398 33.6167 105.965 31.3167 107.098 29.35C108.265 27.35 109.882 25.8 111.948 24.7C114.015 23.5667 116.415 23 119.148 23C121.782 23 124.065 23.5333 125.998 24.6C127.932 25.6667 129.432 27.15 130.498 29.05C131.565 30.95 132.098 33.1833 132.098 35.75C132.098 36.2833 132.082 36.7833 132.048 37.25C132.015 37.6833 131.965 38.1 131.898 38.5H109.798V33.55H125.848L124.548 34.45C124.548 32.3833 124.048 30.8667 123.048 29.9C122.082 28.9 120.748 28.4 119.048 28.4C117.082 28.4 115.548 29.0667 114.448 30.4C113.382 31.7333 112.848 33.7333 112.848 36.4C112.848 39 113.382 40.9333 114.448 42.2C115.548 43.4667 117.182 44.1 119.348 44.1C120.548 44.1 121.582 43.9 122.448 43.5C123.315 43.1 123.965 42.45 124.398 41.55H131.448C130.615 44.0167 129.182 45.9667 127.148 47.4C125.148 48.8 122.565 49.5 119.398 49.5ZM136.677 59.25L143.727 43.65L145.027 41.5L151.627 23.5H159.627L144.177 59.25H136.677ZM142.077 48.5L132.277 23.5H140.377L148.427 46.3L142.077 48.5Z" fill="black"/>
<path d="M4.75 53V13.4H13.22V53H4.75ZM10.525 32.43L28.345 13.4H39.62L20.81 32.43H10.525ZM29.225 53L10.415 32.43H20.81L40.72 53H29.225Z" fill="white"/>
</svg>

          
          
        </motion.div>
      </header>

      <main>
        <div className="flex gap-10 px-20 flex-col md:flex-row w-full rounded-lg">
          {/* First 1/3 - Features/Benefits Section */}
          <motion.div
            className="w-full mt-6 md:w-1/3 my-6 rounded-lg relative max-w-sm sm:max-w-md md:max-w-lg py-16 bg-white sm:p-2 shadow-lg rounded-2xl"
            style={{ boxShadow: "0 1px 8px 3px rgba(49, 85, 205, 0.4)", borderRadius:"16px" }}
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="max-w-sm mx-auto p-4 text-black">
              <ul className="list-disc pl-10 text-lg font-semibold">
                <li>Entreprise</li>
                <li>Industrie</li>
                <li>Grand Compte</li>
                <li>PME/TPE</li>
              </ul>
              
              <p className="mt-4">
                Vous êtes à la <span className="text-blue-800 font-semibold">recherche de Talents pour vos Projets</span>
              </p>
              
              <p className="mt-4 font-bold">Et vous souhaitez :</p>
              
              <ul className="mt-2 space-y-3">
                <li>
                  <span className="text-blue-800 font-semibold">Obtenir rapidement des Profils pertinents</span>
                </li>
                <li>
                  <span className="text-blue-800  font-semibold">Gérer la diffusion</span>  de vos offres de missions
                </li>
                <li>
               <span className="text-blue-800  font-semibold">Suivre les missions</span> de vos consultants 
                </li>
                <li>
                <span className="text-blue-800  font-semibold">Garder le contact</span> avec vos  partenaires et votre réseau
                </li>
                <li>
                  <span className="text-blue-800  font-semibold">Rester informé(e)</span> de la tendance du marché
                </li>
                
              </ul>
            </div>
          </motion.div>
          
          <div className="w-full md:w-1/3 py-6 rounded-lg">
            <LoginPageKPlayer />
          </div>
          
          <div className="w-full md:w-1/3 py-6 rounded-lg">
            <LoginOptionsKPlayer />
          </div>
        </div>
      </main>
      
      <footer className="w-full mt-auto p-4 bg-white">
        <div className="flex justify-center">
          <button 
            onClick={() => navigate("/LayoutKPlayer")} 
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-6 py-3 text-white rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-teal-800 transition duration-300"
            style={{ background: "#215A96" }}
          >
            Essayer la plateforme en Mode Invité
            <svg width="20" height="30" viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25.1545 35.5678V0.432617H29.6205V35.5678H25.1545ZM0.591797 35.5678V0.432617L20.6886 18.0002L0.591797 35.5678Z" fill="white"/>
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LoginContainerKPlayer;