import { useState, useEffect } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { UserPlus, LogOut } from "lucide-react";
import { getAuthHeader, isAuthenticated, removeToken } from "../../utils/jwt";
import axios from "axios";

const Navbar = () => {
  const [authenticated, setAuthenticated] = useState(false);
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
  };

  const [userName, setUserName] = useState<null | string>(null);
  useEffect(() => {
    if (isAuthenticated()) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/profile`, {
          headers: getAuthHeader(),
        })
        .then((response) => {
          const { first_name, last_name } = response.data.user;
          setUserName(`${first_name} ${last_name}`);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, []);

  return (
    <div
      className="flex justify-between items-center bg-white p-3 rounded-xl shadow-md"
      style={{ boxShadow: "0 4px 15px rgba(12, 111, 12, 0.28)" }}
    >
      {/* Left Side: Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="w-32 h-14" />
      </div>

      {/* Center: Profile Name */}
      <div className="text-blue-600 font-semibold text-lg">
        {userName ? userName : "K-Profile"}{" "}
        <span className="text-gray-500">{userName ? "" : "(Guest)"}</span>
      </div>

      {/* Right Side: Button */}
      <button
        onClick={CreateAccountClick}
        className={`${authenticated
            ? "bg-gray-600 hover:bg-gray-800"
            : "bg-teal-700 hover:bg-teal-900"
          } text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition-all duration-200 ease-in-out transform hover:scale-105`}
      >
        {authenticated ? <LogOut size={18} /> : <UserPlus size={18} />}
        <span className="font-medium">
          {authenticated ? "Déconnexion" : "Créer un compte"}
        </span>
      </button>
    </div>
  );
};

export default Navbar;
