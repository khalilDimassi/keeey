import { useState } from 'react';
import axios from 'axios';
import { Edit, Trash2, Save, Loader2 } from 'lucide-react';
import { getAuthHeader } from "../../../../../../utils/jwt";
import { Button } from "../../../../../../components/ui/button";

const Profile = ({ data, onDataUpdated }: { data: string | null, onDataUpdated: () => void }) => {
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
    <div className="space-y-4 px-4">
      {/* Guidance Text (always visible) */}
      <div className="mb-4">
        <p className="text-gray-600 text-sm">
          Pour améliorer votre CV, il est important d'ajouter un résumé ou un objectif professionnel. Cela permet de présenter rapidement vos compétences, vos expériences et vos ambitions à un recruteur. Voici quelques questions pour vous guider :
        </p>
        <ul className="list-disc list-inside text-gray-600 text-sm mt-2">
          <li>Quelles sont vos principales compétences professionnelles ?</li>
          <li>Quel est votre domaine d'expertise ou le type de poste que vous recherchez ?</li>
          <li>Quels sont vos objectifs à court ou long terme dans votre carrière ?</li>
        </ul>
      </div>

      {/* Description Section */}
      <div>
        <div className="flex justify-between items-center mb-3 h-10">
          <label className="block text-m font-medium text-gray-700">Description</label>
          {hasData && !isEditing && (
            <div className="flex space-x-2">
              <Button className='rounded-xl bg-gray-100 hover:bg-[#297280] hover:text-white' size="icon" onClick={handleEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button className='rounded-xl bg-gray-100 hover:bg-red-800 hover:text-white' size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* View Mode (when hasData and not editing) */}
        {hasData && !isEditing && (
          <div className="w-full p-3 bg-gray-50 rounded-2xl h-52 overflow-y-auto whitespace-pre-wrap">
            {data}
          </div>
        )}

        {/* Edit Mode (when editing or no data exists) */}
        {(!hasData || isEditing) && (
          <>
            <textarea
              value={editedData}
              onChange={(e) => setEditedData(e.target.value)}
              placeholder="Écrivez ici..."
              className="w-full px-4 py-2 border border-gray-200 rounded-2xl h-52 mt-1"
              disabled={isLoading}
            />
            <div className="mt-2 flex justify-end gap-6">
              <Button
                className="bg-red-200 text-gray-500 hover:bg-red-800 hover:text-white rounded-xl"
                onClick={() => {
                  setEditedData(data)
                  setIsEditing(false)
                }}
              >
                cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading || editedData.trim() === ''}
                className="bg-[#297280] text-white hover:bg-[#1e5f6b] transition-colors rounded-xl"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Sauvegarder
                    <Save className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;