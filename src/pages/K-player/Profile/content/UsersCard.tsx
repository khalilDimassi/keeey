import { Plus } from "lucide-react";
import { useState } from "react";
import AjouterUtilisateur from "./AjouterUtilisateur";

const UsersCard = () => {
  const [isAjouterOpen, setIsAjouterOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Utilisateurs</h2>
        <button
          onClick={() => setIsAjouterOpen(true)}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-xl bg-[#215A96]"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>
      <table className="w-full mt-2 border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Nom et prénom</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Téléphone</th>
            <th className="text-left p-2">Rôle</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-2">Jean Dupont</td>
            <td className="p-2">jean.dupont@example.com</td>
            <td className="p-2">+33 6 98 76 54 32</td>
            <td className="p-2">Manager</td>
          </tr>
        </tbody>
      </table>

      <AjouterUtilisateur isOpen={isAjouterOpen} onClose={() => setIsAjouterOpen(false)} />
    </>
  );
}

export default UsersCard;