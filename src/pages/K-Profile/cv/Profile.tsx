import { useState } from 'react';
import axios from 'axios';
import { Edit, Trash2, Save } from 'lucide-react';
import { getAuthHeader } from '../../../utils/jwt';
import { Button } from "../../../components/ui/button";

const Profil = ({ data, onDataUpdated }: { data: string, onDataUpdated: () => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(data || '');
  const [isLoading, setIsLoading] = useState(false);

  // If data is null or undefined
  if (data === null || data === undefined) {
    return <div className="text-gray-500">Chargement des informations personnelles...</div>;
  }

  // If data exists but is an empty string
  const hasData = data.trim() !== '';

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/personal/v2`;
      await axios.put(url, { description: editedData }, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        }
      });

      setIsEditing(false);
      onDataUpdated();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/personal/v2`;
      await axios.put(url, { description: '' }, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader()
        }
      });

      onDataUpdated();
    } catch (error) {
      console.error("Error deleting profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 relative">
      {!hasData && (
        <p className="text-gray-600 text-sm">
          Pour améliorer votre CV, il est important d'ajouter un résumé ou un objectif professionnel. Cela permet de présenter rapidement vos compétences, vos expériences et vos ambitions à un recruteur. Voici quelques questions pour vous guider :
        </p>
      )}

      {!hasData && (
        <ul className="list-disc list-inside text-gray-600 text-sm">
          <li>Quelles sont vos principales compétences professionnelles ?</li>
          <li>Quel est votre domaine d'expertise ou le type de poste que vous recherchez ?</li>
          <li>Quels sont vos objectifs à court ou long terme dans votre carrière ?</li>
        </ul>
      )}

      {hasData && !isEditing && (
        <div className="relative">
          <div className="absolute top-0 right-0 flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleEdit}
              disabled={isLoading}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{data}</p>
        </div>
      )}

      {(isEditing || !hasData) && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={editedData}
            onChange={(e) => setEditedData(e.target.value)}
            placeholder="Écrivez ici..."
            className="w-full px-3 py-2 border border-gray-200 rounded-md h-24"
            disabled={isLoading}
          />
          <div className="mt-2 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isLoading || editedData.trim() === ''}
            >
              {isLoading ? "Sauvegarde..." : "Sauvegarder"}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profil;