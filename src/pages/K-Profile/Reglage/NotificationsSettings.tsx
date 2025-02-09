import { useState } from "react";

function NotificationsSettings() {
  const [alerts, setAlerts] = useState({
    offerMatch: true,
    contactOffer: false,
  });

  const [notificationTypes, setNotificationTypes] = useState({
    email: true,
    sms: false,
    push: false,
  });

  const toggleAlert = (key: keyof typeof alerts) => {
    setAlerts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleNotificationType = (key: keyof typeof notificationTypes) => {
    setNotificationTypes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-teal-800 mb-6">
        Alertes / notifications
      </h2>

      {/* TYPES D'ALERTES */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-2">Types d'alertes</h3>
        <div className="space-y-3">
          {Object.entries(alerts).map(([key, value]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={() => toggleAlert(key as keyof typeof alerts)}
                className="hidden"
              />
              <div
                className={`w-5 h-5 border-2 rounded-md transition-all duration-300 flex items-center justify-center
                ${value ? "bg-teal-800 border-teal-800" : "border-gray-400"}`}
              >
                {value && <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>}
              </div>
              <span className="text-gray-700">
                {key === "offerMatch"
                  ? "Nouvelle offre correspondante"
                  : "Nouvelle offre d'un contact"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* TYPES DE NOTIFICATIONS */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-2">Types de notifications</h3>
        <div className="space-y-3">
          {Object.entries(notificationTypes).map(([key, value]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={() => toggleNotificationType(key as keyof typeof notificationTypes)}
                className="hidden"
              />
              <div
                className={`w-5 h-5 border-2 rounded-md transition-all duration-300 flex items-center justify-center
                ${value ? "bg-teal-800 border-teal-800" : "border-gray-400"}`}
              >
                {value && <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>}
              </div>
              <span className="text-gray-700">
                {key === "email" ? "e-mail" : key === "sms" ? "SMS" : "Notification push"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* BOUTON TERMINER */}
      <div className="flex justify-end">
        <button className="bg-teal-800 text-white py-2 px-4 rounded-md font-semibold hover:bg-teal-700 transition-all">
          Terminer
        </button>
      </div>
    </div>
  );
}
export default NotificationsSettings;