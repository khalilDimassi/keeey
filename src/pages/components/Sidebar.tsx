import { useState, useEffect } from "react";
import { Settings, Bookmark, Contact, Building2, Search, UserCheck } from "lucide-react";
import { DashbordSVG, CompetenceSVG, TargetSVG, CvSvG, ProfileCompanySVG } from "./SVGcomponents";
import { ActiveComponent, ProfileType } from "./types";

// TODO: Mock components for demonstration - replace with actual imports 
const GroupContacr = ({ className }: { className?: string }) => <Contact className={className} />;
const Contactetoile = ({ className }: { className?: string }) => <UserCheck className={className} />;
const Staff_recruiting = ({ className }: { className?: string }) => <Building2 className={className} />;

interface IconItem {
  id: ActiveComponent;
  Icon: React.ComponentType<{ className?: string }>;
}

interface ProfileConfig {
  backgroundColor: string;
  borderColor: string;
  boxShadow: string;
  selectedTextColor: string;
  icons: IconItem[];
}

interface SidebarProps {
  profileType: ProfileType;
  onIconClick: (id: ActiveComponent) => void;
  defaultSelected: ActiveComponent;
  horizontal?: boolean;
  setHorizontal?: (value: boolean) => void;
}

const UnifiedSidebar = ({ profileType, onIconClick, defaultSelected, horizontal = false, setHorizontal }: SidebarProps) => {
  const [activeIcon, setActiveIcon] = useState<ActiveComponent | null>(horizontal ? null : defaultSelected);

  useEffect(() => {
    if (horizontal) {
      setActiveIcon(null);
    }
  }, [horizontal]);

  // Profile configurations
  const profileConfigs: Record<ProfileType, ProfileConfig> = {
    kprofile: {
      backgroundColor: "#297280",
      borderColor: "#29728078",
      boxShadow: "3px 3px 7px rgb(20, 57, 64)",
      selectedTextColor: "#297280",
      icons: [
        { id: "dashboard", Icon: DashbordSVG },
        { id: "competence", Icon: CompetenceSVG },
        { id: "bookmark", Icon: Bookmark },
        { id: "contact", Icon: Contact },
        { id: "missions", Icon: TargetSVG },
        { id: "settings", Icon: Settings },
      ]
    },
    kplayer: {
      backgroundColor: "#215A96",
      borderColor: "#34379578",
      boxShadow: "3px 3px 7px rgb(40, 41, 112)",
      selectedTextColor: "#215A96",
      icons: [
        { id: "dashboard", Icon: DashbordSVG },
        { id: "profile", Icon: ProfileCompanySVG },
        { id: "search", Icon: Search },
        // { id: "company", Icon: Building2 },
        { id: "contacts", Icon: Contact },
        { id: "missions", Icon: TargetSVG },
        { id: "settings", Icon: Settings },
      ]
    },
    kpartner: {
      backgroundColor: "#A89B7B",
      borderColor: "#ac850878",
      boxShadow: "1px 2px 8px rgb(102, 80, 8)",
      selectedTextColor: "#A58E56",
      icons: [
        { id: "dashboard", Icon: DashbordSVG },
        { id: "competence", Icon: CompetenceSVG },
        { id: "fileText1", Icon: CvSvG },
        { id: "bookmark", Icon: Staff_recruiting },
        { id: "contact", Icon: GroupContacr },
        { id: "user", Icon: Contactetoile },
        { id: "target", Icon: TargetSVG },
        { id: "settings", Icon: Settings },
      ]
    }
  };

  const config = profileConfigs[profileType];

  const handleIconClick = (id: ActiveComponent) => {
    setActiveIcon(id);
    if (setHorizontal) {
      setHorizontal(false);
    }
    onIconClick(id);
  };

  const renderKStyle = (profileType: ProfileType) => {
    const colorConfig = {
      kprofile: {
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor,
        selectedTextColor: config.selectedTextColor,
        boxShadow: config.boxShadow,
      },
      kplayer: {
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor,
        selectedTextColor: config.selectedTextColor,
        boxShadow: config.boxShadow,
      },
      kpartner: {
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor,
        selectedTextColor: config.selectedTextColor,
        boxShadow: config.boxShadow,
      },
    }[profileType];

    return (
      <div
        className={`rounded-2xl ${horizontal
          ? "w-full mx-16 h-16 flex items-center justify-center"
          : "w-[6%] h-fit py-8 left-[10px] flex items-center justify-center"
          }`}
        style={{ background: colorConfig.backgroundColor }}
      >
        <div className={`flex ${horizontal
          ? "flex-row gap-x-40 justify-center items-center"
          : "flex-col gap-20 py-12 items-center"
          }`}>
          {config.icons.map(({ id, Icon }) => (
            <div
              key={id}
              className={`cursor-pointer flex items-center ${horizontal ? "p-2" : ""}`}
              onClick={() => handleIconClick(id)}
            >
              <div
                className={`transition-all duration-300 ${!horizontal && activeIcon === id
                  ? "bg-slate-100 rounded-full py-2 px-4 ml-8"
                  : ""
                  }`}
              >
                <Icon
                  className={`w-8 h-8 md:w-4 md:h-4 lg:w-8 lg:h-8 transition-colors duration-300 ${activeIcon === id
                    ? `text-[${colorConfig.selectedTextColor}]`
                    : "text-white hover:text-gray-200"
                    }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Default to kprofile style for all profiles, but allow specific overrides
  if (profileType === "kplayer") {
    return renderKStyle("kplayer");
  } else if (profileType === "kpartner") {
    return renderKStyle("kpartner");
  } else {
    return renderKStyle("kprofile");
  }
};

// Export individual components for backward compatibility
export const SidebarKProfile = (props: Omit<SidebarProps, 'profileType'>) => (
  <UnifiedSidebar {...props} profileType="kprofile" />
);

export const SidebarKPlayer = (props: Omit<SidebarProps, 'profileType'>) => (
  <UnifiedSidebar {...props} profileType="kplayer" />
);

export const SidebarKPartner = (props: Omit<SidebarProps, 'profileType'>) => (
  <UnifiedSidebar {...props} profileType="kpartner" />
);

export default UnifiedSidebar;