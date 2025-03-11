import React, { useEffect, useState } from "react";
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
          const extraJobsCount = jobs.length - 1;

          return (
            <div
              key={candidate.user_id}
              className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between gap-4"
              style={{ boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)", borderRadius: "10px" }}
            >
              {/* Badge correspondance */}
              <span className="bg-blue-300 text-blue-800 px-3 py-1 text-sm font-semibold rounded-md">
                80% correspondant
              </span>

              {/* Nom + Détails */}
              <span className="font-semibold">{`${candidate.first_name} ${candidate.last_name}`}</span>

              {/* Évaluation */}
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-500" />
                <span className="text-gray-600">{candidate.rating}</span>
              </div>

              {/* Niveau */}
              <span className="text-gray-500">{`Seniority: ${highestSeniorityJob.seniority}`}</span>

              {/* Disponibilité */}
              <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded">
                {candidate.availability}
              </span>

              {/* Compétences */}
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Compétences :</span>
                <span className="bg-blue-300 text-blue-800 w-14 px-2 py-1 text-xs rounded items-center">
                  {highestSeniorityJob.job}
                </span>
                {extraJobsCount > 0 && (
                  <div className="relative">
                    <span className="bg-black text-white w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full cursor-pointer">
                      +{extraJobsCount}
                    </span>
                    <div className="absolute hidden bg-white p-2 rounded-lg shadow-md mt-2">
                      {jobs.slice(1).map((job, index) => {
                        const seniorityLevel = seniorityLevels.find(level => level.level === job.seniority) || {
                          level: 0,
                          name: "Unknown",
                          description: "Unknown",
                        };

                        return (
                          <div key={index} className="text-xs text-gray-600">
                            {job.job} - {seniorityLevel.name} ({seniorityLevel.description})
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions à droite */}
              <div className="flex items-center gap-4">
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