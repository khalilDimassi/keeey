import { useEffect, useState } from 'react';
import { Check, Loader2, PenBox, X } from 'lucide-react';
import { OpportunityBasicInfo } from '../types';
import { updateOpportunityBasicInfo } from '../services';

interface GeneralInformationTabProps {
  formData: OpportunityBasicInfo;
  loading: boolean;
  error: string | null;
  opportunity_id: string
}

const GeneralInformationTab = ({ formData, loading, error, opportunity_id }: GeneralInformationTabProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localFormData, setLocalFormData] = useState<OpportunityBasicInfo>(formData);
  const [prevFormData, setPrevFormData] = useState<OpportunityBasicInfo>(formData);

  useEffect(() => {
    if (!isEditing && formData !== prevFormData) {
      setLocalFormData({ ...formData });
      setPrevFormData(formData);
    }
  }, [formData, isEditing, prevFormData]);

  const handleChange = (name: keyof OpportunityBasicInfo, value: string | number) => {
    setLocalFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStringChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    handleChange(e.target.name as keyof OpportunityBasicInfo, e.target.value);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    handleChange(e.target.name as keyof OpportunityBasicInfo, value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.name as keyof OpportunityBasicInfo, e.target.value);
  };

  const handleSubmit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare the update payload with only changed fields
      const updatePayload: Partial<OpportunityBasicInfo> = {};

      if (localFormData.title !== formData.title) updatePayload.title = localFormData.title;
      if (localFormData.status !== formData.status) updatePayload.status = localFormData.status;
      if (localFormData.certainty !== formData.certainty) updatePayload.certainty = localFormData.certainty;
      if (localFormData.operational_manager !== formData.operational_manager) updatePayload.operational_manager = localFormData.operational_manager;
      if (localFormData.rate !== formData.rate) updatePayload.rate = localFormData.rate;
      if (localFormData.start_at !== formData.start_at) updatePayload.start_at = localFormData.start_at;
      if (localFormData.announce_at !== formData.announce_at) updatePayload.announce_at = localFormData.announce_at;
      if (localFormData.responded_at !== formData.responded_at) updatePayload.responded_at = localFormData.responded_at;
      if (localFormData.context !== formData.context) updatePayload.context = localFormData.context;
      if (localFormData.description !== formData.description) updatePayload.description = localFormData.description;

      await updateOpportunityBasicInfo(updatePayload, opportunity_id);

      setLocalFormData(prev => ({
        ...prev,
        ...updatePayload
      }));

      console.info("new data: ", localFormData);
      console.info("old data: ", formData);

      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setLocalFormData(formData);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-b-xl rounded-r-xl shadow-lg p-4">
        <div className="max-w-7xl mx-auto rounded-lg p-4 animate-pulse">
          <div className="flex justify-end mb-4">
            <div className="h-10 w-24 bg-gray-300 rounded-xl"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="col-span-1">
                <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
                <div className="h-10 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {[1, 2].map((i) => (
              <div key={i} className="col-span-1">
                <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
                <div className="h-10 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {[1, 2].map((i) => (
              <div key={i} className="col-span-1">
                <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
                <div className="h-10 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>

          <div className="flex gap-6">
            <div className="w-2/3 space-y-4">
              <div>
                <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
                <div className="h-20 bg-gray-200 rounded-xl"></div>
              </div>
              <div>
                <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
                <div className="h-32 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto rounded-lg p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-b-xl rounded-r-xl shadow-lg p-4">
      <div className="flex justify-end mb-4">
        {isEditing ? (
          <div className="flex gap-2">
            <X
              cursor={isSubmitting ? "not-allowed" : "pointer"}
              size={24}
              color="red"
              onClick={handleCancel}
            />
            {isSubmitting
              ? <Loader2
                className="animate-spin"
                size={24}
                color="#215A96"
              />
              : <Check
                size={24}
                color="#215A96"
                onClick={handleSubmit}
                cursor={"pointer"}
              />
            }
          </div>
        ) : (
          <PenBox
            cursor={"pointer"}
            size={24}
            color="#215A96"
            onClick={handleSubmit}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="col-span-1">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          {isEditing ? (
            <input
              type="text"
              id="title"
              name="title"
              value={localFormData.title}
              onChange={handleStringChange}
              placeholder="Titre"
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="p-2 bg-gray-50 rounded-xl">{localFormData.title || '-'}</div>
          )}
        </div>
        <div className="col-span-1">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          {isEditing ? (
            <select
              id="status"
              name="status"
              value={localFormData.status}
              onChange={handleStringChange}
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez un statut</option>
              <option value="ONGOING">Actif</option>
              <option value="PENDING">En attente</option>
              <option value="CONCLUDED">Fermé</option>
              <option value="CLOSED">Annulé</option>
            </select>
          ) : (
            <div className="p-2 bg-gray-50 rounded-xl">
              {localFormData.status === 'ONGOING' ? 'Actif' :
                localFormData.status === 'PENDING' ? 'En attente' :
                  localFormData.status === 'CONCLUDED' ? 'Fermé' :
                    localFormData.status === 'CLOSED' ? 'Annulé' : '-'}
            </div>
          )}
        </div>
        <div className="col-span-1">
          <label htmlFor="certainty" className="block text-sm font-medium text-gray-700 mb-1">Certitude du besoin</label>
          {isEditing ? (
            <select
              id="certainty"
              name="certainty"
              value={localFormData.certainty}
              onChange={handleStringChange}
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez une option</option>
              <option value="confirmed">Budget confirmé</option>
              <option value="probable">Besoin probable</option>
              <option value="pool">Vivier</option>
            </select>
          ) : (
            <div className="p-2 bg-gray-50 rounded-xl">
              {localFormData.certainty === 'confirmed' ? 'Budget confirmé' :
                localFormData.certainty === 'probable' ? 'Besoin probable' :
                  localFormData.certainty === 'pool' ? 'Vivier' : '-'}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="col-span-1">
          <label htmlFor="operational_manager" className="block text-sm font-medium text-gray-700 mb-1">Responsable opérationnel</label>
          {isEditing ? (
            <input
              type="text"
              id="operational_manager"
              name="operational_manager"
              value={localFormData.operational_manager}
              onChange={handleStringChange}
              placeholder="Responsable opérationnel"
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="p-2 bg-gray-50 rounded-xl">{localFormData.operational_manager || '-'}</div>
          )}
        </div>
        <div className="col-span-1">
          <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">Référence de l'offre</label>
          <div className="p-2 bg-gray-50 rounded-xl">{localFormData.reference || '-'}</div>
        </div>
        <div className="col-span-1">
          <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">TJM cible</label>
          {isEditing ? (
            <input
              type="number"
              id="rate"
              name="rate"
              value={localFormData.rate}
              onChange={handleNumberChange}
              placeholder="Responsable opérationnel"
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="p-2 bg-gray-50 rounded-xl">{localFormData.rate || '-'}</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="col-span-1">
          <label htmlFor="start_at" className="block text-sm font-medium text-gray-700 mb-1">Date de démarrage</label>
          {isEditing ? (
            <div className="relative">
              <input
                type="date"
                id="start_at"
                name="start_at"
                value={localFormData.start_at}
                onChange={handleDateChange}
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="p-2 bg-gray-50 rounded-xl">{formatDate(localFormData.announce_at) || '-'}</div>
          )}
        </div>
        <div className="col-span-1">
          <label htmlFor="announce_at" className="block text-sm font-medium text-gray-700 mb-1">Date de l'appel d'offre</label>
          {isEditing ? (
            <div className="relative">
              <input
                type="date"
                id="announce_at"
                name="announce_at"
                value={localFormData.announce_at ? localFormData.announce_at : ''}
                onChange={handleDateChange}
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="p-2 bg-gray-50 rounded-xl">{formatDate(localFormData.announce_at) || '-'}</div>
          )}
        </div>
        <div className="col-span-1">
          <label htmlFor="responded_at" className="block text-sm font-medium text-gray-700 mb-1">Date de réponse</label>
          {isEditing ? (
            <div className="relative">
              <input
                type="date"
                id="responded_at"
                name="responded_at"
                value={localFormData.responded_at ? localFormData.responded_at : ''}
                onChange={handleDateChange}
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="p-2 bg-gray-50 rounded-xl">{formatDate(localFormData.responded_at) || '-'}</div>
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
                value={localFormData.context}
                onChange={handleStringChange}
                placeholder="Contexte"
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-xl min-h-16">{localFormData.context || '-'}</div>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descriptif de la mission</label>
            {isEditing ? (
              <textarea
                id="description"
                name="description"
                value={localFormData.description}
                onChange={handleStringChange}
                placeholder="Descriptif"
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-xl min-h-24">{localFormData.description || '-'}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInformationTab;