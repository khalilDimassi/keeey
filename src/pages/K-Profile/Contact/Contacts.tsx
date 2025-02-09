import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FileText, Award } from "lucide-react";
import ContactsList from "./ContactsList";
import Cooptation from "./Cooptation";

const Contacts = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState("contacts");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full">
      <div className="relative bg-white shadow-sm rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200">
          {/* Tabs */}
          <div className="flex gap-2 p-2">
            <button
              className={`px-4 py-2 font-medium transition-all flex items-center gap-2 rounded-md ${
                activeTab === "contacts"
                  ? "text-teal-600 bg-white shadow-md border border-gray-100"
                  : "text-gray-500 hover:text-teal-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("contacts")}
            >
              <FileText className={`w-5 h-5 ${activeTab === "contacts" ? "text-teal-600" : "text-gray-400"}`} />
              Mes contacts
            </button>
            <button
              className={`px-4 py-2 font-medium transition-all flex items-center gap-2 rounded-md ${
                activeTab === "cooptation/parrainahes"
                  ? "text-teal-600 bg-white shadow-md border border-gray-100"
                  : "text-gray-500 hover:text-teal-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("cooptation/parrainahes")}
            >
              <Award className={`w-5 h-5 ${activeTab === "cooptation/parrainahes" ? "text-teal-600" : "text-gray-400"}`} />
              Mes cooptation/parrainahes
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 px-4">
            <button
              className="px-4 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700"
              onClick={handleOpenModal}
            >
              {activeTab === "contacts" ? "Ajouter un contact" : "Ajouter une cooptation"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="hover-box p-4">
          {activeTab === "contacts" ? <ContactsList /> : <Cooptation />}
        </div>

      
      </div>
      
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
      {/* Close Icon */}
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        onClick={handleCloseModal}
      >
        <AiOutlineCloseCircle className="w-6 h-6" />
      </button>
            <h2 className="text-xl font-semibold mb-4">
              {activeTab === "contacts" ? "Ajouter un contact" : "Ajouter une cooptation"}
            </h2>
            <form>
             {/* Form fields specific to each tab */}
{activeTab === "contacts" ? (
  <>
    {/* Genre Selection */}
    <div className="flex gap-4 mb-4">
      {["Mr.", "Madame", "Autre"].map((gender) => (
        <label key={gender} className="flex items-center gap-1">
          <input type="radio" name="gender" value={gender} />
          {gender}
        </label>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nom</label>
        <input className="w-full p-2 border rounded" placeholder="Nom" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Prénom</label>
        <input className="w-full p-2 border rounded" placeholder="Prénom" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Société</label>
        <input className="w-full p-2 border rounded" placeholder="Société" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Téléphone</label>
        <input className="w-full p-2 border rounded" placeholder="Téléphone" />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Email</label>
      <input className="w-full p-2 border rounded mt-2" placeholder="Email" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Nb Besoin/Recherche en cours</label>
      <input className="w-full p-2 border rounded mt-2" placeholder="Nb Besoin/Recherche en cours" />
    </div>

    <div className="flex justify-end mt-4">
      <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
        + Ajouter
      </button>
    </div>
  </>
) : (
  <>
    {/* Genre Selection */}
    <div className="flex gap-4 mb-4">
      {["Mr.", "Madame", "Autre"].map((gender) => (
        <label key={gender} className="flex items-center gap-1">
          <input type="radio" name="gender" value={gender} />
          {gender}
        </label>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nom</label>
        <input className="w-full p-2 border rounded" placeholder="Nom" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Prénom</label>
        <input className="w-full p-2 border rounded" placeholder="Prénom" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Fonction</label>
        <input className="w-full p-2 border rounded" placeholder="Fonction" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Téléphone</label>
        <input className="w-full p-2 border rounded" placeholder="Téléphone" />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Email</label>
      <input className="w-full p-2 border rounded mt-2" placeholder="Email" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Nb missions réalisées</label>
      <input className="w-full p-2 border rounded mt-2" placeholder="Nb missions réalisées" />
    </div>
    <div className="grid grid-cols-2 gap-2">
    <div>
      <label className="block text-sm font-medium text-gray-700">Nb jours</label>
      <input className="w-full p-2 border rounded" placeholder="Nb jours" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Note</label>
      <input className="w-full p-2 border rounded" placeholder="Note" />
    </div>
 </div>
    <div className="flex justify-end mt-4">
      <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
        + Ajouter
      </button>
    </div>
  </>
)}

              
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;