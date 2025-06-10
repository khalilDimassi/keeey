import { useState } from "react";
import axios from "axios";

interface FormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState<FormData>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    message: "",
    type: 'success'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setNotification({ show: false, message: "", type: 'success' });

    if (formData.new_password !== formData.confirm_password) {
      setNotification({
        show: true,
        message: "Les mots de passe ne correspondent pas",
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/users/password`,
        {
          current_password: formData.current_password,
          new_password: formData.new_password,
        }
      );

      if (response.status === 200) {
        setNotification({
          show: true,
          message: "Votre mot de passe a été modifié avec succès",
          type: 'success'
        });
        setFormData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setNotification({
          show: true,
          message: error.response?.data?.message || "Une erreur est survenue",
          type: 'error'
        });
      } else {
        setNotification({
          show: true,
          message: "Une erreur est survenue",
          type: 'error'
        });
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
      {notification.show && (
        <div className={`p-4 rounded-md mb-4 ${notification.type === 'success'
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mot de passe actuel
          </label>
          <input
            type="password"
            name="current_password"
            value={formData.current_password}
            onChange={handleChange}
            className="mt-3 block w-full px-3 py-2 text-lg bg-gray-100 border-2 rounded-2xl focus:border-green-600 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nouveau mot de passe
          </label>

          <input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            className="mt-3 block w-full px-4 py-2 text-lg bg-gray-100 border-2 rounded-2xl focus:border-green-100 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            className="mt-3 block w-full px-4 py-2 text-lg bg-gray-100 border-2  rounded-2xl focus:border-green-600 focus:ring-green-500"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-lg font-medium text-white bg-[#297280] hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
      >
        {isLoading ? "Chargement..." : "Modifier le mot de passe"}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
