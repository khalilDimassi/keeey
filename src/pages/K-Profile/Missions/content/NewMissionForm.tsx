import { Plus, Star, Trash2, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { DetailedMission, Contact, Company } from "../types";
import { fetchCompanies, fetchContacts } from "../services";

const NewMissionForm = ({
  newMission,
  setNewMission,
  onSubmit,
  loading
}: {
  newMission: Omit<DetailedMission, 'id'>,
  setNewMission: React.Dispatch<React.SetStateAction<Omit<DetailedMission, 'id'>>>,
  onSubmit: () => void,
  loading: boolean
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  // States for companies
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  // States for contacts
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [showContactDropdown, setShowContactDropdown] = useState(false);

  useEffect(() => {
    if (showForm) {
      // Load companies when form is shown
      const loadCompanies = async () => {
        setLoadingCompanies(true);
        setCompanyError(null);
        try {
          const data = await fetchCompanies();
          setCompanies(data);
        } catch (err) {
          setCompanyError(err instanceof Error ? err.message : 'Failed to load companies');
        } finally {
          setLoadingCompanies(false);
        }
      };

      loadCompanies();
    }
  }, [showForm, setLoadingCompanies, setCompanyError, setCompanies]);

  useEffect(() => {
    if (showForm) {
      // Load contacts when form is shown
      const loadContacts = async () => {
        setLoadingContacts(true);
        setContactError(null);
        try {
          const data = await fetchContacts();
          setContacts(data);
        } catch (err) {
          setContactError(err instanceof Error ? err.message : 'Failed to load contacts');
        } finally {
          setLoadingContacts(false);
        }
      };

      loadContacts();
    }
  }, [showForm, setLoadingContacts, setContactError, setContacts]);

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
        className="bg-white p-4 rounded-xl shadow-md w-full max-w-lg"
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
            onSubmit();
            setFormTouched(false);
            setShowForm(false);
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
                  placeholder={loadingCompanies ? "Chargement..." : "Entreprise"}
                  name="company"
                  value={newMission.company}
                  onChange={(e) => {
                    setFormTouched(true);
                    setNewMission({ ...newMission, company: e.target.value });
                    setShowCompanyDropdown(true);
                  }}
                  onFocus={() => setShowCompanyDropdown(true)}
                  className="w-full border rounded-xl px-3 py-2 text-sm pr-8"
                  disabled={loadingCompanies}
                />
                <ChevronDown
                  size={20}
                  className="absolute right-2 top-2 text-gray-400 cursor-pointer"
                  onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                />
              </div>

              {companyError && (
                <p className="text-red-500 text-xs mt-1">{companyError}</p>
              )}

              {showCompanyDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {companies
                    .filter(company =>
                      company.name.toLowerCase().includes(newMission.company.toLowerCase())
                    )
                    .map((company) => (
                      <div
                        key={company.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setNewMission({ ...newMission, company: company.name });
                          setShowCompanyDropdown(false);
                          setFormTouched(true);
                        }}
                      >
                        <span
                          className="font-sm border-l-4 pl-3 border-green-500"
                        >{company.name}</span>
                      </div>
                    ))
                  }
                  {companies.filter(company =>
                    company.name.toLowerCase().includes(newMission.company.toLowerCase())
                  ).length === 0 && (
                      <div
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-blue-600"
                        onClick={() => {
                          setShowCompanyDropdown(false);
                          setFormTouched(true);
                        }}
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
                  placeholder={loadingContacts ? "Chargement..." : "Contact"}
                  name="contact"
                  value={newMission.contact}
                  onChange={(e) => {
                    setFormTouched(true);
                    setNewMission({ ...newMission, contact: e.target.value });
                    setShowContactDropdown(true);
                  }}
                  onFocus={() => setShowContactDropdown(true)}
                  className="w-full border rounded-xl px-3 py-2 text-sm pr-8"
                  disabled={loadingContacts}
                />
                <ChevronDown
                  size={20}
                  className="absolute right-2 top-2 text-gray-400 cursor-pointer"
                  onClick={() => setShowContactDropdown(!showContactDropdown)}
                />
              </div>

              {contactError && (
                <p className="text-red-500 text-xs mt-1">{contactError}</p>
              )}

              {showContactDropdown && (
                <div className="absolute z-10 mt-1 w-full max-h-32 bg-white border border-gray-200 rounded-lg shadow-lg overflow-auto">
                  {contacts
                    .filter(contact =>
                      `${contact.first_name} ${contact.last_name}`
                        .toLowerCase()
                        .includes(newMission.contact.toLowerCase())
                    )
                    .map((contact) => (
                      <div
                        key={contact.id}
                        className="px-4 py-2 bg-gray-50s hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                        onClick={() => {
                          setNewMission({
                            ...newMission,
                            contact: `${contact.first_name} ${contact.last_name}`
                          });
                          setShowContactDropdown(false);
                          setFormTouched(true);
                        }}
                      >
                        <span
                          className={`font-sm border-l-4 pl-3 ${contact.status === "REGISTERED" ? "border-green-500" : contact.status === "NOT-REGISTERED" ? "border-orange-500" : "border-red-500"}`}
                        >{contact.first_name} {contact.last_name}</span>
                      </div>
                    ))
                  }
                  {contacts.filter(contact =>
                    `${contact.first_name} ${contact.last_name}`
                      .toLowerCase()
                      .includes(newMission.contact.toLowerCase())
                  ).length === 0 && newMission.contact.length > 0 && (
                      <div
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-blue-600"
                        onClick={() => {
                          setShowContactDropdown(false);
                          setFormTouched(true);
                        }}
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
                name="start"
                value={newMission.start}
                onChange={(e) => {
                  setFormTouched(true);
                  setNewMission({ ...newMission, start: e.target.value });
                }}
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
              <div className="flex gap-1 items-center justify-start mt-3">
                {Array(5).fill(0).map((_, index) => (
                  <Star
                    key={index}
                    size={20}
                    cursor={"pointer"}
                    fill={index < newMission.satisfaction ? "#EAB308" : "none"}
                    stroke={index < newMission.satisfaction ? "#EAB308" : "#D1D5DB"}
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