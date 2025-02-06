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
import { motion } from "framer-motion";

type IconId =
  | "dashboard"
  | "fileText1"
  | "bookmark"
  | "target"
  | "users"
  | "user"
  | "settings";

interface IconItem {
  id: IconId;
  Icon: LucideIcon;
}

const Sidebar = () => {
  const [activeIcon, setActiveIcon] = useState<IconId>("dashboard");

  const icons: IconItem[] = [
    { id: "dashboard", Icon: LayoutGrid },
    { id: "fileText1", Icon: FileText },
    { id: "bookmark", Icon: Bookmark },
    { id: "target", Icon: Target },
    { id: "users", Icon: Users },
    { id: "user", Icon: User },
    { id: "settings", Icon: Settings },
  ];

  return (
    <div
      style={{ marginTop: "50px" }}
      className="absolute w-[70px] h-[688px] left-[23px] bg-teal-700 rounded-2xl flex flex-col items-center"
    >
      <div className="w-[35.5px] h-[610.59px] flex flex-col items-center">
        {icons.map(({ id, Icon }) => (
          <div
            key={id}
            className="relative mt-12 cursor-pointer flex items-center"
            onClick={() => setActiveIcon(id)}
          >
            {/* Animated Selection Circle */}
            {activeIcon === id && (
              <motion.div
                layoutId="circle"
                className="absolute left-0 bg-white rounded-full"
                style={{
                  width: "6rem",
                  height: "3.5rem",
                  border: "3px solid rgba(140, 214, 194, 0.47)",
                  boxShadow: "3px 3px 7px #a5d8ca",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              />
            )}

            {/* Animated Icon moving to the right */}
            <motion.div
              className="relative z-10"
              animate={{ x: activeIcon === id ? 45 : 0 }} // Move icon 20px right when selected
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Icon
                className={`w-8 h-8 transition-all duration-300 ${
                  activeIcon === id ? "text-teal-700" : "text-white hover:text-gray-200"
                }`}
              />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
