import { useEffect, useState } from "react";
import { Bookmark } from 'lucide-react';
import axios from "axios";
import { Opportunity } from "./types";
import { submitToOpportunity, saveOpportunity } from "./services";

interface OpportunityDetailModalProps {
    opportunityId: number;
    opportunityMatch: number;
    onClose: () => void;
    is_saved: boolean;
    is_applied: boolean;
}

const OpportunityDetailModal = ({ opportunityId, opportunityMatch, onClose, is_saved, is_applied }: OpportunityDetailModalProps) => {
    const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadOpportunityDetails();
    }, [opportunityId]);

    const loadOpportunityDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get<Opportunity>(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${opportunityId}`
            )

            setOpportunity(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load opportunity details.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!opportunity) return;

        try {
            await submitToOpportunity(opportunity.opportunity_id);
            // Could show success message or close modal
        } catch (err) {
            console.error("Failed to submit to opportunity:", err);
            // Could show error message
        }
    };

    const handleSave = async () => {
        if (!opportunity) return;

        try {
            await saveOpportunity(opportunity.opportunity_id);
            // Could show success message
        } catch (err) {
            console.error("Failed to save opportunity:", err);
            // Could show error message
        }
    };


    // Utils 
    const formatTimeAgo = (dateString: string): string => {
        if (!dateString) return "";

        const date = new Date(dateString);
        const now = new Date();
        const diffInMilliseconds = now.getTime() - date.getTime();
        const diffInMonths = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 30));
        const diffInDays = Math.floor((diffInMilliseconds % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        const diffInHours = Math.floor((diffInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        let timeAgo = "il y a";

        if (diffInMonths > 0) {
            timeAgo += ` ${diffInMonths} mois`;
        }
        if (diffInDays > 0) {
            timeAgo += ` ${diffInDays} jours`;
        }
        if (diffInHours > 0) {
            timeAgo += ` ${diffInHours}h`;
        }

        return timeAgo.trim();
    };

    const getStatusNameInFrench = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'En attente';
            case 'ACCEPTED':
                return 'Accepté';
            case 'REJECTED':
                return 'Rejeté';
            case 'ONGOING':
                return 'En cours';
            case 'CONCLUDED':
                return 'Terminé';
            case 'OPEN':
                return 'Ouvert';
            case 'CLOSED':
                return 'Fermé';
            default:
                return 'Inconnu';
        }
    };


    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md">
                    <p className="text-center">Loading opportunity details...</p>
                </div>
            </div>
        );
    }

    if (error || !opportunity) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md">
                    <p className="text-center text-red-500">{error || "Failed to load opportunity details."}</p>
                    <div className="flex justify-center mt-4">
                        <button
                            className="px-4 py-2 bg-gray-200 rounded-md"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
            <div className="bg-white rounded-2xl w-4/5 max-w-6xl min-h-[80vh] shadow-xl relative flex overflow-hidden">
                {/* Left Section */}
                <div className="flex flex-col w-2/3 p-8">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">{opportunity.title}</h3>
                        <div className="flex gap-2">
                            <p className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {formatTimeAgo(opportunity.created_at)}
                            </p>
                            <p className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                                {opportunity.contract_role}
                            </p>
                        </div>
                    </div>

                    {/* Salary and Tags */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div className="px-4 py-2 rounded-lg bg-teal-600 text-white font-medium">
                            {opportunityMatch}%
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-green-100 text-green-800 font-medium text-sm">
                            Correspondant à votre profil
                        </div>
                        {opportunity.crit_remote && (
                            <div className="px-4 py-2 rounded-lg bg-purple-100 text-purple-800 font-medium text-sm">
                                Télétravail
                            </div>
                        )}
                    </div>

                    {/* Job Details */}
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 mb-1">Localisation</h4>
                            <p className="text-gray-800">{opportunity.crit_location || 'Non spécifié'}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 mb-1">TJM</h4>
                            <p className="text-gray-800">{opportunity.rate} €</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 mb-1">Durée (jours)</h4>
                            <p className="text-gray-800">{opportunity.duration} {opportunity.duration > 1 ? 'months' : 'month'}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 mb-1">Date de début</h4>
                            <p className="text-gray-800">{opportunity.start_at ? new Date(opportunity.start_at).toLocaleDateString() : 'Flexible'}</p>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                        <div className="text-gray-700 leading-relaxed overflow-y-auto max-h-[50vh] pr-4">
                            {opportunity.description ? (
                                <p>{opportunity.description}</p>
                            ) : (
                                <div>
                                    <p className="mb-2">
                                        C'est un {opportunity.contract_role} poste situé dans {opportunity.crit_location}
                                        {opportunity.crit_remote ? ' avec option de travail à distance' : ''}.
                                    </p>
                                    <p className="mb-2">
                                        Le TJM est {opportunity.rate}€ et la position devrait durer {opportunity.duration} mois.
                                    </p>
                                    <p>
                                        Date de début: {opportunity.start_at ? new Date(opportunity.start_at).toLocaleDateString() : 'Flexible'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Criteria */}
                    <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Informations Complémentaires</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h5 className="text-sm font-semibold text-gray-500 mb-1">TJM cible</h5>
                                <p className="text-gray-800">{opportunity.crit_target_rate}€</p>
                            </div>
                            <div>
                                <h5 className="text-sm font-semibold text-gray-500 mb-1">TJM maximum</h5>
                                <p className="text-gray-800">{opportunity.crit_max_rate}€</p>
                            </div>
                            <div>
                                <h5 className="text-sm font-semibold text-gray-500 mb-1">Status</h5>
                                <p className="text-gray-800">{getStatusNameInFrench(opportunity.status)}</p>
                            </div>
                            <div>
                                <h5 className="text-sm font-semibold text-gray-500 mb-1">Type</h5>
                                <p className="text-gray-800">{opportunity.opportunity_role === "REQUIREMENT" ? "Besoin" : "Vivier"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col w-1/3 bg-gray-50 p-8 border-l border-gray-200">
                    <div className="flex flex-col items-start">
                        {/* Avatar */}
                        <div className="flex justify-center w-full mb-8">
                            <img
                                src="https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500-300x300.jpg"
                                alt="Avatar"
                                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow-md"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col w-full gap-4">
                            <button
                                className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 text-base font-medium rounded-xl transition duration-200 w-full flex items-center justify-center gap-2"
                                onClick={handleSubmit}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Postuler
                            </button>

                            <button
                                className="border border-gray-300 hover:border-gray-400 bg-white text-gray-700 py-3 px-6 text-base font-medium rounded-xl transition duration-200 w-full flex items-center justify-center gap-2"
                                onClick={handleSave}
                            >
                                <Bookmark size={18} />
                                Sauvegarder
                            </button>
                        </div>

                        {/* Key Details Summary */}
                        <div className="mt-8 w-full">
                            <h5 className="text-md font-semibold text-gray-700 mb-4">Détails clés</h5>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Type de contrat</span>
                                    <span className="font-medium">{opportunity.contract_role}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Localisation</span>
                                    <span className="font-medium">{opportunity.crit_location}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Travail à distance</span>
                                    <span className="font-medium">{opportunity.crit_remote ? 'Oui' : 'Non'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600">TJM</span>
                                    <span className="font-medium">{opportunity.rate}€</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Date de début</span>
                                    <span className="font-medium">{opportunity.start_at ? new Date(opportunity.start_at).toLocaleDateString() : 'Flexible'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Close Button   */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-white rounded-full p-2 shadow-md transition-all duration-200 hover:shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default OpportunityDetailModal;