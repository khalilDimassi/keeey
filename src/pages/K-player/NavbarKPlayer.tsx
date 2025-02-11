import { useState, useEffect } from "react";
import logo from "../assets/logoKeeePlayer.png";
import { useNavigate } from "react-router-dom";
import { UserPlus, LogOut } from "lucide-react";
import { getAuthHeader, isAuthenticated, removeToken } from "../utils/jwt";
import axios from "axios";

const NavbarKPlayer = () => {
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
      navigate("/LoginPageKPlayer");
    }
  };

  const [userName, setUserName] = useState<null | string>(null);
  useEffect(() => {
    if (isAuthenticated()) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/profile`, { headers: getAuthHeader() })
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
    <div className="flex justify-between items-center bg-white p-2 rounded-lg" style={{ boxShadow: "0 4px 15px rgba(62, 78, 203, 0.33)" }}>
      {/* Left Side: Logo and Name */}
      <div className="flex items-center ">
        <img src={logo} alt="Logo" style={{ width: "130px", height: "55px" }} />

      </div>

      {/* Center: Profile Name */}
      <div className="text-blue-600 font-semibold">
        {userName ? userName : "K-Profile"}{" "}
        <span className="text-gray-500">{userName ? "" : "(Guest)"}</span>
      </div>

      {/* Right Side: Button */}
      <button style={{background:"#215A96"}}
        onClick={CreateAccountClick}
        className={`${authenticated ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-800 hover:bg-blue-700"
          } text-white px-2 py-1  rounded-lg flex items-center`} 
      >
        {authenticated ? <LogOut className="mr-2" /> : <UserPlus className="mr-2" />}
        {authenticated ? "Déconnecter" : "Créer un compte"}
      </button>
    </div>
  );
};

export default NavbarKPlayer;
