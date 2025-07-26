import { useEffect, useState } from "react";
import { alertesSettings, NotificationIds, NotificationSetting } from "../types";
import { updateAlertesSettings } from "../services";



function NotificationsSettings({ alSettings, onRefresh, setMessage }: { alSettings: alertesSettings, onRefresh: () => void, setMessage: (message: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<alertesSettings>(alSettings);

  const handleToggle = (setting: NotificationSetting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const Toggle = ({ checked, onChange, id }: { checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, id: NotificationIds }) => {
    return (
      <div className="relative inline-block w-11 h-5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer appearance-none w-11 h-5 bg-slate-100 rounded-full checked:bg-[#30797F] cursor-pointer transition-colors duration-300 ease-in-out"
        />
        <label
          htmlFor={id}
          className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-all duration-300 ease-in-out peer-checked:translate-x-6 peer-checked:border-[#30797F] peer-checked:scale-110 cursor-pointer"
        />
      </div>
    );
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (notificationSettings !== alSettings) {
        await updateAlertesSettings(notificationSettings);
        setSuccess("Mot de passe modifié avec succès");
        onRefresh();
      } else {
        setSuccess("Aucune modification");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to change notifications settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      setMessage(error);
    } else if (success) {
      setMessage(success);
    }
  }, [error, success]);

  return (
    <>
      <div className={`relative bg-yellow-400 top-0 left-0 right-0 h-8 my-5 z-10`}>
        <div className="absolute inset-0 bg-black bg-opacity-10 flex justify-center items-center">
          <div className="inline-flex items-center bg-black bg-opacity-20 text-black font-bold text-xs px-2 py-1 rounded mx-4">
            🚧 EN COURS DE CONSTRUCTION 🚧
          </div>
        </div>
      </div>

      <header className="mb-10 flex flex-row items-center justify-between">
        <h2 className="text-3xl font-semibold text-[#30797F]">
          Alertes / notifications
        </h2>

        <button onClick={(e) => handleSubmit(e)} disabled={loading} className="bg-[#30797F] text-white px-6 py-2 mr-8 rounded-3xl font-semibold hover:bg-[#30797F] transition-all">
          {loading ? "Chargement..." : "Terminer"}
        </button>
      </header>

      <main className="flex flex-row gap-8">
        <div className="flex flex-col gap-3">
          <label className="text-md font-medium">Types d'alertes</label>
          <div className="flex flex-row gap-4">
            <Toggle checked={notificationSettings.newMatchingOffer} onChange={() => handleToggle('newMatchingOffer')} id="new-offer-toggle" />
            <label>Nouvelle offre correspondante</label>
          </div>
          <div className="flex flex-row gap-4">
            <Toggle checked={notificationSettings.newContactOffer} onChange={() => handleToggle('newContactOffer')} id="contact-offer-toggle" />
            <label>Nouvelle offre d'un contact</label>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-md font-medium">Types de notifications</label>
          <div className="flex flex-row gap-4">
            <Toggle checked={notificationSettings.email} onChange={() => handleToggle('email')} id="email-toggle" />
            <label>E-mail</label>
          </div>
          <div className="flex flex-row gap-4">
            <Toggle checked={notificationSettings.sms} onChange={() => handleToggle('sms')} id="sms-toggle" />
            <label>SMS</label>
          </div>
          <div className="flex flex-row gap-4">
            <Toggle checked={notificationSettings.push} onChange={() => handleToggle('push')} id="push-toggle" />
            <label>Notification Push</label>
          </div>
        </div>
      </main>
    </>
  );
}

export default NotificationsSettings;
