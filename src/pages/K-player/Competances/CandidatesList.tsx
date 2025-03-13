import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Star, Bookmark, ArrowUpRight, ChevronDown } from "lucide-react";

interface Job {
  job: string;
  seniority: number;
}

interface Candidate {
  user_id: string;
  first_name: string;
  last_name: string;
  rating: number;
  availability: string;
  jobs: Job[] | null;
}

const CandidatesList: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/suggestions/candidates`);

        const candidatesWithDefaultJobs = response.data.map((candidate: Candidate) => ({
          ...candidate,
          jobs: candidate.jobs ?? [],
        }));
        setCandidates(candidatesWithDefaultJobs);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    fetchCandidates();
  }, []);

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

  const [showExtraJobs, setShowExtraJobs] = useState(false);
  const extraJobsRef = useRef<HTMLDivElement>(null);

  // Close the extra jobs list when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: { target: any; }) => {
      if (extraJobsRef.current && !extraJobsRef.current.contains(event.target)) {
        setShowExtraJobs(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="">
      {/* Titre + Sélecteur */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Candidats <span className="text-gray-500">({candidates.length} Candidats)</span>
        </h2>
        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-md border border-gray-300 shadow-sm">
          Matching <ChevronDown size={16} />
        </button>
      </div>

      {/* Liste des candidats */}
      <div className="space-y-3">
        {candidates.map((candidate) => {
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
                  80% correspondant
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
                  <div className="relative" ref={extraJobsRef}>
                    <button
                      onClick={() => setShowExtraJobs(!showExtraJobs)}
                      className="bg-black text-white w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full cursor-pointer"
                    >
                      +{extraJobsCount}
                    </button>
                    {showExtraJobs && (
                      <div className="absolute bg-white p-2 rounded-lg shadow-md mt-2 max-h-40 overflow-y-auto">
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
                <Bookmark size={35} className="text-gray-500 cursor-pointer" />
                <button className="bg-blue-800 text-white px-4 py-2 rounded-3xl flex items-center gap-2" style={{ backgroundColor: "#215A96", borderRadius: "10px" }}>
                  Valider l’intérêt
                </button>
                <div className="bg-blue-800 p-2 rounded-full flex items-center justify-center" style={{ backgroundColor: "#215A96" }}>
                  <ArrowUpRight size={20} className="text-white top-4 right-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CandidatesList;