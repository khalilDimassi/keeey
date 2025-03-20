import { useState, useEffect } from 'react';
import { OpportunityDetails } from './OpportunityDetails';
import BesoinDoc from '../Define Besoin Vivier/BesoinDoc';

interface InformationsProps {
  opportunityData: OpportunityDetails | null;
  onSave: (data: any) => Promise<void>;
  isSaving: boolean
}

const Informations = ({ opportunityData, onSave, isSaving }: InformationsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    status: '',
    certainty: '', // Not in the backend, keeping as is
    operational_manager: '', // Not in the backend, keeping as is
    reference: 0,
    announce_at: '',
    responded_at: '',
    context: '', // Not in backend, keeping as requested
    description: ''
  });

  const [originalData, setOriginalData] = useState({ ...formData });

  // Initialize form data when opportunity data is loaded
  useEffect(() => {
    if (opportunityData) {
      const newFormData = {
        title: opportunityData.title || '',
        status: opportunityData.status || '',
        certainty: '', // Not coming from backend
        operational_manager: '', // Not coming from backend
        reference: opportunityData.opportunity_id,
        announce_at: opportunityData.announce_at || '',
        responded_at: opportunityData.responded_at || '',
        context: '', // Not coming from backend
        description: opportunityData.description || ''
      };

      setFormData(newFormData);
      setOriginalData(newFormData);
    }
  }, [opportunityData]);

  // Handle form field changes
  const handleChange = (e: { target: { name: string; value: string; }; }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission and toggle edit mode
  const handleSubmit = async () => {
    if (isEditing) {
      // Only include changed fields
      const changedFields: Record<string, any> = {};

      Object.keys(formData).forEach(key => {
        // Only add fields that exist in backend model and have changed
        if (formData[key as keyof typeof formData] !== originalData[key as keyof typeof originalData]) {
          if (
            key === 'title' ||
            key === 'status' ||
            key === 'announce_at' ||
            key === 'responded_at' ||
            key === 'description'
          ) {
            changedFields[key] = formData[key as keyof typeof formData];
          }
        }
      });

      if (Object.keys(changedFields).length > 0) {
        try {
          await onSave(changedFields);
          setOriginalData({ ...formData });
        } catch (error) {
          console.error('Failed to save changes', error);
          // on error! reset form to original data on error
          setFormData({ ...originalData });
        }
      }
    }

    setIsEditing(!isEditing);
  };

  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="max-w-7xl mx-auto rounded-lg p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: "#215A96", borderRadius: "10px" }}
        >
          {isEditing ? isSaving ? 'Saving...' : 'Sauvegarder' : 'Modifier'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="col-span-1">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          {isEditing ? (
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Titre"
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="p-2 bg-gray-50 rounded-xl">{formData.title || '-'}</div>
          )}
        </div>
        <div className="col-span-1">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          {isEditing ? (
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez un statut</option>
              {/* <option value="draft">Brouillon</option> */}
              <option value="ONGOING">Actif</option>
              <option value="PENDING">En attente</option>
              <option value="CONCLUDED">Fermé</option>
              <option value="CLOSED">Annulé</option>
            </select>
          ) : (
            <div className="p-2 bg-gray-50 rounded-xl">
              {/*  formData.status === 'draft' ? 'Brouillon' : */}
              {formData.status === 'ONGOING' ? 'Actif' :
                formData.status === 'PENDING' ? 'En attente' :
                  formData.status === 'CONCLUDED' ? 'Fermé' :
                    formData.status === 'CLOSED' ? 'Annulé' : '-'}
            </div>
          )}
        </div>
        <div className="col-span-1">
          <label htmlFor="certainty" className="block text-sm font-medium text-gray-700 mb-1">Certitude du besoin</label>
          {isEditing ? (
            <select
              id="certainty"
              name="certainty"
              value={formData.certainty}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez une option</option>
              <option value="confirmed">Budget confirmé</option>
              <option value="probable">Besoin probable</option>
              <option value="pool">Vivier</option>
            </select>
          ) : (
            <div className="p-2 bg-gray-50 rounded-xl">
              {formData.certainty === 'confirmed' ? 'Budget confirmé' :
                formData.certainty === 'probable' ? 'Besoin probable' :
                  formData.certainty === 'pool' ? 'Vivier' : '-'}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <label htmlFor="operational_manager" className="block text-sm font-medium text-gray-700 mb-1">Responsable opérationnel</label>
          {isEditing ? (
            <input
              type="text"
              id="operational_manager"
              name="operational_manager"
              value={formData.operational_manager}
              onChange={handleChange}
              placeholder="Responsable opérationnel"
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="p-2 bg-gray-50 rounded-xl">{formData.operational_manager || '-'}</div>
          )}
        </div>
        <div className="col-span-1">
          <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">Référence de l'offre</label>
          {isEditing ? (
            <input
              type="text"
              id="reference"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="Référence de l'offre"
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="p-2 bg-gray-50 rounded-xl">{formData.reference || '-'}</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <label htmlFor="announce_at" className="block text-sm font-medium text-gray-700 mb-1">Date appel d'offre</label>
          {isEditing ? (
            <div className="relative">
              <input
                type="date"
                id="announce_at"
                name="announce_at"
                value={formData.announce_at ? formData.announce_at.split('T')[0] : ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="p-2 bg-gray-50 rounded-xl">{formatDate(formData.announce_at) || '-'}</div>
          )}
        </div>
        <div className="col-span-1">
          <label htmlFor="responded_at" className="block text-sm font-medium text-gray-700 mb-1">Date réponse</label>
          {isEditing ? (
            <div className="relative">
              <input
                type="date"
                id="responded_at"
                name="responded_at"
                value={formData.responded_at ? formData.responded_at.split('T')[0] : ''}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="p-2 bg-gray-50 rounded-xl">{formatDate(formData.responded_at) || '-'}</div>
          )}
        </div>
      </div>

      <div className='flex gap-6'>
        <div className='w-2/3'>
          <div className="mb-4">
            <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-1">Contexte</label>
            {isEditing ? (
              <textarea
                id="context"
                name="context"
                value={formData.context}
                onChange={handleChange}
                placeholder="Contexte"
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              ></textarea>
            ) : (
              <div className="p-2 bg-gray-50 rounded-xl min-h-16">{formData.context || '-'}</div>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descriptif de la mission</label>
            {isEditing ? (
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descriptif"
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              ></textarea>
            ) : (
              <div className="p-2 bg-gray-50 rounded-xl min-h-24">{formData.description || '-'}</div>
            )}
          </div>
        </div>

        <div>
          <div className="mt-6 w-full">
            <BesoinDoc />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Informations;