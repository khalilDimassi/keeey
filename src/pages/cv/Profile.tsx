import { useState } from "react";


interface Profile {
  description: string
}

const Profil = ({ data }: { data: Profile }) => {
  if (!data) {
    return <div className="text-gray-500">Chargement des informations personnelles...</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <p className="text-gray-600 text-sm">
        Pour améliorer votre CV, il est important d'ajouter un résumé ou un objectif professionnel. Cela permet de présenter rapidement vos compétences, vos expériences et vos ambitions à un recruteur. Voici quelques questions pour vous guider :
      </p>
      <ul className="list-disc list-inside text-gray-600 text-sm">
        <li>Quelles sont vos principales compétences professionnelles ?</li>
        <li>Quel est votre domaine d'expertise ou le type de poste que vous recherchez ?</li>
        <li>Quels sont vos objectifs à court ou long terme dans votre carrière ?</li>
      </ul>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={data.description}
          placeholder="Écrivez ici..."
          className="w-full px-3 py-2 border border-gray-200 rounded-md h-24"
        />
      </div>
    </div>
  );
};
export default Profil;
