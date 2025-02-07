import { Trash2 } from "lucide-react"; // Import des icônes Lucide
import { useState } from "react";

// Type pour les langues ajoutées
type Langue = {
  nom: string;
  niveau: number;
};

const Languages = () => {
  const [langue, setLangue] = useState<string>(""); // type string pour la langue
  const [niveau, setNiveau] = useState<number>(50); // type number pour le niveau
  const [langues, setLangues] = useState<Langue[]>([]); // type Langue[] pour la liste des langues

  // Fonction pour afficher le texte en fonction du niveau
  const niveauTexte = () => {
    if (niveau <= 20) return "Débutant";
    if (niveau <= 40) return "Intermédiaire";
    if (niveau <= 60) return "Avancé";
    if (niveau <= 80) return "Très avancé";
    return "Bilingue";
  };

  const ajouterLangue = () => {
    if (langue) {
      setLangues([...langues, { nom: langue, niveau }]);
      setLangue(""); // Réinitialiser le champ de langue
      setNiveau(50); // Réinitialiser le niveau
    }
  };

  const supprimerLangue = (index: number) => {
    setLangues(langues.filter((_, i) => i !== index)); // Supprimer la langue par son index
  };

  return (
    <div className="p-4 space-y-4 w-full mx-auto">
      {/* Champ de saisie pour la langue */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Langue</label>
        <input
          type="text"
          value={langue}
          onChange={(e) => setLangue(e.target.value)}
          placeholder="Entrez une langue"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Niveau</label>
        <input
          type="range"
          min="0"
          max="100"
          value={niveau}
          onChange={(e) => setNiveau(Number(e.target.value))}
          className="w-full appearance-none h-2 bg-teal-600 rounded-lg cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:bg-gray-800 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:bg-gray-800"
        />
        <p className="text-sm text-gray-700 font-semibold">{niveauTexte()}</p>
      </div>

      {/* Bouton d'ajout */}
      <button
        onClick={ajouterLangue}
        className="w-full bg-gray-300 text-teal-600 py-2 rounded-l border border-gray-100 hover:bg-gray-100"
      >
        Ajouter
      </button>

      {/* Liste des langues ajoutées */}
      <div className="space-y-2">
        {langues.map((item, index) => (
          <div key={index} className="flex justify-between items-center border p-2 rounded-md bg-gray-50">
            <span className="text-gray-700">{item.nom} - {niveauTexte()}</span>
            <div className="flex space-x-2">
              <button onClick={() => supprimerLangue(index)} className="text-red-500 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Languages;
