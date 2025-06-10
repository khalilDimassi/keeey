import { useState } from "react";
import ChangePasswordForm from "./ChangePasswordForm";
import NotificationsSettings from "./NotificationsSettings";
import Confidentialite from "./Confidentialite";
import ContactSupportForm from "./ContactSupportForm";
import { ChevronRight, Settings, Menu, X } from "lucide-react";

// Menu latéral avec icônes et labels corrigés
const menuItems = [
  { id: "change-password", label: "Modifier le mot de passe" },
  { id: "notifications", label: "Alertes/Notifications" },
  { id: "security", label: "Confidentialité et accès" },
  { id: "support", label: "Contact / Support" },
  { id: "subscriptions", label: "Abonnement" },
];

export default function Reglage() {
  const [selectedMenu, setSelectedMenu] = useState("change-password");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuItemClick = (id: string) => {
    setSelectedMenu(id);
    setIsMobileMenuOpen(false);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "change-password":
        return <ChangePasswordForm />;
      case "notifications":
        return <NotificationsSettings />;
      case "security":
        return <Confidentialite />;
      case "support":
        return <ContactSupportForm />;
      case "subscriptions":
        return <p>📜 Gérer votre abonnement</p>;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center space-x-2 mb-5">
        <Settings className="text-teal-800" size={35} />
        <h1 className="text-2xl font-semibold">Réglage</h1>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden ml-auto"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <div
              className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Menu</h2>
                <ul className="space-y-2">
                  {menuItems.map((item) => (
                    <li
                      key={item.id}
                      className={`flex justify-between items-center gap-3 p-3 rounded-lg text-lg font-semibold cursor-pointer
                      transition-all duration-200 
                      ${selectedMenu === item.id
                          ? "bg-[#297280] text-transparent bg-clip-text"
                          : "hover:bg-gray-200 text-gray-700"}`}
                      onClick={() => handleMenuItemClick(item.id)}
                    >
                      <span>{item.label}</span>
                      <ChevronRight
                        className={`w-6 h-6 transition-all duration-200 ${selectedMenu === item.id ? "text-green-500" : "text-gray-500"
                          }`}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <aside
          className="hidden md:block w-72 bg-white shadow-lg rounded-lg p-4 h-fit"
          style={{ boxShadow: "0 0 4px 1px #00800033" }}
        >
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={`flex justify-between items-center gap-3 p-3 rounded-lg text-lg font-semibold cursor-pointer
                transition-all duration-200 
                ${selectedMenu === item.id
                    ? "bg-[#297280] text-transparent bg-clip-text"
                    : "hover:bg-gray-200 text-gray-700"}`}
                onClick={() => handleMenuItemClick(item.id)}
              >
                <span>{item.label}</span>
                <ChevronRight
                  className={`w-6 h-6 transition-all duration-200 ${selectedMenu === item.id ? "text-green-500" : "text-gray-500"
                    }`}
                />
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main
          className="flex-1 bg-white shadow-lg rounded-lg p-4 md:p-10 md:ml-6 mt-4 md:mt-0"
          style={{ boxShadow: "0 0 4px 1px #00800033" }}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
}