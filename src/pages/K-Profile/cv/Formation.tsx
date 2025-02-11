import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { getAuthHeader } from "../../utils/jwt";
import axios from "axios";


interface Training {
  training_id: number
  name: string
  description: string
  organization: string
  city: string
  started_at: string
  ended_at: string
  present: boolean
}

const Formation = ({ data }: { data: Training[] }) => {
  const [trainings, setTrainings] = useState<Training[]>(data ?? []);
  const [newTraining, setNewTraining] = useState<Training>({
    training_id: 0,
    name: "",
    description: "",
    organization: "",
    city: "",
    started_at: "",
    ended_at: "",
    present: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTraining({ ...newTraining, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/training`;
      const response = await axios.put(url, newTraining, {
        headers: { "Content-Type": "application/json", "Authorization": getAuthHeader().Authorization },
      });

      if (response.status === 200) {
        const updatedTraining = response.data;
        setTrainings((prevTrainings) => {
          const existingIndex = prevTrainings.findIndex((t) => t.training_id === updatedTraining.training_id);
          if (existingIndex !== -1) {
            return prevTrainings.map((t) => (t.training_id === updatedTraining.training_id ? updatedTraining : t));
          }
          return [...prevTrainings, updatedTraining];
        });

        setNewTraining({ training_id: 0, name: "", description: "", organization: "", city: "", started_at: "", ended_at: "", present: false });
      }
    } catch (error) {
      console.error("Error submitting training:", error);
    }
  };

  const handleUpdate = (training: Training) => {
    setNewTraining(training);
  };

  const handleDelete = async (training_id: number) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/training`, { training_id, name: null, description: null, organization: null, city: null, started_at: null, ended_at: null }, {
        headers: { "Content-Type": "application/json", "Authorization": getAuthHeader().Authorization },
      });

      setTrainings((prev) => prev.filter((t) => t.training_id !== training_id));
    } catch (error) {
      console.error("Error deleting training:", error);
    }
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
          <div key={training.training_id} className="flex justify-between items-center border border-gray-200 p-3 rounded-md">
            <span>{training.name}</span>
            <div className="flex gap-2">
              <button className="text-gray-500 hover:text-gray-700" onClick={() => handleUpdate(training)}><Pencil size={18} /></button>
              <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(training.training_id)}><Trash size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Formation;
