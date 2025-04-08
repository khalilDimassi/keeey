import axios from "axios";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuthHeader } from "../../../../../../utils/jwt";

interface Language {
  id: number;
  name: string;
  level: number;
}


const Languages = ({ data, onDataUpdated }: { data: Language[], onDataUpdated: () => void }) => {
  const [niveau, setNiveau] = useState<number>(50);
  const [languages, setLanguages] = useState<Language[]>(data ?? []);
  const [newLanguage, setNewLanguage] = useState<Language>({
    id: 0,
    name: "",
    level: 40,
  });

  useEffect(() => {
    setLanguages(data ?? []);
  }, [data]);

  const niveauTexte = (level: number) => {
    if (level <= 20) return "Débutant";
    if (level <= 40) return "Intermédiaire";
    if (level <= 60) return "Avancé";
    if (level <= 80) return "Très avancé";
    return "Bilingue";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLanguage({ ...newLanguage, name: e.target.value });
  };

  const handleNiveauChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const level = Number(e.target.value);
    setNiveau(level);
    setNewLanguage((prev) => ({ ...prev, level }));
  };

  const handleSubmit = async () => {
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/language`;
      const response = await axios.put(url, newLanguage, {
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthHeader().Authorization,
        },
      });

      if (response.status === 200) {
        setNewLanguage({ id: 0, name: "", level: 50 });
        setNiveau(50);
      }
      onDataUpdated();
    } catch (error) {
      console.error("Error submitting language:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/language`,
        { id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: getAuthHeader().Authorization,
          },
        }
      );
      onDataUpdated();
    } catch (error) {
      console.error("Error deleting language:", error);
    }
  };

  return (
    <div className="p-4 space-y-4 w-full mx-auto">
      {/* Champ de saisie pour la langue */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Langue</label>
        <input
          type="text"
          value={newLanguage.name}
          onChange={handleChange}
          placeholder="Entrez une langue"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Sélection du niveau */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Niveau</label>
        <input
          type="range"
          min="0"
          max="100"
          value={niveau}
          onChange={handleNiveauChange}
          className="w-full appearance-none h-2 bg-teal-600 rounded-lg cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:bg-gray-800 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:bg-gray-800"
        />
        <p className="text-sm text-gray-700 font-semibold">{niveauTexte(niveau)}</p>
      </div>

      {/* Bouton d'ajout */}
      <button
        onClick={handleSubmit}
        className="w-full bg-gray-300 text-teal-600 py-2 rounded-lg border border-gray-100 hover:bg-gray-100"
      >
        Ajouter
      </button>

      {/* Liste des langues ajoutées */}
      <div className="space-y-2">
        {languages.map((lang) => (
          <div
            key={lang.id}
            className="flex justify-between items-center border p-2 rounded-md bg-gray-50"
          >
            <span className="text-gray-700">
              {lang.name} - {niveauTexte(lang.level)}
            </span>
            <button
              onClick={() => handleDelete(lang.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Languages;
