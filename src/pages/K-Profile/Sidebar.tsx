import { useState, useEffect } from "react";
import { Settings, Bookmark, Contact, LucideIcon } from "lucide-react";
import Dashbord from "./SidebarIcons/Dashbord";
import CompetenceSVG from "./SidebarIcons/CompetenceSVG";
import TargetSVG from "./SidebarIcons/TargetSVG";

export type ActiveComponent =
  "dashboard"
  | "competence"
  | "contact"
  | "bookmark"
  | "missions"
  | "settings"
  | null;

interface SidebarProps {
  onIconClick: (id: ActiveComponent) => void;
  defaultSelected: ActiveComponent;
  horizontal: boolean;
  setHorizontal: (value: boolean) => void;
}

const Sidebar = ({ onIconClick, defaultSelected, horizontal, setHorizontal }: SidebarProps) => {
  const [activeIcon, setActiveIcon] = useState<ActiveComponent>(horizontal ? null : defaultSelected);

  useEffect(() => {
    if (horizontal) {
      setActiveIcon(null);
    }
  }, [horizontal]);

  const icons: { id: ActiveComponent; Icon: LucideIcon }[] = [
    { id: "dashboard", Icon: Dashbord },
    { id: "competence", Icon: CompetenceSVG },
    { id: "contact", Icon: Contact },
    { id: "bookmark", Icon: Bookmark },
    { id: "missions", Icon: TargetSVG },
    { id: "settings", Icon: Settings },
  ];

  const handleIconClick = (id: ActiveComponent) => {
    setActiveIcon(id);
    setHorizontal(false);
    onIconClick(id);
  };

  return (
    <div
      className={`absolute rounded-2xl transition-all duration-500 bg-gradient-to-b from-[#30797F] to-[#039DAA] 
      ${horizontal
          ? "w-[98%] h-16 grid place-items-center mt-[]"
          : "w-[80px] h-[700px] left-[10px] flex flex-col items-center"
        }`}
    >
      {/* Sidebar Icons */}
      <div className={`grid 
        ${horizontal
          ? " grid-cols-6 gap-x-40 justify-center items-center"
          : "flex flex-col gap-8 items-center"}`}>

        {icons.map(({ id, Icon }) => (
          <div
            key={id}
            className={`relative cursor-pointer flex items-center transition-all duration-500 
              ${horizontal
                ? "p-2"
                : "mt-12 "}`}
            onClick={() => handleIconClick(id)}
          >
            {/* Selection Indicator (Only for Vertical Mode) */}
            {!horizontal && activeIcon === id && (
              <div
                className="absolute bg-white rounded-full"
                style={{
                  width: "3rem",
                  height: "2.5rem",
                  border: "3px solid rgba(140, 214, 194, 0.47)",
                  boxShadow: "1px 2px 8px #a5d8ca",
                }}
              />
            )}

            <div
              className="relative z-10 transition-transform duration-500"
              style={{
                transform: horizontal
                  ? "translateY(0px)"
                  : activeIcon === id
                    ? "translateX(4px)" // Slide animation when selected in vertical mode
                    : "translateX(0px)",
              }}
            >
              <Icon className={`w-8 h-8 md:w-4 md:h-4 lg:w-8 lg:h-8 transition-all duration-500
                   ${activeIcon === id
                  ? "text-ProfilColer"
                  : "text-white hover:text-gray-200"}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
