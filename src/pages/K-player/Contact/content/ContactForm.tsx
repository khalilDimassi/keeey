import { contact, contactRole } from "../types";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";


const ContactForm = ({ setFormActive, handleNewContact }: { setFormActive: (active: boolean) => void, handleNewContact: (role: contactRole, data: contact) => void }) => {
    const [role, setRole] = useState<contactRole>('INTERNAL-CONTACT');
    const [formTouched, setFormTouched] = useState(false);

    const toggleRole = () => {
        setRole(prevRole => prevRole === 'INTERNAL-CONTACT' ? 'EXTERNAL-CONTACT' : 'INTERNAL-CONTACT');
    };

    const closeForm = () => {
        if (!formTouched) {
            setFormActive(false)
        } else {
            if (confirm("Des modifications seront perdues. Fermer le formulaire ?")) {
                setFormActive(false)
                setFormTouched(false);
            }
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in"
            onClick={closeForm}
        >
            <div className="bg-slate-100 rounded-2xl p-6 w-full max-w-lg shadow-xl animate-slide-in-up relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 border-b-2 border-[#215A96] pb-2">
                    <h2 className="text-lg font-semibold text-gray-700 flex flex-row gap-2 items-center">
                        Ajouter un contact {role === 'INTERNAL-CONTACT' ? 'interne' : 'externe'}
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={role === 'EXTERNAL-CONTACT'}
                                onChange={toggleRole}
                                title="Toggle role"
                            />
                            <div className="relative w-7 h-4 mt-1 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600" />
                        </label>
                    </h2>
                    <button
                        className="text-gray-500 hover:text-red-700"
                        onClick={closeForm}
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
                <form
                    className="flex flex-col gap-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;

                        handleNewContact(role, {
                            id: 0,
                            gender: form.gender.value,
                            first_name: form.first_name.value,
                            last_name: form.last_name.value,
                            occupation: form.occupation.value,
                            company: form.company?.value ?? null,
                            email: form.email.value,
                            phone: form.phone.value,
                            role: role,
                            ongoing_projects: 0
                        })

                        setFormActive(false);
                        setFormTouched(false);
                    }}
                >
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

                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Fonction"
                            name="occupation"
                            className={`border rounded-xl px-3 py-2 text-sm ${role === 'EXTERNAL-CONTACT' ? 'w-1/2' : 'w-full'}`}
                            onChange={() => setFormTouched(true)}
                        />
                        {role === 'EXTERNAL-CONTACT' && (
                            <input
                                type="text"
                                placeholder="Company"
                                name="company"
                                className="w-1/2 border rounded-xl px-3 py-2 text-sm"
                                onChange={() => setFormTouched(true)}
                            />
                        )}
                    </div>
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

                    <button
                        type="submit"
                        className="bg-[#215A96] flex items-center text-white mr-auto px-4 py-1 rounded-full h-fit hover:bg-blue-900 transition-all duration-200"
                    >
                        <Plus className="w-3 h-3 mr-1" /> Ajouter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;