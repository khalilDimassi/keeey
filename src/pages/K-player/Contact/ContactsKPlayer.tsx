import React, { useState } from "react";
import { Contact, PlusCircle, X } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "internal" | "external";
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Ajouter un contact {type === "internal" ? "internes" : "externes"}
          </h2>
          <button className="cursor-pointer" onClick={onClose}>
            <X />
          </button>
        </div>
        <form>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Genre</label>
            <div className="flex gap-4">
              <label>
                <input type="radio" name="gender" value="Mr." /> Mr.
              </label>
              <label>
                <input type="radio" name="gender" value="Madame" /> Madame
              </label>
              <label>
                <input type="radio" name="gender" value="Autre" /> Autre
              </label>
            </div>
          </div>

          {/* 2x2 Grid for First Four Inputs */}
          <div className="grid grid-cols-2 gap-7 mb-5">
            <input className="w-full p-2 border rounded-lg" placeholder="Nom" />
            <input className="w-full p-2 border rounded-lg" placeholder="Prénom" />
            <input className="w-full p-2 border rounded-lg" placeholder="Fonction" />
            <input className="w-full p-2 border rounded-lg" placeholder="Tel" />
          </div>

          <input className="w-full p-2 mb-5 border rounded" placeholder="Email" />
          {type === "external" && (
            <input className="w-full p-2 mb-5 border rounded" placeholder="Société" />
          )}

          {/* Disabled Button */}
          <button
            type="button"
            className="w-full p-2 bg-blue-800 text-white rounded "

          >
            + Ajouter
          </button>
        </form>
      </div>
    </div>
  );
};


const ContactsKPlayer = () => {
  const [showInternalModal, setShowInternalModal] = useState(false);
  const [showExternalModal, setShowExternalModal] = useState(false);

  return (
    <div className="p-3 min-h-screenmt-1 mb-1">
      <h1 className="text-2xl font-semibold flex items-center mb-4">
        <Contact className="mr-2 text-blue-800" size={40} /> Contact
      </h1>
      <div className="grid grid-cols-2 gap-6 min-h-screen">
        {/* Contacts Internes */}
        <div className="p-4 bg-white shadow rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Mes contacts internes</h2>
            <PlusCircle className="cursor-pointer text-blue-800" onClick={() => setShowInternalModal(true)} />
          </div>
          <table className="w-full border-collapse">
            <thead className="border-b-2 border-gray-300">
              <tr>
                <th className="p-2">Nom et prénom</th>
                <th className="p-2">Fonction</th>
                <th className="p-2">Email</th>
                <th className="p-2">Téléphone</th>
                <th className="p-2">Nb Besoin en cours</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-2">Ahmed Aabb</td>
                <td className="p-2">Exemple</td>
                <td className="p-2">exemple1@g...</td>
                <td className="p-2">+33 123 ...</td>
                <td className="p-2">Exemple</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Contacts Externes */}
        <div className="p-4 bg-white shadow rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Mes contacts externes</h2>
            <PlusCircle className="cursor-pointer text-blue-800" onClick={() => setShowExternalModal(true)} />
          </div>
          <table className="w-full border-collapse">
            <thead className="border-b-2 border-gray-300">
              <tr>
                <th className="p-2">Nom et prénom</th>
                <th className="p-2">Fonction</th>
                <th className="p-2">Société</th>
                <th className="p-2">Email</th>
                <th className="p-2">Téléphone</th>
                <th className="p-2">Nb Besoin en cours</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-2">Ahmed Aabb</td>
                <td className="p-2">Exemple</td>
                <td className="p-2">Exemple</td>
                <td className="p-2">exemple1@g...</td>
                <td className="p-2">+33 123 ...</td>
                <td className="p-2">Exemple</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ContactModal isOpen={showInternalModal} onClose={() => setShowInternalModal(false)} type="internal" />
      <ContactModal isOpen={showExternalModal} onClose={() => setShowExternalModal(false)} type="external" />
    </div>
  );
};

export default ContactsKPlayer;
