import { useState } from "react";

// FORMULAIRE DE MODIFICATION DU MOT DE PASSE
function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
    console.log("Mot de passe changé !");
  };

  return (
    <div>
      
      <div className="flex justify-between items-center w-full">
  <h2 className="text-2xl font-semibold text-teal-800 mb-6">
    Modifier le mot de passe
  </h2>
  <button
    type="submit"
    className="bg-teal-800 text-white px-6 py-3 rounded-3xl font-semibold hover:bg-teal-700 transition-all"
  >
    Términer
  </button>
</div>

      <form onSubmit={handleSubmit} className="space-y-5 w-1/3">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Mot de passe actuel
          </label>
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-800"
            placeholder="Entrez votre mot de passe actuel"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-800"
            placeholder="Entrez un nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-800"
            placeholder="Confirmez votre nouveau mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      
      </form>
    </div>
  );
}
export default ChangePasswordForm;