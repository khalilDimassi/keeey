import { FC, useState } from "react";
import { motion } from "framer-motion";
import { FaGoogle, FaApple, FaGithub } from "react-icons/fa";

interface LoginPageProps {
    userType: "kprofile" | "kplayer" | "kpartner";
    onLogin: (formData: { email: string; password: string; user_role: string }) => void;
    error: string;
    isLoading: boolean;
}

const LoginPage: FC<LoginPageProps> = ({ userType, onLogin, error, isLoading }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        user_role: userType === "kprofile" ? "K-PROFILE" :
            userType === "kplayer" ? "K-PLAYER" : "K-PARTNER"
    });

    const config = {
        kprofile: {
            title: "Connectez-vous à votre compte K-Profile",
            shadow: "0 1px 6px 2px rgba(48, 121, 127, 0.4)",
            color: "#307A7D",
            focusBorder: "focus:border-[#307A7D]"
        },
        kplayer: {
            title: "Connectez-vous à votre compte K-Player",
            shadow: "0 1px 8px 3px rgba(49, 85, 205, 0.4)",
            color: "#215A96",
            focusBorder: "focus:border-[#215A96]"
        },
        kpartner: {
            title: "Connectez-vous à votre compte K-Partner",
            shadow: "0 1px 8px 3px #A89B7B",
            color: "#A89B7B",
            focusBorder: "focus:border-[#A89B7B]"
        }
    };

    const currentConfig = config[userType] || config.kprofile;

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        onLogin(formData);
    };

    return (
        <motion.div
            className="relative w-full max-w-sm sm:max-w-md md:max-w-lg bg-white p-6 sm:p-8 shadow-lg rounded-2xl"
            style={{ boxShadow: currentConfig.shadow }}
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <h2 className="text-center text-lg font-bold text-gray-700 mb-4">
                {currentConfig.title}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full p-2 border border-gray-300 rounded focus:outline-none ${currentConfig.focusBorder} text-sm`}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Mot de passe</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={`w-full p-2 border border-gray-300 rounded focus:outline-none ${currentConfig.focusBorder} text-sm`}
                        required
                    />
                </div>

                {error && <p className="text-red-500 text-xs text-center mt-1">{error}</p>}

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className={`w-1/3 p-2 mt-4 text-white rounded hover:bg-opacity-90 transition text-sm ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                        style={{ background: currentConfig.color }}
                        disabled={isLoading}
                    >
                        {isLoading ? "..." : "Go"}
                    </button>
                </div>
            </form>

            <div className="space-y-3 mt-6">
                {[FaGoogle, FaApple, FaGithub].map((Icon, i) => (
                    <button
                        key={i}
                        className="w-full flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition text-xs sm:text-sm"
                    >
                        <Icon className={`text-${i === 0 ? "red-500" : i === 1 ? "black" : "gray-800"}`} />
                        <span>Continuer avec {i === 0 ? "Google" : i === 1 ? "Apple" : "GitHub"}</span>
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

export default LoginPage;