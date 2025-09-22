import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { saveToken, saveUserId, saveUserRole } from "../../utils/jwt";

import axios from "axios";
import KeeeyLogo from "../assets/KeeyLogo";
import UnifiedAuthCard from "./UnifiedAuthCard";

const LoginContainer = () => {
  const navigate = useNavigate();
  const { userType = "kprofile" } = useParams<{ userType: keyof typeof config }>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle email step (check if user exists)
  const handleEmailStep = async (email: string, userRole: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.post<{ requiresPassword: boolean }>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/check-email`,
        { email, user_role: userRole }
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return null;
        }
        if (error.response?.status === 400) {
          setError("Invalid email format");
          return { requiresPassword: false };
        }
      }

      setError("Error checking email. Please try again or use social login.");
      console.error("Email check error:", error);
      return { requiresPassword: false };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login with password
  const handleLogin = async (formData: { email: string; password: string; user_role: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/api/v1/public/login",
        formData
      );

      const token = response?.data?.token;
      const userId = response?.data?.user?.ID || response?.data?.user?.id;

      if (!token) throw new Error("Token is missing in the response.");

      saveToken(token);
      if (userId) saveUserId(userId);

      // Determine redirect path based on user role
      const redirectPath = formData.user_role === "K-PROFILE" ? "/kprofile" :
        formData.user_role === "K-PLAYER" ? "/kplayer" :
          "/kpartner";

      navigate(redirectPath);
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_BASE_URL + "/api/v1/public/register",
        formData
      );

      const token = response?.data?.token;
      const userId = response?.data?.user?.ID || response?.data?.user?.id;

      if (!token) throw new Error("Token is missing in the response.");

      saveToken(token);
      if (userId) saveUserId(userId);

      // Determine redirect path based on user role
      const redirectPath = formData.user_role === "K-PROFILE" ? "/kprofile" :
        formData.user_role === "K-PLAYER" ? "/kplayer" :
          "/kpartner";

      navigate(redirectPath);
    } catch (error) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle social auth
  const handleSocialAuth = async (provider: string, userRole: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Redirect to backend social auth endpoint
      window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/auth/${provider}?role=${userRole}`;
    } catch (error) {
      setError(`${provider} authentication failed.`);
      console.error("Social auth error:", error);
      setIsLoading(false);
    }
  };

  const handleSupportTicket = async (ticketData: { email: string; subject: string; content: string; }): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/support/tickets`,
        {
          email: ticketData.email,
          subject: ticketData.subject,
          content: ticketData.content,
          timestamp: new Date().toISOString(),
          source: 'auth_form', // Track where ticket came from
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        message: response.data?.message || 'Votre ticket a été envoyé avec succès. Notre équipe vous contactera bientôt.'
      };

    } catch (error) {
      console.error('Support ticket error:', error);
      return {
        success: false,
        message: 'Impossible d\'envoyer le ticket. Veuillez réessayer plus tard.'
      };
    }
  };

  const handlePasswordResetRequest = async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/password-reset-request`, { email: email }, { headers: { 'Content-Type': 'application/json', }, }
      );

      if (response.data.success) {
        setError('New generated password in your mailbox');
        return { success: true, message: 'New generated password in your mailbox' };
      } else {
        setError('Failed to request password reset');
        return { success: false, message: 'Failed to request password reset' };
      }
    } catch (error) {
      setError('Failed to request password reset. Please try again later.');
      return { success: false, message: 'Failed to request password reset. Please try again later.' };
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Configuration object for each user type
  const config = {
    kprofile: {
      color: "#297280",
      features: [
        "Freelance", "Indépendant", "Consultant"
      ],
      description: "Vous êtes à la <span class='text-[#297280] font-semibold'>recherche de vos prochaines missions</span>",
      benefits: [
        "<span class='text-[#297280] font-semibold'>Garder le contact</span> avec vos anciens clients et votre réseau",
        "<span class='text-[#297280] font-semibold'>Garder le contrôle</span> sur la visibilité de votre profil",
        "Gérer facilement votre <span class='text-[#297280] font-semibold'>dossier de compétences</span>",
        "Centraliser vos <span class='text-[#297280] font-semibold'>références professionnelles</span>",
        "<span class='text-[#297280] font-semibold'>Suivre vos missions</span>",
        "<span class='text-[#297280] font-semibold'>Rester informé(e)</span> de la tendance du marché"
      ],
      guestPath: "/kprofile",
    },
    kplayer: {
      color: "#215A96",
      features: [
        "Entreprise", "Industrie", "Grand Compte", "PME/TPE"
      ],
      description: "Vous êtes à la <span class='text-[#215A96] font-semibold'>recherche de Talents pour vos Projets</span>",
      benefits: [
        "<span class='text-[#215A96] font-semibold'>Obtenir rapidement des Profils pertinents</span>",
        "<span class='text-[#215A96] font-semibold'>Gérer la diffusion</span> de vos offres de missions",
        "<span class='text-[#215A96] font-semibold'>Suivre les missions</span> de vos consultants",
        "<span class='text-[#215A96] font-semibold'>Garder le contact</span> avec vos partenaires et votre réseau",
        "<span class='text-[#215A96] font-semibold'>Rester informé(e)</span> de la tendance du marché"
      ],
      guestPath: "/KPlayer",
    },
    kpartner: {
      color: "#A89B7B",
      features: [
        "Cabinet de conseil", "Bureau d'études", "Cabinet de recrutement"
      ],
      description: "Vous êtes à la <span class='text-[#A89B7B] font-semibold'>recherche de Talents</span> pour les Projets de vos clients <span class='text-[#A89B7B] font-semibold'>OU d'opportunités pour vos consultants</span> ou votre réseau",
      benefits: [
        "<span class='text-[#A89B7B] font-semibold'>Identifier rapidement des Profils pertinents</span> pour vos clients",
        "<span class='text-[#A89B7B] font-semibold'>Identifier des Opportunités</span> pour vos consultants",
        "Gérer facilement vos <span class='text-[#A89B7B] font-semibold'>dossiers de compétences</span>",
        "<span class='text-[#A89B7B] font-semibold'>Gérer la diffusion</span> de vos offres de missions",
        "<span class='text-[#A89B7B] font-semibold'>Suivre les missions</span> de vos consultants",
        "<span class='text-[#A89B7B] font-semibold'>Garder le contact</span> avec vos partenaires et votre réseau",
        "<span class='text-[#A89B7B] font-semibold'>Garder le contrôle</span> sur la visibilité de vos profils"
      ],
      guestPath: "/KPartner",
    }
  };

  const currentConfig = config[userType as keyof typeof config] || config.kprofile;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="w-full h-16 flex items-center justify-center relative px-4 mt-10">
        <button
          onClick={() => navigate("/")}
          className="absolute left-4 p-2 rounded-full hover:bg-gray-200 transition duration-300"
        >
          <ArrowLeft size={24} strokeWidth={2} className="text-gray-700 hover:text-gray-900" />
        </button>
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 w-26 sm:w-30 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          onClick={() => navigate("/")}
        >
          <KeeeyLogo color={currentConfig.color} />
        </motion.div>
      </header>

      {/* Main content - responsive layout */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-7xl">
          {/* Responsive grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

            {/* Features/Benefits Section */}
            <div className="flex justify-center">
              <div
                className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6"
                style={{
                  boxShadow: `0 1px 8px 3px ${currentConfig.color}${userType === 'kprofile' ? '66' : 'B3'}`,
                  borderRadius: "16px"
                }}
              >
                <div className="text-black">
                  {/* Features list */}
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {currentConfig.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-lg font-semibold"
                        >
                          <div
                            className="w-2 h-2 rounded-full mr-3"
                            style={{ backgroundColor: currentConfig.color }}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Description */}
                  <div
                    className="mb-6 text-gray-700"
                    dangerouslySetInnerHTML={{ __html: currentConfig.description }}
                  />

                  {/* Benefits */}
                  <div>
                    <p className="mb-4 font-bold text-gray-800">Et vous souhaitez :</p>
                    <ul className="space-y-3">
                      {currentConfig.benefits.map((benefit, index) => (
                        <li
                          key={index}
                          className="flex items-start text-gray-700"
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0"
                            style={{ backgroundColor: currentConfig.color }}
                          />
                          <span
                            dangerouslySetInnerHTML={{ __html: benefit }}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Auth Card Section */}
            <div className="flex justify-center">
              <UnifiedAuthCard
                userType={userType}
                onEmailStep={handleEmailStep}
                onLogin={handleLogin}
                onRegister={handleRegister}
                onSocialAuth={handleSocialAuth}
                onSupportTicket={handleSupportTicket}
                onPasswordResetRequest={handlePasswordResetRequest}
                error={error}
                isLoading={isLoading}
                clearError={clearError}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full p-6 bg-white border-t">
        <div className="flex justify-center">
          <button
            onClick={() => {
              switch (userType) {
                case "kprofile":
                  saveUserRole("K-PROFILE");
                  break;
                case "kplayer":
                  saveUserRole("K-PLAYER");
                  break;
                case "kpartner":
                  saveUserRole("K-PARTNER");
                  break;
                default:
                  break;
              }
              navigate(currentConfig.guestPath);
            }}
            className="max-w-md w-full px-6 py-3 text-white rounded-xl flex items-center justify-center gap-4 shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105"
            style={{ backgroundColor: currentConfig.color }}
          >
            <span className="font-medium">Essayer la plateforme en Mode Invité</span>
            <svg width="20" height="20" viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25.1545 35.5678V0.432617H29.6205V35.5678H25.1545ZM0.591797 35.5678V0.432617L20.6886 18.0002L0.591797 35.5678Z" fill="white" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LoginContainer;
