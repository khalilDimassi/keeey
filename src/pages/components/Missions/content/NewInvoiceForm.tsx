import { Plus, Info, Trash2 } from "lucide-react";
import { useState } from "react";
import { Invoice } from "../types";
import { getColor } from "../../../../utils/color";

const NewInvoiceForm = ({ missionID, handleAddInvoice }: { missionID: number, handleAddInvoice: (newInvoice: Invoice) => void }) => {
  const [showForm, setShowForm] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [formData, setFormData] = useState<Invoice>({
    mission_id: missionID,
    status: "ONGOING",
    year: new Date().getFullYear().toString(),
    month: "",
    days: 0,
    costs: 0,
    description: "",
    gap: 0,
    amountHT: 0
  });

  const closeForm = () => {
    if (!formTouched) {
      setShowForm(false);
    } else {
      if (confirm("Des modifications seront perdues. Fermer le formulaire ?")) {
        setShowForm(false);
        setFormTouched(false);
        setFormData({
          mission_id: missionID,
          status: "ONGOING",
          year: new Date().getFullYear().toString(),
          month: "",
          days: 0,
          costs: 0,
          description: "",
          gap: 0,
          amountHT: 0
        });
      }
    }
  };

  const handleInputChange = (field: keyof Invoice, value: string) => {
    setFormTouched(true);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const months = [
    { value: "01", label: "Janvier" },
    { value: "02", label: "Février" },
    { value: "03", label: "Mars" },
    { value: "04", label: "Avril" },
    { value: "05", label: "Mai" },
    { value: "06", label: "Juin" },
    { value: "07", label: "Juillet" },
    { value: "08", label: "Août" },
    { value: "09", label: "Septembre" },
    { value: "10", label: "Octobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Décembre" }
  ];

  const statusOptions = [
    { value: "ONGOING", label: "En cours" },
    { value: "COMPLETED", label: "Terminée" }
  ];

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className={`flex gap-2 items-center text-white text-xs mx-auto my-2 px-4 py-2 rounded-full shadow ${"bg-[" + getColor(500) + "] hover:bg-[" + getColor(600) + "]"}`}
      >
        <Plus size={16} /> Nouvelle facture
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4"
      onClick={closeForm}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex justify-between items-center mb-4 border-b-2 pb-2 ${"border-[" + getColor(500) + "]"}`}>
          <h2 className="text-lg font-semibold text-gray-700">Nouvelle facture</h2>
          <button onClick={closeForm} className="text-gray-500 hover:text-red-700">
            <Trash2 size={20} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          handleAddInvoice({ ...formData });
          setFormTouched(false);
          setShowForm(false);
          setFormData({
            mission_id: missionID,
            status: "ONGOING",
            year: new Date().getFullYear().toString(),
            month: "",
            days: 0,
            costs: 0,
            description: "",
            gap: 0,
            amountHT: 0
          });
        }}>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                Statut
                <div className="relative inline-block ml-1">
                  <div className="group">
                    <Info size={14} className="text-gray-400" />
                    <div className="absolute invisible group-hover:visible bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 p-2 text-xs text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      État de la facture
                    </div>
                  </div>
                </div>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm font-medium"
                required
              >
                <option value="">Sélectionner</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-1/2">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                Jours
                <div className="relative inline-block ml-1">
                  <div className="group">
                    <Info size={14} className="text-gray-400" />
                    <div className="absolute invisible group-hover:visible bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 p-2 text-xs text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      Nombre de jours facturés
                    </div>
                  </div>
                </div>
              </label>
              <input
                type="number"
                placeholder="N° jours"
                value={formData.days}
                onChange={(e) => handleInputChange('days', e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm font-medium"
                min="1"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                Année
                <div className="relative inline-block ml-1">
                  <div className="group">
                    <Info size={14} className="text-gray-400" />
                    <div className="absolute invisible group-hover:visible bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 p-2 text-xs text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      Année de facturation
                    </div>
                  </div>
                </div>
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm font-medium"
                min="2000"
                max="2100"
                required
              />
            </div>

            <div className="w-1/2">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                Mois
                <div className="relative inline-block ml-1">
                  <div className="group">
                    <Info size={14} className="text-gray-400" />
                    <div className="absolute invisible group-hover:visible bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 p-2 text-xs text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      Mois de facturation
                    </div>
                  </div>
                </div>
              </label>
              <select
                value={formData.month}
                onChange={(e) => handleInputChange('month', e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm font-medium"
                required
              >
                <option value="">Sélectionner</option>
                {months.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              Coûts (€)
              <div className="relative inline-block ml-1">
                <div className="group">
                  <Info size={14} className="text-gray-400" />
                  <div className="absolute invisible group-hover:visible bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 text-xs text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    Coûts associés à la mission
                  </div>
                </div>
              </div>
            </label>
            <input
              type="number"
              placeholder="Montant"
              value={formData.costs}
              onChange={(e) => handleInputChange('costs', e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm font-medium"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              Desc. coûts
              <div className="relative inline-block ml-1">
                <div className="group">
                  <Info size={14} className="text-gray-400" />
                  <div className="absolute invisible group-hover:visible bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-56 p-2 text-xs text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    Description détaillée des coûts
                  </div>
                </div>
              </div>
            </label>
            <textarea
              placeholder="Description des coûts"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm font-medium resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                Écart coût (€)
                <div className="relative inline-block ml-1">
                  <div className="group">
                    <Info size={14} className="text-gray-400" />
                    <div className="absolute invisible group-hover:visible bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 text-xs text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      Différence entre coût prévu et réel
                    </div>
                  </div>
                </div>
              </label>
              <input
                type="number"
                placeholder="Écart"
                value={formData.gap}
                onChange={(e) => handleInputChange('gap', e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm font-medium"
                step="0.01"
              />
            </div>

            <div className="w-1/2">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                Montant HT (€)
                <div className="relative inline-block ml-1">
                  <div className="group">
                    <Info size={14} className="text-gray-400" />
                    <div className="absolute invisible group-hover:visible bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 p-2 text-xs text-white bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      Montant hors taxes
                    </div>
                  </div>
                </div>
              </label>
              <input
                type="number"
                placeholder="Montant HT"
                value={formData.amountHT}
                onChange={(e) => handleInputChange('amountHT', e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm font-medium"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <button
            className={`flex justify-self-end justify-center w-1/2 px-4 py-2 rounded-full text-sm text-white disabled:opacity-50 ${"bg-[" + getColor(500) + "] hover:bg-[" + getColor(600) + "] transition-colors"}`}
            type="submit"
          >
            <Plus size={16} className="mr-1" /> Créer la facture
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewInvoiceForm;