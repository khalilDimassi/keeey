import { createContact, loadContacts, deleteContact } from "./services";
import { ArrowLeft, Contact, Plus, Trash2, } from "lucide-react";
import { useEffect, useState } from "react";
import { contactFetch } from "./types";

import ContactsReferencesContent from "./content/ContactsReferencesContent";
import CoOptationPatronageContent from "./content/CoOptationPatronageContent";
import GeneralInformationContent from "./content/GeneralInformationContent";
import ContactMissions from "./content/ContactMissions";

const ContactsKProfile = () => {
  const [activeTab, setActiveTab] = useState('referrals');
  const [contacts, setContacts] = useState<contactFetch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [displayedContacts, setDisplayedContacts] = useState<contactFetch[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [selectedContact, setSelectedContact] = useState<contactFetch | null>(null);
  const [activeDetailsTab, setActiveDetailsTab] = useState('informations');
  const [occupationType, setOccupationType] = useState('');


  useEffect(() => {
    const fetchContacts = async () => {
      setError(null);
      setLoading(true);
      const [data, error] = await loadContacts();
      if (error) {
        setError(error);
      } else if (data) {
        setContacts(data);
      }
      setLoading(false);
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    // Handle smooth transition between states
    if (loading || error) {
      setIsTransitioning(true);
      setDisplayedContacts([]);

      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 250);

      return () => clearTimeout(timer);
    } else if (contacts.length > 0) {
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setDisplayedContacts(contacts);
        setIsTransitioning(false);
      }, 250);

      return () => clearTimeout(timer);
    } else {
      setDisplayedContacts([]);
      setIsTransitioning(false);
    }
  }, [loading, error, contacts]);

  const handleNewContact = () => {
    setShowForm(true);
  };

  const handleContactDelete = async (contactID: number) => {
    try {
      const isConfirmed = window.confirm("Are you sure you want to delete this contact?");
      if (!isConfirmed) {
        return;
      }

      await deleteContact(contactID);
      const updatedContacts = contacts.filter((contact) => contact.ID !== contactID);
      setContacts(updatedContacts);

      alert("Contact deleted successfully!");
    } catch (error) {
      console.error("Failed to delete contact:", error);
      alert("Failed to delete contact. Please try again.");
    }
  };

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

  return (
    selectedContact ? (
      <>
        <div className="min-h-screen w-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3 ">
              <ArrowLeft size={38} color="#297280" onClick={() => setSelectedContact(null)} cursor={"pointer"} />
              <h1 className="text-xl font-semibold">Détails du consultant</h1>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex relative w-full pr-4 pt-4 rounded-xl ">
            {/* Contacts/References Tab */}
            <button
              onClick={() => setActiveDetailsTab('informations')}
              className={`px-6 py-3 font-medium text-sm rounded-tl-xl rounded-tr-xl relative ${activeDetailsTab === 'informations'
                ? 'text-black bg-white shadow-[0_0_8px_0_rgba(0,0,0,0.1)] z-10'
                : 'text-gray-700 bg-slate-100 hover:bg-gray-300'
                }`}
            >
              Informations Générales
            </button>

            {/* Co-optation/Patronage Tab */}
            {selectedContact.role === "SPONSOR" && <button
              onClick={() => setActiveDetailsTab('missions')}
              className={`px-6 py-3 font-medium text-sm rounded-tl-xl rounded-tr-xl relative -ml-1 ${activeDetailsTab === 'missions'
                ? 'text-black bg-white shadow-[0_0_8px_0_rgba(0,0,0,0.1)] z-10'
                : 'text-gray-700 bg-slate-100 hover:bg-gray-300'
                }`}
            >
              Ses Missions
            </button>}
          </div>

          <div className={`overflow-x-auto rounded-b-xl rounded-r-xl bg-white shadow-lg ${activeDetailsTab === 'missions' ? 'rounded-l-xl' : ''}`}>
            <div className="min-w-full">
              {activeDetailsTab === 'informations' ? (
                <GeneralInformationContent
                  selectedContact={selectedContact}
                  refreshContactData={(newContact) => {
                    setSelectedContact(newContact);
                    setContacts(contacts.map(contact => contact.ID === newContact.ID ? newContact : contact));
                  }}
                />
              ) : activeDetailsTab === 'missions' ? (
                <ContactMissions />
              ) : null}
            </div>
          </div>

        </div>
      </>
    ) : (
      <>
        <div className="min-h-screen w-full flex flex-col">
          <div className="flex items-center space-x-3 my-4">
            <Contact
              className={`w-8 h-8 md:w-4 md:h-4 lg:w-8 lg:h-8 transition-all duration-500 `}
              color="#297280"
            />
            <h1 className="text-xl font-semibold text-black">
              Contacts
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex relative w-full pr-4 pt-4 rounded-xl ">
            {/* Contacts/References Tab */}
            <button
              onClick={() => setActiveTab('referrals')}
              className={`px-6 py-3 font-medium text-sm rounded-tl-xl rounded-tr-xl relative ${activeTab === 'referrals'
                ? 'text-black bg-white shadow-[0_0_8px_0_rgba(0,0,0,0.1)] z-10'
                : 'text-gray-700 bg-slate-100 hover:bg-gray-300'
                }`}
            >
              Contacts/References
            </button>

            {/* Co-optation/Patronage Tab */}
            <button
              onClick={() => setActiveTab('cooptation')}
              className={`px-6 py-3 font-medium text-sm rounded-tl-xl rounded-tr-xl relative -ml-1 ${activeTab === 'cooptation'
                ? 'text-black bg-white shadow-[0_0_8px_0_rgba(0,0,0,0.1)] z-10'
                : 'text-gray-700 bg-slate-100 hover:bg-gray-300'
                }`}
            >
              Cooptation/Parrainage
            </button>


            <button
              className="ml-auto h-fit flex self-center items-center bg-[#297280] text-white text-sm px-5 py-1.5 rounded-full shadow-md hover:bg-teal-900"
              onClick={handleNewContact}
            >
              <Plus className="w-3 h-3 mr-1" /> Ajouter un {activeTab === 'cooptation' ? 'parrain' : 'contact'}
            </button>
          </div>

          {/* Tab Content */}
          <div className={`overflow-x-auto rounded-b-xl rounded-r-xl bg-white shadow-lg ${activeTab === 'cooptation' ? 'rounded-l-xl' : ''}`}>
            <div className="min-w-full">
              {activeTab === 'referrals' ? (
                <ContactsReferencesContent
                  key={activeTab}
                  displayedContacts={displayedContacts.some(contact => contact.role === 'REFERRAL') ? displayedContacts.filter(contact => contact.role === 'REFERRAL') : displayedContacts}
                  isTransitioning={isTransitioning}
                  loading={loading}
                  error={error}
                  onReload={() => {
                    setError(null);
                    loadContacts()
                  }}
                  handleContactDetails={setSelectedContact}
                  handleContactDelete={handleContactDelete}
                />
              ) : activeTab === 'cooptation' ? (
                <CoOptationPatronageContent
                  key={activeTab}
                  displayedContacts={displayedContacts.some(contact => contact.role === 'SPONSOR') ? displayedContacts.filter(contact => contact.role === 'SPONSOR') : displayedContacts}
                  isTransitioning={isTransitioning}
                  loading={loading}
                  error={error}
                  onReload={() => {
                    setError(null);
                    loadContacts()
                  }}
                  handleContactDetails={setSelectedContact}
                  handleContactDelete={handleContactDelete}
                />
              ) : null}
            </div>
          </div>
        </div>

        {showForm && activeTab === 'referrals' ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in"
            onClick={closeForm}
          >
            <div
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl animate-slide-in-up relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4 border-b-2 border-[#297280] pb-2">
                <h2 className="text-lg font-semibold text-gray-700">Ajouter un contact</h2>
                <button onClick={closeForm} className="text-gray-500 hover:text-red-700">
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  createContact("REFERRAL", {
                    gender: form.gender.value,
                    first_name: form.first_name.value,
                    last_name: form.last_name.value,
                    email: form.email.value,
                    company: form.company.value,
                    occupation: form.occupation.value,
                    phone: form.phone?.value || "",
                    notes: form.notes?.value || "",
                    request_reference: form.request_reference.checked
                  });

                  setShowForm(false);
                  setFormTouched(false);
                }}
                className="space-y-4"
              >

                {/* Gender */}
                <div className="flex items-center gap-6 pl-0.5">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="gender" value="male" onChange={() => setFormTouched(true)} />
                    <span className="text-sm">M.</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="gender" value="female" onChange={() => setFormTouched(true)} />
                    <span className="text-sm">Mme</span>
                  </label>
                </div>

                {/* Names */}
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Nom"
                    name="last_name"
                    className="w-1/2 border rounded-xl px-3 py-2 text-sm"
                    onChange={() => setFormTouched(true)}
                  />
                  <input
                    type="text"
                    placeholder="Prénom"
                    name="first_name"
                    className="w-1/2 border rounded-xl px-3 py-2 text-sm"
                    onChange={() => setFormTouched(true)}
                  />
                </div>

                {/* Company & Occupation */}
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Société"
                    name="company"
                    className="w-1/2 border rounded-xl px-3 py-2 text-sm"
                    onChange={() => setFormTouched(true)}
                  />
                  <input
                    type="text"
                    placeholder="Fonction"
                    name="occupation"
                    className="w-1/2 border rounded-xl px-3 py-2 text-sm"
                    onChange={() => setFormTouched(true)}
                  />
                </div>

                {/* Email & Phone */}
                <div className="flex gap-4">
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    className="w-1/2 border rounded-xl px-3 py-2 text-sm"
                    onChange={() => setFormTouched(true)}
                  />
                  <input
                    type="tel"
                    placeholder="Téléphone (optionnel)"
                    name="phone"
                    className="w-1/2 border rounded-xl px-3 py-2 text-sm"
                    onChange={() => setFormTouched(true)}
                  />
                </div>

                {/* Notes */}
                <textarea
                  placeholder="Observations..."
                  rows={4}
                  name="notes"
                  className="w-full border rounded-xl px-3 py-2 text-sm resize-none"
                  onChange={() => setFormTouched(true)}
                />

                {/* Submit Button */}
                <div className="flex justify-between items-center px-4">
                  {/* Checkbox */}
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="request_reference"
                      className="accent-[#297280]"
                      onChange={() => setFormTouched(true)}
                    />
                    Demander une référence
                  </label>
                  <button
                    type="submit"
                    className="bg-[#297280] flex items-center text-white px-4 py-1 rounded-full h-fit hover:bg-teal-900 transition-all duration-200"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Ajouter
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : showForm && activeTab === 'cooptation' ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in"
            onClick={closeForm}
          >
            <div
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl animate-slide-in-up relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4 border-b-2 border-[#297280] pb-2">
                <h2 className="text-lg font-semibold text-gray-700">Ajouter une cooptation</h2>
                <button onClick={closeForm} className="text-gray-500 hover:text-red-700">
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;

                  const occupationValue =
                    form.occupationType.value === 'employee'
                      ? form.occupationDetails.value
                      : form.occupationType.value;

                  createContact("SPONSOR", {
                    gender: form.gender.value,
                    first_name: form.first_name.value,
                    last_name: form.last_name.value,
                    email: form.email.value,
                    company: form.company.value,
                    occupation: occupationValue,
                    phone: form.phone?.value || "",
                    notes: form.notes?.value || "",
                    request_reference: form.request_reference.checked
                  });

                  setShowForm(false);
                  setFormTouched(false);
                }}
                className="space-y-4"
              >

                {/* Gender */}
                <div className="flex items-center gap-6 pl-0.5">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="gender" value="male" onChange={() => setFormTouched(true)} />
                    <span className="text-sm">M.</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="gender" value="female" onChange={() => setFormTouched(true)} />
                    <span className="text-sm">Mme</span>
                  </label>
                </div>

                {/* Names */}
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Nom"
                    name="last_name"
                    className="w-1/2 border rounded-xl px-3 py-2 text-sm"
                    onChange={() => setFormTouched(true)}
                  />
                  <input
                    type="text"
                    placeholder="Prénom"
                    name="first_name"
                    className="w-1/2 border rounded-xl px-3 py-2 text-sm"
                    onChange={() => setFormTouched(true)}
                  />
                </div>

                {/* Company & Occupation */}
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <select
                      name="occupationType"
                      className="w-full border rounded-xl px-3 py-2 text-sm"
                      onChange={(e) => {
                        setFormTouched(true);
                        setOccupationType(e.target.value);
                      }}
                    >
                      <option value="">Sélectionner une profession...</option>
                      <option value="freelancer">Indépendant</option>
                      <option value="employee">Employé</option>
                      <option value="businessOwner">Propriétaire d'entreprise</option>
                    </select>
                  </div>

                  <div className="w-1/2">
                    <input
                      type="text"
                      placeholder={(occupationType === 'freelancer' || occupationType === '') ? 'Non applicable' : "Nom de l'entreprise"}
                      name="company"
                      className={`w-full border rounded-xl px-3 py-2 text-sm transition-all ${(occupationType === 'freelancer' || occupationType === '')
                        ? 'bg-gray-100 cursor-not-allowed opacity-70'
                        : 'bg-white'
                        }`}
                      disabled={(occupationType === 'freelancer' || occupationType === '')}
                      onChange={() => setFormTouched(true)}
                    />
                  </div>
                </div>

                {/* Occupation details field - only shown if not freelancer */}
                {occupationType && occupationType === 'employee' && (
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Votre titre de poste"
                      name="occupationDetails"
                      className="w-full border rounded-xl px-3 py-2 text-sm"
                      onChange={() => setFormTouched(true)}
                    />
                  </div>
                )}

                {/* Email & Phone */}
                <div className="flex gap-4">
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    className="w-1/2 border rounded-xl px-3 py-2 text-sm"
                    onChange={() => setFormTouched(true)}
                  />
                  <input
                    type="tel"
                    placeholder="Téléphone (optionnel)"
                    name="phone"
                    className="w-1/2 border rounded-xl px-3 py-2 text-sm"
                    onChange={() => setFormTouched(true)}
                  />
                </div>

                {/* Notes */}
                <textarea
                  placeholder="Observations..."
                  rows={4}
                  name="notes"
                  className="w-full border rounded-xl px-3 py-2 text-sm resize-none"
                  onChange={() => setFormTouched(true)}
                />

                {/* Submit Button */}
                <div className="flex justify-between items-center px-4">
                  <button
                    type="submit"
                    className="bg-[#297280] flex items-center text-white px-4 py-1 rounded-full h-fit hover:bg-teal-900 transition-all duration-200"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Ajouter
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null
        }
      </>
    )
  );
};

export default ContactsKProfile; 