import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { getAuthHeader } from "../../utils/jwt";

// Définition du type Certificat
interface Cert {
  id: number
  name: string
  description: string
  started_at: string
  ended_at: string
}

const Certificat = ({ data }: { data: Cert[] }) => {
  const [isPermanent, setIsPermanent] = useState(false);
  const [certifications, setCertifications] = useState<Cert[]>(data ?? []);
  const [newCertification, setNewCertification] = useState<Cert>({
    id: 0,
    name: "",
    description: "",
    started_at: "",
    ended_at: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewCertification({ ...newCertification, [e.target.name]: e.target.value });
  };

  const handlePermanentToggle = () => {
    setIsPermanent(!isPermanent);
    setNewCertification((prev) => ({
      ...prev,
      ended_at: !isPermanent ? "" : prev.ended_at,
    }));
  };

  const handleSubmit = async () => {
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/certification`;
      const response = await axios.put(url, newCertification, {
        headers: { "Content-Type": "application/json", "Authorization": getAuthHeader().Authorization },
      });

      if (response.status === 200) {
        const updatedCertification = response.data;
        setCertifications((prevCertifications) => {
          const existingIndex = prevCertifications.findIndex((t) => t.id === updatedCertification.id);
          if (existingIndex !== -1) {
            return prevCertifications.map((t) => (t.id === updatedCertification.id ? updatedCertification : t));
          }
          return [...prevCertifications, updatedCertification];
        });

        setNewCertification({ id: 0, name: "", description: "", started_at: "", ended_at: "" });
      }
    } catch (error) {
      console.error("Error submitting certification:", error);
    }
  };

  const handleUpdate = (certification: Cert) => {
    setNewCertification(certification);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/certification`, { id, name: null, description: null, organization: null, city: null, started_at: null, ended_at: null }, {
        headers: { "Content-Type": "application/json", "Authorization": getAuthHeader().Authorization },
      });

      setCertifications((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting certification:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-md p-4">
        <h3 className="font-medium mb-2">{newCertification.id === 0 ? "Ajouter une certificat" : "Modifier la certificat"}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom du certificat</label>
            <input
              type="text"
              name="nom"
              value={newCertification.name}
              onChange={handleChange}
              placeholder="Nom du certificat"
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Organisme</label>
              <input
                type="text"
                name="organisme"
                // value={currentCertificat.organisme}
                onChange={handleChange}
                placeholder="Nom de l'organisme"
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ville</label>
              <input
                type="text"
                name="ville"
                // value={newCertification.}
                onChange={handleChange}
                placeholder="Ville"
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
          </div> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date d'obtention</label>
              <input
                type="date"
                name="dateObtention"
                value={newCertification.started_at}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date d'expiration</label>
              <input
                type="date"
                name="expiration"
                value={newCertification.ended_at}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="permanent"
              checked={isPermanent}
              onChange={handlePermanentToggle}
              className="text-teal-600"
            />
            <span>Certificat permanent</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={newCertification.description}
              onChange={handleChange}
              placeholder="Description du certificat"
              className="w-full px-3 py-2 border border-gray-200 rounded-md h-24"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="bg-gray-100 text-green px-4 py-2 rounded-md hover:bg-teal-700 w-full"
          >
            {newCertification.id === 0 ? "Enregistrer" : "Mettre à jour"}
          </button>
        </div>
      </div>

      {/* Liste des certificats enregistrés */}
      <div className="space-y-2">
        {certifications.map((certificat, index) => (
          <div key={index} className="flex justify-between items-center border border-gray-200 p-3 rounded-md">
            <div>
              <p className="font-medium">{certificat.name}</p>
              <p className="text-sm text-gray-500">
                {certificat.started_at}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="text-blue-500 hover:text-blue-700" onClick={() => handleUpdate(certificat)}>
                <Pencil size={18} />
              </button>
              <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(certificat.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificat;
