import { Check, PenLine, X } from "lucide-react";
import { contactFetch } from "../types";
import { updateContact } from "../services";
import { useState } from "react";


interface GeneralInformationContentProps {
    selectedContact: contactFetch
    refreshContactData: (newData: contactFetch) => void
}

const GeneralInformationContent = ({ selectedContact, refreshContactData }: GeneralInformationContentProps) => {
    const [dispolayConstact, setDispolayConstact] = useState<contactFetch>(selectedContact);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState<contactFetch>(
        { ...selectedContact }
    );

    // Placeholder functions (would be defined in your component)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => (prev ? { ...prev, [name]: value } : prev));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateContact(selectedContact.ID, formData);
            setDispolayConstact(formData);
            refreshContactData(formData);
            setEditing(false);
            // TODO: refresh contact data
        } catch (error) {
            console.error("Failed to update contact:", error);
        }
    };

    const handleCancel = () => {
        setFormData(dispolayConstact);
        setEditing(false);
    };

    return (
        <div className="p-6">
            {selectedContact ? (
                <>
                    <div className="flex justify-end gap-2">
                        {editing ? (
                            <div className="flex justify-end gap-2">
                                <Check onClick={handleSubmit}
                                    size={40}
                                    cursor="pointer"
                                    className="text-green-600 hover:text-green-800 bg-gray-50 p-2 border border-green-200 hover:shadow-md rounded-xl"
                                />

                                <X onClick={handleCancel}
                                    size={40}
                                    cursor="pointer"
                                    className="text-red-600 hover:text-red-800 bg-gray-50 p-2 border border-red-200 hover:shadow-md rounded-xl"
                                />
                            </div>
                        ) : (
                            <PenLine onClick={() => setEditing(true)}
                                size={40}
                                cursor="pointer"
                                className="text-[#297280] hover:text-[#1e5a66] bg-gray-50 p-2 border border-[#1e5a66] hover:shadow-md rounded-xl"
                            />
                        )}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-6 sm:gap-2 gap-2">
                            {editing ? (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <label>Genre</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="male"
                                                    checked={formData.gender === "male"}
                                                    onChange={handleInputChange}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                Male
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="female"
                                                    checked={formData.gender === "female"}
                                                    onChange={handleInputChange}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                Female
                                            </label>
                                        </div>
                                    </div>
                                    {[
                                        { label: "Nom", name: "last_name", value: formData.last_name },
                                        { label: "Prénom", name: "first_name", value: formData.first_name },
                                        { label: "Adresse mail", name: "email", value: formData.email, colSpan: 2 },
                                        { label: "Fonction principale / Titre", name: "occupation", value: formData.occupation },
                                        { label: "Numéro de téléphone", name: "phone", value: formData.phone || "", placeholder: "Non renseigné..." },
                                    ].map((field) => (
                                        <div
                                            key={field.name}
                                            className={`flex flex-col gap-2 ${field.colSpan ? `col-span-${field.colSpan}` : ''}`}
                                        >
                                            <label>{field.label}</label>
                                            <input
                                                name={field.name}
                                                value={field.value}
                                                placeholder={field.placeholder}
                                                onChange={handleInputChange}
                                                className="px-4 py-2 rounded-xl w-full h-fit border border-black"
                                            />
                                        </div>
                                    ))}

                                    <div className="col-span-3 flex flex-col gap-2">
                                        <label>Observation</label>
                                        <textarea
                                            name="note"
                                            value={formData.note || ""}
                                            placeholder="Non renseigné..."
                                            onChange={handleInputChange}
                                            className="px-4 py-2 rounded-xl w-full min-h-32 border border-black text-justify"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <label>Genre</label>
                                        <span className="px-4 py-2 rounded-xl w-full h-fit bg-gray-100 text-gray-800 ">{dispolayConstact.gender}</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label>Nom</label>
                                        <span className="px-4 py-2 rounded-xl w-full h-fit bg-gray-100 text-gray-800 ">{dispolayConstact.last_name}</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label>Prénom</label>
                                        <span className="px-4 py-2 rounded-xl w-full h-fit bg-gray-100 text-gray-800 ">{dispolayConstact.first_name}</span>
                                    </div>
                                    <div className="col-span-2 flex flex-col gap-2">
                                        <label>Adresse mail</label>
                                        <span className="px-4 py-2 rounded-xl w-full h-fit bg-gray-100 text-gray-800 ">{dispolayConstact.email}</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label>Fonction principale / Titre</label>
                                        <span className="px-4 py-2 rounded-xl w-full h-fit bg-gray-100 text-gray-800 ">{dispolayConstact.occupation}</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label>Numéro de téléphone</label>
                                        <span className="px-4 py-2 rounded-xl w-full h-fit bg-gray-100 text-gray-800 ">{dispolayConstact.phone || "Non renseigné..."}</span>
                                    </div>
                                    <div className="col-span-3 flex flex-col gap-2">
                                        <label>Observation</label>
                                        <span className="px-4 py-2 rounded-xl w-full min-h-32 bg-gray-100 text-gray-800 text-justify">{dispolayConstact.note || "Non renseigné..."}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </form>
                </>
            ) : (
                <p>No contact selected</p>
            )}
        </div>
    );
};

export default GeneralInformationContent