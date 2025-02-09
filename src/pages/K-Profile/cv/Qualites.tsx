import axios from "axios";
import { Search, Trash } from "lucide-react";
import { useState } from "react";
import { getAuthHeader } from "../../utils/jwt";


interface Quality {
  quality_id: number
  name: string
}

const Qualites = ({ data }: { data: Quality[] }) => {
  const [qualities, setQualities] = useState<Quality[]>(data ?? []);
  const [newQuality, setNewQuality] = useState<Quality>({
    quality_id: 0,
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewQuality({ ...newQuality, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/certification`;
      const response = await axios.put(url, newQuality, {
        headers: { "Content-Type": "application/json", "Authorization": getAuthHeader().Authorization },
      });

      if (response.status === 200) {
        const updatedQuality = response.data;
        setQualities((prevQualities) => {
          const existingIndex = prevQualities.findIndex((t) => t.quality_id === updatedQuality.quality_id);
          if (existingIndex !== -1) {
            return prevQualities.map((t) => (t.quality_id === updatedQuality.quality_id ? updatedQuality : t));
          }
          return [...prevQualities, updatedQuality];
        });

        setNewQuality({ quality_id: 0, name: "" });
      }
    } catch (error) {
      console.error("Error submitting certification:", error);
    }
  };

  const handleDelete = async (quality_id: number) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/certification`, { quality_id, name: null, description: null, organization: null, city: null, started_at: null, ended_at: null }, {
        headers: { "Content-Type": "application/json", "Authorization": getAuthHeader().Authorization },
      });

      setQualities((prev) => prev.filter((t) => t.quality_id !== quality_id));
    } catch (error) {
      console.error("Error deleting certification:", error);
    }
  };

  return (
    <div className="p-4 grid gap-2">
      {/* Champ de saisie avec icône Search */}
      <label className="block text-sm font-medium text-gray-700">
        Qualité
      </label>
      <div className="relative mb-4 grid gap-2">
        <input
          type="text"
          value={newQuality.name}
          onChange={handleChange}
          placeholder='Ajouter une qualité'
          className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
        />
        <button
          onClick={handleSubmit}
          className="bg-gray-100 text-green px-4 py-2 rounded-md hover:bg-teal-700 w-full"
        >
          Submit
        </button>
      </div>

      {/* Liste des qualités */}
      <div className="space-y-2">
        {qualities.map((qual) => (
          <div
            key={qual.quality_id}
            className="flex justify-between items-center border border-gray-300 px-4 py-2 rounded-md bg-gray-100"
          >
            <span>{qual.name}</span>
            <button
              onClick={() => handleDelete(qual.quality_id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Qualites;