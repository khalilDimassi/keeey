import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaGoogle, FaApple, FaGithub, FaEnvelope, FaArrowLeft } from "react-icons/fa";

type AuthStep = 'initial' | 'email-input' | 'password-input' | 'register-form';

interface UnifiedAuthCardProps {
    userType: "kprofile" | "kplayer" | "kpartner";
    onEmailStep: (email: string, userRole: string) => Promise<{ exists: boolean; requiresPassword: boolean }>;
    onLogin: (formData: { email: string; password: string; user_role: string }) => void;
    onRegister: (formData: any) => void;
    onSocialAuth: (provider: string, userRole: string) => void;
    error: string | null;
    isLoading: boolean;
}

const UnifiedAuthCard: React.FC<UnifiedAuthCardProps> = ({
    userType,
    onEmailStep,
    onLogin,
    onRegister,
    onSocialAuth,
    error,
    isLoading
}) => {
    const [step, setStep] = useState<AuthStep>('initial');
    const [email, setEmail] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        company: '',
        user_role: userType === "kprofile" ? "K-PROFILE" :
            userType === "kplayer" ? "K-PLAYER" : "K-PARTNER"
    });

    const config = {
        kprofile: {
            title: "Accédez à votre compte K-Profile",
            shadow: "0 1px 6px 2px #30797f66",
            color: "#297280",
            focusBorder: "focus:border-[#297280]"
        },
        kplayer: {
            title: "Accédez à votre compte K-Player",
            shadow: "0 1px 8px 3px #3155cd66",
            color: "#215A96",
            focusBorder: "focus:border-[#215A96]"
        },
        kpartner: {
            title: "Accédez à votre compte K-Partner",
            shadow: "0 1px 8px 3px #A89B7B",
            color: "#A89B7B",
            focusBorder: "focus:border-[#A89B7B]"
        }
    };

    const currentConfig = config[userType] || config.kprofile;

    const socialOptions = [
        { provider: 'google', Icon: FaGoogle, text: "Google", color: "text-red-500" },
        { provider: 'apple', Icon: FaApple, text: "Apple", color: "text-black" },
        { provider: 'github', Icon: FaGithub, text: "Github", color: "text-gray-600" },
    ];

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        const result = await onEmailStep(email, formData.user_role);

        setFormData(prev => ({ ...prev, email }));

        if (result.requiresPassword === true) {
            setStep('password-input');
        } else if (result.requiresPassword == null || result.requiresPassword == undefined) {
            setStep('register-form');
        }
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin({
            email: formData.email,
            password: formData.password,
            user_role: formData.user_role
        });
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister(formData);
    };

    const handleSocialAuth = (provider: string) => {
        onSocialAuth(provider, formData.user_role);
    };

    const goBack = () => {
        if (step === 'password-input' || step === 'register-form') {
            setStep('email-input');
        } else if (step === 'email-input') {
            setStep('initial');
        }
    };

    const renderInitialStep = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-center text-lg font-bold text-gray-700 mb-6">
                {currentConfig.title}
            </h2>

            <div className="space-y-4 mb-6">
                {socialOptions.map((item, index) => (
                    <motion.button
                        key={item.provider}
                        onClick={() => handleSocialAuth(item.provider)}
                        className="w-full flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition text-sm sm:text-base"
                        initial={{ x: -15, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                    >
                        <item.Icon className={item.color} />
                        <span>Continuer avec {item.text}</span>
                    </motion.button>
                ))}
            </div>

            <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-gray-500 text-sm">ou</span>
                <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <motion.button
                onClick={() => setStep('email-input')}
                className="w-full flex items-center justify-center gap-2 p-4 text-white rounded-xl hover:bg-opacity-90 transition text-sm sm:text-base"
                style={{ background: currentConfig.color }}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
            >
                <FaEnvelope className="text-white" />
                <span>Continuer avec email</span>
            </motion.button>
        </motion.div>
    );

    const renderEmailStep = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center mb-6">
                <button
                    onClick={goBack}
                    className="p-2 rounded-full hover:bg-gray-100 transition mr-2"
                    disabled={isLoading}
                >
                    <FaArrowLeft className="text-gray-600" />
                </button>
                <h2 className="text-lg font-bold text-gray-700">
                    Entrez votre email
                </h2>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Adresse email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full p-3 border border-gray-300 rounded-xl focus:outline-none ${currentConfig.focusBorder} text-sm`}
                        placeholder="votre@email.com"
                        required
                        disabled={isLoading}
                        autoFocus
                    />
                </div>

                <button
                    type="submit"
                    className="w-full p-3 text-white rounded-xl hover:bg-opacity-90 transition text-sm font-medium"
                    style={{ background: currentConfig.color }}
                    disabled={isLoading || !email.trim()}
                >
                    {isLoading ? "Vérification..." : "Continuer"}
                </button>
            </form>
        </motion.div>
    );

    const renderPasswordStep = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center mb-6">
                <button
                    onClick={goBack}
                    className="p-2 rounded-full hover:bg-gray-100 transition mr-2"
                    disabled={isLoading}
                >
                    <FaArrowLeft className="text-gray-600" />
                </button>
                <h2 className="text-lg font-bold text-gray-700">
                    Connexion
                </h2>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Connexion en tant que:</p>
                <p className="font-medium text-gray-800">{formData.email}</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Mot de passe
                    </label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={`w-full p-3 border border-gray-300 rounded-xl focus:outline-none ${currentConfig.focusBorder} text-sm`}
                        required
                        disabled={isLoading}
                        autoFocus
                    />
                </div>

                <button
                    type="submit"
                    className="w-full p-3 text-white rounded-xl hover:bg-opacity-90 transition text-sm font-medium"
                    style={{ background: currentConfig.color }}
                    disabled={isLoading}
                >
                    {isLoading ? "Connexion..." : "Se connecter"}
                </button>
            </form>
        </motion.div>
    );

    const renderRegisterStep = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center mb-6">
                <button
                    onClick={goBack}
                    className="p-2 rounded-full hover:bg-gray-100 transition mr-2"
                    disabled={isLoading}
                >
                    <FaArrowLeft className="text-gray-600" />
                </button>
                <h2 className="text-lg font-bold text-gray-700">
                    Créer un compte
                </h2>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Inscription avec:</p>
                <p className="font-medium text-gray-800">{formData.email}</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Prénom
                        </label>
                        <input
                            type="text"
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            className={`w-full p-3 border border-gray-300 rounded-xl focus:outline-none ${currentConfig.focusBorder} text-sm`}
                            required
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Nom
                        </label>
                        <input
                            type="text"
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            className={`w-full p-3 border border-gray-300 rounded-xl focus:outline-none ${currentConfig.focusBorder} text-sm`}
                            required
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {userType !== 'kprofile' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Entreprise
                        </label>
                        <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className={`w-full p-3 border border-gray-300 rounded-xl focus:outline-none ${currentConfig.focusBorder} text-sm`}
                            required
                            disabled={isLoading}
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Mot de passe
                    </label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={`w-full p-3 border border-gray-300 rounded-xl focus:outline-none ${currentConfig.focusBorder} text-sm`}
                        required
                        disabled={isLoading}
                        minLength={6}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full p-3 text-white rounded-xl hover:bg-opacity-90 transition text-sm font-medium"
                    style={{ background: currentConfig.color }}
                    disabled={isLoading}
                >
                    {isLoading ? "Création..." : "Créer mon compte"}
                </button>
            </form>
        </motion.div>
    );

    return (
        <motion.div
            className="relative w-full max-w-md bg-white p-6 sm:p-8 shadow-lg rounded-2xl"
            style={{ boxShadow: currentConfig.shadow }}
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <AnimatePresence mode="wait">
                {step === 'initial' && renderInitialStep()}
                {step === 'email-input' && renderEmailStep()}
                {step === 'password-input' && renderPasswordStep()}
                {step === 'register-form' && renderRegisterStep()}
            </AnimatePresence>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                    <p className="text-red-600 text-sm text-center">{error}</p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default UnifiedAuthCard;