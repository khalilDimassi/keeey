import axios from "axios";
import { Pencil, Trash, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuthHeader } from "../../utils/jwt";

interface Cert {
  id: number
  name: string
  description: string
  started_at: string
  ended_at: string
  present: boolean
}

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  });
};

const Certificat = ({ data, onDataUpdated }: { data: Cert[], onDataUpdated: () => void }) => {
  const [certifications, setCertifications] = useState<Cert[]>(data ?? []);
  const [expandedCertificationId, setExpandedCertificationId] = useState<number | null>(null);
  const [newCertification, setNewCertification] = useState<Cert>({
    id: 0,
    name: "",
    description: "",
    started_at: "",
    ended_at: "",
    present: false,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setCertifications(data ?? []);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setNewCertification(prev => ({
      ...prev,
      [name === 'nom' ? 'name' :
        name === 'description' ? 'description' :
          name === 'dateObtention' ? 'started_at' :
            name === 'expiration' ? 'ended_at' :
              name === 'permanent' ? 'present' :
                name]:
        type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/certification`,
        isEditing ? newCertification : { ...newCertification, id: 0 },
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader()
          },
        }
      );

      setNewCertification({
        id: 0,
        name: "",
        description: "",
        started_at: "",
        ended_at: "",
        present: false
      });
      setIsEditing(false);
      onDataUpdated();
    } catch (error) {
      console.error("Error submitting certification:", error);
    }
  };

  const handleUpdate = (certification: Cert) => {
    setNewCertification({
      ...certification,
      present: !certification.ended_at
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/certification`,
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
      console.error("Error deleting certification:", error);
    }
  };

  const toggleCertificationExpand = (id: number) => {
    setExpandedCertificationId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Nom du certificat</label>
            <input
              type="text"
              name="nom"
              value={newCertification.name}
              onChange={handleChange}
              placeholder="Nom du certificat"
              className="w-full px-3 py-2 border border-gray-200 rounded-md"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Date d'obtention</label>
              <input
                type="date"
                name="dateObtention"
                value={newCertification.started_at}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
            {!newCertification.present && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Date d'expiration</label>
                <input
                  type="date"
                  name="expiration"
                  value={newCertification.ended_at}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md"
                />
              </div>
            )}
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="permanent"
              checked={newCertification.present}
              onChange={handleChange}
              className="text-teal-600"
            />
            <span>Certificat permanent</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Description</label>
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
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
          >
            {isEditing ? 'Mettre à jour' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {certifications.map((certification) => (
          <div key={certification.id} className="border border-gray-200 rounded-md">
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleCertificationExpand(certification.id);
              }}
              className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium">{certification.name}</span>
              <div className="flex gap-2 items-center">
                {expandedCertificationId === certification.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate(certification);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(certification.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
            {expandedCertificationId === certification.id && (
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Période</p>
                    <p>
                      {formatDate(certification.started_at)} - {!certification.ended_at ? 'Présent' : formatDate(certification.ended_at)}
                    </p>
                  </div>
                </div>
                {certification.description && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 font-semibold">Description</p>
                    <p className="text-gray-800">{certification.description}</p>
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

export default Certificat;