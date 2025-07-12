import { useState, useEffect } from "react";
import { Settings, Bookmark, Contact, LucideIcon } from "lucide-react";
import Dashbord from "./SidebarIcons/Dashbord";
import CompetenceSVG from "./SidebarIcons/CompetenceSVG";
import TargetSVG from "./SidebarIcons/TargetSVG";

export type ActiveComponent =
  "dashboard"
  | "competence"
  | "bookmark"
  | "contact"
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
    { id: "bookmark", Icon: Bookmark },
    { id: "contact", Icon: Contact },
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
      className={`rounded-2xl  bg-[#297280] ${horizontal
        ? "w-full mx-16 h-16 flex items-center justify-center"
        : "w-[8%] h-fit py-8 left-[10px] flex items-center justify-center"
        }`}
    >
      {/* Sidebar Icons */}
      <div className={`flex ${horizontal
        ? "flex-row gap-x-40 justify-center items-center"
        : "flex-col gap-20 py-12 items-center"}`}
      >
        {icons.map(({ id, Icon }) => (
          <div
            key={id}
            className={`cursor-pointer flex items-center ${horizontal ? "p-2" : ""}`}
            onClick={() => handleIconClick(id)}
          >
            <div
              className={`transition-all duration-300 ${!horizontal && activeIcon === id
                ? "bg-white rounded-full py-2 px-4 ml-6"
                : ""}`}
            >
              <Icon
                className={`w-8 h-8 md:w-4 md:h-4 lg:w-8 lg:h-8 transition-colors duration-300 ${activeIcon === id
                  ? "text-[#297280]"
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

export default Sidebar;
