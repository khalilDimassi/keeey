// RegisterForm.tsx
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import KeeeyLogo from '../../assets/KeeyLogo';
import { useState } from 'react';

interface RegisterFormProps {
    userType: string;
    onRegister: (formData: any) => void;
    error: string;
    isLoading: boolean;
}

const RegisterForm = ({ userType, onRegister, error, isLoading }: RegisterFormProps) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        user_role: userType === 'kprofile' ? 'K-PROFILE' : userType === 'kplayer' ? 'K-PLAYER' : 'K-PARTNER'
    });

    const config = {
        kprofile: {
            title: "Créer votre compte K-Profile",
            color: "#297280",
            shadow: "0 1px 6px 2px #30797f66",
            focusBorder: "focus:border-green-500",
            guestPath: "/Layout/kprofile"
        },
        kplayer: {
            title: "Créer votre compte K-Player",
            color: "#215A96",
            shadow: "0 1px 8px 3px #3155cd66",
            focusBorder: "focus:border-blue-500",
            guestPath: "/Layout/kplayer"
        },
        kpartner: {
            title: "Créer votre compte K-Partner",
            color: "#A89B7B",
            shadow: "0 1px 8px 3px #a89b7b66",
            focusBorder: "focus:border-yellow-600",
            guestPath: "/Layout/kpartner"
        }
    };

    const currentConfig = config[userType as keyof typeof config] || config.kprofile;

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        onRegister(formData);
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-3 bg-gray-50">
            <div className="width-12 absolute top-6 left-1/2 transform -translate-x-1/2 object-contain cursor-pointer" onClick={() => navigate("/")}>
                <KeeeyLogo color={currentConfig.color} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative w-full max-w-lg bg-white p-6 shadow-md"
                style={{
                    boxShadow: currentConfig.shadow,
                    borderRadius: "15px",
                }}
            >
                <div className="flex items-center mb-4">
                    <button onClick={() => navigate("/Login/" + userType)} className="text-gray-600 hover:text-gray-800">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-lg font-bold text-gray-700 flex-grow text-center">
                        {currentConfig.title}
                    </h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-gray-600 text-sm"><span className='text-red-500'>* </span>Prénom</label>
                            <input
                                type="text"
                                name="first_name"
                                placeholder="Prénom"
                                className={`w-full p-2 border border-gray-300 rounded focus:outline-none ${currentConfig.focusBorder}`}
                                value={formData.first_name}
                                onChange={handleChange}
                                style={{ borderRadius: "12px" }}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm"><span className='text-red-500'>* </span>Nom</label>
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Nom"
                                className={`w-full p-2 border border-gray-300 rounded focus:outline-none ${currentConfig.focusBorder}`}
                                value={formData.last_name}
                                onChange={handleChange}
                                style={{ borderRadius: "12px" }}
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-3">
                        <label className="block text-gray-600 text-sm"><span className='text-red-500'>* </span>Adresse mail</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="exemple@mail.com"
                            className={`w-full p-2 border border-gray-300 rounded focus:outline-none ${currentConfig.focusBorder}`}
                            value={formData.email}
                            onChange={handleChange}
                            style={{ borderRadius: "12px" }}
                            required
                        />
                    </div>

                    <div className="mt-3">
                        <label className="block text-gray-600 text-sm">Numéro de téléphone</label>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Votre numéro"
                            className={`w-full p-2 border border-gray-300 rounded focus:outline-none ${currentConfig.focusBorder}`}
                            value={formData.phone}
                            onChange={handleChange}
                            style={{ borderRadius: "12px" }}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div>
                            <label className="block text-gray-600 text-sm"><span className='text-red-500'>* </span>Mot de passe</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Mot de passe"
                                className={`w-full p-2 border border-gray-300 rounded focus:outline-none ${currentConfig.focusBorder}`}
                                value={formData.password}
                                onChange={handleChange}
                                style={{ borderRadius: "12px" }}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 text-sm"><span className='text-red-500'>* </span>Confirmer</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirmer le mot de passe"
                                className={`w-full p-2 border border-gray-300 rounded focus:outline-none ${currentConfig.focusBorder}`}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                style={{ borderRadius: "12px" }}
                                required
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

                    <div className="mt-5 flex space-x-3">
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-1/2 text-white py-1.5 rounded hover:bg-opacity-90 transition ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                            style={{
                                borderRadius: "12px",
                                background: currentConfig.color
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? "..." : "Inscrivez-vous"}
                        </motion.button>

                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-1/2 text-gray-500 text-sm hover:underline"
                            onClick={() => navigate(currentConfig.guestPath)}
                        >
                            Continuer en tant qu'invité →
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default RegisterForm;