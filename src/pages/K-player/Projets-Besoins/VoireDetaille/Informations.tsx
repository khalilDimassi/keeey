import React, { useState } from 'react';
import Documents from './Documents';

const Informations = () => {
  const [formData, setFormData] = useState({
    titre: '',
    statut: '',
    certitude: '',
    responsable: '',
    reference: '',
    dateAppel: '',
    dateReponse: '',
    contexte: '',
    descriptif: '',
    documents: [
      { id: 1, name: 'K-BIS', file: null },
      { id: 2, name: 'exemple', file: null }
    ]
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddDocument = () => {
    const newDocuments = [...formData.documents, { 
      id: formData.documents.length + 1, 
      name: 'Nouveau document', 
      file: null 
    }];
    
    setFormData({
      ...formData,
      documents: newDocuments
    });
  };

  return (
    <div className="max-w-7xl mx-auto rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="col-span-1">
          <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input 
            type="text" 
            id="titre" 
            name="titre" 
            value={formData.titre} 
            onChange={handleChange} 
            placeholder="Titre" 
            className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-1">
          <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <input 
            type="text" 
            id="statut" 
            name="statut" 
            value={formData.statut} 
            onChange={handleChange} 
            placeholder="Statut (en cours, std-by, fermé...)" 
            className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-1">
          <label htmlFor="certitude" className="block text-sm font-medium text-gray-700 mb-1">Certitude du besoin</label>
          
          <div className="relative">
            <input 
              type="text" 
              id="certitude" 
              name="certitude" 
              value={formData.certitude} 
              onChange={handleChange} 
              placeholder="Budget confirmé - Besoin probable - Vivier" 
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
         
          </div>
          
        </div>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <label htmlFor="responsable" className="block text-sm font-medium text-gray-700 mb-1">Responsable opérationnel</label>
          <input 
            type="text" 
            id="responsable" 
            name="responsable" 
            value={formData.responsable} 
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
            value={formData.reference} 
            onChange={handleChange} 
            placeholder="Référence de l'offre" 
            className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="col-span-1">
          <label htmlFor="dateAppel" className="block text-sm font-medium text-gray-700 mb-1">Date appel d'offre</label>
          <div className="relative">
            <input 
              type="text" 
              id="dateAppel" 
              name="dateAppel" 
              value={formData.dateAppel} 
              onChange={handleChange} 
              placeholder="Date appelle d'offre" 
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="col-span-1">
          <label htmlFor="dateReponse" className="block text-sm font-medium text-gray-700 mb-1">Date réponse</label>
          <div className="relative">
            <input 
              type="text" 
              id="dateReponse" 
              name="dateReponse" 
              value={formData.dateReponse} 
              onChange={handleChange} 
              placeholder="Date réponse" 
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

<div className='flex gap-6'>
<div className='w-2/3'>

      <div className="mb-4">
        <label htmlFor="contexte" className="block text-sm font-medium text-gray-700 mb-1">Contexte</label>
        <textarea 
          id="contexte" 
          name="contexte" 
          value={formData.contexte} 
          onChange={handleChange} 
          placeholder="Contexte" 
          className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        ></textarea>
      </div>

      <div className="mb-6">
        <label htmlFor="descriptif" className="block text-sm font-medium text-gray-700 mb-1">Descriptif de la mission</label>
        <textarea 
          id="descriptif" 
          name="descriptif" 
          value={formData.descriptif} 
          onChange={handleChange} 
          placeholder="Descriptif" 
          className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        ></textarea>
      </div>
      </div>
      <div>

      <div className="mt-6 w-full ">      
   <Documents />
      </div>

      </div>
      </div>


    </div>
  );
};

export default Informations;