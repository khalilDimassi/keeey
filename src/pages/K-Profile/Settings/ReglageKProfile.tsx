import { Ban, Bell, CheckCircle, ChevronRight, CreditCard, Headphones, Key, Settings, Shield, Subscript, } from "lucide-react";
import { useEffect, useState } from "react";
import { MenuItem, alertesSettings, confidalitySettings } from "./types";
import { loadAlertesSettings, loadConfidalitySettings } from "./services";

import ChangePasswordForm from "./content/ChangePasswordForm";
import NotificationsSettings from "./content/NotificationsSettings";
import Confidentialite from "./content/Confidentialite";
import ContactSupportForm from "./content/ContactSupportForm";
import SubscriptionForm from "./content/SubscriptionForm";


const ReglageKProfile = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [alSettings, setAlertesSettings] = useState<alertesSettings>({
    newMatchingOffer: false,
    newContactOffer: false,
    email: false,
    sms: false,
    push: false,
  });
  const [confSettings, setConfSettings] = useState<confidalitySettings>({
    everyone: false,
    platform: false,
    contacts: false,
    company: false,
  })

  const menuItems: MenuItem[] = [
    {
      id: "pwd",
      label: "Modifier le mot de passe",
      icon: <Key className="w-5 h-5" />,
      component: <ChangePasswordForm setMessage={() => { setMessage }} />
    },
    {
      id: "notif",
      label: "Alertes / Notifications",
      icon: <Bell className="w-5 h-5" />,
      component: <NotificationsSettings alSettings={alSettings} onRefresh={() => { onRefresh }} setMessage={() => { setMessage }} />
    },
    {
      id: "security",
      label: "Confidentialité et accès",
      icon: <Shield className="w-5 h-5" />,
      component: <Confidentialite confSettings={confSettings} onRefresh={() => { onRefresh }} setMessage={() => { setMessage }} />
    },
    {
      id: "support",
      label: "Contact / Support",
      icon: <Headphones className="w-5 h-5" />,
      component: <ContactSupportForm setMessage={() => { setMessage }} />
    },
    {
      id: "sub",
      label: "Abonnement",
      icon: <CreditCard className="w-5 h-5" />,
      component: <SubscriptionForm setMessage={() => { setMessage }} />
    },
  ];

  const [selectedMenu, setSelectedMenu] = useState<MenuItem['id']>(menuItems[0].id);
  const selectedComponent = menuItems.find(item => item.id === selectedMenu)?.component;

  const loadData = async () => {
    try {
      const alData = await loadAlertesSettings();
      const confData = await loadConfidalitySettings();
      setAlertesSettings(alData);
      setConfSettings(confData);
    } catch (error) {
      console.error('Error loading settings data:', error);
      setMessage("Une erreur s'est produite lors du chargement des données.");
    }
  };

  useEffect(() => {
    loadData();
  }, [setAlertesSettings]);

  const onRefresh = () => {
    loadData();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage(null);
    }, 10000);

    return () => clearTimeout(timer);
  }, [setMessage]);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="flex items-center justify-between space-x-3 my-4">
        <div className="flex items-center gap-2">
          <Settings className="w-8 h-8 text-[#297280]" />
          <h1 className="text-xl font-semibold text-black">
            Réglage
          </h1>
        </div>
        {message && <div className={`flex items-center text-sm py-2 px-3 rounded-xl 
          ${message?.includes("erreur") ?
            "bg-red-100 text-red-600" :
            "bg-green-100 text-green-600"}`}
        >
          {message?.includes("erreur") ?
            <Ban size={16} color="red" className="mr-2" /> :
            <CheckCircle size={16} color="green" className="mr-2" />}
          {message}
          <span className="ml-4 cursor-pointer font-bold" onClick={() => setMessage(null)}>x</span>
        </div>}
      </div>

      <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Sidebar Navigation */}
        <aside
          className="hidden h-fit md:block w-1/4 bg-white shadow-md rounded-xl p-4"
        >
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li
                key={item.id}
                className={`flex justify-between items-center gap-3 p-3 rounded-xl cursor-pointer
                transition-all duration-200 group
                ${selectedMenu === item.id
                    ? "bg-[#297280]/10 text-[#297280]"
                    : "hover:bg-gray-100 text-gray-700"}`}
                onClick={() => setSelectedMenu(item.id)}
              >
                <div className="flex items-center gap-3">
                  <span className={`${selectedMenu === item.id ? "text-[#297280]" : "text-gray-600"}`}>
                    {item.icon}
                  </span>
                  <span className="hidden lg:inline text-sm font-medium">
                    {item.label}
                  </span>
                  <span className="lg:hidden absolute left-20 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </span>
                </div>
                <ChevronRight
                  className={`w-5 h-5 transition-all duration-200 ${selectedMenu === item.id ? "text-[#297280]" : "text-gray-500"}`}
                />
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main
          className="flex-1 bg-white shadow-md rounded-xl p-6 md:p-8 min-h-[500px]"
        >
          {selectedComponent}
        </main>
      </div>
    </div>
  );
}

export default ReglageKProfile;