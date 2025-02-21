import React from "react";
import logo from "../assets/logoKeeePlayer.svg";
const Login = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[600px] h-[300px] relative">
        {/* Close Button */}
        <button 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
        <div className="flex items-center ">
        <img src={logo} alt="Logo" style={{ width: "160px", height: "70px" }} />

      </div>
          <button className="text-gray-600 hover:underline text-sm">
       
            <a href="/LoginPageKplayer" className="text-gray-700 ml-1 hover:underline"> J'ai déjà un compte</a>
          </button>
        </div>

        {/* Message */}
        <p className="text-center text-gray-700 text-lg mb-6 px-4">
          Pour profiter pleinement de toutes les fonctionnalités disponibles sur Keeey, 
          veuillez créer un compte ou vous connecter à votre compte existant.
        </p>

        {/* Create Account Button */}
        <button className="w-full bg-blue-800 text-white font-medium py-2 rounded-lg flex items-center mt-5 justify-center">
          
          <a href="/LoginOptionsKPlayer" className="text-white ml-1 hover:underline"> 🔒 Créer un compte</a>
        </button>
      </div>
    </div>
  );
};

export default Login;
