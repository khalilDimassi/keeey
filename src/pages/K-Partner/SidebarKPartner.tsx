import React, { useState } from "react";
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

type IconId =
  | "dashboard"
  | "fileText1"
  | "bookmark"
  | "target"
  | "users"
  | "user"
  | "settings"
  | null;

interface IconItem {
  id: IconId;
  Icon: LucideIcon;
}

interface SidebarProps {
  onIconClick: (id: IconId) => void;
  defaultSelected: IconId;
}

const SidebarKPartner = ({ onIconClick, defaultSelected }: SidebarProps) => {
  const [activeIcon, setActiveIcon] = useState<IconId>(defaultSelected);

  const icons: IconItem[] = [
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
    onIconClick(id);
  };

  return (
    <div
      style={{ marginTop: "50px" ,background:" #A58E56"}}
      className="absolute w-[70px] h-[688px] left-[23px]  rounded-2xl flex flex-col items-center"
    >
      <div className="w-[35.5px] h-[610.59px] flex flex-col items-center">
        {icons.map(({ id, Icon }) => (
          <div
            key={id}
            className="relative mt-12 cursor-pointer flex items-center"
            onClick={() => handleIconClick(id)}
          >
            {activeIcon === id && (
              <div
                className="absolute left-0 bg-white rounded-full"
                style={{
                  width: "6rem",
                  height: "3.5rem",
                  border: "3px solid rgba(52, 55, 149, 0.47)",
                  boxShadow: "3px 3px 7pxrgb(40, 41, 112)",
                }}
              />
            )}
            <div
              className="relative z-10"
              style={{
                transform: `translateX(${activeIcon === id ? "50px" : "0px"})`,
                transition: "transform 0.3s ease-in-out",
              }}
            >
              <Icon
                className={`w-8 h-8 transition-all duration-300 ${
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
export default SidebarKPartner;
