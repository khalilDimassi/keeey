import axios from "axios";
import { Pencil, Trash, ChevronDown, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuthHeader } from "../../../../../../utils/jwt";

interface Exp {
  id: number
  title: string
  description: string
  employer: string
  city: string
  started_at: string
  ended_at: string
  present: boolean
}

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  });
};

const Experience = ({ data, onDataUpdated }: { data: Exp[], onDataUpdated: () => void }) => {
  const [experiences, setExperiences] = useState<Exp[]>(data ?? []);
  const [expandedExperienceId, setExpandedExperienceId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newExperience, setNewExperience] = useState<Exp>({
    id: 0,
    title: "",
    description: "",
    employer: "",
    city: "",
    started_at: "",
    ended_at: "",
    present: false,
  });

  useEffect(() => {
    setExperiences(data ?? []);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setError(null);

    const { name, value, type, checked } = e.target as HTMLInputElement;
    setNewExperience(prev => ({
      ...prev,
      [name === 'poste' ? 'title' :
        name === 'employeur' ? 'employer' :
          name === 'ville' ? 'city' :
            name === 'debut' ? 'started_at' :
              name === 'fin' ? 'ended_at' :
                name === 'present' ? 'present' :
                  name]:
        type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!newExperience.title.trim()) {
        setError("Le nom du poste est requis");
        return;
      }

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/experience`,
        isEditing ? newExperience : { ...newExperience, id: 0 },
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader()
          },
        }
      );

      setNewExperience({
        id: 0,
        title: "",
        description: "",
        employer: "",
        city: "",
        started_at: "",
        ended_at: "",
        present: false
      });
      setIsEditing(false);
      onDataUpdated();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Use the backend error message if available, otherwise fall back to the default message
        const errorMessage = error.response?.data?.message || error.message;
        setError(errorMessage);
      } else {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      }
      console.error("Error submitting experience:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (experience: Exp) => {
    setError(null);
    setNewExperience({
      ...experience,
      present: !experience.ended_at
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/experience`,
        { id },
        { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
      );
      onDataUpdated();
    } catch (error) {
      console.error("Error deleting experience:", error);
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
        ) : error ? <span className="relative flex items-center">
          Try again
          <Pencil className="ml-2 h-4 w-4" />
        </span>
          : (
            <span className="flex items-center">
              Sauvegarder
              <Save className="ml-2 h-4 w-4" />
            </span>
          )}
      </button>

      <div className="border border-gray-200 rounded-xl hover:shadow-md p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Nom du poste <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="poste"
              value={newExperience.title}
              onChange={handleChange}
              placeholder={error && !newExperience.title ? "Le nom du poste est requis" : "Nom du poste"}
              className={`w-full px-3 py-2 border border-gray-200 rounded-xl ${error && !newExperience.title ? "placeholder-red-300 bg-red-50" : "placeholder-gray-400 bg-gray-50"}`}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Nom de l'employeur</label>
              <input
                type="text"
                name="employeur"
                value={newExperience.employer}
                onChange={handleChange}
                placeholder="Nom de l'employeur"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Ville</label>
              <input
                type="text"
                name="ville"
                value={newExperience.city}
                onChange={handleChange}
                placeholder="Ville"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Date de début</label>
              <input
                type="date"
                name="debut"
                value={newExperience.started_at}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50"
              />
            </div>
            {!newExperience.present && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Date de fin</label>
                <input
                  type="date"
                  name="fin"
                  value={newExperience.ended_at}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50"
                />
              </div>
            )}
            <div className="flex flex-col justify-start items-center gap-3">
              <label className="block text-sm font-medium text-gray-700 mb-3">À ce jour</label>
              <input
                type="checkbox"
                name="present"
                checked={newExperience.present}
                onChange={handleChange}
                className="text-teal-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Description</label>
            <textarea
              name="description"
              value={newExperience.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 h-24"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {experiences.map((experience) => (
          <div key={experience.id} className="border border-gray-200 rounded-xl">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setExpandedExperienceId(prev => prev === experience.id ? null : experience.id);
              }}
              className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium">{experience.title}</span>
              <div className="flex gap-2 items-center">
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${expandedExperienceId === experience.id ? 'rotate-180' : ''}`} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate(experience);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(experience.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
            <div className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out ${expandedExperienceId === experience.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              {expandedExperienceId === experience.id && (
                <div className="p-4 border-t border-gray-100 shadow-inner shadow-gray-200 bg-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Employeur</p>
                        <p className="text-gray-800 font-medium">{experience.employer || 'Non spécifié'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ville</p>
                        <p className="text-gray-800 font-medium">{experience.city || 'Non spécifié'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Période</p>
                        <p className="text-gray-800 font-medium">
                          {formatDate(experience.started_at)} – {experience.ended_at ? formatDate(experience.ended_at) : 'Présent'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {experience.description && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Description</p>
                      <p className="text-gray-700 leading-relaxed">{experience.description}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;