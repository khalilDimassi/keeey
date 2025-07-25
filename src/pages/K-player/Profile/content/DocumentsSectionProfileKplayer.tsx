import React, { useState } from "react";

import { PlusCircle } from "lucide-react";
import { FaPlus, FaTimes, FaUpload } from "react-icons/fa";
import { Role } from "../types";

const documents = [
  { id: 1, name: "K-BIS" },
  { id: 2, name: "RIB" },

];

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  titre: string;
  description: string;
  file: File | null;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    titre: '',
    description: '',
    file: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        file: e.target.files![0]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here 
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Ajouter un Document</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre
            </label>
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleInputChange}
              placeholder="Titre"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div className="mt-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
              onClick={() => document.getElementById('fileInput')?.click()}>
              <div className="flex flex-col items-center">
                <FaUpload className="text-gray-400 text-3xl mb-2" />
                <p className="text-sm text-gray-500">télécharger des fichiers</p>
              </div>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            >
              <FaPlus size={16} />
              <span>Ajouter</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DocumentsSectionProfileKplayer = ({ role }: { role: Role }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="p-4 bg-white  rounded-lg " >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Documents</h2>
        {role === "ADMIN" && (
          <button className="text-blue-800 hover:text-blue-700" onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={40} />
          </button>
        )}
      </div>
      <DocumentUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div className="flex space-x-4">
        {documents.map((doc) => (
          <div key={doc.id} className="flex flex-col items-center justify-center shadow-sm border rounded-lg p-4" style={{ width: "8rem", height: "8rem" }}>
            <div className="w-full h-full bg-gray-300 rounded-md"></div>
            <p className="text-sm mt-2">{doc.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


export default DocumentsSectionProfileKplayer;