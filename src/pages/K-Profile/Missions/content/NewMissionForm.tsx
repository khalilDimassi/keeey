import { Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { DetailedMission } from "../types";


const NewMissionForm = ({ newMission, setNewMission, onSubmit, loading }: { newMission: Omit<DetailedMission, 'id'>, setNewMission: React.Dispatch<React.SetStateAction<Omit<DetailedMission, 'id'>>>, onSubmit: () => void, loading: boolean }) => {
  const [showForm, setShowForm] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  const closeForm = () => {
    if (!formTouched) {
      setShowForm(false);
    } else {
      if (confirm("Des modifications seront perdues. Fermer le formulaire ?")) {
        setShowForm(false);
        setFormTouched(false);
      }
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="ml-auto flex gap-2 items-center text-white px-4 py-2 rounded-full shadow bg-[#297280] hover:bg-teal-900"
      >
        <Plus size={20} /> Ajouter une mission
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4 transform transition-all duration-500 ease-in-out"
      onClick={closeForm}
    >
      <div
        className="bg-white p-4 rounded-xl shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b-2 border-[#297280] pb-2">
          <h2 className="text-lg font-semibold text-gray-700">Ajouter une mission</h2>
          <button onClick={closeForm} className="text-gray-500 hover:text-red-700">
            <Trash2 size={20} />
          </button>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setFormTouched(false);
            setShowForm(false);
            onSubmit();
          }}
        >
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titre de la mission
            </label>
            <input
              type="text"
              id="title"
              placeholder="Titre"
              name="title"
              value={newMission.title}
              onChange={(e) => {
                setFormTouched(true);
                setNewMission({ ...newMission, title: e.target.value });
              }}
              className="w-full border rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Entreprise
              </label>
              <input
                type="text"
                id="company"
                placeholder="Entreprise"
                name="company"
                value={newMission.company}
                onChange={(e) => {
                  setFormTouched(true);
                  setNewMission({ ...newMission, company: e.target.value });
                }}
                className="w-full border rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                Contact
              </label>
              <input
                type="text"
                id="contact"
                placeholder="Contact"
                name="contact"
                value={newMission.contact}
                onChange={(e) => {
                  setFormTouched(true);
                  setNewMission({ ...newMission, contact: e.target.value });
                }}
                className="w-full border rounded-xl px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <input
                type="date"
                id="start"
                name="start"
                value={newMission.start}
                onChange={(e) => {
                  setFormTouched(true);
                  setNewMission({ ...newMission, start: e.target.value });
                }}
                className="w-full border rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <input
                type="date"
                id="end"
                name="end"
                value={newMission.end}
                onChange={(e) => {
                  setFormTouched(true);
                  setNewMission({ ...newMission, end: e.target.value });
                }}
                className="w-full border rounded-xl px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">
                Taux Journalier Moyen
              </label>
              <input
                type="text"
                id="rate"
                placeholder="TJM"
                name="rate"
                value={newMission.rate}
                onChange={(e) => {
                  setFormTouched(true);
                  setNewMission({ ...newMission, rate: e.target.value });
                }}
                className="w-full border rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niveau de satisfaction
              </label>
              <div className="flex gap-1 items-center justify-start">
                {Array(5).fill(0).map((_, index) => (
                  <Star
                    key={index}
                    size={20}
                    fill={index < newMission.satisfaction ? "#EAB308" : "none"}
                    stroke={index < newMission.satisfaction ? "#EAB308" : "#D1D5DB"}
                    className="cursor-pointer"
                    onClick={() => {
                      setFormTouched(true);
                      setNewMission({ ...newMission, satisfaction: index + 1 });
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <button
            className="flex justify-self-end justify-center w-1/3 mr-3 px-4 py-2 text-sm text-white bg-[#297280] rounded-full hover:bg-teal-900 disabled:opacity-50"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? 'Ajout...' : '+ Ajouter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewMissionForm;