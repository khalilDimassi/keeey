import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import { getAuthHeader } from "../../utils/jwt";


interface Skill {
  skill_id: number
  sector: string
  job: string
  seniority: number
}


const Competences = ({ data }: { data: Skill[] }) => {
  const [skills, setSkills] = useState<Skill[]>(data ?? []);

  const handleDelete = async (skill_id: number) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/skill`, { skill_id, name: null, description: null, organization: null, city: null, started_at: null, ended_at: null }, {
        headers: { "Content-Type": "application/json", "Authorization": getAuthHeader().Authorization },
      });

      setSkills((prev) => prev.filter((t) => t.skill_id !== skill_id));
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  return (
    <div className="p-4 grid gap-2">
      {/* Liste des compétences */}
      <div className="space-y-2">
        {skills.map((skill) => (
          <div
            key={skill.skill_id}
            className="flex justify-between items-center border border-gray-300 px-4 py-2 rounded-md bg-gray-100"
          >
            <span>{skill.sector + ": " + skill.job}</span>
            <button
              onClick={() => handleDelete(skill.skill_id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Competences;