import { Plus, Star, Trash2, ChevronDown } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { DetailedMission, Contact, Company } from "../types";
import { fetchCompanies, fetchContacts } from "../services";
import { getColor } from '../../../../utils/color';

interface NewMissionFormProps {
  newMission: Omit<DetailedMission, 'id'>;
  setNewMission: React.Dispatch<React.SetStateAction<Omit<DetailedMission, 'id'>>>;
  onSubmit: () => void;
  loading: boolean;
}

const NewMissionForm = ({ newMission, setNewMission, onSubmit, loading }: NewMissionFormProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showContactDropdown, setShowContactDropdown] = useState(false);

  // Data states
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingData, setLoadingData] = useState({ companies: false, contacts: false });
  const [errors, setErrors] = useState({ companies: null as string | null, contacts: null as string | null });

  // Memoized filtered data
  const filteredCompanies = useMemo(() => {
    return companies.filter(company =>
      company.name.toLowerCase().includes(newMission.company.toLowerCase())
    );
  }, [companies, newMission.company]);

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact =>
      `${contact.first_name} ${contact.last_name}`
        .toLowerCase()
        .includes(newMission.contact.toLowerCase())
    );
  }, [contacts, newMission.contact]);

  // Data loading functions
  const loadCompanies = useCallback(async () => {
    setLoadingData(prev => ({ ...prev, companies: true }));
    setErrors(prev => ({ ...prev, companies: null }));
    try {
      const data = await fetchCompanies();
      setCompanies(data);
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        companies: err instanceof Error ? err.message : 'Failed to load companies'
      }));
    } finally {
      setLoadingData(prev => ({ ...prev, companies: false }));
    }
  }, []);

  const loadContacts = useCallback(async () => {
    setLoadingData(prev => ({ ...prev, contacts: true }));
    setErrors(prev => ({ ...prev, contacts: null }));
    try {
      const data = await fetchContacts();
      setContacts(data);
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        contacts: err instanceof Error ? err.message : 'Failed to load contacts'
      }));
    } finally {
      setLoadingData(prev => ({ ...prev, contacts: false }));
    }
  }, []);

  // Load data when form is shown
  useEffect(() => {
    if (showForm) {
      loadCompanies();
      loadContacts();
    }
  }, [showForm, loadCompanies, loadContacts]);

  const closeForm = () => {
    if (!formTouched) {
      setShowForm(false);
    } else if (confirm("Des modifications seront perdues. Fermer le formulaire ?")) {
      setShowForm(false);
      setFormTouched(false);
    }
  };

  const handleInputChange = (field: keyof Omit<DetailedMission, 'id'>, value: string) => {
    setFormTouched(true);
    setNewMission(prev => ({ ...prev, [field]: value }));
  };

  const handleCompanySelect = (companyName: string) => {
    handleInputChange('company', companyName);
    setShowCompanyDropdown(false);
  };

  const handleContactSelect = (contactName: string) => {
    handleInputChange('contact', contactName);
    setShowContactDropdown(false);
  };

  const handleSatisfactionChange = (rating: number) => {
    setFormTouched(true);
    setNewMission(prev => ({ ...prev, satisfaction: rating }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
    setFormTouched(false);
    setShowForm(false);
  };

  const toggleDropdown = (dropdown: 'company' | 'contact') => {
    if (dropdown === 'company') {
      setShowCompanyDropdown(prev => !prev);
      setShowContactDropdown(false);
    } else {
      setShowContactDropdown(prev => !prev);
      setShowCompanyDropdown(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className={`ml-auto flex gap-2 items-center text-white px-4 py-2 rounded-full shadow ${"bg-[" + getColor(500) + "] hover:bg-[" + getColor(600) + "] transition-colors"}`}
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
        className="bg-white p-4 rounded-xl shadow-md w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex justify-between items-center mb-4 border-b-2 pb-2 ${"border-[" + getColor(500) + "]"}`}>
          <h2 className="text-lg font-semibold text-gray-700">Ajouter une mission</h2>
          <Trash2
            className="text-gray-500 hover:text-red-700"
            cursor={"pointer"}
            onClick={closeForm}
            size={20}
          />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titre de la mission
            </label>
            <input
              type="text"
              id="title"
              placeholder="Titre"
              value={newMission.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2 relative">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Entreprise
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="company"
                  placeholder={loadingData.companies ? "Chargement..." : "Entreprise"}
                  value={newMission.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  onFocus={() => toggleDropdown('company')}
                  className="w-full border rounded-xl px-3 py-2 text-sm pr-8"
                  disabled={loadingData.companies}
                />
                <ChevronDown
                  size={20}
                  className="absolute right-2 top-2 text-gray-400 cursor-pointer"
                  onClick={() => toggleDropdown('company')}
                />
              </div>

              {errors.companies && (
                <p className="text-red-500 text-xs mt-1">{errors.companies}</p>
              )}

              {showCompanyDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleCompanySelect(company.name)}
                    >
                      <span className="font-sm border-l-4 pl-3 border-green-500">
                        {company.name}
                      </span>
                    </div>
                  ))}
                  {filteredCompanies.length === 0 && newMission.company && (
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-blue-600"
                      onClick={() => setShowCompanyDropdown(false)}
                    >
                      + Créer "{newMission.company}"
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-1/2 relative">
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                Contact
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="contact"
                  placeholder={loadingData.contacts ? "Chargement..." : "Contact"}
                  value={newMission.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  onFocus={() => toggleDropdown('contact')}
                  className="w-full border rounded-xl px-3 py-2 text-sm pr-8"
                  disabled={loadingData.contacts}
                />
                <ChevronDown
                  size={20}
                  className="absolute right-2 top-2 text-gray-400 cursor-pointer"
                  onClick={() => toggleDropdown('contact')}
                />
              </div>

              {errors.contacts && (
                <p className="text-red-500 text-xs mt-1">{errors.contacts}</p>
              )}

              {showContactDropdown && (
                <div className="absolute z-10 mt-1 w-full max-h-32 bg-white border border-gray-200 rounded-lg shadow-lg overflow-auto">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                      onClick={() => handleContactSelect(`${contact.first_name} ${contact.last_name}`)}
                    >
                      <span
                        className={`font-sm border-l-4 pl-3 ${contact.status === "REGISTERED"
                          ? "border-green-500"
                          : contact.status === "NOT-REGISTERED"
                            ? "border-orange-500"
                            : "border-red-500"
                          }`}
                      >
                        {contact.first_name} {contact.last_name}
                      </span>
                    </div>
                  ))}
                  {filteredContacts.length === 0 && newMission.contact && (
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-blue-600"
                      onClick={() => setShowContactDropdown(false)}
                    >
                      + Créer "{newMission.contact}"
                    </div>
                  )}
                </div>
              )}
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
                value={newMission.start}
                onChange={(e) => handleInputChange('start', e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <input
                type="date"
                id="end"
                value={newMission.end}
                onChange={(e) => handleInputChange('end', e.target.value)}
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
                value={newMission.rate}
                onChange={(e) => handleInputChange('rate', e.target.value)}
                className="w-full border rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niveau de satisfaction
              </label>
              <div className="flex gap-1 items-center justify-start mt-3">
                {Array(5).fill(0).map((_, index) => (
                  <Star
                    key={index}
                    size={20}
                    cursor="pointer"
                    fill={index < newMission.satisfaction ? "#EAB308" : "none"}
                    stroke={index < newMission.satisfaction ? "#EAB308" : "#D1D5DB"}
                    onClick={() => handleSatisfactionChange(index + 1)}
                  />
                ))}
              </div>
            </div>
          </div>

          <button
            className={`flex justify-self-end justify-center w-1/2 mr-3 px-4 py-2 rounded-full text-sm text-white disabled:opacity-50 ${"bg-[" + getColor(500) + "] hover:bg-[" + getColor(600) + "] transition-colors"}`}
            type="submit"
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