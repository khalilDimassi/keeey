import axios from "axios";
import { useEffect, useState } from "react";
import { getAuthHeader } from "../../../../../../utils/jwt";
import { Trash2 } from "lucide-react";


interface Interest {
  id: number
  name: string
}

const Centre = ({ data, onDataUpdated }: { data: Interest[], onDataUpdated: () => void }) => {
  const [interests, setInterests] = useState<Interest[]>(data ?? []);
  const [newInterest, setNewInterest] = useState<Interest>({
    id: 0,
    name: "",
  });

  useEffect(() => {
    setInterests(data ?? []);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target as HTMLInputElement;
    setNewInterest(prev => ({
      ...prev,
      name: value
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log(newInterest)
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/interest`,
        newInterest,
        { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
      );

      setNewInterest({ id: 0, name: "" })
      onDataUpdated()
    } catch (error) {
      console.error("Error submitting interest:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/interest`,
        { id },
        { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
      );

      onDataUpdated()
    } catch (error) {
      console.error("Error deleting interest:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Champ de saisie pour le centre d'intérêt */}
      <div className="grid gap-4">
        <label className="block text-sm font-medium text-gray-700">
          Centre d'intérêt
        </label>
        <input
          type="text"
          name="centre"
          value={newInterest.name}
          onChange={handleChange}
          placeholder="Entrez un centre d'intérêt"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleSubmit}
          className="bg-gray-100 text-green px-4 py-2 rounded-md hover:bg-teal-700 w-full"
        >
          Submit
        </button>
      </div>

      {/* Liste des centres d'intérêt enregistrés */}
      <div className="space-y-2">
        {interests.map((interest) => (
          <div key={interest.id} className="flex justify-between items-center border border-gray-200 p-3 rounded-md">
            <div>
              <p className="font-medium">{interest.name}</p>
            </div>
            <div className="flex gap-2">
              <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(interest.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Centre;
