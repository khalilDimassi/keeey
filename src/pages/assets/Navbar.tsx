import { AlertTriangle, LogOut, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { ProfileType } from "./types";
import axios from "axios";
import { isAuthenticated, getAuthHeader, saveUserId, removeToken } from "../../utils/jwt";
import { useNavigate } from "react-router-dom";
import KeeeyLogo from "./KeeyLogo";

interface ProfileConfig {
    logoColor: string
    boxShadow: string
    nameColor: string
    userType: string
    popupColor: string
}

interface NavbarProps {
    profileType: ProfileType
}

const UnifiedNavbar = ({ profileType }: NavbarProps) => {
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/profile`, { headers: getAuthHeader(), })
                .then(response => {
                    const { first_name, last_name, ID, email_verified } = response.data.user;
                    setUserName(`${first_name} ${last_name}`);
                    saveUserId(ID);
                    setIsEmailVerified(email_verified);
                })
                .catch(error => console.error("Error fetching profile:", error));
        }
    }, [setUserName, saveUserId, setIsEmailVerified]);


    const CreateAccountClick = () => {
        if (isAuthenticated()) {
            removeToken();
            navigate("/");
        } else {
            navigate("/Login/kprofile");
        }
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

    // Profile configurations
    const profileConfigs: Record<ProfileType, ProfileConfig> = {
        kprofile: {
            logoColor: "#297280",
            boxShadow: "0 4px 15px #0c6f0c47",
            nameColor: "text-[#297280]",
            userType: "K-Profile",
            popupColor: "bg-[#297280] hover:bg-teal-900",
        },
        kplayer: {
            logoColor: "#215A96",
            boxShadow: "0 4px 15px #3e4ecb54",
            nameColor: "text-[#215A96]",
            userType: "K-Player",
            popupColor: "bg-[#215A96] hover:bg-blue-900",
        },
        kpartner: {
            logoColor: "#A89B7B",
            boxShadow: "0 4px 15px #0c6f0c47",
            nameColor: "text-[#A58E56]",
            userType: "K-Partner",
            popupColor: "bg-[#A58E56] hover:bg-[#73633C]",
        }
    };

    const config = profileConfigs[profileType];


    const renderKStyle = (profileType: ProfileType) => {
        const colorConfig = {
            kprofile: {
                logoColor: config.logoColor,
                boxShadow: config.boxShadow,
                nameColor: config.nameColor,
                userType: config.userType,
                popupColor: config.popupColor,
            },
            kplayer: {
                logoColor: config.logoColor,
                boxShadow: config.boxShadow,
                nameColor: config.nameColor,
                userType: config.userType,
                popupColor: config.popupColor,
            },
            kpartner: {
                logoColor: config.logoColor,
                boxShadow: config.boxShadow,
                nameColor: config.nameColor,
                userType: config.userType,
                popupColor: config.popupColor,
            },
        }[profileType];

        return (

            <div
                className="relative flex items-center bg-white py-3 px-8 rounded-xl shadow-md m-3 mb-6"
                style={{ boxShadow: colorConfig.boxShadow }}
            >
                <div className="flex items-center cursor-pointer w-32 h-14 flex-shrink-0" onClick={() => navigate("/")}>
                    <KeeeyLogo color={colorConfig.logoColor} />
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-2">
                    {isAuthenticated() && (
                        <>
                            <div className="flex items-center">
                                {isEmailVerified ? (
                                    <></>
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

                            <div className={`font-semibold text-lg whitespace-nowrap ${colorConfig.nameColor}`}>
                                {userName || colorConfig.userType}
                                {!userName && <span className="text-gray-500 ml-1">(Guest)</span>}
                            </div>
                        </>
                    )}

                    {/* Guest state */}
                    {!isAuthenticated() && (
                        <div className={`font-semibold text-lg whitespace-nowrap ${colorConfig.nameColor}`}>
                            {colorConfig.userType} <span className="text-gray-500">(Guest)</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center ml-auto flex-shrink-0">
                    <button
                        onClick={CreateAccountClick}
                        className={`hidden md:flex ${isAuthenticated()
                            ? "bg-gray-600 hover:bg-gray-800"
                            : colorConfig.popupColor
                            } text-white px-4 py-2 rounded-xl items-center gap-2 shadow-md transition-all duration-200 ease-in-out transform hover:scale-105`}
                    >
                        {isAuthenticated() ? <LogOut size={18} /> : <UserPlus size={18} />}
                        <span className="font-medium">
                            {isAuthenticated() ? "Déconnexion" : "Créer un compte"}
                        </span>
                    </button>
                </div>
            </div>
        );
    };

    if (profileType === "kplayer") {
        return renderKStyle("kplayer");
    } else if (profileType === "kpartner") {
        return renderKStyle("kpartner");
    } else {
        return renderKStyle("kprofile");
    }
};


export const NavbarKProfile = (props: Omit<NavbarProps, 'profileType'>) => (
    <UnifiedNavbar {...props} profileType="kprofile" />
);

export const NavbarKPlayer = (props: Omit<NavbarProps, 'profileType'>) => (
    <UnifiedNavbar {...props} profileType="kplayer" />
);

export const NavbarKPartner = (props: Omit<NavbarProps, 'profileType'>) => (
    <UnifiedNavbar {...props} profileType="kpartner" />
);

export default UnifiedNavbar;