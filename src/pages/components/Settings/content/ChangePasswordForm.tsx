import { useEffect, useState } from "react";
import { changePassword } from "../services";

const ChangePasswordForm = ({ mainColor, setMessage }: { mainColor: string, setMessage: (message: string) => void }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const resetForm = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await changePassword(formData.currentPassword, formData.newPassword, formData.confirmPassword);
      setSuccess("Mot de passe modifié avec succès");
      resetForm();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to change password");
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
      <header className="mb-10 flex flex-row items-center justify-between">
        <h2 className={`text-3xl font-semibold text-[${mainColor}]`}>
          Changer de mot de passe
        </h2>

        <button onClick={(e) => handleSubmit(e)} disabled={loading} className={`bg-[${mainColor}] text-white px-6 py-2 mr-8 rounded-3xl font-semibold`}>
          {loading ? "Chargement..." : "Modifier le mot de passe"}
        </button>
      </header>

      <main className="grid grid-cols-4 gap-4 pr-8 text-start">
        <label htmlFor="currentPassword" className="my-auto">Mot de passe actuel</label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={formData.currentPassword}
          placeholder="Mot de passe actuel"
          className="col-span-3 border rounded-xl p-2"
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
        />
        <label htmlFor="newPassword" className="my-auto">Nouveau mot de passe</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          placeholder="Nouveau mot de passe"
          className="col-span-3 border rounded-xl p-2"
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
        />
        <label htmlFor="confirmPassword" className="my-auto">Confirmer le mot de passe</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          placeholder="Confirmer le mot de passe"
          className="col-span-3 border rounded-xl p-2"
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />
      </main>
    </>
  );
};

export default ChangePasswordForm;
