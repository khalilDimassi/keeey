import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Star, Bookmark, ArrowUpRight, ChevronDown, Check } from "lucide-react";
import { getAuthHeader } from "../../../utils/jwt";

interface Job {
  job: string;
  seniority: number;
}

interface MatchPercentages {
  total_match_percentage: number;
  jobs_match_percentage: number;
  seniority_match_percentage: number;
  availability_match_percentage: number;
  rate_match_percentage: number;
  mobility_match_percentage: number;
  languages_match_percentage: number;
  tools_match_percentage: number;
  authorizations_match_percentage: number;
  qualities_match_percentage: number;
}

interface CandidateSuggestion {
  user_id: string;
  first_name: string;
  last_name: string;
  rating: number;
  availability: string;
  jobs: Job[] | null;
  totalMatchPercentage?: number;
  isStarred?: boolean;
  isValidated?: boolean;
}

interface CandidatesListProps {
  ApiType?: string;
  OpportunityID?: number;
}

const CandidatesList = ({ ApiType, OpportunityID }: CandidatesListProps) => {
  const [candidateSuggestion, setCandidateSuggestion] = useState<CandidateSuggestion[]>([]);
  const [showExtraJobs, setShowExtraJobs] = useState<{ [key: string]: boolean }>({});
  const extraJobsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const fetchCandidates = async (path: string, auth?: { Authorization: string }) => {
    try {
      const response = await axios.get<CandidateSuggestion[]>(`${import.meta.env.VITE_API_BASE_URL}/api/v1${path}`, { headers: auth });

      const candidatesWithDefaultJobs = response.data.map((candidate: CandidateSuggestion) => ({
        ...candidate,
        jobs: candidate.jobs ?? [],
      }));

      // Loop through candidates to fetch match percentages for each one
      for (const candidate of candidatesWithDefaultJobs) {
        try {
          const matchResponse = await axios.get<MatchPercentages>(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${OpportunityID}/${candidate.user_id}/matching`
          );

          candidate.totalMatchPercentage = Math.round(matchResponse.data.total_match_percentage);

        } catch (error) {
          console.error(`Error fetching match percentages for candidate ${candidate.user_id}:`, error);
          // Continue with the next candidate even if one fails
        }
      }

      setCandidateSuggestion(candidatesWithDefaultJobs);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      // Optionally, you can set an error state here and display it in the UI
    }
  };

  useEffect(() => {
    if (ApiType === "SUBMITTED") {
      fetchCandidates(`/private/opportunities/${OpportunityID}/candidates/submitted`, getAuthHeader());
    } else {
      fetchCandidates('/public/opportunities/suggestions/candidates');
    }
  }, [ApiType, OpportunityID]);

  // Handle starring a candidate
  const handleStarCandidate = async (userId: string) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${OpportunityID}/candidates/${userId}/star`,
        {},
        { headers: getAuthHeader() }
      );

      // Update local state to reflect the change
      setCandidateSuggestion(prev =>
        prev.map(candidate =>
          candidate.user_id === userId
            ? { ...candidate, isStarred: true }
            : candidate
        )
      );

      console.log("Candidate starred successfully:", response.data);
    } catch (error) {
      console.error("Error starring candidate:", error);
    }
  };

  // Handle validating interest for a candidate
  const handleValidateInterest = async (userId: string) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${OpportunityID}/candidates/${userId}/validate`,
        {},
        { headers: getAuthHeader() }
      );

      // Update local state to reflect the change
      setCandidateSuggestion(prev =>
        prev.map(candidate =>
          candidate.user_id === userId
            ? { ...candidate, isValidated: true }
            : candidate
        )
      );

      console.log("Candidate interest validated successfully:", response.data);
    } catch (error) {
      console.error("Error validating candidate interest:", error);
    }
  };

  const getHighestSeniorityJob = (jobs: Job[]) => {
    if (jobs.length === 0) return { job: "No job", seniority: 0 };
    return jobs.reduce((highest, job) => (job.seniority > highest.seniority ? job : highest), jobs[0]);
  };

  const seniorityLevels = [
    { level: 1, name: "Junior", description: "1 - 4 ans" },
    { level: 2, name: "Mid-Level", description: "5 - 9 ans" },
    { level: 3, name: "Senior", description: "10 - 14 ans" },
    { level: 4, name: "Lead", description: "15 - 19 ans" },
    { level: 5, name: "Principal", description: "20+ ans" },
  ];

  // Toggle extra jobs visibility for a specific candidate
  const toggleExtraJobs = (userId: string) => {
    setShowExtraJobs(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // Close the extra jobs list when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.entries(extraJobsRef.current).forEach(([userId, ref]) => {
        if (ref && !ref.contains(event.target as Node)) {
          setShowExtraJobs(prev => ({
            ...prev,
            [userId]: false
          }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderDefaultView = () => (
    <div className="space-y-3">
      {candidateSuggestion.map((candidate) => {
        const jobs = candidate.jobs ?? [];
        const highestSeniorityJob = getHighestSeniorityJob(jobs);
        const highestSeniorityLevel = seniorityLevels.find(level => level.level === highestSeniorityJob.seniority);
        const extraJobsCount = jobs.length - 1;

        return (
          <div
            key={candidate.user_id}
            className="bg-white p-3 rounded-lg shadow-md grid grid-cols-7 gap-4 items-center"
            style={{ boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)", borderRadius: "10px" }}
          >
            {/* Badge correspondance */}
            <div className="col-span-1">
              <span className="bg-blue-300 text-blue-800 px-3 py-1 text-sm font-semibold rounded-md">
                {candidate.totalMatchPercentage ? `${Math.round(candidate.totalMatchPercentage)}%` : "-"} correspondant
              </span>
            </div>

            {/* Nom + Détails */}
            <div className="col-span-1">
              <span className="font-semibold">{`${candidate.first_name} ${candidate.last_name}`}</span>
            </div>

            {/* Évaluation */}
            <div className="col-span-1 flex items-center gap-1">
              <Star size={16} className="text-yellow-500" />
              <span className="text-gray-600">{candidate.rating}</span>
            </div>

            {/* Niveau */}
            <div className="col-span-1">
              <span className="text-gray-500">
                {highestSeniorityLevel ? `${highestSeniorityLevel.name}: ${highestSeniorityLevel.description}` : "-"}
              </span>
            </div>

            {/* Disponibilité */}
            <div className="col-span-1">
              <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded">
                {candidate.availability}
              </span>
            </div>

            {/* Compétences */}
            <div className="col-span-1 flex items-center gap-4">
              <span className="text-gray-600 text-sm">Metiers:</span>
              <span className="bg-blue-300 text-blue-800 px-2 py-1 text-xs rounded inline-flex items-center">
                {highestSeniorityJob.job}
              </span>
              {extraJobsCount > 0 && (
                <div
                  className="relative"
                  ref={el => extraJobsRef.current[candidate.user_id] = el}
                >
                  <button
                    onClick={() => toggleExtraJobs(candidate.user_id)}
                    className="bg-black text-white w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full cursor-pointer"
                  >
                    +{extraJobsCount}
                  </button>
                  {showExtraJobs[candidate.user_id] && (
                    <div className="absolute bg-white p-2 rounded-lg shadow-md mt-2 max-h-40 overflow-y-auto z-10">
                      <ul className="space-y-2">
                        {jobs.slice(1).map((job, index) => {
                          const seniorityLevel = seniorityLevels.find(level => level.level === job.seniority) || {
                            level: 0,
                            name: "Unknown",
                            description: "Unknown",
                          };

                          return (
                            <li key={index} className="text-xs text-gray-600 border-b border-gray-200 pb-2">
                              <div>{job.job}</div>
                              <div>
                                {seniorityLevel.name}: {seniorityLevel.description}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions à droite */}
            <div className="col-span-1 flex items-center gap-4">
              <Bookmark
                size={35}
                className={`${candidate.isStarred ? 'text-yellow-500 fill-yellow-500' : 'text-gray-500'} cursor-pointer`}
                onClick={() => handleStarCandidate(candidate.user_id)}
              />
              <button
                className={`${candidate.isValidated ? 'bg-green-600' : 'bg-blue-800'} text-white px-4 py-2 rounded-3xl flex items-center gap-2`}
                style={{ backgroundColor: candidate.isValidated ? "#22C55E" : "#215A96", borderRadius: "10px" }}
                onClick={() => handleValidateInterest(candidate.user_id)}
                disabled={candidate.isValidated}
              >
                {candidate.isValidated ? 'Intérêt validé' : 'Valider l\'intérêt'}
              </button>
              <div className="bg-blue-800 p-2 rounded-full flex items-center justify-center" style={{ backgroundColor: "#215A96" }}>
                <ArrowUpRight size={20} className="text-white top-4 right-4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );


  const lightGray = [209, 213, 219]
  const blue = [59, 130, 246]

  const interpolateColor = (percentage: number) => {
    const r = Math.round(lightGray[0] + (blue[0] - lightGray[0]) * (percentage / 100));
    const g = Math.round(lightGray[1] + (blue[1] - lightGray[1]) * (percentage / 100));
    const b = Math.round(lightGray[2] + (blue[2] - lightGray[2]) * (percentage / 100));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getTextColor = (backgroundColor: string) => {
    const rgb = backgroundColor.match(/\d+/g)?.map(Number);
    if (!rgb) return "black";
    const brightness = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
    return brightness > 0.5 ? "black" : "white";
  };



  const renderSubmittedView = () => (
    <div className="space-y-3">
      {candidateSuggestion.map((candidate) => {
        const jobs = candidate.jobs ?? [];
        const highestSeniorityJob = getHighestSeniorityJob(jobs);
        const highestSeniorityLevel = seniorityLevels.find(level => level.level === highestSeniorityJob.seniority);
        const extraJobsCount = jobs.length - 2;
        const backgroundColor = interpolateColor(candidate.totalMatchPercentage ?? 0);
        const textColor = getTextColor(backgroundColor);

        return (
          <div
            key={candidate.user_id}
            className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between gap-4"
            style={{ boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)", borderRadius: "10px" }}
          >
            {/* Badge correspondance */}
            <span
              className="px-3 py-1 text-sm font-semibold rounded-md"
              style={{

                backgroundColor,
                color: textColor,
              }}
            >
              {candidate.totalMatchPercentage ?? 0}% correspondant
            </span>

            {/* Nom + Détails */}
            <span className="font-semibold">{`${candidate.first_name} ${candidate.last_name}`}</span>

            {/* Évaluation */}
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-500" />
              <span className="text-gray-600">{candidate.rating}</span>
            </div>

            {/* Niveau */}
            <span className="text-gray-500">
              Seniority: {highestSeniorityLevel ? highestSeniorityLevel.name : "-"}
            </span>

            {/* Disponibilité */}
            <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded">
              {candidate.availability}
            </span>

            {/* Compétences */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-sm">Compétences:</span>
              <span className="bg-blue-300 text-blue-800 px-2 py-1 text-xs rounded items-center">
                {highestSeniorityJob.job}
              </span>
              {jobs.slice(1, 2).map((job, index) => (
                <span
                  key={index}
                  className="bg-blue-300 text-blue-800 px-2 py-1 text-xs rounded items-center"
                >
                  {job.job}
                </span>
              ))}
              {extraJobsCount && (
                <span className="bg-black text-white w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full">
                  +{extraJobsCount}
                </span>
              )}
            </div>

            {/* Actions à droite */}
            <div className="flex items-center gap-4">
              <div
                className={`${candidate.isStarred ? 'bg-yellow-500' : 'bg-black'} p-2 rounded-full flex items-center justify-center cursor-pointer`}
                onClick={() => handleStarCandidate(candidate.user_id)}
              >
                <Star fill={`${candidate.isStarred ? 'black' : 'white'}`} size={18} className="text-white" />
              </div>
              <div className="bg-blue-800 p-2 rounded-full flex items-center justify-center" style={{ backgroundColor: "#215A96" }}>
                <ArrowUpRight size={15} className="text-white" />
              </div>
              <button
                className={`${candidate.isValidated ? 'bg-green-600' : 'bg-blue-800'} text-white px-4 py-2 rounded-3xl flex items-center gap-2`}
                style={{ backgroundColor: candidate.isValidated ? "#22C55E" : "#215A96", borderRadius: "10px" }}
                onClick={() => handleValidateInterest(candidate.user_id)}
                disabled={candidate.isValidated}
              >
                <Check size={16} /> {candidate.isValidated ? 'Intérêt validé' : 'Valider l\'intérêt'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="">
      {/* Titre + Sélecteur */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {ApiType === "SUBMITTED" ? (
            <>Submissions <span className="text-gray-500">({candidateSuggestion.length} Candidats)</span></>
          ) : (
            <>Suggestions <span className="text-gray-500">({candidateSuggestion.length} Candidats)</span></>
          )}
        </h2>
        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-md border border-gray-300 shadow-sm">
          Matching <ChevronDown size={16} />
        </button>
      </div>

      {/* Liste des candidats */}
      {ApiType === "SUBMITTED" ? renderSubmittedView() : renderDefaultView()}
    </div>
  );
};

export default CandidatesList;