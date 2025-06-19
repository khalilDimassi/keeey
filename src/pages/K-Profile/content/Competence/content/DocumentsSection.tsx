import React, { useState } from "react";
import { Plus, PlusCircle, Trash2, Upload, X } from "lucide-react";

interface Document {
  id: number;
  name: string;
}

interface FormData {
  titre: string;
  description: string;
  file: File | null;
}

// Sample data
const SAMPLE_DOCUMENTS: Document[] = [
  { id: 1, name: "K-BIS" },
  { id: 2, name: "RIB" },
  { id: 3, name: "Attestation Urssaf" },
  { id: 4, name: "Contrat de Travail" },
  { id: 5, name: "Facture Électricité" }
];


const DocumentCard: React.FC<{ document: Document; onDelete: (id: number) => void; }> = ({ document, onDelete }) => {
  return (
    <div
      className="relative flex flex-col items-center justify-center shadow-sm border rounded-lg p-4 overflow-hidden"
      style={{ width: "15rem", height: "13rem" }}
    >

      {/* Delete button */}
      <button
        onClick={() => onDelete(document.id)}
        className="absolute top-2 right-2 z-5 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors duration-200"
        aria-label="Supprimer le document"
      >
        <Trash2 size={12} />
      </button>

      <div className="w-full h-full bg-gray-300 rounded-md mt-6"></div>
      <p className="text-sm mt-2 font-medium">{document.name}</p>
    </div>
  );
};

const ShowAllModal: React.FC<{ isOpen: boolean; onClose: () => void; documents: Document[]; onDelete: (id: number) => void; }> = ({ isOpen, onClose, documents, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6 pr-8">Tous les Documents</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} onDelete={onDelete} />
          ))}
        </div>
      </div>
    </div>
  );
};

const FileUploadArea: React.FC<{ onFileChange: (file: File) => void; selectedFile: File | null; }> = ({ onFileChange, selectedFile }) => {
  const handleClick = () => {
    document.getElementById('fileInput')?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Fichier
      </label>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-teal-400 transition-colors"
        onClick={handleClick}
      >
        <div className="flex flex-col items-center">
          <Upload className="text-gray-400 text-3xl mb-2" size={32} />
          <p className="text-sm text-gray-500 mb-1">
            {selectedFile ? selectedFile.name : "Télécharger des fichiers"}
          </p>
          {selectedFile && (
            <p className="text-xs text-gray-400">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          )}
        </div>
        <input
          id="fileInput"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
      </div>
    </div>
  );
};

const FormField: React.FC<{ label: string; name: string; value: string; placeholder: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean; }> = ({ label, name, value, placeholder, onChange, required = false }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition-colors"
      />
    </div>
  );
};

const DocumentUploadModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: FormData) => void; }> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    titre: '',
    description: '',
    file: null
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileChange = (file: File) => {
    setFormData(prev => ({
      ...prev,
      file
    }));

    if (errors.file) {
      setErrors(prev => ({
        ...prev,
        file: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est requis';
    }

    if (!formData.file) {
      newErrors.file = null;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {

    if (validateForm()) {
      onSubmit(formData);
      // Reset form
      setFormData({
        titre: '',
        description: '',
        file: null
      });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      titre: '',
      description: '',
      file: null
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6 pr-8">Ajouter un Document</h2>

        <div className="space-y-4">
          <FormField
            label="Titre"
            name="titre"
            value={formData.titre}
            placeholder="Entrez le titre du document"
            onChange={handleInputChange}
            required
          />
          {errors.titre && (
            <p className="text-red-500 text-sm mt-1">{errors.titre}</p>
          )}

          <FormField
            label="Description"
            name="description"
            value={formData.description}
            placeholder="Description du document (optionnel)"
            onChange={handleInputChange}
          />

          <FileUploadArea
            onFileChange={handleFileChange}
            selectedFile={formData.file}
          />
          {errors.file && (
            <p className="text-red-500 text-sm mt-1">{errors.file?.toString()}</p>
          )}

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-gradient-to-b from-[#297280] to-[#1f5c68] text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:from-[#1f5c68] hover:to-[#297280] transition-all duration-200 shadow-md"
            >
              <Plus size={16} />
              <span>Ajouter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentsSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowAllModalOpen, setIsShowAllModalOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>(SAMPLE_DOCUMENTS);

  const handleAddDocument = (formData: FormData) => {
    // Create new document
    const newDocument: Document = {
      id: Math.max(...documents.map(d => d.id), 0) + 1,
      name: formData.titre
    };

    setDocuments(prev => [...prev, newDocument]);

    // Here you would typically send the data to your backend
    console.log('New document added:', {
      ...formData,
      id: newDocument.id
    });
  };

  const handleDeleteDocument = (id: number) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const displayedDocuments = documents.slice(0, 3);
  const hasMoreDocuments = documents.length > 3;

  return (
    <div className="p-4 bg-white  rounded-xl relative overflow-hidden" >

      {/* Header */}
      <div className="flex justify-between items-center mb-4 mt-1">
        <h2 className="text-lg font-semibold text-gray-800">Documents</h2>
        <button
          className="text-[#297280] hover:text-[#1f5c68] transition-colors transform hover:scale-110 duration-200"
          onClick={() => setIsModalOpen(true)}
          aria-label="Ajouter un document"
        >
          <PlusCircle size={40} />
        </button>
      </div>

      {/* Documents Grid - Show only first 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedDocuments.map((doc) => (
          <DocumentCard key={doc.id} document={doc} onDelete={handleDeleteDocument} />
        ))}
      </div>

      {/* Show All Button - Only render if more than 3 documents */}
      {hasMoreDocuments && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setIsShowAllModalOpen(true)}
            className="bg-gradient-to-b from-[#297280] to-[#1f5c68] text-white px-6 py-2 rounded-xl hover:from-[#1f5c68] hover:to-[#297280] transition-all duration-200 shadow-md"
          >
            Voir tout ({documents.length})
          </button>
        </div>
      )}

      {/* Empty State */}
      {documents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun document ajouté</p>
          <p className="text-sm">Cliquez sur le bouton + pour ajouter votre premier document</p>
        </div>
      )}

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddDocument}
      />

      {/* Show All Modal */}
      <ShowAllModal
        isOpen={isShowAllModalOpen}
        onClose={() => setIsShowAllModalOpen(false)}
        documents={documents}
        onDelete={handleDeleteDocument}
      />
    </div>
  );

};

export default DocumentsSection;