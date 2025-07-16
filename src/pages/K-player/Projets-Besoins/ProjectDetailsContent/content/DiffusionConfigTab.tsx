import React, { useState } from 'react';

const Diffusion = ({ opportunity_id }: { opportunity_id: string }) => {
  const [selectedOption, setSelectedOption] = useState('non-visible');
  const [contacts, setContacts] = useState([
    {
      id: 1,
      nom: 'AAAAA bbbb',
      fonction: 'exemple',
      societe: 'exemple',
      email: 'exemple1@gmail.com',
      telephone: '+33 123 456 789',
      besoin: 'Exemple'
    }
  ]);

  const handleOptionChange = (option: React.SetStateAction<string>) => {
    setSelectedOption(option);
  };

  const handleAddContact = () => {
    // Logique pour ajouter un contact
    console.log('Ajouter un contact');
  };

  return (
    <div className="w-full bg-white rounded-b-xl rounded-r-xl shadow-lg p-6 flex flex-col md:flex-row gap-4">
      <div className="w-full relative md:w-2/5 p-2">
        <div className="absolute inset-0 bg-gray-100/80 z-10 rounded-xl flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,_#e5e7eb_0,_#e5e7eb_25px,_transparent_25px,_transparent_50px)] opacity-60"></div>
          </div>
          <div className="bg-white border-2 border-gray-300 px-8 py-4 rounded-xl shadow-lg z-10">
            <span className="text-l font-bold text-gray-700">EN COURS DE CONSTRUCTION</span>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-blue-700 mb-4">Critière de diffusion de l'offre</h2>

        <div className="mb-6">
          <p className="font-medium mb-3">Qui peut voir ce besoin :</p>

          <div className="space-y-4">
            <div className="flex items-center justify-between cursor-pointer">
              <span>Offre non visible</span>
              <div
                className={`relative w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all ${selectedOption === 'non-visible' ? "bg-blue-800" : "bg-gray-300"
                  }`}
                onClick={() => handleOptionChange('non-visible')}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${selectedOption === 'non-visible' ? "translate-x-6" : "translate-x-0"
                    }`}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between cursor-pointer">
              <span>Offre totalement visible sur la plateforme</span>
              <div
                className={`relative w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all ${selectedOption === 'totalement-visible' ? "bg-blue-800" : "bg-gray-300"
                  }`}
                onClick={() => handleOptionChange('totalement-visible')}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${selectedOption === 'totalement-visible' ? "translate-x-6" : "translate-x-0"
                    }`}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between cursor-pointer">
              <span>Offre visible pour les contacts sélectionnés</span>
              <div
                className={`relative w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all ${selectedOption === 'contacts-selectionnes' ? "bg-blue-800" : "bg-gray-300"
                  }`}
                onClick={() => handleOptionChange('contacts-selectionnes')}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${selectedOption === 'contacts-selectionnes' ? "translate-x-6" : "translate-x-0"
                    }`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-20 rounded-md">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Explications :</h3>
          <p className="text-sm text-gray-500">
            Seuls les contacts sélectionnés ci-contre pourront avoir accès à votre
            besoin sur la plateforme. Les éléments confidentiels (contact, TJM...)
            resteront non accessibles, jusqu'à ce que vous autorisiez la transmission
            des informations.
          </p>
        </div>
      </div>
      <div className="w-full relative md:w-3/5">
        <div className="absolute inset-0 bg-gray-100/80 z-10 rounded-xl flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,_#e5e7eb_0,_#e5e7eb_25px,_transparent_25px,_transparent_50px)] opacity-60"></div>
          </div>
          <div className="bg-white border-2 border-gray-300 px-8 py-4 rounded-xl shadow-lg z-10">
            <span className="text-l font-bold text-gray-700">EN COURS DE CONSTRUCTION</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Contacts selectionnés pour ce besoin</h2>
          <button
            onClick={handleAddContact}
            className="bg-white text-gray-800 border border-gray-300 rounded-full p-1 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm leading-normal">
                <th className="py-3 px-2 text-left">Nom et prénom</th>
                <th className="py-3 px-2 text-left">Fonction</th>
                <th className="py-3 px-2 text-left">Société</th>
                <th className="py-3 px-2 text-left">Email</th>
                <th className="py-3 px-2 text-left">Téléphone</th>
                <th className="py-3 px-2 text-left">Nb Besoin en cours</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {contacts.map((contact) => (
                <tr key={contact.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-2">{contact.nom}</td>
                  <td className="py-3 px-2">{contact.fonction}</td>
                  <td className="py-3 px-2">{contact.societe}</td>
                  <td className="py-3 px-2">{contact.email}</td>
                  <td className="py-3 px-2">{contact.telephone}</td>
                  <td className="py-3 px-2">{contact.besoin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Diffusion;