import { useState } from 'react';
import { type StarredCandidates, MatchPercentages } from './OpportunityDetails';

interface CandidatesProps {
    candidates: StarredCandidates[]
}

// Helper function to calculate the competence score
const calculateCompetenceScore = (scores: MatchPercentages): number => {
    return (
        (scores.jobs_match_percentage * 0.75) +
        (scores.languages_match_percentage * 0.125) +
        (scores.qualities_match_percentage * 0.025) +
        (scores.tools_match_percentage * 0.075) +
        (scores.authorizations_match_percentage * 0.025)
    );
};

// Helper function to determine tag background color based on score
const getTagColorClass = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-orange-100 text-orange-700';
    if (score >= 40) return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
};

const StarredCandidatesComp = ({ candidates }: CandidatesProps) => {
    const [candidatesList, setCandidatesList] = useState<StarredCandidates[]>(candidates);

    // Handle status change
    const handleStatusChange = (id: string, newStatus: string) => {
        setCandidatesList(prevList =>
            prevList.map(candidate =>
                candidate.id === id ? { ...candidate, status: newStatus } : candidate
            )
        );
    };

    // Placeholder functions for action buttons
    const handleViewProfile = (id: string) => {
        console.log(`View profile of candidate with id: ${id}`);
        // In a real implementation, this would navigate to profile page
    };

    const handleSendEmail = (id: string) => {
        console.log(`Send email to candidate with id: ${id}`);
        // In a real implementation, this would open email modal
    };

    const handleDelete = (id: string) => {
        console.log(`Delete candidate with id: ${id}`);
        setCandidatesList(prevList => prevList.filter(candidate => candidate.id !== id));
    };

    return (
        <div className="">
            <div className="max-w-7xl mx-auto space-y-2">
                {candidatesList.map((candidate) => {
                    // Calculate competence score
                    const competenceScore = calculateCompetenceScore(candidate.matching_scores);

                    return (
                        <div
                            key={candidate.id}
                            className="bg-white rounded-xl shadow-sm border p-4 flex items-center gap-4"
                        >
                            {/* Match percentage */}
                            <div className="w-16 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                {Math.round(candidate.matching_scores.total_match_percentage)}%
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
                                        <p>Emplois: {Math.round(candidate.matching_scores.jobs_match_percentage)}%</p>
                                        <p>Langues: {Math.round(candidate.matching_scores.languages_match_percentage)}%</p>
                                        <p>Outils: {Math.round(candidate.matching_scores.tools_match_percentage)}%</p>
                                        <p>Qualités: {Math.round(candidate.matching_scores.qualities_match_percentage)}%</p>
                                        <p>Autorisations: {Math.round(candidate.matching_scores.authorizations_match_percentage)}%</p>
                                    </div>
                                </div>

                                {/* Seniority */}
                                <div className="relative group">
                                    <span className={`px-4 py-1 rounded-xl text-sm ${getTagColorClass(candidate.matching_scores.seniority_match_percentage)}`}>
                                        Séniorité
                                    </span>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                                        Score: {Math.round(candidate.matching_scores.seniority_match_percentage)}%
                                    </div>
                                </div>

                                {/* Availability */}
                                <div className="relative group">
                                    <span className={`px-4 py-1 rounded-xl text-sm ${getTagColorClass(candidate.matching_scores.availability_match_percentage)}`}>
                                        Dispo
                                    </span>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                                        Score: {Math.round(candidate.matching_scores.availability_match_percentage)}%
                                    </div>
                                </div>

                                {/* TJM (Rate) */}
                                <div className="relative group">
                                    <span className={`px-4 py-1 rounded-xl text-sm ${getTagColorClass(candidate.matching_scores.rate_match_percentage)}`}>
                                        TJM
                                    </span>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                                        Score: {Math.round(candidate.matching_scores.rate_match_percentage)}%
                                    </div>
                                </div>

                                {/* Mobility */}
                                <div className="relative group">
                                    <span className={`px-4 py-1 rounded-xl text-sm ${getTagColorClass(candidate.matching_scores.mobility_match_percentage)}`}>
                                        Mobilité
                                    </span>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                                        Score: {Math.round(candidate.matching_scores.mobility_match_percentage)}%
                                    </div>
                                </div>
                            </div>

                            {/* Status dropdown */}
                            <select
                                className="w-32 px-4 py-1.5 border rounded-xl text-sm"
                                value={candidate.status}
                                onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                            >
                                <option value="">Statut</option>
                                <option value="En cours">En cours</option>
                                <option value="Validé">Validé</option>
                                <option value="Refusé">Refusé</option>
                            </select>

                            {/* Action buttons */}
                            <div className="flex gap-2">
                                <button
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    onClick={() => handleViewProfile(candidate.id)}
                                >
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="14" cy="14" r="14" fill="#215A96" />
                                        <path d="M10.3906 16.6666L16.6651 10.3921M16.6651 10.3921H10.3906M16.6651 10.3921V16.6666" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                    onClick={() => handleSendEmail(candidate.id)}
                                >
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M3.64706 10.7059L1 12.9118L6.2946 16.8049C6.32725 14.2267 8.00184 13.7941 11.1471 13.7941C14.3235 13.7941 15.1176 16.7353 15.1176 18.2059L8.05882 18.1021L10.2647 19.724L16 23.9412L21.7353 19.724L27.9118 15.1825V10.5177V5.85294H22.6176H9.38235H3.64706V10.7059ZM10.7059 8.5C13.7941 8.5 13.7941 12.4706 10.7059 12.4706C7.61765 12.4706 7.61765 8.5 10.7059 8.5Z" fill="white" />
                                        <path d="M31 12.9118V30.5588M31 12.9118L27.9118 15.1825M31 12.9118L27.9118 10.5177M1 12.9118L3.64706 10.7059M1 12.9118V30.5588M1 12.9118L6.2946 16.8049M3.64706 10.7059V5.85294H9.38235M3.64706 10.7059V14.6765M1 30.5588H31M1 30.5588L10.2647 19.724M31 30.5588L21.7353 19.724M21.7353 19.724L16 23.9412L10.2647 19.724M21.7353 19.724L27.9118 15.1825M10.2647 19.724L8.05882 18.1021M9.38235 5.85294L16 1L22.6176 5.85294M9.38235 5.85294H22.6176M22.6176 5.85294H27.9118V10.5177M27.9118 15.1825V10.5177M24.3824 9.38235H21.5147M21.5147 9.38235H18.6471H17.7647H21.5147ZM17.7647 12.4706H21.0735H24.3824M17.7647 15.1825H24.3824M21.7353 17.7647H17.7647M8.05882 18.1021L15.1176 18.2059C15.1176 16.7353 14.3235 13.7941 11.1471 13.7941C8.00184 13.7941 6.32725 14.2267 6.2946 16.8049M8.05882 18.1021L6.2946 16.8049M6.29412 16.8824C6.29412 16.8563 6.29428 16.8305 6.2946 16.8049M10.7059 8.5C13.7941 8.5 13.7941 12.4706 10.7059 12.4706C7.61765 12.4706 7.61765 8.5 10.7059 8.5Z" stroke="#0E538C" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button
                                    className="p-2 hover:bg-red-50 rounded-lg"
                                    onClick={() => handleDelete(candidate.id)}
                                >
                                    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.75 23.25C3.0625 23.25 2.47396 23.0052 1.98438 22.5156C1.49479 22.026 1.25 21.4375 1.25 20.75V4.5H0V2H6.25V0.75H13.75V2H20V4.5H18.75V20.75C18.75 21.4375 18.5052 22.026 18.0156 22.5156C17.526 23.0052 16.9375 23.25 16.25 23.25H3.75ZM16.25 4.5H3.75V20.75H16.25V4.5ZM6.25 18.25H8.75V7H6.25V18.25ZM11.25 18.25H13.75V7H11.25V18.25Z" fill="#215A96" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StarredCandidatesComp;