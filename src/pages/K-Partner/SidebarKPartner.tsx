import React, { useState, useEffect } from "react";
import { 
  LayoutGrid, 
  Settings, 
  FileText, 
  Bookmark, 
  Target, 
  Contact,   // ✅ Contact exists in Lucide
  User, 
  BrainCircuit, // ✅ Alternative for Competence
  LucideIcon
} from "lucide-react";
import Dashbord from "./SidebarIcons/Dashbord";
import CompetenceSVG from "./SidebarIcons/CompetenceSVG";
import CvSvG from "./SidebarIcons/CvSVG";
import TargetSVG from "./SidebarIcons/TargetSVG";

import GroupContacr from "./SidebarIcons/GroupContacr";
import Contactetoile from "./SidebarIcons/Contactetoile";
import Staff_recruiting from "./SidebarIcons/Staff_recruiting";

type IconId = "dashboard" | "fileText1" | "bookmark" | "target" | "competence" | "user" | "settings" | "contact"| null;

interface SidebarProps {
  onIconClick: (id: IconId) => void;
  defaultSelected: IconId;
  horizontal: boolean;
  setHorizontal: (value: boolean) => void; // Function to switch back to vertical
}

const SidebarKPartner = ({ onIconClick, defaultSelected, horizontal, setHorizontal }: SidebarProps) => {
  const [activeIcon, setActiveIcon] = useState<IconId>(horizontal ? null : defaultSelected);

  useEffect(() => {
    if (horizontal) {
      setActiveIcon(null);
    }
  }, [horizontal]);
  const icons: { id: IconId; Icon: LucideIcon }[] = [
    { id: "dashboard", Icon: Dashbord },  // ✅ Now correctly typed
    { id: "competence", Icon: CompetenceSVG },
    { id: "fileText1", Icon: CvSvG },
    { id: "bookmark", Icon: Staff_recruiting },
    
    { id: "contact", Icon: GroupContacr },
    { id: "user", Icon: Contactetoile },
    { id: "target", Icon: TargetSVG },
    { id: "settings", Icon: Settings },
  ];
  
  const handleIconClick = (id: IconId) => {
    setActiveIcon(id);
    setHorizontal(false); // Switch back to vertical mode
    onIconClick(id);
  };

  return (
    <div
      className={`absolute rounded-2xl transition-all duration-500 mt-14 
        ${horizontal 
          ? " h-16 grid  place-items-center mt-[]"  // Moves up when horizontal
          : "w-[60px] h-[600px] left-[23px] flex flex-col items-center"
        }`}
        style={{ background: "#A89B7B" }}
    >
      {/* Sidebar Icons */}
      <div className={`grid ${horizontal ? "grid-cols-8 gap-x-40 justify-center items-center" : "flex flex-col items-center"}`}>

        {icons.map(({ id, Icon }) => (
          <div
            key={id}
            className={`relative cursor-pointer flex items-center transition-all duration-500 ${
              horizontal ? "p-2" : "mt-12"
            }`}
            onClick={() => handleIconClick(id)}
          >
            {/* Selection Indicator (Only for Vertical Mode) */}
            {!horizontal && activeIcon === id && (
              <div
                className="absolute bg-white rounded-full"
                style={{
                  width: "6rem",
                  height: "2.5rem",
                  border: "3px solid rgba(172, 133, 8, 0.47)",
                  boxShadow: "1px 2px 8px rgb(102, 80, 8)",
                }}
              />
            )}

            <div
              className="relative z-10 transition-transform duration-500"
              style={{
                transform: horizontal
                  ? "translateY(0px)" // Ensures icons stay centered
                  : activeIcon === id
                  ? "translateX(50px)" // Slide animation when selected in vertical mode
                  : "translateX(0px)",
              }}
            >
              <Icon
className={`w-6 h-6 transition-all duration-500 ${
  activeIcon === id ? "text-PartnerColer" : "text-white hover:text-gray-200"
}`}
/>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarKPartner;
