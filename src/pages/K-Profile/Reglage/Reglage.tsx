import { useState } from "react";
import ChangePasswordForm from "./ChangePasswordForm";
import NotificationsSettings from "./NotificationsSettings";
import Confidentialite from "./Confidentialite";
import ContactSupportForm from "./ContactSupportForm";
import { MdBookmark } from "react-icons/md";
import { ChevronRight, Settings } from "lucide-react";

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

  return (
    <div> <div className="flex items-center space-x-2 mb-5 ">
    <Settings className="text-teal-800" size={35} />
    <h1 className="text-2xl font-semibold " style={{ fontWeight: "bold" }}>Réglage</h1>
  </div>
    <div className="flex h-screen  ">
       
      {/* MENU LATERAL - Hauteur ajustée */}
      <aside
  className="w-72 bg-white shadow-lg rounded-lg p-4 h-fit"
  style={{ boxShadow: "0 0 4px 1px rgba(0, 128, 0, 0.2)" }}
>
  <ul className="space-y-2">
    {menuItems.map((item) => (
      <li
        key={item.id}
        className={`flex justify-between items-center gap-3 p-3 rounded-lg text-lg font-semibold cursor-pointer
        transition-all duration-200 
        ${selectedMenu === item.id ? "text-teal-600" : "hover:bg-gray-200 text-gray-700"}`}
        onClick={() => setSelectedMenu(item.id)}
      >
        <span>{item.label}</span>
        <ChevronRight
          className={`w-6 h-6 transition-all duration-200 ${
            selectedMenu === item.id ? "text-green-500" : "text-gray-500"
          }`}
        />
      </li>
    ))}
  </ul>
</aside>

      {/* CONTENU PRINCIPAL - Hauteur pleine page */}
      <main className="flex-1 bg-white shadow-lg rounded-lg p-10 ml-6 "  style={{ boxShadow: "0 0 4px 1px rgba(0, 128, 0, 0.2)" }}>
        {selectedMenu === "change-password" && <ChangePasswordForm />}
        {selectedMenu === "notifications" && <NotificationsSettings />}
        {selectedMenu === "security" && <Confidentialite />}
        {selectedMenu === "support" && <ContactSupportForm />}
        {selectedMenu === "subscriptions" && <p>📜 Gérer votre abonnement</p>}
      </main>
    </div>
    </div>
  );
}






