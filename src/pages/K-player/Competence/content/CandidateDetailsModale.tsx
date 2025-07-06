import { useEffect, useState } from "react";
import { ArrowLeft, Bookmark, Building, MailCheck, MapPin, User } from 'lucide-react';
import axios from "axios";
import { Candidate, CandidateEnhancements } from "../types";

interface CandidateDetailModalProps {
    candidateId: string;
    matchings: CandidateEnhancements | null;
    onClose: () => void;
    is_starred: boolean;
    is_validated: boolean;
    onStarCandidate: (candidateId: string) => void;
    onValidateInterest: (candidateId: string) => void;
}

const CandidateDetailModal = ({ candidateId, matchings, onClose, is_starred, is_validated, onStarCandidate, onValidateInterest }: CandidateDetailModalProps) => {
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        const loadCandidateDetails = async () => {
            try {
                const response = await axios.get<Candidate>(
                    `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/users/${candidateId}/candidate`
                )
                setCandidate(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load candidate details.');
            }
        };

        loadCandidateDetails();
        setLoading(false);
    }, [candidateId]);

    const calculateCompetenceScore = (scores: CandidateEnhancements | null): number => {
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

    const handleAction = (e: React.MouseEvent, id: string, action: string) => {
        e.stopPropagation();

        if (action === "star") {
            onStarCandidate(id);
        } else if (action === "validate") {
            onValidateInterest(id);
        } else {
            console.error("Invalid action");
        }
    };

    function formatDateRange(startDate: string, endDate: string, isPresent: boolean): string {
        const start = new Date(startDate);
        const end = isPresent ? new Date() : new Date(endDate);

        const startStr = start.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
        const endStr = isPresent ? 'Présent' : end.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });

        return `${startStr} - ${endStr}`;
    }

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md">
                    <p className="text-center">Chargement des détails de l'opportunité...</p>
                </div>
            </div>
        );
    }

    if ((error || !candidate) && !loading) {
        return (
            <div className="fixed inset-0 flex items-start justify-center pt-4 z-50">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
                    <div className="flex justify-between items-center">
                        <span>{error || "Échec du chargement des détails de l'opportunité."}</span>
                        <button
                            className="ml-4 text-red-500 font-bold"
                            onClick={onClose}
                        >
                            ×
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div onClick={onClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl w-4/6 shadow-xl relative flex flex-col overflow-y-hidden">
                {/* Header */}
                <div className="flex flex-row gap-10 justify-between items-center py-4 pr-8">
                    <div className="flex flex-row gap-2">
                        <button onClick={onClose} className="flex justify-self-start pl-2 rounded-lg transition-colors">
                            <ArrowLeft size={25} className="text-gray-600" />
                        </button>
                        <div className="w-24 h-24 bg-blue-400 rounded-full flex items-center justify-center">
                            <User className="h-16 w-16 text-blue-900" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <h2 className="  text-xl font-semibold text-gray-900">{candidate?.occupation}</h2>
                            <div className="flex flex-wrap items-center justify-start gap-4 text-sm text-gray-600 pl-3">
                                <span className="bg-blue-200 text-blue-800 text-sm px-2 py-1 rounded font-medium">
                                    {matchings?.total_match_percentage ? matchings.total_match_percentage.toFixed(2) : "0.00"}%
                                </span>
                                {candidate?.organization &&
                                    <span className="flex items-center gap-1">
                                        <Building size={15} />
                                        Société
                                    </span>
                                }
                                {candidate?.location &&
                                    <span className="flex items-center gap-1">
                                        <MapPin size={15} />
                                        {candidate?.location ? candidate?.location : "-"}
                                    </span>
                                }
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
                                onClick={(e) => handleAction(e, candidate?.user_id ?? "", "validate")}
                                className="hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <MailCheck size={30} fill={is_validated ? "#fbbf24" : "none"} stroke={is_validated ? "#fbbf24" : "currentColor"} />
                            </button>
                            <button
                                onClick={(e) => handleAction(e, candidate?.user_id ?? "", "star")}
                                className="hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Bookmark size={30} fill={is_starred ? "#fbbf24" : "none"} stroke={is_starred ? "#fbbf24" : "currentColor"} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-[#2d3875] h-[2px] mx-8" />

                {/* Content */}
                <div className="grid grid-cols-2 gap-px bg-[#2a3575] mx-1 ">
                    {/* Left Column - Critères */}
                    <div className="bg-white px-4">
                        <h1 className="text-xl font-semibold text-gray-900 my-2">Critères</h1>

                        {/* Contract Type */}
                        {candidate?.contracts &&
                            <div className="flex flex-row items-center gap-3 mb-3">
                                <label className="block text-xs font-medium text-gray-700">Contrats proposés</label>
                                {candidate?.contracts.map((item, index) => (
                                    <div key={index} className="bg-blue-200 rounded-xl text-xs font-medium px-2 py-0.5">{item}</div>
                                ))}
                            </div>
                        }
                        <div className="grid grid-cols-2 gap-4 mb-3">
                            {/* Dates */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date de démarrage</label>
                                <span className="block border border-gray-300 rounded-xl px-2 py-1 bg-gray-50 text-sm text-gray-700">
                                    {candidate?.availability ? (() => {
                                        const date = new Date(candidate.availability);
                                        if (!isNaN(date.getTime())) {
                                            return date.toLocaleDateString('fr-FR');
                                        }
                                        switch (candidate.availability) {
                                            case 'ONE_MONTH':
                                                return '1 mois';
                                            case 'THREE_MONTHS':
                                                return '3 mois';
                                            case 'IMMEDIATE':
                                                return 'Immédiat';
                                            default:
                                                return candidate.availability;
                                        }
                                    })() : 'ERROR!'}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">TJM - Salaire cible</label>
                                <span className="block px-2 py-1 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700">{candidate?.tjm} €/jr - {candidate?.salary} €/an</span>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                                <span className="block px-2 py-1 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700">{candidate?.location ?? "-"}</span>
                            </div>
                            {candidate?.remote &&
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Télétravail</label>
                                    <span className="block px-2 py-1 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700">{candidate?.remote ? "Oui" : "-"}</span>
                                </div>
                            }
                        </div>

                        {/* Compétences Section */}
                        <div className="mb-4 flex flex-col gap-4">
                            <h4 className="text-md font-semibold text-gray-900">Compétences</h4>

                            {candidate?.sectors && candidate?.sectors?.length > 0 && <>
                                <div className="flex flex-wrap items-center gap-3">
                                    <label className="block text-xs font-medium text-gray-700">Secteurs</label>
                                    {candidate?.sectors?.map((item) => (
                                        <div className="bg-blue-200 rounded-xl text-xs font-medium px-2 py-0.5">{item.sector_name}</div>
                                    ))}
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <label className="block text-xs font-medium text-gray-700">Métiers</label>
                                    {candidate?.sectors?.flatMap(sector =>
                                        sector.job_names?.map((item, index) => (
                                            <div key={`${sector.sector_name}-${index}`} className="bg-blue-200 rounded-xl text-xs font-medium px-2 py-0.5">
                                                {item}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>}
                            {candidate?.tools && candidate?.tools?.length > 0 &&
                                <div className="flex flex-wrap items-center gap-3">
                                    <label className="block text-xs font-medium text-gray-700">Soft Skills</label>
                                    {candidate?.tools?.map((item) => (
                                        <div className="bg-blue-200 rounded-xl text-xs font-medium px-2 py-0.5">{item.name}</div>
                                    ))}
                                </div>
                            }
                            {candidate?.qualities && candidate?.qualities?.length > 0 &&
                                <div className="flex flex-wrap items-center gap-3">
                                    <label className="block text-xs font-medium text-gray-700">Qualités</label>
                                    {candidate?.qualities?.map((item) => (
                                        <div className="bg-blue-200 rounded-xl text-xs font-medium px-2 py-0.5">{item.name}</div>
                                    ))}
                                </div>
                            }
                            {candidate?.languages && candidate?.languages?.length > 0 &&
                                <div className="flex flex-wrap items-center gap-3">
                                    <label className="block text-xs font-medium text-gray-700">Langues</label>
                                    {candidate?.languages?.map((item) => (
                                        <div className="bg-blue-200 rounded-xl text-xs font-medium px-2 py-0.5">{item.name}</div>
                                    ))}
                                </div>
                            }
                        </div>
                    </div>

                    {/* Right Column - Description */}
                    <div className="bg-white px-4 pb-4 overflow-y-scroll">
                        <h1 className="text-xl font-semibold text-gray-900 my-2">Dossier de Compétences</h1>

                        {candidate?.occupation && (
                            <div className="flex flex-row gap-3">
                                <span className="block text-sm font-bold text-gray-700">Titre: </span>
                                <span className="block text-sm font-medium text-gray-500">{candidate.occupation}</span>
                            </div>
                        )}

                        {candidate?.years_experience !== undefined && candidate?.years_experience !== null && (
                            <div className="flex flex-row gap-3">
                                <span className="block text-sm font-bold text-gray-700">Années d'experience:</span>
                                <span className="block text-sm font-medium text-gray-500">
                                    {candidate.years_experience} {candidate.years_experience === 1 ? 'an' : 'ans'}
                                </span>
                            </div>
                        )}

                        {candidate?.description && (
                            <div className="flex flex-row gap-3">
                                <span className="block text-sm font-bold text-gray-700">Présentation:</span>
                                <span className="block text-wrap text-sm font-medium text-gray-500">{candidate.description}</span>
                            </div>
                        )}

                        {/* Trainings Section */}
                        {candidate?.trainings && candidate?.trainings?.length > 0 && (
                            <div className="mt-2">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-1">Formations</h2>
                                <div className="space-y-4">
                                    {candidate.trainings.map((training) => (
                                        <div key={training.id} className="pl-4 border-l-2 border-blue-200">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{training.name}</h3>
                                                    <p className="text-sm text-gray-600">{training.organization} • {training.city}</p>
                                                </div>
                                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full whitespace-nowrap">
                                                    {formatDateRange(training.started_at, training.ended_at, training.present)}
                                                </span>
                                            </div>
                                            {training.description && (
                                                <p className="mt-2 text-sm text-gray-500">{training.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Experiences Section */}
                        {candidate?.experiences && candidate?.experiences?.length > 0 && (
                            <div className="mt-2">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-1">Expériences Professionnelles</h2>
                                <div className="space-y-4">
                                    {candidate.experiences.map((exp) => (
                                        <div key={exp.id} className="pl-4 border-l-2 border-blue-200">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{exp.title}</h3>
                                                    <p className="text-sm text-gray-600">{exp.employer} • {exp.city}</p>
                                                </div>
                                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full whitespace-nowrap">
                                                    {formatDateRange(exp.started_at, exp.ended_at, exp.present)}
                                                </span>
                                            </div>
                                            {exp.description && (
                                                <p className="mt-2 text-sm text-gray-500">{exp.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateDetailModal;