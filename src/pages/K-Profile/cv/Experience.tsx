import axios from "axios";
import { Pencil, Trash, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuthHeader } from "../../utils/jwt";

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
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setExperiences(data ?? []);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setNewExperience(prev => ({
      ...prev,
      [name === 'title' ? 'title' :
        name === 'employer' ? 'employer' :
          name === 'city' ? 'city' :
            name === 'started_at' ? 'started_at' :
              name === 'ended_at' ? 'ended_at' :
                name === 'description' ? 'description' :
                  name === 'present' ? 'present' :
                    name]:
        type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    try {
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
      console.error("Error submitting experience:", error);
    }
  };

  const handleUpdate = (experience: Exp) => {
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
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader()
          }
        }
      );
      onDataUpdated();
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };

  const toggleExperienceExpand = (id: number) => {
    setExpandedExperienceId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Nom du poste</label>
            <input
              type="text"
              name="title"
              value={newExperience.title}
              onChange={handleChange}
              placeholder="Nom du poste"
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Nom de l'employeur</label>
              <input
                type="text"
                name="employer"
                value={newExperience.employer}
                onChange={handleChange}
                placeholder="Nom de l'employeur"
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Ville</label>
              <input
                type="text"
                name="city"
                value={newExperience.city}
                onChange={handleChange}
                placeholder="Ville"
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Date de début</label>
              <input
                type="date"
                name="started_at"
                value={newExperience.started_at}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
            {!newExperience.present && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Date de fin</label>
                <input
                  type="date"
                  name="ended_at"
                  value={newExperience.ended_at}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md"
                />
              </div>
            )}
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="present"
              checked={newExperience.present}
              onChange={handleChange}
              className="text-teal-600"
            />
            <span>À ce jour</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Description</label>
            <textarea
              name="description"
              value={newExperience.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full px-3 py-2 border border-gray-200 rounded-md h-24"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
          >
            {isEditing ? 'Mettre à jour' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {experiences.map((experience) => (
          <div key={experience.id} className="border border-gray-200 rounded-md">
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleExperienceExpand(experience.id);
              }}
              className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium">{experience.title}</span>
              <div className="flex gap-2 items-center">
                {expandedExperienceId === experience.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
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
            {expandedExperienceId === experience.id && (
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Employeur</p>
                    <p>{experience.employer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Ville</p>
                    <p>{experience.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Période</p>
                    <p>
                      {formatDate(experience.started_at)} - {!experience.ended_at ? 'Présent' : formatDate(experience.ended_at)}
                    </p>
                  </div>
                </div>
                {experience.description && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 font-semibold">Description</p>
                    <p className="text-gray-800">{experience.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;