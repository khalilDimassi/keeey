import React from "react";
import { Pencil, Plus } from "lucide-react";
import DocumentsSectionProfileKplayer from "./DocumentsSectionProfileKplayer";

const ProfilePage: React.FC = () => {
  return (
    <div className="p-6  flex flex-col md:flex-row gap-6 bg-gray-100">
      <div className="flex flex-col gap-6 w-full md:w-1/3">
        {/* Mon Profil */}
        <div className=" shadow bg-white rounded-lg p-4">
          <div className="flex items-center mb-2">
            <h2 className="text-lg font-semibold">Mon profil</h2>
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-md">Administrateur</span>
            <Pencil className="cursor-pointer ml-60" size={16} />
          </div>
          <div className="relative flex items-center gap-4">
            <img 
              src="/path-to-profile-picture.jpg" 
              alt="Profile" 
              className="w-16 h-16 rounded-full border border-gray-300" 
            />
            <div className="absolute left-20 top-1/2 transform -translate-y-1/2">
              <p className="font-semibold">Nom : exemple</p>
              <p className="font-semibold">Prénom : exemple</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p><strong>Email professionnel :</strong> exemple</p>
            <p><strong>Numéro de téléphone :</strong> exemple</p>
            <p><strong>Fonction :</strong> exemple</p>
          </div>
        </div>
        
        {/* Entreprise */}
        <div className="bg-white shadow rounded-lg p-4">
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
            <div className="absolute left-20 top-1/2 transform -translate-y-1/2">
              <p className="font-semibold">Nom : exemple</p>
              <p className="font-semibold">Secteur : exemple</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p><strong>Adresse :</strong> exemple</p>
            <p><strong>Effectif :</strong> exemple</p>
            <p><strong>SIREN/SIRET :</strong> exemple</p>
          </div>
          <div className="mt-4">
            <DocumentsSectionProfileKplayer />
          </div>
        </div>
      </div>
      
      {/* Utilisateurs */}
      <div className="bg-white shadow rounded-lg p-4 flex-1">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Utilisateurs</h2>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded">
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
              <td className="p-2">exemple</td>
              <td className="p-2">exemple</td>
              <td className="p-2">exemple</td>
              <td className="p-2">exemple</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfilePage;
