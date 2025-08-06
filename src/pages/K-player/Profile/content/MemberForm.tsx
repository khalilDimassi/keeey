import { Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { OrgMember } from "../types";

interface MemberFormProps {
  mode: 'add' | 'edit';
  member?: OrgMember;
  onClose: () => void;
  onSubmit: (member: Omit<OrgMember, 'ID'>) => void;
  onDelete?: () => void;
}

const MemberForm = ({ mode, member, onClose, onSubmit, onDelete }: MemberFormProps) => {
  const [formTouched, setFormTouched] = useState(false);

  const closeForm = () => {
    if (!formTouched) {
      onClose();
    } else {
      if (confirm("Des modifications seront perdues. Fermer le formulaire ?")) {
        onClose();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    onSubmit({
      first_name: form.first_name.value,
      last_name: form.last_name.value,
      email: form.email.value,
      phone: form.phone.value,
      gender: form.gender.value,
      occupation: form.occupation.value,
    } as Omit<OrgMember, 'ID'>);

    setFormTouched(false);
    closeForm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in"
      onClick={closeForm}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl animate-slide-in-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b-2 border-[#215A96] pb-2">
          <h2 className="text-lg font-semibold text-gray-700">
            {mode === 'add' ? 'Ajouter un utilisateur' : 'Modifier utilisateur'}
          </h2>
          <button onClick={closeForm} className="text-gray-500 hover:text-red-700">
            <Trash2 size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Gender */}
          <div className="flex items-center gap-6 pl-0.5">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value="male"
                defaultChecked={member?.gender === 'M.'}
                onChange={() => setFormTouched(true)}
              />
              <span className="text-sm">M.</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value="female"
                defaultChecked={member?.gender === 'female'}
                onChange={() => setFormTouched(true)}
              />
              <span className="text-sm">Mme</span>
            </label>
          </div>

          {/* Names */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Nom"
              name="last_name"
              defaultValue={member?.last_name || ''}
              className="w-1/2 border rounded-xl px-3 py-2 text-sm"
              onChange={() => setFormTouched(true)}
            />
            <input
              type="text"
              placeholder="Prénom"
              name="first_name"
              defaultValue={member?.first_name || ''}
              className="w-1/2 border rounded-xl px-3 py-2 text-sm"
              onChange={() => setFormTouched(true)}
            />
          </div>

          {/* Occupation */}
          <input
            type="text"
            placeholder="Fonction"
            name="occupation"
            defaultValue={member?.occupation || ''}
            className="w-full border rounded-xl px-3 py-2 text-sm"
            onChange={() => setFormTouched(true)}
          />

          {/* Email & Phone */}
          <div className="flex gap-4">
            <input
              type="email"
              placeholder="Email"
              name="email"
              defaultValue={member?.email || ''}
              className="w-1/2 border rounded-xl px-3 py-2 text-sm"
              onChange={() => setFormTouched(true)}
            />
            <input
              type="tel"
              placeholder="Téléphone (optionnel)"
              name="phone"
              defaultValue={member?.phone || ''}
              className="w-1/2 border rounded-xl px-3 py-2 text-sm"
              onChange={() => setFormTouched(true)}
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-[#215A96] flex items-center text-white mr-auto px-4 py-1 rounded-full h-fit hover:bg-blue-900 transition-all duration-200"
            >
              <Plus className="w-3 h-3 mr-1" />
              {mode === 'add' ? 'Ajouter' : 'Mettre à jour'}
            </button>

            {mode === 'edit' && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
                    onDelete();
                  }
                }}
                className="bg-red-600 flex items-center text-white px-4 py-1 rounded-full h-fit hover:bg-red-700 transition-all duration-200"
              >
                <Trash2 className="w-3 h-3 mr-1" /> Supprimer
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;