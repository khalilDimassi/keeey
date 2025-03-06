import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Pencil, Trash } from "lucide-react";
import { getAuthHeader } from "../../../utils/jwt";
import axios from "axios";

interface Training {
  id: number
  name: string
  description: string
  organization: string
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

const Formation = ({ data, onDataUpdated }: { data: Training[], onDataUpdated: () => void }) => {
  const [trainings, setTrainings] = useState<Training[]>(data ?? []);
  const [expandedTrainingId, setExpandedTrainingId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTraining, setNewTraining] = useState<Training>({
    id: 0,
    name: "",
    description: "",
    organization: "",
    city: "",
    started_at: "",
    ended_at: "",
    present: false,
  });

  useEffect(() => {
    setTrainings(data ?? []);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setNewTraining(prev => ({
      ...prev,
      [name === 'nom' ? 'name' :
        name === 'etablissement' ? 'organization' :
          name === 'ville' ? 'city' :
            name === 'debut' ? 'started_at' :
              name === 'fin' ? 'ended_at' :
                name === 'present' ? 'present' :
                  name]:
        type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/training`,
        isEditing ? newTraining : { ...newTraining, id: 0 },
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader()
          },
        }
      );
      setNewTraining({
        id: 0,
        name: "",
        description: "",
        organization: "",
        city: "",
        started_at: "",
        ended_at: "",
        present: false
      });
      setIsEditing(false);
      onDataUpdated();
    } catch (error) {
      console.error("Error submitting training:", error);
    }
  };

  const handleUpdate = (training: Training) => {
    setNewTraining({
      ...training,
      present: !training.ended_at
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/training`,
        { id },
        { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
      );
      onDataUpdated();
    } catch (error) {
      console.error("Error deleting training:", error);
    }
  };

  const toggleTrainingExpand = (id: number) => {
    setExpandedTrainingId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <div className=" p-4">
        <div className="space-y-4">
          <div >
            <label className="block text-sm font-medium text-gray-700 mb-3">Formation</label>
            <input
              type="text"
              name="nom"
              value={newTraining.name}
              onChange={handleChange}
              placeholder="Nom de la formation"
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Établissement</label>
              <input
                type="text"
                name="etablissement"
                value={newTraining.organization}
                onChange={handleChange}
                placeholder="Établissement"
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Ville</label>
              <input
                type="text"
                name="ville"
                value={newTraining.city}
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
                name="debut"
                value={newTraining.started_at}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
            {!newTraining.present && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Date de fin</label>
                <input
                  type="date"
                  name="fin"
                  value={newTraining.ended_at}
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
              checked={newTraining.present}
              onChange={handleChange}
              className="text-teal-600"
            />
            <span>À ce jour</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Description</label>
            <textarea
              name="description"
              value={newTraining.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full px-3 py-2 border border-gray-200 rounded-md h-24"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
          >
            Enregistrer
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {trainings.map((training) => (
          <div key={training.id} className="border border-gray-200 rounded-md">
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleTrainingExpand(training.id);
              }}
              className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium">{training.name}</span>
              <div className="flex gap-2 items-center">
                {expandedTrainingId === training.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate(training);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(training.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
            {expandedTrainingId === training.id && (
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Établissement</p>
                    <p>{training.organization}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Ville</p>
                    <p>{training.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Période</p>
                    <p>
                      {formatDate(training.started_at)} - {!training.ended_at ? 'Présent' : formatDate(training.ended_at)}
                    </p>
                  </div>
                </div>
                {training.description && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 font-semibold">Description</p>
                    <p className="text-gray-800">{training.description}</p>
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

export default Formation;
