import { Star, StarOff, ArrowUpRight, MailX, MailCheck } from "lucide-react";
import { useRef } from "react";
import { CandidateSuggestion, CandidateJob } from "../types";
import { isAuthenticated } from "../../../../../../utils/jwt";

const seniorityLevels = [
  { level: 1, name: "Junior", description: "1 - 4 ans" },
  { level: 2, name: "Mid-Level", description: "5 - 9 ans" },
  { level: 3, name: "Senior", description: "10 - 14 ans" },
  { level: 4, name: "Lead", description: "15 - 19 ans" },
  { level: 5, name: "Principal", description: "20+ ans" },
];

interface CandidateCardProps {
  candidate: CandidateSuggestion;
  showExtraSkills: Record<string, boolean>;
  setShowExtraSkills: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onStarCandidate: (userId: string) => void;
  onValidateInterest: (userId: string) => void;
  onSelectCandidate: (userId: string) => void;
}

const CandidateCard = ({
  candidate,
  showExtraSkills,
  setShowExtraSkills: setShowSkills,
  onStarCandidate: handleStar,
  onValidateInterest: handleValidate,
  onSelectCandidate: selectCandidate,
}: CandidateCardProps) => {
  const extraSkillsRef = useRef<Record<string, HTMLDivElement | null>>({});

  const getHighestSeniorityJob = (jobs: CandidateJob[]) => {
    if (!jobs.length) return { job: "No job", seniority: 0 };
    return jobs.reduce((highest, job) => (job.seniority > highest.seniority ? job : highest), jobs[0]);
  };

  const getSeniorityLevel = (yearsOfExperience: number) => {
    return seniorityLevels.find(level => {
      if (level.level === 5) return yearsOfExperience >= 20;
      if (level.level === 4) return yearsOfExperience >= 15;
      if (level.level === 3) return yearsOfExperience >= 10;
      if (level.level === 2) return yearsOfExperience >= 5;
      return yearsOfExperience >= 1;
    });
  };

  const toggleExtraSkills = (userId: string) => {
    setShowSkills(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const formatAvailability = (availability?: string) => {
    switch (availability) {
      case 'ONE_MONTH': return 'Dans 1 mois';
      case 'THREE_MONTHS': return 'Dans 3 mois';
      case 'IMMEDIATE': return 'Immédiate';
      default: return availability || 'Non spécifiée';
    }
  };

  const jobs = candidate.jobs ?? [];
  const highestSeniorityJob = getHighestSeniorityJob(jobs);
  const highestSeniorityLevel = getSeniorityLevel(highestSeniorityJob.seniority);
  const extraJobsCount = jobs.length - 1;
  const matchPercentage = Math.round(candidate.matching?.total_match_percentage ?? 0);

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
          {matchPercentage}% correspondant
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
          {formatAvailability(candidate.availability)}
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
          <div ref={el => extraSkillsRef.current[candidate.user_id] = el}>
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
                    const level = getSeniorityLevel(job.seniority);
                    return (
                      <li key={index} className="text-xs text-gray-600 border-b border-gray-200 pb-2">
                        <div>{job.job}</div>
                        <div>{level?.name}: {level?.description}</div>
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
          {candidate.isStarred ? (
            <StarOff
              fill="green"
              size={24}
              className="p-0.5 bg-black rounded-full hover:text-red-500 text-green-500 cursor-pointer transition-colors"
              onClick={() => handleStar(candidate.user_id)}
            />
          ) : (
            <Star
              fill="white"
              size={24}
              className="p-0.5 bg-black rounded-full hover:text-green-500 text-white cursor-pointer transition-colors"
              onClick={() => handleStar(candidate.user_id)}
            />
          )}

          <ArrowUpRight
            size={24}
            className="p-0.5 text-white bg-[#215A96] rounded-full hover:bg-gray-500 cursor-pointer transition-colors"
            onClick={() => selectCandidate(candidate.user_id)}
          />

          {candidate.isValidated ? (
            <MailX
              size={24}
              className="px-1 rounded-full bg-[#215A96] text-green-500 hover:text-red-500 cursor-pointer transition-colors"
              onClick={() => handleValidate(candidate.user_id)}
            />
          ) : (
            <MailCheck
              size={24}
              className="px-1 rounded-full bg-[#215A96] text-white hover:text-green-500 cursor-pointer transition-colors"
              onClick={() => handleValidate(candidate.user_id)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CandidateCard;