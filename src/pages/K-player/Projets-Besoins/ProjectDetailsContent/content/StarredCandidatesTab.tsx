import { useState } from 'react';
import { MatchPercentages, EnhancedCandidate } from '../../types';
import { ArrowUpRight, MailCheck, MailX, Trash2 } from 'lucide-react';
import { validateCandidateInterest } from '../../services';

interface CandidatesProps {
    candidates: EnhancedCandidate[]
    loading: boolean
    error: string | null
    opportunity_id: string
}

const EnhancedCandidateComp = ({ candidates, opportunity_id }: CandidatesProps) => {
    const [candidatesList, setCandidatesList] = useState<EnhancedCandidate[]>(candidates);

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

    const handleViewProfile = (id: string) => {
        console.log(`View profile of candidate with id: ${id}`);
        // In a real implementation, this would navigate to profile page
    };

    const handleValidateInterest = async (candidate: EnhancedCandidate, state: boolean) => {
        try {
            if (!opportunity_id) return;

            await validateCandidateInterest(opportunity_id, candidate.user_id);
            candidate.isValidated = state;

        } catch (error) {
            console.error("Error validating candidate interest:", error);
            // TODO: add error state handling here if needed
        }
    };

    const handleDelete = (id: string) => {
        console.log(`Delete candidate with id: ${id}`);
        setCandidatesList(prevList => prevList.filter(candidate => candidate.user_id !== id));
    };

    return (
        <div className="">
            <div className="w-full  mx-auto space-y-2">
                {candidatesList.map((candidate) => {
                    // Calculate competence score
                    const competenceScore = calculateCompetenceScore(candidate.matching_scores ?? null);

                    return (
                        <div
                            key={candidate.user_id}
                            className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-4"
                        >
                            {/* Match percentage */}
                            <div className="w-16 h-8 bg-blue-200 rounded-xl flex items-center justify-center text-blue-800 font-bold">
                                {Math.round(candidate.totalMatchPercentage ?? 0 * 10) / 10}%
                            </div>

                            {/* Name and role */}
                            <div className="w-48">
                                <h3 className="font-semibold">{candidate.first_name} {candidate.last_name}</h3>
                                <p className="text-sm text-gray-500">{candidate.occupation}</p>
                            </div>

                            {/* Tags */}
                            <div className="flex gap-2 flex-1">
                                {/* Competences */}
                                <div className="relative group">
                                    <span className={`px-4 py-1 rounded-xl text-sm ${getTagColorClass(competenceScore)}`}>
                                        Compétences
                                    </span>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                                        <p>Score: {Math.round(competenceScore)}%</p>
                                        <p>Emplois: {Math.round(candidate.matching_scores?.jobs_match_percentage ?? 0)}%</p>
                                        <p>Langues: {Math.round(candidate.matching_scores?.languages_match_percentage ?? 0)}%</p>
                                        <p>Outils: {Math.round(candidate.matching_scores?.tools_match_percentage ?? 0)}%</p>
                                        <p>Qualités: {Math.round(candidate.matching_scores?.qualities_match_percentage ?? 0)}%</p>
                                        <p>Autorisations: {Math.round(candidate.matching_scores?.authorizations_match_percentage ?? 0)}%</p>
                                    </div>
                                </div>

                                {/* Seniority */}
                                <div className="relative group">
                                    <span className={`px-4 py-1 rounded-xl text-sm ${getTagColorClass(candidate.matching_scores?.seniority_match_percentage ?? 0)}`}>
                                        Séniorité
                                    </span>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                                        Score: {Math.round(candidate.matching_scores?.seniority_match_percentage ?? 0)}%
                                    </div>
                                </div>

                                {/* Availability */}
                                <div className="relative group">
                                    <span className={`px-4 py-1 rounded-xl text-sm ${getTagColorClass(candidate.matching_scores?.availability_match_percentage ?? 0)}`}>
                                        Dispo
                                    </span>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                                        Score: {Math.round(candidate.matching_scores?.availability_match_percentage ?? 0)}%
                                    </div>
                                </div>

                                {/* TJM (Rate) */}
                                <div className="relative group">
                                    <span className={`px-4 py-1 rounded-xl text-sm ${getTagColorClass(candidate.matching_scores?.rate_match_percentage ?? 0)}`}>
                                        TJM
                                    </span>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                                        Score: {Math.round(candidate.matching_scores?.rate_match_percentage ?? 0)}%
                                    </div>
                                </div>

                                {/* Mobility */}
                                <div className="relative group">
                                    <span className={`px-4 py-1 rounded-xl text-sm ${getTagColorClass(candidate.matching_scores?.mobility_match_percentage ?? 0)}`}>
                                        Mobilité
                                    </span>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                                        Score: {Math.round(candidate.matching_scores?.mobility_match_percentage ?? 0)}%
                                    </div>
                                </div>
                            </div>

                            {/* Comment section */}
                            {/* TODO: add comment space */}

                            {/* Action buttons */}
                            <div className="flex gap-2">
                                <button
                                    className="p-2 text-white bg-[#215A96] rounded-full hover:bg-gray-500 transition-colors"
                                    title="Open user profile"
                                    onClick={() => { handleViewProfile(candidate.user_id) }}
                                >
                                    <ArrowUpRight size={18} />
                                </button>

                                <button
                                    className={`px-3 py-1.5 rounded-full bg-[#215A96] flex items-center gap-1 transition-colors ${candidate.isValidated
                                        ? 'text-green-500 hover:text-red-500'
                                        : 'text-white hover:text-green-500'
                                        }`}
                                    onClick={() => handleValidateInterest(candidate, !candidate.isValidated)}
                                    disabled={candidate.isValidated}
                                    title={candidate.isValidated ? 'Revoke validation' : 'Validate interest'}
                                >
                                    {candidate.isValidated ? (
                                        <MailX size={24} />
                                    ) : (
                                        <MailCheck size={24} />
                                    )}
                                </button>
                                <button
                                    className={`p-2 bg-[#215A96] text-white rounded-full transition-colors hover:text-red-500`}
                                    onClick={() => handleDelete(candidate.user_id)}
                                    title="Remove from favorites"
                                >
                                    <Trash2 size={24} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EnhancedCandidateComp;