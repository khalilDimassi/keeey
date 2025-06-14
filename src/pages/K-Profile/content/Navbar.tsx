import { useState, useEffect } from 'react';
import { UserPlus, LogOut, Menu, Check, AlertTriangle } from 'lucide-react';
import { getAuthHeader, isAuthenticated, removeToken, saveUserId } from '../../../utils/jwt';
import { useNavigate } from 'react-router-dom';
import KeeeyLogo from '../../assets/KeeyLogo';
import axios from 'axios';

const Navbar = () => {
  const [authenticated, _setAuthenticated] = useState(isAuthenticated());
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated()) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/profile`, {
          headers: getAuthHeader(),
        })
        .then((response) => {
          if (isMounted) {
            const { first_name, last_name, ID, email_verified } = response.data.user;
            setUserName(`${first_name} ${last_name}`);
            saveUserId(ID);
            setIsEmailVerified(email_verified);
          }
        })
        .catch((error) => {
          if (isMounted) {
            console.error("Error fetching profile:", error);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const CreateAccountClick = () => {
    if (authenticated) {
      removeToken();
      navigate("/");
    } else {
      navigate("/Login/kprofile");
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleResendVerification = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await axios.get(import.meta.env.VITE_API_BASE_URL + '/api/v1/private/request-verification-email', {
        headers: {
          ...getAuthHeader()
        }
      });
    } catch (error) {
      console.error('Failed to resend verification email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div
        className="flex items-center bg-white p-3 rounded-xl shadow-md relative"
        style={{ boxShadow: "0 4px 15px #0c6f0c47" }}
      >
        {/* Left Side: Logo - Fixed position */}
        <div className="flex items-center cursor-pointer w-32 h-14 flex-shrink-0" onClick={() => navigate("/")}>
          <KeeeyLogo color="#297280" />
        </div>

        {/* Center: Profile Name - Absolutely centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-2">
          {authenticated && (
            <>
              <div className="flex items-center">
                {isEmailVerified ? (
                  <div
                    className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                    title="Email verified"
                  >
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <button
                    onClick={handleResendVerification}
                    disabled={isLoading}
                    className="w-4 h-4 bg-orange-400 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-200 group"
                    title="Email not verified - Click to resend"
                  >
                    <AlertTriangle
                      className={`w-2.5 h-2.5 text-white ${!isLoading ? 'animate-pulse' : ''}`}
                      strokeWidth={3}
                    />
                  </button>
                )}
              </div>

              <div className="text-[#297280] font-semibold text-lg whitespace-nowrap">
                {userName || "K-Profile"}
                {!userName && <span className="text-gray-500 ml-1">(Guest)</span>}
              </div>
            </>
          )}

          {/* Guest state */}
          {!authenticated && (
            <div className="text-[#297280] font-semibold text-lg">
              K-Profile <span className="text-gray-500">(Guest)</span>
            </div>
          )}
        </div>

        {/* Right Side: Button - Fixed position */}
        <div className="flex items-center ml-auto flex-shrink-0">
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden mr-4 text-[#297280]"
          >
            <Menu size={24} />
          </button>

          {/* Desktop Button - Hidden on mobile */}
          <button
            onClick={CreateAccountClick}
            className={`hidden md:flex ${authenticated
              ? "bg-gray-600 hover:bg-gray-800"
              : "bg-[#297280] hover:bg-teal-900"
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
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50 rounded-b-xl">
          <div className="flex flex-col items-center p-4 space-y-4">
            {/* Mobile Profile Name with Icon */}
            {authenticated && (
              <div className="flex items-center gap-2">
                {isEmailVerified ? (
                  <div
                    className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                    title="Email verified"
                  >
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <button
                    onClick={handleResendVerification}
                    disabled={isLoading}
                    className="w-4 h-4 bg-orange-400 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-200"
                    title="Email not verified - Click to resend"
                  >
                    <AlertTriangle
                      className={`w-2.5 h-2.5 text-white ${!isLoading ? 'animate-pulse' : ''}`}
                      strokeWidth={3}
                    />
                  </button>
                )}
                <div className="text-[#297280] font-semibold text-lg">
                  {userName || "K-Profile"}
                  {!userName && <span className="text-gray-500 ml-1">(Guest)</span>}
                </div>
              </div>
            )}

            {!authenticated && (
              <div className="text-[#297280] font-semibold text-lg">
                K-Profile <span className="text-gray-500">(Guest)</span>
              </div>
            )}

            {/* Mobile Button */}
            <button
              onClick={CreateAccountClick}
              className={`flex ${authenticated
                ? "bg-gray-600 hover:bg-gray-800"
                : "bg-[#297280] hover:bg-teal-900"
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