import { useEffect, useState } from "react";
import { ArrowLeft, Building, MailCheck, MapPin, User, Loader2, AlertCircle, StarOff, Star, Briefcase } from 'lucide-react';
import axios from "axios";
import { Candidate, CandidateEnhancements, CandidateSector } from "../types";



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
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        // Trigger entrance animation
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => { loadCandidateDetails(); }, [candidateId]);

    const loadCandidateDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<Candidate>(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/users/${candidateId}/candidate`
            )
            const candidate = response.data;

            const sumExperience = calculateSumExperience(candidate.sectors);
            const maxExperience = calculateMaxExperience(candidate.sectors);

            setCandidate({
                ...candidate,
                calculatedExperience: {
                    sum: sumExperience,
                    max: maxExperience
                }
            });
        } catch (err) {
            console.error(err);
            setError('Failed to load candidate details.');
        } finally {
            setLoading(false);
        }
    };


    const calculateSumExperience = (sectors: CandidateSector[]): number => {
        if (!sectors || sectors.length === 0) return 0;
        return sectors.reduce((total, sector) => total + sector.seniority, 0);
    };

    const calculateMaxExperience = (sectors: CandidateSector[]): number => {
        if (!sectors || sectors.length === 0) return 0;
        return Math.max(...sectors.map(sector => sector.seniority));
    };

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

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300); // Wait for exit animation
    };

    function formatDateRange(startDate: string, endDate: string, isPresent: boolean): string {
        const start = new Date(startDate);
        const end = isPresent ? new Date() : new Date(endDate);

        const startStr = start.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
        const endStr = isPresent ? 'Présent' : end.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });

        return `${startStr} - ${endStr}`;
    }

    // Loading State
    const LoadingContent = () => (
        <div className={`transform transition-all duration-300 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}>
            <div className="bg-white rounded-xl w-full max-w-2xl mx-auto shadow-xl p-8 flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600 text-lg font-medium">Chargement des détails de l'opportunité...</p>
                <div className="mt-4 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
            </div>
        </div>
    );

    // Error State
    const ErrorContent = () => (
        <div className={`transform transition-all duration-300 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}>
            <div className="bg-white rounded-xl w-full max-w-2xl mx-auto shadow-xl p-8 flex flex-col items-center justify-center min-h-[300px]">
                <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
                <p className="text-gray-600 text-center mb-6">
                    {error || "Échec du chargement des détails de l'opportunité."}
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Fermer
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        </div>
    );

    // Main Content
    const MainContent = () => (
        <div className={`transform transition-all duration-500 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}>
            <div className="bg-white rounded-xl shadow-xl relative flex flex-col overflow-y-hidden">
                {/* Header */}
                <div className="flex flex-row gap-10 justify-between items-center py-4 pr-8 animate-fade-in">
                    <div className="flex flex-row gap-2">
                        <button onClick={handleClose} className="flex justify-self-start pl-2 rounded-lg transition-colors hover:bg-gray-100">
                            <ArrowLeft size={25} className="text-gray-600" />
                        </button>
                        <div className="w-24 h-24 bg-blue-400 rounded-full flex items-center justify-center transform transition-transform hover:scale-105">
                            <User className="h-16 w-16 text-blue-900" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <span className="bg-blue-200 text-blue-800 text-sm px-2 py-1 rounded font-medium animate-bounce-in">
                                    {matchings?.total_match_percentage ? matchings.total_match_percentage.toFixed(2) : "0.00"}%
                                </span>
                                <h2 className="text-xl font-semibold text-gray-900">{candidate?.first_name} {candidate?.last_name}</h2>
                            </div>
                            <div className="flex flex-wrap items-center justify-start gap-4 text-sm text-gray-600 pl-3">
                                {candidate?.location && <span className="flex items-center gap-1 animate-slide-in-right">
                                    <MapPin size={15} />
                                    {candidate?.location ? candidate?.location : "-"}
                                </span>}
                                {candidate?.organization && <span className="flex items-center gap-1 animate-slide-in-left">
                                    <Building size={15} />
                                    {candidate?.organization ? candidate?.organization : "-"}
                                </span>}
                                {candidate?.occupation && <span className="flex items-center gap-1 animate-slide-in-left">
                                    <Briefcase size={15} />
                                    {candidate?.occupation ? candidate?.occupation : "-"}
                                </span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        {(() => {
                            const competenceScore = calculateCompetenceScore(matchings ?? null);
                            return (
                                <div className="flex gap-2 w-full animate-fade-in-up">
                                    {/* Competences */}
                                    <div className="relative group">
                                        <span className={`px-3 py-1 rounded-full font-medium text-sm transition-all hover:scale-105 ${getTagColorClass(competenceScore)}`}>
                                            Compétences
                                        </span>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-full p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
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
                                        <span className={`px-3 py-1 rounded-full font-medium text-sm transition-all hover:scale-105 ${getTagColorClass(matchings?.seniority_match_percentage ?? 0)}`}>
                                            Séniorité
                                        </span>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 w-full bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                            Score: {Math.round(matchings?.seniority_match_percentage ?? 0)}%
                                        </div>
                                    </div>

                                    {/* Availability */}
                                    <div className="relative group">
                                        <span className={`px-3 py-1 rounded-full font-medium text-sm transition-all hover:scale-105 ${getTagColorClass(matchings?.availability_match_percentage ?? 0)}`}>
                                            Dispo
                                        </span>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 w-full bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                            Score: {Math.round(matchings?.availability_match_percentage ?? 0)}%
                                        </div>
                                    </div>

                                    {/* Mobility */}
                                    <div className="relative group">
                                        <span className={`px-3 py-1 rounded-full font-medium text-sm transition-all hover:scale-105 ${getTagColorClass(matchings?.mobility_match_percentage ?? 0)}`}>
                                            Mobilité
                                        </span>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 w-full bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                            Score: {Math.round(matchings?.mobility_match_percentage ?? 0)}%
                                        </div>
                                    </div>

                                    {/* TJM (Rate) */}
                                    <div className="relative group">
                                        <span className={`px-3 py-1 rounded-full font-medium text-sm transition-all hover:scale-105 ${getTagColorClass(matchings?.rate_match_percentage ?? 0)}`}>
                                            TJM
                                        </span>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 w-full bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                            Score: {Math.round(matchings?.rate_match_percentage ?? 0)}%
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                        <div className="flex flex-row items-center justify-end gap-6 w-full animate-fade-in-up">
                            <select
                                className="px-3 py-2 w-1/3 mr-5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                name={"Default"}
                            >
                                <option value={"Saved"}>Saved</option>
                                <option value={"Applied"}>Applied</option>
                            </select>
                            <button
                                onClick={(e) => handleAction(e, candidate?.user_id ?? "", "validate")}
                                className="hover:bg-gray-100 rounded-lg transition-all transform hover:scale-110"
                            >
                                <MailCheck size={30} stroke={is_validated ? "greens" : "currentColor"} />
                            </button>
                            <button
                                className={`p-2 bg-black rounded-full transition-colors ${is_starred
                                    ? 'hover:text-red-500 text-green-500'
                                    : 'hover:text-green-500 text-white'
                                    }`}
                                onClick={(e) => handleAction(e, candidate?.user_id ?? "", "star")}
                                title={is_starred ? 'Remove star' : 'Add star'}
                            >
                                {is_starred ? (
                                    <StarOff fill="green" size={18} />
                                ) : (
                                    <Star fill="white" size={18} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-[#2d3875] h-[2px] mx-8 animate-expand" />

                {/* Content */}
                <div className="grid grid-cols-2 gap-px bg-[#2a3575] mx-1 animate-fade-in-up">
                    {/* Left Column - Critères */}
                    <div className="bg-white px-4">
                        <h1 className="text-xl font-semibold text-gray-900 my-2">Critères</h1>

                        {/* Contract Type */}
                        {candidate?.contracts &&
                            <div className="flex flex-row items-center gap-3 mb-3 animate-slide-in-left">
                                <label className="block text-xs font-medium text-gray-700">Contrats proposés</label>
                                {candidate?.contracts.map((item, index) => (
                                    <div key={index} className="bg-blue-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-blue-300">{item}</div>
                                ))}
                            </div>
                        }
                        <div className="grid grid-cols-2 gap-4 mb-3 animate-fade-in-up">
                            {/* Dates */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date de démarrage</label>
                                <span className="block border border-gray-300 rounded-xl px-2 py-1 bg-gray-50 text-sm text-gray-700 transition-all hover:bg-gray-100">
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
                                <span className="block px-2 py-1 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700 transition-all hover:bg-gray-100">{candidate?.tjm} €/jr - {candidate?.salary} €/an</span>
                            </div>

                            {/* Location */}
                            {candidate?.location && <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                                <span className="block px-2 py-1 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700 transition-all hover:bg-gray-100">{candidate?.location ?? "-"}</span>
                            </div>}
                            {candidate?.remote && <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Télétravail</label>
                                <span className="block px-2 py-1 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700 transition-all hover:bg-gray-100">{candidate?.remote ? "Oui" : "-"}</span>
                            </div>}
                        </div>

                        {/* Compétences Section */}
                        <div className="mb-4 flex flex-col gap-4 animate-fade-in-up">
                            <h4 className="text-md font-semibold text-gray-900">Compétences</h4>

                            {candidate?.sectors && candidate?.sectors?.length > 0 && <>
                                <div className="flex flex-wrap items-center gap-3">
                                    <label className="block text-xs font-medium text-gray-700">Secteurs</label>
                                    {candidate?.sectors?.map((item, index) => (
                                        <div key={index} className="bg-blue-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-blue-300 hover:scale-105">{item.sector_name} | {item.seniority} ans</div>
                                    ))}
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <label className="block text-xs font-medium text-gray-700">Métiers</label>
                                    {candidate?.sectors?.flatMap(sector =>
                                        sector.job_names?.map((item, index) => (
                                            <div key={`${sector.sector_name}-${index}`} className="bg-blue-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-blue-300 hover:scale-105">
                                                {item}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>}
                            {candidate?.tools && candidate?.tools?.length > 0 &&
                                <div className="flex flex-wrap items-center gap-3">
                                    <label className="block text-xs font-medium text-gray-700">Soft Skills</label>
                                    {candidate?.tools?.map((item, index) => (
                                        <div key={index} className="bg-blue-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-blue-300 hover:scale-105">{item.name}</div>
                                    ))}
                                </div>
                            }
                            {candidate?.qualities && candidate?.qualities?.length > 0 &&
                                <div className="flex flex-wrap items-center gap-3">
                                    <label className="block text-xs font-medium text-gray-700">Qualités</label>
                                    {candidate?.qualities?.map((item, index) => (
                                        <div key={index} className="bg-blue-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-blue-300 hover:scale-105">{item.name}</div>
                                    ))}
                                </div>
                            }
                            {candidate?.languages && candidate?.languages?.length > 0 &&
                                <div className="flex flex-wrap items-center gap-3">
                                    <label className="block text-xs font-medium text-gray-700">Langues</label>
                                    {candidate?.languages?.map((item, index) => (
                                        <div key={index} className="bg-blue-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-blue-300 hover:scale-105">{item.name}</div>
                                    ))}
                                </div>
                            }
                        </div>
                    </div>

                    {/* Right Column - Description */}
                    <div className="bg-white px-4 pb-4 overflow-y-scroll">
                        <h1 className="text-xl font-semibold text-gray-900 my-2">Dossier de Compétences</h1>

                        {candidate?.occupation && (
                            <div className="flex flex-row gap-3 animate-slide-in-right">
                                <span className="block text-sm font-bold text-gray-700">Titre: </span>
                                <span className="block text-sm font-medium text-gray-500">{candidate.occupation}</span>
                            </div>
                        )}

                        {candidate?.years_experience !== undefined && candidate?.years_experience !== null && (
                            <div className="flex flex-row gap-3 animate-slide-in-right">
                                <span className="block text-sm font-bold text-gray-700">Années d'experience:</span>
                                <span className="block text-sm font-medium text-gray-500">
                                    {candidate.years_experience && candidate.years_experience !== 0
                                        ? `${candidate.years_experience} ${candidate.years_experience === 1 ? 'an' : 'ans'}`
                                        : `${candidate.calculatedExperience?.sum || 0} ${(candidate.calculatedExperience?.sum || 0) === 1 ? 'an' : 'ans'}`}
                                </span>
                            </div>
                        )}

                        {candidate?.description && (
                            <div className="flex flex-row gap-3 animate-slide-in-right">
                                <span className="block text-sm font-bold text-gray-700">Présentation:</span>
                                <span className="block text-wrap text-sm font-medium text-gray-500">{candidate.description}</span>
                            </div>
                        )}

                        {/* Trainings Section */}
                        {candidate?.trainings && candidate?.trainings?.length > 0 && (
                            <div className="mt-2 animate-fade-in-up">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-1">Formations</h2>
                                <div className="space-y-4">
                                    {candidate.trainings.map((training, index) => (
                                        <div key={training.id} className="pl-4 border-l-2 border-blue-200 transition-all hover:border-blue-400 hover:bg-blue-50 rounded-r-lg p-2" style={{ animationDelay: `${index * 0.1}s` }}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{training.name}</h3>
                                                    <p className="text-sm text-gray-600">{training.organization} • {training.city}</p>
                                                </div>
                                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full whitespace-nowrap transition-all hover:bg-blue-100">
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
                            <div className="mt-2 animate-fade-in-up">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-1">Expériences Professionnelles</h2>
                                <div className="space-y-4">
                                    {candidate.experiences.map((exp, index) => (
                                        <div key={exp.id} className="pl-4 border-l-2 border-blue-200 transition-all hover:border-blue-400 hover:bg-blue-50 rounded-r-lg p-2" style={{ animationDelay: `${index * 0.1}s` }}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{exp.title}</h3>
                                                    <p className="text-sm text-gray-600">{exp.employer} • {exp.city}</p>
                                                </div>
                                                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full whitespace-nowrap transition-all hover:bg-blue-100">
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

    return (
        <div
            onClick={handleClose}
            className={`fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 transform transition-all duration-500 ease-in-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}
        >
            <div className=" w-4/6 " onClick={(e) => e.stopPropagation()}>
                {loading && <LoadingContent />}
                {error && !loading && <ErrorContent />}
                {!loading && !error && <MainContent />}
            </div>
        </div>
    );
};

export default CandidateDetailModal;