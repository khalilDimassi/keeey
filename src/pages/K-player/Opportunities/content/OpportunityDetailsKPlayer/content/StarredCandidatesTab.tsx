import { useCallback, useState } from 'react';
import { ArrowUpRight, MailCheck, MailX, Trash2 } from 'lucide-react';
import { emitter } from '../../../../../../utils/eventEmitter';
import { EnhancedCandidate, MatchPercentages } from '../types';
import { removeCandidateStar, validateCandidateInterest } from '../services';

interface CandidatesProps {
    candidates: EnhancedCandidate[]
    loading: boolean
    error: string | null
    opportunity_id: string
    onSelectedCandidate: (candidateID: string) => void
}

const EnhancedCandidateComp = ({ candidates, opportunity_id, onSelectedCandidate }: CandidatesProps) => {
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

    const handleValidateInterest = async (candidateId: string, state: boolean) => {
        try {
            if (!opportunity_id) return;
            await validateCandidateInterest(opportunity_id, candidateId);
            // Update the local state
            setCandidatesList(prevList => prevList.map(candidate => {
                if (candidate.user_id === candidateId) {
                    const updatedCandidate: EnhancedCandidate = {
                        ...candidate,
                        matching_scores: candidate.matching_scores ? {
                            ...candidate.matching_scores,
                            is_validated: state
                        } : {
                            is_validated: state,
                            total_match_percentage: 0,
                            skills_match_percentage: 0,
                            seniority_match_percentage: 0,
                            jobs_match_percentage: 0,
                            languages_match_percentage: 0,
                            tools_match_percentage: 0,
                            qualities_match_percentage: 0,
                            authorizations_match_percentage: 0,
                            availability_match_percentage: 0,
                            rate_match_percentage: 0,
                            mobility_match_percentage: 0,
                            sectors_match_percentage: 0
                        }
                    };
                    return updatedCandidate;
                }
                return candidate;
            }));
        } catch (error) {
            console.error("Error validating candidate interest:", error);
            // TODO: add error state handling here if needed
        }
    };

    const handleDelete = async (opportunity_id: string, user_id: string) => {
        await removeCandidateStar(opportunity_id, user_id);
        setCandidatesList(prevList => prevList.filter(candidate => candidate.user_id !== user_id));
    };

    return (
        <div className="w-full bg-white rounded-b-xl rounded-r-xl shadow-lg p-6">
            {candidatesList.map((candidate) => {
                const competenceScore = calculateCompetenceScore(candidate.matching_scores ?? null);
                const handleClick = useCallback((e: React.MouseEvent) => {
                    e.stopPropagation();
                    e.preventDefault();

                    if (!candidate) {
                        console.error('No candidate data');
                        return;
                    }

                    const currentValidationStatus = candidate.matching_scores?.is_validated ?? false;
                    try {
                        handleValidateInterest(candidate.user_id, !currentValidationStatus);
                        emitter.emit('refreshSuggestions');
                    } catch (error) {
                        console.error('Button click error:', error);
                    }
                }, [candidate]);

                return (
                    <div
                        key={candidate.user_id}
                        className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-4 mb-3 hover:shadow-md"
                    >
                        <div className="w-16 h-8 bg-blue-200 rounded-xl flex items-center justify-center text-blue-800 font-bold">
                            {Math.round(candidate.totalMatchPercentage ?? 0 * 10)}%
                        </div>
                        <div className="w-48">
                            <h3 className="font-semibold">{candidate.first_name} {candidate.last_name}</h3>
                            <p className="text-sm text-gray-500">{candidate.occupation}</p>
                        </div>
                        <div className="flex gap-2 flex-1">
                            <div className="relative group">
                                <span className={`px-4 py-1 rounded-xl text-sm ${getTagColorClass(competenceScore)}`}>
                                    Compétences
                                </span>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 w-full bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                                    <p>Score: {Math.round(competenceScore)}%</p>
                                    <hr className="my-1" />
                                    <p>Emplois: {Math.round(candidate.matching_scores?.jobs_match_percentage ?? 0)}%</p>
                                    <p>Langues: {Math.round(candidate.matching_scores?.languages_match_percentage ?? 0)}%</p>
                                    <p>Outils: {Math.round(candidate.matching_scores?.tools_match_percentage ?? 0)}%</p>
                                    <p>Qualités: {Math.round(candidate.matching_scores?.qualities_match_percentage ?? 0)}%</p>
                                    <p>Autorisations: {Math.round(candidate.matching_scores?.authorizations_match_percentage ?? 0)}%</p>
                                </div>
                            </div>
                            <div className="relative group">
                                <span className={`px-4 py-1 rounded-xl text-sm ${getTagColorClass(candidate.matching_scores?.seniority_match_percentage ?? 0)}`}>
                                    Séniorité
                                </span>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 w-full bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                                    Score: {Math.round(candidate.matching_scores?.seniority_match_percentage ?? 0)}%
                                </div>
                            </div>
                            <div className="relative group">
                                <span className={`px-4 py-1 rounded-xl text-sm ${getTagColorClass(candidate.matching_scores?.availability_match_percentage ?? 0)}`}>
                                    Dispo
                                </span>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 w-full bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                                    Score: {Math.round(candidate.matching_scores?.availability_match_percentage ?? 0)}%
                                </div>
                            </div>
                            <div className="relative group">
                                <span className={`px-4 py-1 rounded-xl text-sm ${getTagColorClass(candidate.matching_scores?.rate_match_percentage ?? 0)}`}>
                                    TJM
                                </span>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 w-full bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                                    Score: {Math.round(candidate.matching_scores?.rate_match_percentage ?? 0)}%
                                </div>
                            </div>
                            <div className="relative group">
                                <span className={`px-4 py-1 rounded-xl text-sm ${getTagColorClass(candidate.matching_scores?.mobility_match_percentage ?? 0)}`}>
                                    Mobilité
                                </span>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 w-full bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                                    Score: {Math.round(candidate.matching_scores?.mobility_match_percentage ?? 0)}%
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <ArrowUpRight
                                className='transition-colors bg-[#215A96] hover:bg-gray-500 p-1 rounded-full'
                                onClick={() => onSelectedCandidate(candidate.user_id)}
                                cursor={'pointer'}
                                color='white'
                                size={36}
                            />
                            {candidate.matching_scores?.is_validated
                                ? <MailX
                                    className='text-green-500 hover:text-red-500 transition-colors'
                                    cursor={"pointer"}
                                    size={38}
                                    onClick={handleClick}
                                />
                                : <MailCheck
                                    className='text-[#215A96] hover:text-green-500 transition-colors'
                                    cursor={"pointer"}
                                    size={38}
                                    onClick={handleClick}
                                />
                            }
                            <Trash2
                                className='text-[#215A96] hover:text-red-500 transition-colors'
                                cursor={"pointer"}
                                size={38}
                                onClick={() => {
                                    handleDelete(opportunity_id, candidate.user_id);
                                    emitter.emit('refreshSuggestions');
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default EnhancedCandidateComp;