import { useState } from "react";
import { LayoutGrid, Building2, Search, UserCheck, Contact, LucideIcon, Target, Settings } from "lucide-react";

export type ActiveComponent =
  | "dashboardPage"
  | "companyPage"
  | "searchPage"
  | "profilePage"
  | "missionsPage"
  | "contactsPage"
  | "settingsPage"
  | null;

interface IconItem {
  id: ActiveComponent;
  Icon: LucideIcon;
}

interface SidebarProps {
  onIconClick: (id: ActiveComponent) => void;
  defaultSelected: ActiveComponent;
}

const SidebarKPlayer = ({ onIconClick, defaultSelected }: SidebarProps) => {
  const [activeIcon, setActiveIcon] = useState<ActiveComponent>(defaultSelected);

  const icons: IconItem[] = [
    { id: "dashboardPage", Icon: LayoutGrid },
    { id: "companyPage", Icon: Building2 },
    { id: "searchPage", Icon: Search },
    { id: "profilePage", Icon: UserCheck },
    { id: "missionsPage", Icon: Target },
    { id: "contactsPage", Icon: Contact },
    { id: "settingsPage", Icon: Settings },

  ];

  const handleIconClick = (id: ActiveComponent) => {
    setActiveIcon(id);
    onIconClick(id);
  };

  return (
    <div
      style={{ marginTop: "50px", background: "#215A96" }}
      className="absolute w-[60px] h-[688px] left-[23px] rounded-2xl flex flex-col items-center"
    >
      <div className="w-[35.5px] h-[610.59px] flex flex-col items-center">
        {icons.map(({ id, Icon }) => (
          <div
            key={id}
            className="relative mt-16 cursor-pointer flex items-center"
            onClick={() => handleIconClick(id)}
          >
            {activeIcon === id && (
              <div
                className="absolute left-0 bg-white rounded-full"
                style={{
                  width: "6rem",
                  height: "2.5rem",
                  border: "3px solid rgba(52, 55, 149, 0.47)",
                  boxShadow: "3px 3px 7px rgb(40, 41, 112)",
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
                className={`w-7 h-7 transition-all duration-300 ${activeIcon === id ? "text-blue-700" : "text-white hover:text-gray-200"
                  }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SidebarKPlayer;
