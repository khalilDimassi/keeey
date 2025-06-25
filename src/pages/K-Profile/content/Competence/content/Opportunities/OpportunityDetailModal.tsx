import { useEffect, useState } from "react";
import { ArrowLeft, Bookmark, Building, MailCheck, MapPin, User } from 'lucide-react';
import axios from "axios";
import { MatchPercentages, Opportunity } from "./types";

interface OpportunityDetailModalProps {
    opportunityId: number;
    matchings: MatchPercentages | null;
    onClose: () => void;
    is_saved: boolean;
    is_applied: boolean;
    onSaveOpportunity: (opportunityId: number, is_saved: boolean) => void;
    onSubmitOpportunity: (opportunityId: number, is_applied: boolean) => void;
}

const OpportunityDetailModal = ({ opportunityId, matchings, onClose, is_saved, is_applied, onSaveOpportunity, onSubmitOpportunity }: OpportunityDetailModalProps) => {
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

    const calculateCompetenceScore = (scores: MatchPercentages | null): number => {
        if (!scores) return 0;
        return (
            (scores.jobs_match_percentage * 0.75) +
            (scores.languages_match_percentage * 0.125) +
            (scores.qualities_match_percentage * 0.025) +
            (scores.tools_match_percentage * 0.075) +
            (scores.authorizations_match_percentage * 0.025)
        );
    };

    const getTagColorClass = (score: number) => {
        if (score >= 90) return 'bg-green-100 text-green-700';
        if (score >= 80) return 'bg-teal-100 text-teal-700';
        if (score >= 70) return 'bg-blue-100 text-blue-700';
        if (score >= 60) return 'bg-indigo-100 text-indigo-700';
        if (score >= 50) return 'bg-purple-100 text-purple-700';
        if (score >= 40) return 'bg-yellow-100 text-yellow-700';
        if (score >= 30) return 'bg-amber-100 text-amber-700';
        if (score >= 20) return 'bg-orange-100 text-orange-700';
        if (score >= 10) return 'bg-red-100 text-red-700';
        return 'bg-gray-100 text-gray-700';
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
        <div onClick={onClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
            <div className="bg-white rounded-xl w-4/6 aspect-[4/3] shadow-xl relative flex flex-col overflow-y-hidden">
                {/* Header */}
                <div className="flex flex-row gap-10 justify-between items-center py-4 pr-8">
                    <div className="flex flex-row gap-2">
                        <button onClick={onClose} className="flex justify-self-start pl-2 rounded-lg transition-colors">
                            <ArrowLeft size={25} className="text-gray-600" />
                        </button>
                        <div className="w-24 h-24 bg-green-400 rounded-full flex items-center justify-center">
                            <User className="h-16 w-16 text-green-900" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <h2 className="  text-xl font-semibold text-gray-900">{opportunity.title}</h2>
                            <div className="flex items-center justify-start gap-4 text-sm text-gray-600 pl-3">
                                <span className="bg-[#9FC5C8] text-[#297280] text-sm px-2 py-1 rounded font-medium">
                                    {matchings?.total_match_percentage ? matchings.total_match_percentage : 0}%
                                </span>
                                <span className="flex items-center gap-1">
                                    <Building size={15} />
                                    Société
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin size={15} />
                                    {opportunity.crit_location ? opportunity.crit_location : "-"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        {(() => {
                            const competenceScore = calculateCompetenceScore(matchings ?? null);
                            return (
                                <div className="flex gap-2 w-full">
                                    {/* Competences */}
                                    <div className="relative group">
                                        <span className={`px-3 py-1 rounded-full font-medium text-sm ${getTagColorClass(competenceScore)}`}>
                                            Compétences
                                        </span>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-full p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                                            <p>Score: {Math.round(competenceScore)}%</p>
                                            <hr className="my-1" />
                                            <p>Emplois: {Math.round(matchings?.jobs_match_percentage ?? 0)}%</p>
                                            <p>Langues: {Math.round(matchings?.languages_match_percentage ?? 0)}%</p>
                                            <p>Outils: {Math.round(matchings?.tools_match_percentage ?? 0)}%</p>
                                            <p>Qualités: {Math.round(matchings?.qualities_match_percentage ?? 0)}%</p>
                                            <p>Autorisations: {Math.round(matchings?.authorizations_match_percentage ?? 0)}%</p>
                                        </div>
                                    </div>

                                    {/* Seniority */}
                                    <div className="relative group">
                                        <span className={`px-3 py-1 rounded-full font-medium text-sm ${getTagColorClass(matchings?.seniority_match_percentage ?? 0)}`}>
                                            Séniorité
                                        </span>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 w-full bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                                            Score: {Math.round(matchings?.seniority_match_percentage ?? 0)}%
                                        </div>
                                    </div>

                                    {/* Availability */}
                                    <div className="relative group">
                                        <span className={`px-3 py-1 rounded-full font-medium text-sm ${getTagColorClass(matchings?.availability_match_percentage ?? 0)}`}>
                                            Dispo
                                        </span>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 w-full bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                                            Score: {Math.round(matchings?.availability_match_percentage ?? 0)}%
                                        </div>
                                    </div>

                                    {/* Mobility */}
                                    <div className="relative group">
                                        <span className={`px-3 py-1 rounded-full font-medium text-sm ${getTagColorClass(matchings?.mobility_match_percentage ?? 0)}`}>
                                            Mobilité
                                        </span>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 w-full bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                                            Score: {Math.round(matchings?.mobility_match_percentage ?? 0)}%
                                        </div>
                                    </div>

                                    {/* TJM (Rate) */}
                                    <div className="relative group">
                                        <span className={`px-3 py-1 rounded-full font-medium text-sm ${getTagColorClass(matchings?.rate_match_percentage ?? 0)}`}>
                                            TJM
                                        </span>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 w-full bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                                            Score: {Math.round(matchings?.rate_match_percentage ?? 0)}%
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                        <div className="flex flex-row items-center justify-end gap-6 w-full">
                            <select
                                className="px-3 py-2 w-1/3 mr-5 border border-gray-300 rounded-xl hover:bg-gray-50"
                                name={"Default"}
                            >
                                <option value={"Saved"}>Saved</option>
                                <option value={"Applied"}>Applied</option>
                            </select>
                            <button
                                onClick={(e) => handleSubmit(e, opportunityId, is_applied)}
                                className="hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <MailCheck size={30} fill={is_applied ? "#fbbf24" : "none"} stroke={is_applied ? "#fbbf24" : "currentColor"} />
                            </button>
                            <button
                                onClick={(e) => handleSave(e, opportunityId, is_saved)}
                                className="hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Bookmark size={30} fill={is_saved ? "#fbbf24" : "none"} stroke={is_saved ? "#fbbf24" : "currentColor"} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-[#30797F] h-[2px] mx-8" />

                {/* Content */}
                {(() => {
                    // Check if all description fields are null/empty
                    const hasContext = opportunity.context && opportunity.context.trim() !== '';
                    const hasMissions = opportunity.mission && opportunity.mission.trim() !== '';
                    const hasCandidateProfile = opportunity.candidate_profile && opportunity.candidate_profile.trim() !== '';
                    const hasDescription = hasContext || hasMissions || hasCandidateProfile;

                    if (!hasDescription) {
                        // Collapsed view - only show criteria with more space
                        return (
                            <div className="bg-white mx-1 overflow-y-scroll px-6">
                                <h3 className="text-lg font-semibold text-gray-900 my-4">Critères</h3>

                                {/* Contract Type */}
                                {opportunity.contract_roles &&
                                    <div className="flex flex-row items-center gap-3 mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Contrats proposés</label>
                                        {opportunity.contract_roles.map((item, index) => (
                                            <div key={index} className="bg-gray-300 rounded-xl text-sm font-medium px-2 py-1">{item}</div>
                                        ))}
                                    </div>
                                }

                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    {/* Dates */}
                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-3">Date de démarrage</label>
                                        <span className="block border border-gray-300 rounded-xl px-3 py-2 bg-gray-50 text-base text-gray-700">
                                            {opportunity.start_at ? new Date(opportunity.start_at).toLocaleDateString('fr-FR') : '25/12/2024'}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-3">Durée initiale</label>
                                        <span className="block px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 text-base text-gray-700">{opportunity.duration} mois</span>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-3">Localisation</label>
                                        <span className="block px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 text-base text-gray-700">{opportunity.crit_location ? opportunity.crit_location : "-"}</span>
                                    </div>
                                    <div>
                                        <label className="block text-base font-medium text-gray-700 mb-3">Télétravail</label>
                                        <span className="block px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 text-base text-gray-700">{opportunity.crit_remote ? 'oui' : 'non'}</span>
                                    </div>
                                </div>

                                {/* Compétences Section */}
                                <div className="mb-6 flex flex-col gap-6">
                                    <h4 className="text-lg font-semibold text-gray-900">Compétences</h4>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <label className="block text-sm font-medium text-gray-700">Secteurs</label>
                                        {/* TODO: Add sectors api */}
                                        {/* {opportunity.sectors?.map((item) => (
                                    <div className="bg-gray-300 rounded-xl text-sm font-medium px-2 py-1">{item}</div>
                                ))} */}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <label className="block text-sm font-medium text-gray-700">Métiers</label>
                                        {/* TODO: Add jobs api */}
                                        {/* {opportunity.jobs?.map((item) => (
                                    <div className="bg-gray-300 rounded-xl text-sm font-medium px-2 py-1">{item}</div>
                                ))} */}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <label className="block text-sm font-medium text-gray-700">Langues</label>
                                        {/* TODO: Add languages api */}
                                        {/* {opportunity.languages?.map((item) => (
                                    <div className="bg-gray-300 rounded-xl text-sm font-medium px-2 py-1">{item}</div>
                                ))} */}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <label className="block text-sm font-medium text-gray-700">Outils</label>
                                        {/* TODO: Add tools api */}
                                        {/* {opportunity.tools?.map((item) => (
                                    <div className="bg-gray-300 rounded-xl text-sm font-medium px-2 py-1">{item}</div>
                                ))} */}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <label className="block text-sm font-medium text-gray-700">Qualités</label>
                                        {/* TODO: Add qualities api */}
                                        {/* {opportunity.qualities?.map((item) => (
                                    <div className="bg-gray-300 rounded-xl text-sm font-medium px-2 py-1">{item}</div>
                                ))} */}
                                    </div>
                                </div>
                            </div>
                        );
                    } else {
                        // Original two-column layout
                        return (
                            <div className="grid grid-cols-2 gap-px bg-[#30797F] mx-1 overflow-y-scroll">
                                {/* Left Column - Critères */}
                                <div className="bg-white px-4">
                                    <h3 className="text-sm font-semibold text-gray-900 my-2">Critères</h3>

                                    {/* Contract Type */}
                                    {opportunity.contract_roles &&
                                        <div className="flex flex-row items-center gap-3 mb-3">
                                            <label className="block text-xs font-medium text-gray-700">Contrats proposés</label>
                                            {opportunity.contract_roles.map((item, index) => (
                                                <div key={index} className="bg-gray-300 rounded-xl text-xs font-medium px-1 py-0.5">{item}</div>
                                            ))}
                                        </div>
                                    }

                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                        {/* Dates */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Date de démarrage</label>
                                            <span className="block border border-gray-300 rounded-xl px-2 py-1 bg-gray-50 text-sm text-gray-700">
                                                {opportunity.start_at ? new Date(opportunity.start_at).toLocaleDateString('fr-FR') : '25/12/2024'}
                                            </span>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Durée initiale</label>
                                            <span className="block px-2 py-1 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700">{opportunity.duration} mois</span>
                                        </div>

                                        {/* Location */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                                            <span className="block px-2 py-1 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700">{opportunity.crit_location ? opportunity.crit_location : "-"}</span>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Télétravail</label>
                                            <span className="block px-2 py-1 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700">{opportunity.crit_remote ? 'oui' : 'non'}</span>
                                        </div>
                                    </div>

                                    {/* Compétences Section */}
                                    <div className="mb-4 flex flex-col gap-4">
                                        <h4 className="text-md font-semibold text-gray-900">Compétences</h4>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <label className="block text-xs font-medium text-gray-700">Secteurs</label>
                                            {/* TODO: Add sectors api */}
                                            {/* {opportunity.sectors?.map((item) => (
                                        <div className="bg-gray-300 rounded-xl text-xs font-medium">{item}</div>
                                    ))} */}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <label className="block text-xs font-medium text-gray-700">Métiers</label>
                                            {/* TODO: Add jobs api */}
                                            {/* {opportunity.jobs?.map((item) => (
                                        <div className="bg-gray-300 rounded-xl text-xs font-medium">{item}</div>
                                    ))} */}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <label className="block text-xs font-medium text-gray-700">Langues</label>
                                            {/* TODO: Add languages api */}
                                            {/* {opportunity.languages?.map((item) => (
                                        <div className="bg-gray-300 rounded-xl text-xs font-medium">{item}</div>
                                    ))} */}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <label className="block text-xs font-medium text-gray-700">Outils</label>
                                            {/* TODO: Add tools api */}
                                            {/* {opportunity.tools?.map((item) => (
                                        <div className="bg-gray-300 rounded-xl text-xs font-medium">{item}</div>
                                    ))} */}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <label className="block text-xs font-medium text-gray-700">Qualités</label>
                                            {/* TODO: Add qualities api */}
                                            {/* {opportunity.qualities?.map((item) => (
                                        <div className="bg-gray-300 rounded-xl text-xs font-medium">{item}</div>
                                    ))} */}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Description */}
                                <div className="bg-white px-4">
                                    <h3 className="text-sm font-semibold text-gray-900 my-2">Description du poste</h3>

                                    {hasContext && (
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Contexte :</label>
                                            <div className="p-2 border border-gray-300 bg-gray-200 rounded-xl min-h-7">
                                                {/* <div className="text-sm text-black">{opportunity.context}</div> */}
                                                <div className="text-sm text-black">-</div>
                                            </div>
                                        </div>
                                    )}

                                    {hasMissions && (
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Missions :</label>
                                            <div className="p-2 border border-gray-300 bg-gray-200 rounded-xl min-h-7">
                                                {/* <div className="text-sm text-black">{opportunity.missions}</div> */}
                                                <div className="text-sm text-black">-</div>
                                            </div>
                                        </div>
                                    )}

                                    {hasCandidateProfile && (
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Profil attendu :</label>
                                            <div className="p-2 border border-gray-300 bg-gray-200 rounded-xl min-h-7">
                                                {/* <div className="text-sm text-black">{opportunity.candidate_profile}</div> */}
                                                <div className="text-sm text-black">-</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    }
                })()}
            </div>
        </div>
    );
};

export default OpportunityDetailModal;