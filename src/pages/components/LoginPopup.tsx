import KeeeyLogo from "../assets/KeeyLogo";
import { ProfileType } from "./types";

interface ProfileConfig {
  mainCOlor: string;
  loginURL: string;
  registerURL: string;
}

type LoginPopupProps = {
  profileType: ProfileType;
  onClose: () => void;
};

const UnifiedLoginPopup = ({ profileType, onClose }: LoginPopupProps) => {
  const profileConfigs: Record<ProfileType, ProfileConfig> = {
    kprofile: {
      mainCOlor: "",
      loginURL: "",
      registerURL: "",
    },
    kplayer: {
      mainCOlor: "#215A96",
      loginURL: "/LoginPageKplayer",
      registerURL: "/LoginOptionsKPlayer",
    },
    kpartner: {
      mainCOlor: "",
      loginURL: "",
      registerURL: "",
    },
  };

  const config = profileConfigs[profileType];

  const renderKStyle = (profileType: ProfileType) => {
    const colorConfig = {
      kprofile: {
        mainColor: config.mainCOlor,
        loginURL: config.loginURL,
        registerURL: config.registerURL,
      },
      kplayer: {
        mainColor: config.mainCOlor,
        loginURL: config.loginURL,
        registerURL: config.registerURL,
      },
      kpartner: {
        mainColor: config.mainCOlor,
        loginURL: config.loginURL,
        registerURL: config.registerURL,
      },
    }[profileType];

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-[600px] h-[300px] relative">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center w-40 h-[70px]">
              <KeeeyLogo color={colorConfig.mainColor} />
            </div>
            <button className="text-gray-600 hover:underline text-sm">
              <a href={colorConfig.loginURL} className="text-gray-700 ml-1 hover:underline"> J'ai déjà un compte</a>
            </button>
          </div>

          {/* Message */}
          <p className="text-center text-gray-700 text-lg mb-6 px-4">
            Pour profiter pleinement de toutes les fonctionnalités disponibles sur Keeey,
            veuillez créer un compte ou vous connecter à votre compte existant.
          </p>

          {/* Create Account Button */}
          <button className={`w-full text-white font-medium py-2 rounded-lg flex items-center mt-5 justify-center bg-[${colorConfig.mainColor}]`}>
            <a href={colorConfig.registerURL} className="text-white ml-1 hover:underline"> 🔒 Créer un compte</a>
          </button>
        </div>
      </div>
    )
  }

  if (profileType === "kplayer") {
    return renderKStyle("kplayer");
  } else if (profileType === "kpartner") {
    return renderKStyle("kpartner");
  } else {
    return renderKStyle("kprofile");
  }
};

export const LoginPopupKProfile = (props: Omit<LoginPopupProps, 'profileType'>) => (
  <UnifiedLoginPopup {...props} profileType="kprofile" />
);

export const LoginPopupKPlayer = (props: Omit<LoginPopupProps, 'profileType'>) => (
  <UnifiedLoginPopup {...props} profileType="kplayer" />
);

export const LoginPopupKPartner = (props: Omit<LoginPopupProps, 'profileType'>) => (
  <UnifiedLoginPopup {...props} profileType="kpartner" />
);

export default UnifiedLoginPopup; 