import axios from "axios";
import { useState } from "react";
import { getAuthHeader } from "../../utils/jwt";
import { Pencil, Trash } from "lucide-react";


interface Project {
  project_id: number
  name: string
  description: string
}

const Realisation = ({ data }: { data: Project[] }) => {
  const [projects, setProjects] = useState<Project[]>(data ?? []);
  const [newProject, setNewProject] = useState<Project>({
    project_id: 0,
    name: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/project`;
      const response = await axios.put(url, newProject, {
        headers: { "Content-Type": "application/json", "Authorization": getAuthHeader().Authorization },
      });

      if (response.status === 200) {
        const updatedProject = response.data;
        setProjects((prevProjects) => {
          const existingIndex = prevProjects.findIndex((t) => t.project_id === updatedProject.project_id);
          if (existingIndex !== -1) {
            return prevProjects.map((t) => (t.project_id === updatedProject.project_id ? updatedProject : t));
          }
          return [...prevProjects, updatedProject];
        });

        setNewProject({ project_id: 0, name: "", description: "" });
      }
    } catch (error) {
      console.error("Error submitting project:", error);
    }
  };

  const handleUpdate = (project: Project) => {
    setNewProject(project);
  };

  const handleDelete = async (project_id: number) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/project`, { project_id, name: null, description: null, organization: null, city: null, started_at: null, ended_at: null }, {
        headers: { "Content-Type": "application/json", "Authorization": getAuthHeader().Authorization },
      });

      setProjects((prev) => prev.filter((t) => t.project_id !== project_id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="space-y-4">
      <label htmlFor="realisation" className="block text-sm font-medium text-gray-700">
        Realisation
      </label>
      <input type="text" name="name" value={newProject.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-md" placeholder="Nom de la realisation" />
      <textarea
        id="realisation"
        value={newProject.description}
        onChange={handleChange}
        rows={4}
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder="Describe your realisation here..."
      ></textarea>
      <button onClick={handleSubmit} className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">{newProject.project_id === 0 ? "Enregistrer" : "Mettre à jour"}</button>
      <div className="mt-4">
        {projects.map((project) => (
          <div key={project.project_id} className="flex justify-between items-center border border-gray-200 p-3 rounded-md">
            <span>{project.name}</span>
            <div className="flex gap-2">
              <button className="text-gray-500 hover:text-gray-700" onClick={() => handleUpdate(project)}><Pencil size={18} /></button>
              <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(project.project_id)}><Trash size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}
export default Realisation;