import axios from "axios";
import { Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuthHeader } from "../../utils/jwt";


interface Quality {
  id: number
  name: string
}

const Qualites = ({ data, onDataUpdated }: { data: Quality[], onDataUpdated: () => void }) => {
  const [qualities, setQualities] = useState<Quality[]>(data ?? []);
  const [newQuality, setNewQuality] = useState<Quality>({
    id: 0,
    name: "",
  });

  useEffect(() => {
    setQualities(data ?? []);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target as HTMLInputElement;
    setNewQuality(prev => ({
      ...prev,
      name: value
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/quality`,
        newQuality,
        { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
      );

      setNewQuality({ id: 0, name: "" });
      onDataUpdated();
    } catch (error) {
      console.error("Error submitting quality:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/quality`,
        { id },
        { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
      );

      onDataUpdated();
    } catch (error) {
      console.error("Error deleting quality:", error);
    }
  };

  return (
    <div className="p-4 grid gap-2">
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
            key={qual.id}
            className="flex justify-between items-center border border-gray-300 px-4 py-2 rounded-md bg-gray-100"
          >
            <span>{qual.name}</span>
            <button
              onClick={() => handleDelete(qual.id)}
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