import { useState } from "react";
import ChangePasswordForm from "./ChangePasswordForm";
import NotificationsSettings from "./NotificationsSettings";
import Confidentialite from "./Confidentialite";
import ContactSupportForm from "./ContactSupportForm";
import { MdBookmark } from "react-icons/md";
import { Settings } from "lucide-react";

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
    <div> <div className="flex items-center space-x-2 mt-10 ml-10">
    <Settings className="text-teal-800" size={30} />
    <h1 className="text-xl font-semibold ">Reglage</h1>
  </div>
    <div className="flex h-screen p-6 ">
       
      {/* MENU LATERAL - Hauteur ajustée */}
      <aside className="w-72 bg-white shadow-lg rounded-lg p-4 h-fit">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-lg text-gray-700 cursor-pointer 
              transition-all duration-200
              ${selectedMenu === item.id
                ? "bg-teal-800 text-white shadow-md"
                : "hover:bg-gray-200"}`}
              onClick={() => setSelectedMenu(item.id)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>

      {/* CONTENU PRINCIPAL - Hauteur pleine page */}
      <main className="flex-1 bg-white shadow-lg rounded-lg p-6 ml-6 ">
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






