import { OpportunityBasicInfo } from "../../OpportunityDetailsKPlayer/types";

const GeneralInformationForm = ({ onChange, formData }: { onChange: (data: any) => void; formData: OpportunityBasicInfo; }) => {

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value ? parseFloat(value) : null
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value || null
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className='p-4'>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="col-span-1">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            placeholder="Titre"
            className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select
            id="status"
            name="status"
            value={formData.status || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez un statut</option>
            <option value="ONGOING">Actif</option>
            <option value="PENDING">En attente</option>
            <option value="CONCLUDED">Fermé</option>
            <option value="CLOSED">Annulé</option>
          </select>
        </div>
        <div className="col-span-1">
          <label htmlFor="certainty" className="block text-sm font-medium text-gray-700 mb-1">Certitude du besoin</label>
          <select
            id="certainty"
            name="certainty"
            value={formData.certainty || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez une option</option>
            <option value="confirmed">Budget confirmé</option>
            <option value="probable">Besoin probable</option>
            <option value="pool">Vivier</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="col-span-1">
          <label htmlFor="operational_manager" className="block text-sm font-medium text-gray-700 mb-1">Responsable opérationnel</label>
          <input
            type="text"
            id="operational_manager"
            name="operational_manager"
            value={formData.operational_manager || ''}
            onChange={handleChange}
            placeholder="Responsable opérationnel"
            className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">Référence de l'offre</label>
          <input
            type="text"
            id="reference"
            name="reference"
            value={formData.reference || ''}
            onChange={handleChange}
            placeholder="Référence de l'offre"
            className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">TJM cible</label>
          <input
            type="number"
            id="rate"
            name="rate"
            value={formData.rate || ''}
            onChange={handleNumberChange}
            placeholder="TJM cible"
            className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="col-span-1">
          <label htmlFor="start_at" className="block text-sm font-medium text-gray-700 mb-1">Date de démarrage</label>
          <div className="relative">
            <input
              type="date"
              id="start_at"
              name="start_at"
              value={formData.start_at || ''}
              onChange={handleDateChange}
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="col-span-1">
          <label htmlFor="announce_at" className="block text-sm font-medium text-gray-700 mb-1">Date de l'appel d'offre</label>
          <div className="relative">
            <input
              type="date"
              id="announce_at"
              name="announce_at"
              value={formData.announce_at || ''}
              onChange={handleDateChange}
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="col-span-1">
          <label htmlFor="responded_at" className="block text-sm font-medium text-gray-700 mb-1">Date de réponse</label>
          <div className="relative">
            <input
              type="date"
              id="responded_at"
              name="responded_at"
              value={formData.responded_at || ''}
              onChange={handleDateChange}
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      <div className='flex gap-6'>
        <div className='w-2/3'>
          <div className="mb-4">
            <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-1">Contexte</label>
            <textarea
              id="context"
              name="context"
              value={formData.context || ''}
              onChange={handleChange}
              placeholder="Contexte"
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descriptif de la mission</label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Descriptif"
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInformationForm;