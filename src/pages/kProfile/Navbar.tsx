
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { UserPlus } from "lucide-react"; // Change icon to something else

const Navbar = () => {
    
        const navigate = useNavigate(); // Create navigate function
    
        const handleButtonClick = () => {
          navigate("/LoginPage"); // Navigate to the /login route
        };
    
  return (
    <div className="flex justify-between items-center bg-white p-2 rounded-lg"style={{ boxShadow: "0 4px 15px rgba(0, 128, 0, 0.2)"}}>
      {/* Left Side: Logo and Name */}
      <div className="flex items-center ">
        <img src={logo} alt="Logo" style={{width:"160px",height:"70px"}} />
        
      </div>
      
      {/* Center: Profile Name */}
      <div className="text-blue-600 font-semibold">
        K-Profile <span className="text-gray-500">(Guest)</span>
      </div>
      
      {/* Right Side: Button */}
      <button
      onClick={handleButtonClick}
      className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center"
    >
      <UserPlus className="mr-2" /> {/* New icon */}
      Créer un compte
    </button>
    </div>
  );
};

export default Navbar;
