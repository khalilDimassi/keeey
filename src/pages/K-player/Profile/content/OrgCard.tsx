import { Check, Pencil, Plus, X } from "lucide-react";
import DocumentsSectionProfileKplayer from "./DocumentsSectionProfileKplayer";
import { Organization } from "../types";
import { FC, useState } from "react";
import axios from "axios";
import { getAuthHeader } from "../../../../utils/jwt";

interface OrgCardProps {
    org: Organization | null;
    loading?: boolean;
    error?: string | null;
    onDataUpdate?: () => void;
}

const OrgCard: FC<OrgCardProps> = ({ org, loading = false, error = null, onDataUpdate }) => {
    if (loading) {
        return (
            <div className="bg-white shadow rounded-lg p-4 animate-pulse"
                style={{ boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)", borderRadius: "10px" }}>
                <div className="flex justify-between items-center mb-4">
                    <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
                    <div className="h-6 w-6 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                </div>
                <div className="mt-3">
                    <div className="h-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (error && error.startsWith("3:")) {
        org = null;
        return (
            <div className="bg-white shadow rounded-lg p-4 text-center"
                style={{ boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)", borderRadius: "10px" }}>
                <div className="text-red-500 mb-2">⚠️ Erreur lors du chargement des données de l'organisation.</div>
                <p className="text-sm text-gray-600">{error}</p>
            </div>
        );
    }

    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<Partial<Organization>>({
        name: org?.name || '',
        sector: org?.sector || '',
        address: org?.address || '',
        effective: org?.effective || '',
        siret: org?.siret || '',
        img: org?.img || ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleEditClick = () => {
        if (isEditing) {
            // Save changes
            handleSave();
        } else {
            // Enter edit mode
            setIsEditing(true);
            setSubmitError(null);
        }
    };

    const handleAddClick = () => {
        setIsAdding(true);
        setFormData({
            name: '',
            sector: '',
            address: '',
            effective: '',
            siret: '',
            img: ''
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {

            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/organization`,
                formData,
                {
                    headers: {
                        ...getAuthHeader(),
                    },
                }
            );

            setIsEditing(false);
            setIsAdding(false);
            if (onDataUpdate) {
                onDataUpdate();
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setSubmitError(err.response.data.message);
            } else {
                setSubmitError("Failed to save organization");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setIsAdding(false);
        setSubmitError(null);
    };


    if (!org && !isAdding) {
        console.info(">> organization: ", org);
        return (
            <div className="bg-white shadow rounded-lg p-4 text-center"
                style={{ boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)", borderRadius: "10px" }}>
                <p className="text-gray-500 mb-4">Aucune donnée d'organisation disponible.</p>
                <button
                    onClick={handleAddClick}
                    className="flex items-center justify-center gap-2 bg-[#215A96] text-white px-4 py-2 rounded-xl  mx-auto"
                >
                    <Plus size={16} /> Ajouter
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-4"
            style={{ boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)", borderRadius: "10px" }}>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Entreprise</h2>
                <div className="flex gap-2">
                    {(isEditing || isAdding) ? (
                        <>
                            <button
                                onClick={handleCancel}
                                className="text-gray-600 hover:text-red-800"
                                disabled={isSubmitting}
                            >
                                <X size={16} />
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSubmitting}
                                className="text-gray-600 hover:text-green-800 disabled:opacity-50"
                            >
                                <Check size={16} />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleEditClick}
                            className="text-[#215A96]"
                        >
                            <Pencil size={16} />
                        </button>
                    )}
                </div>
            </div>

            {submitError && (
                <div className="mb-4 text-red-500 text-sm">{submitError}</div>
            )}

            <div className="relative flex items-center gap-4">
                {(!org?.img) ? (
                    <img
                        src={org?.img}
                        alt="Entreprise"
                        className="w-16 h-16 rounded-full border border-gray-300 object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center w-16 h-16 rounded-full border border-gray-300 bg-blue-100 text-blue-600 font-semibold text-xl">
                        {(isEditing || isAdding) ? 'E' : org?.name?.charAt(0).toUpperCase() || 'E'}
                    </div>
                )}
                <div>
                    {(isEditing || isAdding) ? (
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                    ) : (
                        <p className="font-semibold">Nom: {org?.name || '-'}</p>
                    )}
                </div>
            </div>

            <div className="mt-4 space-y-2">
                {(isEditing || isAdding) ? (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Secteur</label>
                            <input
                                type="text"
                                name="sector"
                                value={formData.sector || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Adresse</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Effectif</label>
                            <input
                                type="text"
                                name="effective"
                                value={formData.effective || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">SIREN/SIRET</label>
                            <input
                                type="text"
                                name="siret"
                                value={formData.siret || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <p><strong>Secteur: </strong>{org?.sector || '-'}</p>
                        <p><strong>Adresse: </strong>{org?.address || '-'}</p>
                        <p><strong>Effectif: </strong>{org?.effective || '-'}</p>
                        <p><strong>SIREN/SIRET: </strong>{org?.siret || '-'}</p>
                    </>
                )}
            </div>

            {!isAdding && (
                <div className="mt-3">
                    <DocumentsSectionProfileKplayer />
                </div>
            )}
        </div>
    );
};

export default OrgCard;