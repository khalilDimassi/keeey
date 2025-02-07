import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  FileText,
  Bookmark,
  Target,
  Users,
  User,
  Settings,
  LucideIcon,
} from "lucide-react";

type IconId = "dashboard" | "fileText1" | "bookmark" | "target" | "users" | "user" | "settings" | null;

interface SidebarProps {
  onIconClick: (id: IconId) => void;
  defaultSelected: IconId;
  horizontal: boolean;
  setHorizontal: (value: boolean) => void; // Function to switch back to vertical
}

const Sidebar = ({ onIconClick, defaultSelected, horizontal, setHorizontal }: SidebarProps) => {
  const [activeIcon, setActiveIcon] = useState<IconId>(horizontal ? null : defaultSelected);

  useEffect(() => {
    if (horizontal) {
      setActiveIcon(null);
    }
  }, [horizontal]);

  const icons: { id: IconId; Icon: LucideIcon }[] = [
    { id: "dashboard", Icon: LayoutGrid },
    { id: "fileText1", Icon: FileText },
    { id: "bookmark", Icon: Bookmark },
    { id: "target", Icon: Target },
    { id: "users", Icon: Users },
    
    { id: "user", Icon: User },
    { id: "settings", Icon: Settings },
  ];

  const handleIconClick = (id: IconId) => {
    setActiveIcon(id);
    setHorizontal(false); // Switch back to vertical mode
    onIconClick(id);
  };

  return (
    <div
      className={`absolute bg-teal-800 rounded-2xl transition-all duration-500 
        ${horizontal 
          ? "w-[98%] h-16 grid place-items-center mt-[]"  // Moves up when horizontal
          : "w-[70px] h-[688px] left-[23px] flex flex-col items-center"
        }`}
    >
      {/* Sidebar Icons */}
      <div className={`grid ${horizontal ? "grid-cols-7 gap-x-60" : "flex flex-col items-center"}`}>
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
                  width: "4.5rem",
                  height: "3.5rem",
                  border: "3px solid rgba(140, 214, 194, 0.47)",
                  boxShadow: "1px 2px 8px #a5d8ca",
                }}
              />
            )}

            <div
              className="relative z-10 transition-transform duration-500"
              style={{
                transform: horizontal
                  ? "translateY(0px)" // Ensures icons stay centered
                  : activeIcon === id
                  ? "translateX(30px)" // Slide animation when selected in vertical mode
                  : "translateX(0px)",
              }}
            >
              <Icon
                className={`w-8 h-8 transition-all duration-500 ${
                  activeIcon === id ? "text-teal-700" : "text-white hover:text-gray-200"
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
