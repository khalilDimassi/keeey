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
    <div>
      <h2 className="text-2xl font-semibold text-teal-800 mb-6">
        Alertes / notifications
      </h2>

      {/* TYPES D'ALERTES */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-2">Types d'alertes</h3>
        <div className="space-y-3">
          {Object.entries(alerts).map(([key, value]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <div
                className={`relative w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all ${
                  value ? "bg-gradient-to-b from-[#30797F] to-[#039DAA]" : "bg-gray-300"
                }`}
                onClick={() => toggleAlert(key as keyof typeof alerts)}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    value ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
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
              <div
                className={`relative w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all ${
                  value ? "bg-gradient-to-b from-[#30797F] to-[#039DAA]" : "bg-gray-300"
                }`}
                onClick={() => toggleNotificationType(key as keyof typeof notificationTypes)}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    value ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
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
        <button className="bg-gradient-to-b from-[#30797F] to-[#039DAA] text-white px-6 py-3 rounded-3xl font-semibold hover:bg-gradient-to-b from-[#30797F] to-[#039DAA] transition-all">
          Terminer
        </button>
      </div>
    </div>
  );
}

export default NotificationsSettings;
