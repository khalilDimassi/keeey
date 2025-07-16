import { NavLink } from "react-router-dom";
import { Settings, Bookmark, Contact, Building2, Search, UserCheck } from "lucide-react";
import { DashbordSVG, CompetenceSVG, TargetSVG, CvSvG, ProfileCompanySVG } from "./SVGcomponents";
import { ProfileType } from "./types";

// TODO: Mock components for demonstration - replace with actual imports 
const GroupContacr = ({ className }: { className?: string }) => <Contact className={className} />;
const Contactetoile = ({ className }: { className?: string }) => <UserCheck className={className} />;
const Staff_recruiting = ({ className }: { className?: string }) => <Building2 className={className} />;

interface IconItem {
  id: string;
  path: string;
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
  horizontal?: boolean;
}

const UnifiedSidebar = ({ profileType, horizontal = false, }: SidebarProps) => {
  const profileConfigs: Record<ProfileType, ProfileConfig> = {
    kprofile: {
      backgroundColor: "#297280",
      borderColor: "#29728078",
      boxShadow: "3px 3px 7px rgb(20, 57, 64)",
      selectedTextColor: "#297280",
      icons: [
        { id: "dashboard", path: "/kprofile/dashboard", Icon: DashbordSVG },
        { id: "competence", path: "/kprofile/profile", Icon: CompetenceSVG },
        { id: "bookmark", path: "/kprofile/bookmarks", Icon: Bookmark },
        { id: "contact", path: "/kprofile/contacts", Icon: Contact },
        { id: "missions", path: "/kprofile/missions", Icon: TargetSVG },
        { id: "settings", path: "/kprofile/settings", Icon: Settings },
      ]
    },
    kplayer: {
      backgroundColor: "#215A96",
      borderColor: "#34379578",
      boxShadow: "3px 3px 7px rgb(40, 41, 112)",
      selectedTextColor: "#215A96",
      icons: [
        { id: "dashboard", path: "/kplayer/dashboard", Icon: DashbordSVG },
        { id: "profile", path: "/kplayer/profile", Icon: ProfileCompanySVG },
        { id: "search", path: "/kplayer/projects", Icon: Search },
        { id: "contacts", path: "/kplayer/contacts", Icon: Contact },
        { id: "missions", path: "/kplayer/missions", Icon: TargetSVG },
        { id: "settings", path: "/kplayer/settings", Icon: Settings },
      ]
    },
    kpartner: {
      backgroundColor: "#A89B7B",
      borderColor: "#ac850878",
      boxShadow: "1px 2px 8px rgb(102, 80, 8)",
      selectedTextColor: "#A58E56",
      icons: [
        { id: "dashboard", path: "/kpartner/dashboard", Icon: DashbordSVG },
        { id: "competence", path: "/kpartner/competence", Icon: CompetenceSVG },
        { id: "fileText1", path: "/kpartner/cv", Icon: CvSvG },
        { id: "bookmark", path: "/kpartner/staff", Icon: Staff_recruiting },
        { id: "contact", path: "/kpartner/group", Icon: GroupContacr },
        { id: "user", path: "/kpartner/contacts", Icon: Contactetoile },
        { id: "target", path: "/kpartner/missions", Icon: TargetSVG },
        { id: "settings", path: "/kpartner/settings", Icon: Settings },
      ]
    }
  };

  const config = profileConfigs[profileType];

  const renderKStyle = () => {
    return (
      <div
        className={`rounded-2xl ${horizontal
          ? "w-full mx-16 h-16 flex items-center justify-center"
          : "w-[6%] h-fit py-8 left-[10px] flex items-center justify-center"
          }`}
        style={{ background: config.backgroundColor }}
      >
        <div className={`flex ${horizontal
          ? "flex-row gap-x-40 justify-center items-center"
          : "flex-col gap-20 py-12 items-center"
          }`}>
          {config.icons.map(({ id, path, Icon }) => (
            <NavLink
              key={id}
              to={path}
              className={`cursor-pointer flex items-center ${horizontal ? "p-2" : ""}`}
            >
              {({ isActive }) => (
                <div
                  className={`transition-all duration-300 ${!horizontal && isActive
                    ? "bg-slate-100 rounded-full py-2 px-4 ml-8"
                    : ""
                    }`}
                >
                  <Icon
                    className={`w-8 h-8 md:w-4 md:h-4 lg:w-8 lg:h-8 transition-colors duration-300 ${isActive
                      ? `text-[${config.selectedTextColor}]`
                      : "text-white hover:text-gray-200"
                      }`}
                  />
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    );
  };

  return renderKStyle();
};

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