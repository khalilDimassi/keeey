import { useEffect, useRef, useState } from "react";
import { Star, ArrowUpRight, Check, MailCheck, MailX, StarOff } from "lucide-react";
import { CandidateSuggestion, CandidateSkill } from "../types";
import { fetchCandidatesWithMatchData, starCandidate, updateCandidateStatus, validateCandidateInterest } from "../services";
import { isAuthenticated } from "../../../../utils/jwt";
import { emitter } from "../../../../utils/eventEmitter";

interface CandidatesListProps {
  apiType?: string;
  opportunityId?: string;
}

const CandidatesList = ({ apiType = "ALL", opportunityId }: CandidatesListProps) => {
  const [candidateSuggestion, setCandidateSuggestion] = useState<CandidateSuggestion[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<CandidateSuggestion[]>([]);
  const [showExtraSkills, setShowExtraSkills] = useState<{ [key: string]: boolean }>({});
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
      setFilteredCandidates(candidates);
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
    // First filter by match percentage
    const filtered = candidateSuggestion.filter(candidate =>
      candidate.totalMatchPercentage !== undefined &&
      candidate.totalMatchPercentage >= matchPercentageFilter
    );

    // Then sort by starred/validated status and match percentage
    const sorted = [...filtered].sort((a, b) => {
      // First priority: Starred candidates
      if (a.isStarred && !b.isStarred) return -1;
      if (!a.isStarred && b.isStarred) return 1;

      // Second priority: Validated candidates
      if (a.isValidated && !b.isValidated) return -1;
      if (!a.isValidated && b.isValidated) return 1;

      // Third priority: Match percentage (higher first)
      const matchA = a.totalMatchPercentage || 0;
      const matchB = b.totalMatchPercentage || 0;
      return matchB - matchA;
    });

    setFilteredCandidates(sorted);
  }, [matchPercentageFilter, candidateSuggestion]);

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
          const matchA = a.totalMatchPercentage || 0;
          const matchB = b.totalMatchPercentage || 0;
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
          const matchA = a.totalMatchPercentage || 0;
          const matchB = b.totalMatchPercentage || 0;
          return matchB - matchA;
        });
      });
    } catch (error) {
      console.error("Error validating candidate interest:", error);
      // TODO: add error state handling here if needed
    }
  };

  const getHighestSenioritySkill = (skills: CandidateSkill[]) => {
    if (skills.length === 0) return { skill: "No skill", seniority: 0 };
    return skills.reduce((highest, skill) => (skill.seniority > highest.seniority ? skill : highest), skills[0]);
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

  const renderDefaultView = () => (
    <div className="space-y-3">
      {filteredCandidates.map((candidate) => {
        const skills = candidate.skills ?? [];
        const highestSenioritySkill = getHighestSenioritySkill(skills);
        const highestSeniorityLevel = seniorityLevels.find(level => level.level === highestSenioritySkill.seniority);
        const extraSkillsCount = skills.length - 1;

        return (
          <div
            key={candidate.user_id}
            className={`bg-white p-3 flex items-center gap-4 shadow-md rounded-xl ${candidate.isStarred ? 'border-2 border-yellow-400' :
              candidate.isValidated ? 'border border-green-500' : ''
              }`}
            style={{ boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)", borderRadius: "10px" }}
          >
            {/* Badge correspondance */}
            <div className="flex-shrink-0">
              <span className="bg-blue-200 text-blue-800 px-3 py-1 text-sm font-bold rounded-xl">
                {candidate.totalMatchPercentage ? `${Math.round(candidate.totalMatchPercentage)}%` : "0%"} correspondant
              </span>
            </div>

            {/* Nom + Détails */}
            <div className="flex-shrink-0 min-w-[120px]">
              <span className="font-semibold">{`${candidate.first_name} ${candidate.last_name}`}</span>
            </div>

            {/* Évaluation */}
            <div className="flex-shrink-0 flex items-center gap-1 min-w-[60px]">
              <Star size={16} className="text-yellow-500" />
              <span className="text-gray-600">{candidate.rating}</span>
            </div>

            {/* Niveau */}
            <div className="flex-1 min-w-[100px] max-w-[160px]">
              <span className="text-gray-500">
                {highestSeniorityLevel ? `${highestSeniorityLevel.name}: ${highestSeniorityLevel.description}` : "-"}
              </span>
            </div>

            {/* Disponibilité */}
            <div className="flex-shrink-0 min-w-[100px] flex justify-center">
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

            {/* Compétences */}
            <div className="flex-1 flex justify-between items-center gap-4 overflow-hidden min-w-[200px]">
              <span className="text-gray-600 text-sm">Competances:</span>
              <span className="bg-blue-300 text-blue-800 px-2 py-1 text-xs rounded inline-flex items-center">
                {highestSenioritySkill.skill}
              </span>
              {extraSkillsCount > 0 && (
                <div
                  className="relative"
                  ref={el => extraSkillsRef.current[candidate.user_id] = el}
                >
                  <button
                    onClick={() => toggleExtraSkills(candidate.user_id)}
                    className="bg-black text-white w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full cursor-pointer"
                  >
                    +{extraSkillsCount}
                  </button>
                  {showExtraSkills[candidate.user_id] && (
                    <div className="absolute bg-white p-2 rounded-lg shadow-md mt-2 max-h-40 overflow-y-auto z-10">
                      <ul className="space-y-2">
                        {skills.slice(1).map((skill, index) => {
                          const seniorityLevel = seniorityLevels.find(level => level.level === skill.seniority) || {
                            level: 0,
                            name: "Unknown",
                            description: "Unknown",
                          };

                          return (
                            <li key={index} className="text-xs text-gray-600 border-b border-gray-200 pb-2">
                              <div>{skill.skill}</div>
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
            {isAuthenticated() && (
              <div className="flex-shrink-0 flex items-center gap-4 ml-auto">
                <button
                  className={`p-2 bg-black rounded-full transition-colors ${candidate.isStarred
                    ? 'hover:text-red-500 text-green-500'
                    : 'hover:text-green-500 text-white'
                    }`}
                  onClick={() => handleStarCandidate(candidate.user_id)}
                  title={candidate.isStarred ? 'Remove star' : 'Add star'}
                >
                  {candidate.isStarred ? (
                    <StarOff fill="green" size={18} />
                  ) : (
                    <Star fill="white" size={18} />
                  )}
                </button>

                <button
                  className="p-2 text-white bg-[#215A96] rounded-full hover:bg-gray-500 transition-colors"
                  title="Open user profile"
                  onClick={() => {/* Placeholder for user profile popup */ }}
                >
                  <ArrowUpRight size={18} />
                </button>

                <button
                  className={`px-3 py-1.5 rounded-full bg-[#215A96] flex items-center gap-1 transition-colors ${candidate.isValidated
                    ? 'text-green-500 hover:text-red-500'
                    : 'text-white hover:text-green-500'
                    }`}
                  onClick={() => handleValidateInterest(candidate.user_id)}
                  disabled={candidate.isValidated}
                  title={candidate.isValidated ? 'Revoke validation' : 'Validate interest'}
                >
                  {candidate.isValidated ? (
                    <MailX size={24} />
                  ) : (
                    <MailCheck size={24} />
                  )}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderSubmittedView = () => (
    <div className="space-y-3">
      {filteredCandidates.map((candidate) => {
        const skills = candidate.skills ?? [];
        const highestSenioritySkill = getHighestSenioritySkill(skills);
        const highestSeniorityLevel = seniorityLevels.find(level => level.level === highestSenioritySkill.seniority);
        const extraSkillsCount = skills.length - 2;
        const backgroundColor = interpolateColor(candidate.totalMatchPercentage ?? 0);
        const textColor = getTextColor(backgroundColor);

        return (
          <div
            key={candidate.user_id}
            className={`bg-white p-3 rounded-lg shadow-md flex items-center justify-between gap-4 ${candidate.isStarred
              ? 'border-2 border-yellow-400'
              : candidate.isValidated
                ? 'border border-green-500'
                : ''}`}
            style={{ boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)", borderRadius: "10px" }}
          >
            {/* Badge correspondance */}
            <span className="px-3 py-1 text-sm font-semibold rounded-md"
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
                {highestSenioritySkill.skill}
              </span>
              {skills.slice(1, 2).map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-300 text-blue-800 px-2 py-1 text-xs rounded items-center"
                >
                  {skill.skill}
                </span>
              ))}
              {extraSkillsCount > 0 && (
                <span className="bg-black text-white w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full">
                  +{extraSkillsCount}
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
          style={{ boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)", borderRadius: "10px" }}
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
    </>
  );
};

export default CandidatesList;