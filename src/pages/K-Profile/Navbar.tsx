import { useState, useEffect } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { UserPlus, LogOut, Menu } from "lucide-react";
import { getAuthHeader, isAuthenticated, removeToken, saveUserId } from "../../utils/jwt";
import axios from "axios";

const Navbar = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userName, setUserName] = useState<null | string>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const navigate = useNavigate();
  const CreateAccountClick = () => {
    if (authenticated) {
      removeToken();
      navigate("/");
    } else {
      navigate("/Login");
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isAuthenticated()) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/profile`, {
          headers: getAuthHeader(),
        })
        .then((response) => {
          const { first_name, last_name, ID } = response.data.user;
          setUserName(`${first_name} ${last_name}`);
          saveUserId(ID);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="relative">
      <div
        className="flex justify-between items-center bg-white p-3 rounded-xl shadow-md"
        style={{ boxShadow: "0 4px 15px rgba(12, 111, 12, 0.28)" }}
      >
        {/* Left Side: Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-32 h-14" onClick={() => navigate("/")} />
        </div>

        {/* Center: Profile Name - Hidden on mobile */}
        <div className="hidden md:block text-[#30797F] font-semibold text-lg">
          {userName ? userName : "K-Profile"}{" "}
          <span className="text-gray-500">{userName ? "" : "(Guest)"}</span>
        </div>

        {/* Right Side: Button */}
        <div className="flex items-center">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleMobileMenu} 
            className="md:hidden mr-4"
          >
            <Menu size={24} />
          </button>

          {/* Desktop Button - Hidden on mobile */}
          <button
            onClick={CreateAccountClick}
            className={`hidden md:flex ${authenticated
              ? "bg-gray-600 hover:bg-gray-800"
              : "bg-gradient-to-b from-[#30797F] to-[#039DAA] hover:bg-teal-900"
              } text-white px-4 py-2 rounded-xl items-center gap-2 shadow-md transition-all duration-200 ease-in-out transform hover:scale-105`}
          >
            {authenticated ? <LogOut size={18} /> : <UserPlus size={18} />}
            <span className="font-medium">
              {authenticated ? "Déconnexion" : "Créer un compte"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50">
          <div className="flex flex-col items-center p-4">
            {/* Mobile Profile Name */}
            <div className="text-blue-600 font-semibold text-lg mb-4">
              {userName ? userName : "K-Profile"}{" "}
              <span className="text-gray-500">{userName ? "" : "(Guest)"}</span>
            </div>

            {/* Mobile Button */}
            <button
              onClick={CreateAccountClick}
              className={`flex ${authenticated
                ? "bg-gray-600 hover:bg-gray-800"
                : "bg-teal-700 hover:bg-teal-900"
                } text-white px-4 py-2 rounded-xl items-center gap-2 shadow-md transition-all duration-200 ease-in-out transform hover:scale-105`}
            >
              {authenticated ? <LogOut size={18} /> : <UserPlus size={18} />}
              <span className="font-medium">
                {authenticated ? "Déconnexion" : "Créer un compte"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;