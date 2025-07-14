import axios from "axios";
import { Trash2, Loader2, Save, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuthHeader } from "../../../../../utils/jwt";

interface Language {
  id: number;
  name: string;
  level: number;
}

const Languages = ({ data, onDataUpdated }: { data: Language[], onDataUpdated: () => void }) => {
  const [languages, setLanguages] = useState<Language[]>(data ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newLanguage, setNewLanguage] = useState<Language>({
    id: 0,
    name: "",
    level: 50,
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

  const niveauColor = (level: number) => {
    if (level <= 20) return "bg-red-500";
    if (level <= 40) return "bg-orange-500";
    if (level <= 60) return "bg-yellow-500";
    if (level <= 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setNewLanguage({ ...newLanguage, name: e.target.value });
  };

  const handleNiveauChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const level = Number(e.target.value);
    setNewLanguage((prev) => ({ ...prev, level }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!newLanguage.name.trim()) {
        setError("Le nom de la langue est requis");
        return;
      }

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/language`,
        newLanguage,
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader()
          },
        }
      );

      setNewLanguage({ id: 0, name: "", level: 50 });
      onDataUpdated();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        setError(errorMessage);
      } else {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      }
      console.error("Error submitting language:", error);
    } finally {
      setIsLoading(false);
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
            ...getAuthHeader()
          },
        }
      );
      onDataUpdated();
    } catch (error) {
      console.error("Error deleting language:", error);
    }
  };

  return (
    <div className="relative space-y-4">
      <button
        onClick={handleSubmit}
        className={`rounded-xl absolute top-2 right-0 py-1.5 px-2 mr-4 ${error ? "bg-red-700 text-white hover:bg-[#1e5f6b]" : "bg-[#297280] text-white hover:bg-[#1e5f6b]"} `}
      >
        {isLoading ? (
          <span className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sauvegarde...
          </span>
        ) : error ? (
          <span className="relative flex items-center">
            Try again
            <Pencil className="ml-2 h-4 w-4" />
          </span>
        ) : (
          <span className="flex items-center">
            Sauvegarder
            <Save className="ml-2 h-4 w-4" />
          </span>
        )}
      </button>

      <div className="border border-gray-200 rounded-xl hover:shadow-md p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Langue <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newLanguage.name}
              onChange={handleChange}
              placeholder={error && !newLanguage.name ? "Le nom de la langue est requis" : "Entrez une langue"}
              className={`w-full px-3 py-2 border border-gray-200 rounded-xl ${error && !newLanguage.name
                ? "placeholder-red-300 bg-red-50"
                : "placeholder-gray-400 bg-gray-50"
                }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Niveau</label>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="100"
                value={newLanguage.level}
                onChange={handleNiveauChange}
                className="w-full appearance-none h-2 bg-gray-200 rounded-lg cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#297280] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:bg-[#1e5f6b] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#297280] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:hover:bg-[#1e5f6b] [&::-moz-range-thumb]:border-0"
                style={{
                  background: `linear-gradient(to right, #297280 0%, #297280 ${newLanguage.level}%, #e5e7eb ${newLanguage.level}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${niveauColor(newLanguage.level)}`}>
                  {niveauTexte(newLanguage.level)}
                </span>
                <span className="text-sm text-gray-500">{newLanguage.level}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {languages.map((language) => (
          <div
            key={language.id}
            className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-800">{language.name}</h3>
                  <button
                    onClick={() => handleDelete(language.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${niveauColor(language.level)}`}>
                      {niveauTexte(language.level)}
                    </span>
                    <span className="text-sm text-gray-500">{language.level}%</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#297280] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${language.level}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Languages;