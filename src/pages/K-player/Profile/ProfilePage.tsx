import React, { useState } from "react";
import { FileText, Pencil, Plus, UserCheck } from "lucide-react";
import DocumentsSectionProfileKplayer from "./DocumentsSectionProfileKplayer";
import AjouterUtilisateur from "./AjouterUtilisateur";

const ProfilePage: React.FC = () => {
  const [isAjouterOpen, setIsAjouterOpen] = useState(false);

  return (
    <div className=""> 
     <div className="flex ml-5 items-center space-x-3 mt-1 mb-1">
    <UserCheck className="text-blue-800" size={40} />
    <h1 className="text-xl font-semibold ">Profil</h1>
  </div>
    <div className="p-4 flex flex-col md:flex-row gap-6 bg-gray-100">
        
      <div className="flex flex-col gap-6 w-full md:w-1/3">
        {/* Mon Profil */}
        <div className="shadow bg-white rounded-lg p-4"style={{boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)" ,borderRadius:"10px"}}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Mon profil</h2>
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-md">Administrateur</span>
            <Pencil className="cursor-pointer" size={16} />
          </div>
          <div className="relative flex items-center gap-4">
            <img 
              src="/path-to-profile-picture.jpg" 
              alt="Profile" 
              className="w-16 h-16 rounded-full border border-gray-300" 
            />
            <div>
              <p className="font-semibold">Nom : exemple</p>
              <p className="font-semibold">Prénom : exemple</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p><strong>Email professionnel :</strong> exemple@email.com</p>
            <p><strong>Numéro de téléphone :</strong> +33 6 12 34 56 78</p>
            <p><strong>Fonction :</strong> Développeur</p>
          </div>
        </div>

        {/* Entreprise */}
        <div className="bg-white shadow rounded-lg p-4" style={{boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)" ,borderRadius:"10px"}}>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Entreprise</h2>
            <Pencil className="cursor-pointer" size={16} />
          </div>
          <div className="relative flex items-center gap-4">
            <img 
              src="/path-to-company-logo.jpg" 
              alt="Entreprise" 
              className="w-16 h-16 rounded-full border border-gray-300" 
            />
            <div>
              <p className="font-semibold">Nom : TechCorp</p>
 
            </div>
          </div>
          <div className="mt-4 space-y-2">
          <p><strong> Secteur :</strong> Informatique</p>
            <p><strong>Adresse :</strong> 123 Rue de l'Innovation, Paris</p>
            <p><strong>Effectif :</strong> 250 employés</p>
            <p><strong>SIREN/SIRET :</strong> 123 456 789 00012</p>
          </div>
          <div className="mt-3">
            <DocumentsSectionProfileKplayer />
          </div>
        </div>
      </div>

      {/* Utilisateurs */}
      <div className="bg-white shadow rounded-lg p-4 flex-1" style={{boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)" ,borderRadius:"10px"}}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Utilisateurs</h2>
          <button 
            onClick={() => setIsAjouterOpen(true)} 
            className="flex items-center gap-2  text-white px-4 py-2 rounded"
            style={{background: "#215A96" ,borderRadius:"10px"}}
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
      </div>

      {/* Popup Ajouter Utilisateur */}
      <AjouterUtilisateur isOpen={isAjouterOpen} onClose={() => setIsAjouterOpen(false)} />
    </div>
    </div>
  );
  
};

export default ProfilePage;
