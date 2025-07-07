import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FaGoogle, FaApple, FaGithub, FaEnvelope, FaArrowLeft, FaQuestionCircle, FaTimes, FaCheck, FaExclamationTriangle } from "react-icons/fa";

type AuthStep = 'initial' | 'password-input' | 'register-form';

interface UnifiedAuthCardProps {
    userType: "kprofile" | "kplayer" | "kpartner";
    onEmailStep: (email: string, userRole: string) => Promise<{ requiresPassword: boolean } | null>;
    onLogin: (formData: { email: string; password: string; user_role: string }) => void;
    onRegister: (formData: any) => void;
    onSocialAuth: (provider: string, userRole: string) => void;
    onSupportTicket?: (ticketData: { email: string; subject: string; content: string }) => Promise<{ success: boolean; message?: string }>;
    onPasswordResetRequest?: (email: string) => Promise<{ success: boolean; message?: string }>;
    error: string | null;
    isLoading: boolean;
    clearError: () => void;
}

interface SupportTicket {
    email: string;
    subject: string;
    content: string;
}

const UnifiedAuthCard: React.FC<UnifiedAuthCardProps> = ({
    userType,
    onEmailStep,
    onLogin,
    onRegister,
    onSocialAuth,
    onSupportTicket,
    onPasswordResetRequest,
    error,
    isLoading,
    clearError
}) => {
    const [step, setStep] = useState<AuthStep>('initial');
    const [email, setEmail] = useState('');
    const [showSupportPopup, setShowSupportPopup] = useState(false);
    const [supportLoading, setSupportLoading] = useState(false);
    const [supportNotification, setSupportNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        company: '',
        user_role: userType === "kprofile" ? "K-PROFILE" :
            userType === "kplayer" ? "K-PLAYER" : "K-PARTNER"
    });
    const [supportTicket, setSupportTicket] = useState<SupportTicket>({
        email: '',
        subject: '',
        content: ''
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

    // Auto-hide support notification
    useEffect(() => {
        if (supportNotification) {
            const timer = setTimeout(() => {
                setSupportNotification(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [supportNotification]);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        const result = await onEmailStep(email, formData.user_role);

        setFormData(prev => ({ ...prev, email }));
        setSupportTicket(prev => ({ ...prev, email }));

        if (!result) {
            setStep('register-form');
        } else if (result?.requiresPassword === true) {
            setStep('password-input');
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
        if (!acceptTerms) {
            return;
        }
        onRegister(formData);
    };

    const handleSocialAuth = (provider: string) => {
        onSocialAuth(provider, formData.user_role);
    };

    const handleSupportSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onSupportTicket) return;

        setSupportLoading(true);
        try {
            const result = await onSupportTicket(supportTicket);
            setSupportNotification({
                type: result.success ? 'success' : 'error',
                message: result.message || (result.success ? 'Ticket envoyé avec succès!' : 'Erreur lors de l\'envoi du ticket')
            });
            if (result.success) {
                setSupportTicket({ email: formData.email, subject: '', content: '' });
            }
        } catch (error) {
            setSupportNotification({
                type: 'error',
                message: 'Erreur lors de l\'envoi du ticket'
            });
        } finally {
            setSupportLoading(false);
            setShowSupportPopup(false);
        }
    };

    const handlePasswordResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!onPasswordResetRequest) return;

        try {
            await onPasswordResetRequest(email);
        } catch (error) {
            console.error(error);
        }
    };

    const goBack = () => {
        clearError(); // Clear error when going back
        if (step === 'password-input' || step === 'register-form') {
            setStep('initial');
        }
    };

    const openSupportPopup = () => {
        setSupportTicket(prev => ({ ...prev, email: formData.email || email }));
        setShowSupportPopup(true);
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
                    />
                </div>

                <motion.button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 p-4 text-white rounded-xl hover:bg-opacity-90 transition text-sm sm:text-base"
                    style={{ background: currentConfig.color }}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading || !email.trim()}
                >
                    <FaEnvelope className="text-white" />
                    <span>{isLoading ? "Vérification..." : "Continuer avec email"}</span>
                </motion.button>
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
                    <div className="flex justify-between">
                        <label className="block text-sm font-medium text-gray-600 mb-2">Mot de passe</label>
                        <p
                            className="block text-sm font-medium text-gray-600 mb-2 hover:text-blue-600 cursor-pointer"
                            onClick={handlePasswordResetRequest}
                        >
                            réinitialiser le mot de passe ?
                        </p>
                    </div>
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

                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        id="acceptTerms"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        required
                        disabled={isLoading}
                    />
                    <div className="flex-1 flex items-center gap-2">
                        <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                            J'accepte les{" "}
                            <a href="#" className="text-blue-600 hover:underline">
                                conditions générales d'utilisation
                            </a>
                        </label>
                        <button
                            type="button"
                            onClick={openSupportPopup}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Signaler un problème"
                        >
                            <FaQuestionCircle size={16} />
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full p-3 text-white rounded-xl hover:bg-opacity-90 transition text-sm font-medium disabled:opacity-50"
                    style={{ background: currentConfig.color }}
                    disabled={isLoading || !acceptTerms}
                >
                    {isLoading ? "Création..." : "Créer mon compte"}
                </button>
            </form>
        </motion.div>
    );

    const renderSupportPopup = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowSupportPopup(false)}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-700">Support technique</h3>
                    <button
                        onClick={() => setShowSupportPopup(false)}
                        className="p-1 rounded-full hover:bg-gray-100 transition"
                        disabled={supportLoading}
                    >
                        <FaTimes className="text-gray-600" />
                    </button>
                </div>

                <form onSubmit={handleSupportSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={supportTicket.email}
                            onChange={(e) => setSupportTicket(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                            required
                            disabled={supportLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Sujet
                        </label>
                        <input
                            type="text"
                            value={supportTicket.subject}
                            onChange={(e) => setSupportTicket(prev => ({ ...prev, subject: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                            placeholder="Décrivez brièvement le problème"
                            required
                            disabled={supportLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Description
                        </label>
                        <textarea
                            value={supportTicket.content}
                            onChange={(e) => setSupportTicket(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm resize-none h-24"
                            placeholder="Décrivez le problème en détail..."
                            required
                            disabled={supportLoading}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setShowSupportPopup(false)}
                            className="flex-1 p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
                            disabled={supportLoading}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
                            disabled={supportLoading}
                        >
                            {supportLoading ? "Envoi..." : "Envoyer"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );

    return (
        <>
            <motion.div
                className="relative w-full max-w-md bg-white p-6 sm:p-8 shadow-lg rounded-2xl"
                style={{ boxShadow: currentConfig.shadow }}
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <AnimatePresence mode="wait">
                    {step === 'initial' && renderInitialStep()}
                    {step === 'password-input' && renderPasswordStep()}
                    {step === 'register-form' && renderRegisterStep()}
                </AnimatePresence>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-4 p-3 rounded-lg ${error.toLowerCase().includes("mailbox")
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"}`}
                    >
                        <p className={`text-sm text-center ${error.toLowerCase().includes("mailbox")
                            ? "text-green-600"
                            : "text-red-600"}`}>
                            {error}
                        </p>
                    </motion.div>
                )}
            </motion.div>

            <AnimatePresence>
                {showSupportPopup && renderSupportPopup()}
            </AnimatePresence>

            <AnimatePresence>
                {supportNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -50, x: "-50%" }}
                        className="fixed top-4 left-1/2 transform z-50 max-w-sm"
                    >
                        <div className={`p-4 rounded-lg shadow-lg flex items-center gap-3 ${supportNotification.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                            }`}>
                            {supportNotification.type === 'success' ? (
                                <FaCheck className="text-green-600 flex-shrink-0" />
                            ) : (
                                <FaExclamationTriangle className="text-red-600 flex-shrink-0" />
                            )}
                            <p className="text-sm font-medium">{supportNotification.message}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default UnifiedAuthCard;