import { useEffect, useState } from "react";
import { ArrowLeft, Bookmark, Building, MapPin, MessageCircle, User } from 'lucide-react';
import axios from "axios";
import { Opportunity } from "./types";

interface OpportunityDetailModalProps {
    opportunityId: number;
    opportunityMatch: number;
    onClose: () => void;
    is_saved: boolean;
    is_applied: boolean;
    onSaveOpportunity: (opportunityId: number, is_saved: boolean) => void;
    onSubmitOpportunity: (opportunityId: number, is_applied: boolean) => void;
}

const OpportunityDetailModal = ({ opportunityId, opportunityMatch, onClose, is_saved, is_applied, onSaveOpportunity, onSubmitOpportunity }: OpportunityDetailModalProps) => {
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


    const handleSave = (e: React.MouseEvent, id: number, is_saved: boolean) => {
        e.stopPropagation();
        onSaveOpportunity(id, !is_saved);
    };

    const handleSubmit = (e: React.MouseEvent, id: number, is_applied: boolean) => {
        e.stopPropagation();
        onSubmitOpportunity(id, !is_applied);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md">
                    <p className="text-center">Chargement des détails de l'opportunité...</p>
                </div>
            </div>
        );
    }

    if (error || !opportunity) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md">
                    <p className="text-center text-red-500">{error || "Échec du chargement des détails de l'opportunité."}</p>
                    <div className="flex justify-center mt-4">
                        <button className="px-4 py-2 bg-gray-200 rounded-md" onClick={onClose}>
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[90vh] shadow-xl relative flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-green-500 text-white text-sm px-2 py-1 rounded font-medium">{opportunityMatch}%</span>
                                <h2 className="text-xl font-semibold text-gray-900">{opportunity.title}</h2>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                    <Building className="h-4 w-4" />
                                    Société
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {opportunity.crit_location}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-2">
                            <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">Compétences</span>
                            <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full font-medium">Séniorité</span>
                            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">Dispo</span>
                            <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">Mobilité</span>
                            <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full font-medium">TJM</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm">Statut</span>
                        </div>
                        <button
                            onClick={(e) => handleSave(e, opportunityId, is_saved)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Bookmark className="h-5 w-5" fill={is_saved ? "#fbbf24" : "none"} stroke={is_saved ? "#fbbf24" : "currentColor"} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Column - Critères */}
                    <div className="w-1/2 p-6 border-r border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Critères</h3>

                        {/* Contract Type */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Contrat proposé</label>
                            <div className="flex gap-2">
                                <div className="px-4 py-2 rounded-lg text-sm font-medium">
                                    {opportunity.contract_roles}
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date de démarrage</label>
                                <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                                    <span className="text-sm text-gray-700">
                                        {opportunity.start_at ? new Date(opportunity.start_at).toLocaleDateString('fr-FR') : '25/12/2024'}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Durée initiale</label>
                                <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                                    <span className="text-sm text-gray-700">{opportunity.duration} mois</span>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                                <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                                    <span className="text-sm text-gray-700">Paris</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Télétravail</label>
                                <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                                    <span className="text-sm text-gray-700">{opportunity.crit_remote ? 'oui' : 'non'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Compétences Section */}
                        <div className="mb-6">
                            <h4 className="text-md font-semibold text-gray-900 mb-4">Compétences</h4>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Langue(s)</label>
                                <div className="flex gap-2">
                                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">Langue</span>
                                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">Langue</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Outils / Habilitations</label>
                                <div className="p-3 border border-gray-300 rounded-lg bg-white min-h-[80px]">
                                    {/* Empty input field */}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Qualité Relationnelles</label>
                                <div className="p-3 border border-gray-300 rounded-lg bg-white min-h-[80px]">
                                    {/* Empty input field */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Description */}
                    <div className="w-1/2 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Description du poste</h3>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Contexte :</label>
                            <div className="p-4 border border-gray-300 rounded-lg bg-white min-h-[120px]">
                                <div className="text-sm text-gray-500">Contexte</div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Missions :</label>
                            <div className="p-4 border border-gray-300 rounded-lg bg-white min-h-[200px]">
                                <div className="text-sm text-gray-500">Missions</div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Profil attendu :</label>
                            <div className="p-4 border border-gray-300 rounded-lg bg-white min-h-[200px]">
                                <div className="text-sm text-gray-500">Profil attendu</div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-8">
                            <button
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 text-base font-medium rounded-xl transition duration-200 flex items-center justify-center gap-2"
                                onClick={(e) => handleSubmit(e, opportunityId, is_applied)}
                            >
                                {is_applied ? 'Retirer la Postulation' : 'Postuler'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpportunityDetailModal;