import axios from "axios";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { getAuthHeader } from "../utils/jwt";

interface Exp {
  experience_id: number
  title: string
  description: string
  employer: string
  city: string
  started_at: string
  ended_at: string
}

const Experience = ({ data }: { data: Exp[] }) => {
  const [isPresent, setIsPresent] = useState(false);
  const [experiences, setExperiences] = useState<Exp[]>(data ?? []);
  const [newExperience, setNewExperience] = useState<Exp>({
    experience_id: 0,
    title: "",
    description: "",
    employer: "",
    city: "",
    started_at: "",
    ended_at: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewExperience({ ...newExperience, [e.target.name]: e.target.value });
  };

  const handlePresentToggle = () => {
    setIsPresent(!isPresent);
    setNewExperience((prev) => ({
      ...prev,
      ended_at: !isPresent ? "" : prev.ended_at,
    }));
  };

  const handleSubmit = async () => {
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/experience`;
      const response = await axios.put(url, newExperience, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": getAuthHeader().Authorization,
        },
      });

      if (response.status === 200) {
        const updatedExperience = response.data;
        setExperiences((prevExperiences) => {
          const existingIndex = prevExperiences.findIndex(
            (t) => t.experience_id === updatedExperience.experience_id
          );
          if (existingIndex !== -1) {
            return prevExperiences.map((t) =>
              t.experience_id === updatedExperience.experience_id ? updatedExperience : t
            );
          }
          return [...prevExperiences, updatedExperience];
        });

        setNewExperience({
          experience_id: 0,
          title: "",
          description: "",
          employer: "",
          city: "",
          started_at: "",
          ended_at: "",
        });
        setIsPresent(false);
      }
    } catch (error) {
      console.error("Error submitting experience:", error);
    }
  };

  const handleUpdate = (experience: Exp) => {
    setNewExperience(experience);
    setIsPresent(experience.ended_at === ""); // If ended_at is empty, check the "present" checkbox
  };

  const handleDelete = async (experience_id: number) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/experience`,
        { experience_id, name: null, description: null, organization: null, city: null, started_at: null, ended_at: null },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": getAuthHeader().Authorization,
          },
        }
      );

      setExperiences((prev) => prev.filter((t) => t.experience_id !== experience_id));
    } catch (error) {
      console.error("Error deleting experience:", error);
    }
  };


  return (
    <div className="space-y-4">
      <div className=" p-4">
       
        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="title" className="mb-1 text-gray-600">Nom du poste</label>
            <input
              type="text"
              name="title"
              id="title"
              value={newExperience.title}
              onChange={handleChange}
              placeholder="Nom du poste"
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="employer" className="mb-1 text-gray-600">Nom de l'employeur</label>
            <input
              type="text"
              name="employer"
              id="employer"
              value={newExperience.employer}
              onChange={handleChange}
              placeholder="Nom de l'employeur"
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="city" className="mb-1 text-gray-600">Ville</label>
            <input
              type="text"
              name="city"
              id="city"
              value={newExperience.city}
              onChange={handleChange}
              placeholder="Ville"
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="started_at" className="mb-1 text-gray-600">Date de début</label>
            <input
              type="date"
              name="started_at"
              id="started_at"
              value={newExperience.started_at}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="ended_at" className="mb-1 text-gray-600">Date de fin</label>
            <input
              type="date"
              name="ended_at"
              id="ended_at"
              value={newExperience.ended_at}
              onChange={handleChange}
              disabled={isPresent}
              className="w-full px-3 py-2 border border-gray-200 rounded-md disabled:bg-gray-200 disabled:cursor-not-allowed"
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="present"
              checked={isPresent}
              onChange={handlePresentToggle}
              className="text-teal-600"
            />
            <span>À ce jour</span>
          </label>
          <div className="flex flex-col">
            <label htmlFor="description" className="mb-1 text-gray-600">Description</label>
            <textarea
              name="description"
              id="description"
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
            {newExperience.experience_id === 0 ? "Enregistrer" : "Mettre à jour"}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {experiences.map((experience) => (
          <div key={experience.experience_id} className="flex justify-between items-center border border-gray-200 p-3 rounded-md">
            <span>{experience.title}</span>
            <div className="flex gap-2">
              <button className="text-gray-500 hover:text-gray-700" onClick={() => handleUpdate(experience)}>
                <Pencil size={18} />
              </button>
              <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(experience.experience_id)}>
                <Trash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
