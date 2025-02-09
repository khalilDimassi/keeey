import axios from "axios";
import { useState } from "react";
import { getAuthHeader } from "../utils/jwt";
import { Trash2 } from "lucide-react";


interface Interest {
  interest_id: number
  name: string
}

const Centre = ({ data }: { data: Interest[] }) => {
  const [interests, setInterests] = useState<Interest[]>(data ?? []);
  const [newInterest, setNewInterest] = useState<Interest>({
    interest_id: 0,
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewInterest({ ...newInterest, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/certification`;
      const response = await axios.put(url, newInterest, {
        headers: { "Content-Type": "application/json", "Authorization": getAuthHeader().Authorization },
      });

      if (response.status === 200) {
        const updatedInterest = response.data;
        setInterests((prevInterests) => {
          const existingIndex = prevInterests.findIndex((t) => t.interest_id === updatedInterest.interest_id);
          if (existingIndex !== -1) {
            return prevInterests.map((t) => (t.interest_id === updatedInterest.interest_id ? updatedInterest : t));
          }
          return [...prevInterests, updatedInterest];
        });

        setNewInterest({ interest_id: 0, name: "" });
      }
    } catch (error) {
      console.error("Error submitting certification:", error);
    }
  };

  const handleDelete = async (interest_id: number) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/certification`, { interest_id, name: null, description: null, organization: null, city: null, started_at: null, ended_at: null }, {
        headers: { "Content-Type": "application/json", "Authorization": getAuthHeader().Authorization },
      });

      setInterests((prev) => prev.filter((t) => t.interest_id !== interest_id));
    } catch (error) {
      console.error("Error deleting certification:", error);
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

      {/* Liste des certificats enregistrés */}
      <div className="space-y-2">
        {interests.map((interest) => (
          <div key={interest.interest_id} className="flex justify-between items-center border border-gray-200 p-3 rounded-md">
            <div>
              <p className="font-medium">{interest.name}</p>
            </div>
            <div className="flex gap-2">
              <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(interest.interest_id)}>
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
