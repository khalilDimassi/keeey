import axios from "axios";
import { Pencil, Trash, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuthHeader } from "../../../../../utils/jwt";

interface Project {
  id: number
  name: string
  description: string
}

const Realisation = ({ data, onDataUpdated }: { data: Project[], onDataUpdated: () => void }) => {
  const [projects, setProjects] = useState<Project[]>(data ?? []);
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);
  const [newProject, setNewProject] = useState<Project>({
    id: 0,
    name: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setProjects(data ?? []);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/project`,
        isEditing ? newProject : { ...newProject, id: 0 },
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader()
          },
        }
      );

      setNewProject({
        id: 0,
        name: "",
        description: "",
      });
      setIsEditing(false);
      onDataUpdated();
    } catch (error) {
      console.error("Error submitting project:", error);
    }
  };

  const handleUpdate = (project: Project) => {
    setNewProject(project);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/project`,
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
      console.error("Error deleting project:", error);
    }
  };

  const toggleProjectExpand = (id: number) => {
    setExpandedProjectId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Nom du projet</label>
            <input
              type="text"
              name="name"
              value={newProject.name}
              onChange={handleChange}
              placeholder="Nom du projet"
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Description</label>
            <textarea
              name="description"
              value={newProject.description}
              onChange={handleChange}
              placeholder="Description du projet"
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
        {projects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-md">
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleProjectExpand(project.id);
              }}
              className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium">{project.name}</span>
              <div className="flex gap-2 items-center">
                {expandedProjectId === project.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate(project);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(project.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
            {expandedProjectId === project.id && (
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                {project.description && (
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Description</p>
                    <p className="text-gray-800">{project.description}</p>
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

export default Realisation;