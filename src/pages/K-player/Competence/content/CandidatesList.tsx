import { useEffect, useRef, useState } from "react";
import { Star, ArrowUpRight, Check, MailCheck, MailX, StarOff } from "lucide-react";
import { CandidateSuggestion, CandidateJob } from "../types";
import { fetchCandidatesWithMatchData, starCandidate, updateCandidateStatus, validateCandidateInterest } from "../services";
import { isAuthenticated } from "../../../../utils/jwt";
import { emitter } from "../../../../utils/eventEmitter";
import CandidateDetailModal from "./CandidateDetailsModale";

interface CandidatesListProps {
  apiType?: string;
  opportunityId?: string;
  selectedCandidateId?: string;
  onClodeModal?: () => void;
}

const CandidatesList = ({ apiType = "ALL", opportunityId, selectedCandidateId, onClodeModal }: CandidatesListProps) => {
  const [candidateSuggestion, setCandidateSuggestion] = useState<CandidateSuggestion[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<CandidateSuggestion[]>([]);
  const [showExtraSkills, setShowExtraSkills] = useState<{ [key: string]: boolean }>({});
  const [selectedCandidateID, setSelectedCandidateID] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [matchPercentageFilter, setMatchPercentageFilter] = useState<number>(0);
  const extraSkillsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const candidates = await fetchCandidatesWithMatchData(apiType, opportunityId);
      setCandidateSuggestion(candidates);
    } catch (err) {
      console.error("Failed to load candidates:", err);
      setError(err instanceof Error ? err.message : 'Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
    const handleRefresh = () => {
      setVersion(v => v + 1);
    };
    emitter.on('refreshSuggestions', handleRefresh);
    return () => {
      emitter.off('refreshSuggestions', handleRefresh);
    };
  }, [apiType, opportunityId]);

  useEffect(() => {
    loadCandidates();
  }, [version]);

  useEffect(() => {
    const filtered = candidateSuggestion.filter(candidate =>
      candidate.matching?.total_match_percentage !== undefined &&
      candidate.matching?.total_match_percentage >= matchPercentageFilter
    );
    const sorted = [...filtered].sort((a, b) => {
      if (a.isStarred && !b.isStarred) return -1;
      if (!a.isStarred && b.isStarred) return 1;

      if (a.isValidated && !b.isValidated) return -1;
      if (!a.isValidated && b.isValidated) return 1;

      const matchA = a.matching?.total_match_percentage || 0;
      const matchB = b.matching?.total_match_percentage || 0;
      return matchB - matchA;
    });
    setFilteredCandidates(sorted);

  }, [matchPercentageFilter, candidateSuggestion]);

  const handleCloseModal = () => {
    setSelectedCandidateID(null);
    onClodeModal?.();
  };

  const handleStarCandidate = async (userId: string) => {
    try {
      if (!opportunityId) return;

      await starCandidate(opportunityId, userId);
      setCandidateSuggestion(prev => {
        const updated = updateCandidateStatus(prev, userId, { isStarred: true });
        // Re-sort after starring a candidate to move it to the top
        return [...updated].sort((a, b) => {
          if (a.isStarred && !b.isStarred) return -1;
          if (!a.isStarred && b.isStarred) return 1;
          if (a.isValidated && !b.isValidated) return -1;
          if (!a.isValidated && b.isValidated) return 1;
          const matchA = a.matching?.total_match_percentage || 0;
          const matchB = b.matching?.total_match_percentage || 0;
          return matchB - matchA;
        });
      });
    } catch (error) {
      console.error("Error starring candidate:", error);
      // TODO: add error state handling here if needed
    }
  };

  const handleValidateInterest = async (userId: string) => {
    try {
      if (!opportunityId) return;

      await validateCandidateInterest(opportunityId, userId);
      setCandidateSuggestion(prev => {
        const updated = updateCandidateStatus(prev, userId, { isValidated: true });
        // Re-sort after validating a candidate to move it towards the top
        return [...updated].sort((a, b) => {
          if (a.isStarred && !b.isStarred) return -1;
          if (!a.isStarred && b.isStarred) return 1;
          if (a.isValidated && !b.isValidated) return -1;
          if (!a.isValidated && b.isValidated) return 1;
          const matchA = a.matching?.total_match_percentage || 0;
          const matchB = b.matching?.total_match_percentage || 0;
          return matchB - matchA;
        });
      });
    } catch (error) {
      console.error("Error validating candidate interest:", error);
      // TODO: add error state handling here if needed
    }
  };

  const getHighestSeniorityJob = (jobs: CandidateJob[]) => {
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

  const toggleExtraSkills = (userId: string) => {
    setShowExtraSkills(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  useEffect(() => {
    if (selectedCandidateID) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [selectedCandidateID]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.entries(extraSkillsRef.current).forEach(([userId, ref]) => {
        if (ref && !ref.contains(event.target as Node)) {
          setShowExtraSkills(prev => ({
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

  const handlePercentageChange = (value: number) => {
    setMatchPercentageFilter(Math.min(100, Math.max(0, value)));
  };

  const getSeniorityLevel = (yearsOfExperience: number) => {
    return seniorityLevels.find(level => {
      if (level.level === 5) return yearsOfExperience >= 20; // Principal (20+ years)
      if (level.level === 4) return yearsOfExperience >= 15 && yearsOfExperience <= 19; // Lead (15-19)
      if (level.level === 3) return yearsOfExperience >= 10 && yearsOfExperience <= 14; // Senior (10-14)
      if (level.level === 2) return yearsOfExperience >= 5 && yearsOfExperience <= 9; // Mid-Level (5-9)
      return yearsOfExperience >= 1 && yearsOfExperience <= 4; // Junior (1-4)
    });
  };

  useEffect(() => {
    if (selectedCandidateId) setSelectedCandidateID(selectedCandidateId);
  }, [selectedCandidateId]);

  const renderDefaultView = () => (
    <>
      {filteredCandidates.map((candidate) => {
        const jobs = candidate.jobs ?? [];
        const highestSeniorityJob = getHighestSeniorityJob(jobs);
        const highestSeniorityLevel = getSeniorityLevel(highestSeniorityJob.seniority);
        const extraJobsCount = jobs.length - 1;

        return (
          <div
            key={candidate.user_id}
            className={`mb-4 bg-white p-3 flex justify-between items-center gap-4 shadow-md rounded-xl ${candidate.isStarred ? 'border-2 border-yellow-400' :
              candidate.isValidated ? 'border border-green-500' : ''
              }`}
            style={{ boxShadow: "0 0 4px 1px #11355d69", borderRadius: "10px" }}
          >
            <div className="flex-shrink-0">
              <span className="bg-blue-200 text-blue-800 px-3 py-1 text-sm font-bold rounded-xl">
                {candidate.matching?.total_match_percentage ? `${Math.round(candidate.matching?.total_match_percentage)}%` : "0%"} correspondant
              </span>
            </div>

            <div className="w-[150px]">
              <span className="font-semibold">{`${candidate.first_name} ${candidate.last_name}`}</span>
            </div>

            <div className="flex items-center gap-1 min-w-[60px]">
              <Star size={16} className="text-yellow-500" />
              <span className="text-gray-600">{candidate.rating}</span>
            </div>

            <div className="w-[160px]">
              <span className="text-gray-500">
                {highestSeniorityLevel ? `${highestSeniorityLevel.name}: ${highestSeniorityLevel.description}` : "-"}
              </span>
            </div>

            <div className="min-w-[100px] flex justify-center">
              <span className="bg-gray-200 text-gray-700 px-3 py-1 text-xs rounded w-full text-center">
                {(() => {
                  switch (candidate.availability) {
                    case 'ONE_MONTH':
                      return 'Dans 1 mois';
                    case 'THREE_MONTHS':
                      return 'Dans 3 mois';
                    case 'IMMEDIATE':
                      return 'Immédiate';
                    default:
                      return candidate.availability || 'Non spécifiée';
                  }
                })()}
              </span>
            </div>

            <div className="inline-block w-0.5 self-stretch bg-neutral-100 dark:bg-white/10"></div>

            <div className="flex justify-between items-center gap-2 w-[400px]">
              <div>
                <span className="text-gray-600 text-sm mr-1">Competances:</span>
                <span className="bg-blue-300 text-blue-800 px-2 py-1 text-xs rounded inline-flex items-center text-nowrap w-fit">
                  {highestSeniorityJob.job} | {highestSeniorityJob.seniority} ans
                </span>
              </div>
              {extraJobsCount > 0 && (
                <div
                  className="relative"
                  ref={el => extraSkillsRef.current[candidate.user_id] = el}
                >
                  <button
                    onClick={() => toggleExtraSkills(candidate.user_id)}
                    className="bg-black text-white w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full cursor-pointer"
                  >
                    +{extraJobsCount}
                  </button>
                  {showExtraSkills[candidate.user_id] && (
                    <div className="absolute bg-white p-2 rounded-lg shadow-md mt-2 max-h-40 overflow-y-auto z-10">
                      <ul className="space-y-2">
                        {jobs.slice(1).map((job, index) => {
                          const seniorityLevel = seniorityLevels.find(level => level.level === job.seniority) || {
                            level: 0,
                            name: "-",
                            description: "-",
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

            {isAuthenticated() && (
              <div className="flex items-center gap-4">
                {candidate.matching?.is_starred ? (
                  <StarOff
                    fill="green"
                    size={24}
                    className="p-0.5 bg-black rounded-full hover:text-red-500 text-green-500 cursor-pointer transition-colors"
                    onClick={() => handleStarCandidate(candidate.user_id)}
                  />
                ) : (
                  <Star
                    fill="white"
                    size={24}
                    className="p-0.5 bg-black rounded-full hover:text-green-500 text-white cursor-pointer transition-colors"
                    onClick={() => handleStarCandidate(candidate.user_id)}
                  />
                )}

                <ArrowUpRight
                  size={24}
                  className="p-0.5 text-white bg-[#215A96] rounded-full hover:bg-gray-500 cursor-pointer transition-colors"
                  onClick={() => setSelectedCandidateID(candidate.user_id)}
                />

                {candidate.matching?.is_validated ? (
                  <MailX
                    size={24}
                    className="px-1 rounded-full bg-[#215A96] text-green-500 hover:text-red-500 cursor-pointer transition-colors"
                    onClick={() => handleValidateInterest(candidate.user_id)}
                  />
                ) : (
                  <MailCheck
                    size={24}
                    className="px-1 rounded-full bg-[#215A96] text-white hover:text-green-500 cursor-pointer transition-colors"
                    onClick={() => handleValidateInterest(candidate.user_id)}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Detail Modal */}
      {selectedCandidateID && (
        <CandidateDetailModal
          candidateId={selectedCandidateID}
          matchings={filteredCandidates.find(candidate => candidate.user_id === selectedCandidateID)?.matching ?? null}
          onClose={handleCloseModal}
          is_starred={filteredCandidates.find(candidate => candidate.user_id === selectedCandidateID)?.matching?.is_starred ?? false}
          is_validated={filteredCandidates.find(candidate => candidate.user_id === selectedCandidateID)?.matching?.is_validated ?? false}
          onStarCandidate={handleStarCandidate}
          onValidateInterest={handleValidateInterest}
        />
      )}
    </>
  );

  const renderSubmittedView = () => (
    <div className="space-y-3">
      {filteredCandidates.map((candidate) => {
        const jobs = candidate.jobs ?? [];
        const highestSeniorityJob = getHighestSeniorityJob(jobs);
        const highestSeniorityLevel = seniorityLevels.find(level => level.level === highestSeniorityJob.seniority);
        const extraJobsCount = jobs.length - 2;
        const backgroundColor = interpolateColor(candidate.matching?.total_match_percentage ?? 0);
        const textColor = getTextColor(backgroundColor);

        return (
          <div
            key={candidate.user_id}
            className={`bg-white p-3 rounded-lg shadow-md flex items-center justify-between gap-4 ${candidate.isStarred
              ? 'border-2 border-yellow-400'
              : candidate.isValidated
                ? 'border border-green-500'
                : ''}`}
            style={{ boxShadow: "0 0 4px 1px #11355d69", borderRadius: "10px" }}
          >
            {/* Badge correspondance */}
            <span className="px-3 py-1 text-sm font-semibold rounded-md"
              style={{
                backgroundColor,
                color: textColor,
              }}
            >
              {candidate.matching?.total_match_percentage ?? 0}% correspondant
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
              {extraJobsCount > 0 && (
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

  const LoadingSkeleton = ({ error = false }: { error?: boolean }) => (
    <div className="space-y-3">
      {[...Array(2)].map((_, index) => (
        <div
          key={index}
          className={`bg-white p-3 rounded-lg shadow-md grid grid-cols-7 gap-4 items-center ${error ? 'border border-red-600' : ''
            }`}
          style={{ boxShadow: "0 0 4px 1px #11355d69", borderRadius: "10px" }}
        >
          {/* Badge correspondance */}
          <div className="col-span-1">
            <div className={`h-8 rounded-md ${error ? 'bg-red-400' : 'bg-gray-200'}`}></div>
          </div>

          {/* Nom + Détails */}
          <div className="col-span-1">
            <div className={`h-4 rounded ${error ? 'bg-red-400' : 'bg-gray-200'}`}></div>
          </div>

          {/* Évaluation */}
          <div className="col-span-1 flex items-center gap-1">
            <div className={`h-4 w-4 rounded-full ${error ? 'bg-red-400' : 'bg-gray-200'}`}></div>
            <div className={`h-4 w-8 rounded ${error ? 'bg-red-400' : 'bg-gray-200'}`}></div>
          </div>

          {/* Niveau */}
          <div className="col-span-1">
            <div className={`h-4 rounded ${error ? 'bg-red-400' : 'bg-gray-200'}`}></div>
          </div>

          {/* Disponibilité */}
          <div className="col-span-1">
            <div className={`h-6 w-16 rounded ${error ? 'bg-red-400' : 'bg-gray-200'}`}></div>
          </div>

          {/* Compétences */}
          <div className="col-span-1 flex items-center gap-4">
            <div className={`h-4 w-16 rounded ${error ? 'bg-red-400' : 'bg-gray-200'}`}></div>
            <div className={`h-6 w-16 rounded ${error ? 'bg-red-400' : 'bg-gray-200'}`}></div>
          </div>

          {/* Actions à droite */}
          <div className="col-span-1 flex items-center gap-4">
            <div className={`h-8 w-8 rounded-full ${error ? 'bg-red-400' : 'bg-gray-200'}`}></div>
            <div className={`h-8 w-24 rounded-full ${error ? 'bg-red-400' : 'bg-gray-200'}`}></div>
            <div className={`h-8 w-8 rounded-full ${error ? 'bg-red-400' : 'bg-gray-200'}`}></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {apiType === "SUBMITTED" ? "Submissions" : "Suggestions"}
            <span className="text-gray-500"> (Loading...)</span>
          </h2>
          <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
        </div>
        <LoadingSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {apiType === "SUBMITTED" ? "Submissions" : "Suggestions"}
            <span className="text-gray-500 text-sm"> (Error: {error})</span>
          </h2>
          <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
        </div>
        <LoadingSkeleton error />
      </>
    );
  }

  return (
    <>
      {/* Titre + Slider */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {apiType === "SUBMITTED" ? (
            <>Submissions <span className="text-gray-500">({filteredCandidates.length} Candidates)</span></>
          ) : apiType === "ALL" ? (
            <>Suggestions <span className="text-gray-500">({filteredCandidates.length} Candidates)</span></>
          ) : (
            <>What ? <span className="text-gray-500">({filteredCandidates.length} Candidates)</span></>
          )}
        </h2>

        <div className="flex justify-between items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-300 shadow-sm">
          <span className="text-gray-500">Filter by</span>
          <input
            type="number"
            min="0"
            max="100"
            value={matchPercentageFilter}
            onChange={(e) => handlePercentageChange(parseInt(e.target.value) || 0)}
            className="w-full text-center outline-none border-2"
          />
          <span className="ml-1">%</span>
        </div>
      </div>

      {/* Liste des candidats */}
      {apiType === "SUBMITTED" ? renderSubmittedView() : renderDefaultView()}

      <footer className="mt-24">

      </footer>
    </>
  );
};

export default CandidatesList;