import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { saveToken, saveUserId } from "../../utils/jwt";

import LoginOptions from "./content/LoginOptions";
import LoginPage from "./content/LoginPage";
import axios from "axios";
import KeeeyLogo from "../assets/KeeyLogo";

const LoginContainer = () => {
    const navigate = useNavigate();
    const { userType = "kprofile" } = useParams<{ userType: keyof typeof config }>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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
            const redirectPath = formData.user_role === "K-PROFILE" ? "/Layout/kprofile" :
                formData.user_role === "K-PLAYER" ? "/Layout/kplayer" :
                    "/Layout/kpartner";

            navigate(redirectPath);
        } catch (error) {
            setError("Login failed. Please check your credentials.");
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Configuration object for each user type
    const config = {
        kprofile: {
            color: "#30797F",
            features: [
                "Freelance", "Indépendant", "Consultant"
            ],
            description: "Vous êtes à la <span class='text-[#30797F] font-semibold'>recherche de vos prochaines missions</span>",
            benefits: [
                "<span class='text-[#30797F] font-semibold'>Garder le contact</span> avec vos anciens clients et votre réseau",
                "<span class='text-[#30797F] font-semibold'>Garder le contrôle</span> sur la visibilité de votre profil",
                "Gérer facilement votre <span class='text-[#30797F] font-semibold'>dossier de compétences</span>",
                "Centraliser vos <span class='text-[#30797F] font-semibold'>références professionnelles</span>",
                "<span class='text-[#30797F] font-semibold'>Suivre vos missions</span>",
                "<span class='text-[#30797F] font-semibold'>Rester informé(e)</span> de la tendance du marché"
            ],
            guestPath: "/Layout/kprofile",
            loginPage: <LoginPage userType={userType} onLogin={handleLogin} error={error || ""} isLoading={isLoading} />,
            loginOptions: <LoginOptions userType={userType} />
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
            guestPath: "/LayoutKPlayer",
            loginPage: <LoginPage userType={userType} onLogin={handleLogin} error={error || ""} isLoading={isLoading} />,
            loginOptions: <LoginOptions userType={userType} />
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
            guestPath: "/Layout/KPartner",
            loginPage: <LoginPage userType={userType} onLogin={handleLogin} error={error || ""} isLoading={isLoading} />,
            loginOptions: <LoginOptions userType={userType} />
        }
    };

    const currentConfig = config[userType as keyof typeof config] || config.kprofile;

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
                    className="absolute left-1/2 transform -translate-x-1/2 w-26 sm:w-30 cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    onClick={() => navigate("/")}
                >
                    <KeeeyLogo color={currentConfig.color} />
                </motion.div>
            </header>

            <main>
                <div className="flex gap-10 px-20 flex-col md:flex-row w-full rounded-lg">
                    {/* Features/Benefits Section */}
                    <motion.div
                        className="w-full mt-6 md:w-1/3 my-6 relative max-w-sm sm:max-w-md md:max-w-lg py-16 bg-white sm:p-2 shadow-lg rounded-2xl"
                        style={{
                            boxShadow: `0 1px 8px 3px ${currentConfig.color}${userType === 'kprofile' ? '66' : 'B3'}`,
                            borderRadius: "16px"
                        }}
                        initial={{ x: -80, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="max-w-sm mx-auto p-4 text-black">
                            <ul className="list-disc pl-10 text-lg font-semibold">
                                {currentConfig.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>

                            <p
                                className="mt-4"
                                dangerouslySetInnerHTML={{ __html: currentConfig.description }}
                            />

                            <p className="mt-4 font-bold">Et vous souhaitez :</p>

                            <ul className="mt-2 space-y-3">
                                {currentConfig.benefits.map((benefit, index) => (
                                    <li
                                        key={index}
                                        dangerouslySetInnerHTML={{ __html: benefit }}
                                    />
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    {/* Login Form Section */}
                    <div className="w-full md:w-1/3 py-6 rounded-lg">
                        {currentConfig.loginPage}
                    </div>

                    {/* Login Options Section */}
                    <div className="w-full md:w-1/3 py-6 rounded-lg">
                        {currentConfig.loginOptions}
                    </div>
                </div>
            </main>

            <footer className="w-full mt-auto p-4 bg-white">
                <div className="flex justify-center">
                    <button
                        onClick={() => navigate(currentConfig.guestPath)}
                        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-6 py-3 text-white rounded-xl flex items-center justify-center gap-8 shadow-md transition duration-300"
                        style={{ background: currentConfig.color }}
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