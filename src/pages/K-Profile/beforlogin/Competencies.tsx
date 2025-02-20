import axios from "axios";
import { useState, useEffect } from "react";
import { getAuthHeader, isAuthenticated } from "../../utils/jwt";

interface Job {
  name: string;
  comp: string[];
}

interface SectorData {
  sector: string;
  jobs: Job[];
}

function Competencies() {
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [sectorData, setSectorData] = useState<SectorData[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [connecte] = useState(isAuthenticated);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectorResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/suggestions`
        );
        if (!sectorResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const sectorDataResult: SectorData[] = await sectorResponse.json();
        setSectorData(sectorDataResult);

        if (connecte) {
          const skillsResponse = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/skills/v2`,
            { headers: getAuthHeader() }
          );

          if (skillsResponse.status === 200) {
            const userSkills: string[] = skillsResponse.data || [];
            setSelectedSkills(userSkills);

            for (const sector of sectorDataResult) {
              for (const job of sector.jobs) {
                const hasMatchingSkills = job.comp.some(skill =>
                  userSkills.includes(skill)
                );
                if (hasMatchingSkills) {
                  setSelectedSectors(prev =>
                    prev.includes(sector.sector) ? prev : [...prev, sector.sector]
                  );
                  setSelectedSector(sector.sector);
                  setSelectedJob(job.name);
                  break;
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [connecte]);

  const handleSectorSelect = (sector: string) => {
    setSelectedSectors((prev) => {
      const newSelectedSectors = prev.includes(sector)
        ? prev.filter((item) => item !== sector)
        : prev.length < 3
          ? [...prev, sector]
          : prev;
      if (!prev.includes(sector)) {
        setSelectedSector(sector);
      }
      return newSelectedSectors;
    });
  };

  const handleJobSelect = (job: string) => {
    setSelectedJob(selectedJob === job ? null : job);
  };

  const handleSkillSelect = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((item) => item !== skill)
        : [...prev, skill]
    );
  };

  const getJobSelectedSkillsCount = (job: Job) => {
    return job.comp.filter(skill => selectedSkills.includes(skill)).length;
  };

  const handleSaveSkills = async () => {
    if (!connecte) {
      alert('Please log in to save your skills');
      return;
    }

    setIsSaving(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/skill/v2`,
        { skills: selectedSkills },
        {
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        }
      );

      if (response.status === 200) {
        alert('Skills saved successfully!');
      } else {
        throw new Error('Failed to save skills');
      }
    } catch (error) {
      console.error('Error saving skills:', error);
      alert('Failed to save skills. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Get unique sectors from the data
  const sectors = Array.from(
    new Set(
      Array.isArray(sectorData)
        ? sectorData.map((data) => data.sector)
        : []
    )
  );

  // Get jobs for selected sector
  const selectedSectorJobs = selectedSector
    ? sectorData.find((data) => data.sector === selectedSector)?.jobs || []
    : [];

  // Get skills for selected job
  const selectedJobSkills = selectedJob
    ? selectedSectorJobs.find((job) => job.name === selectedJob)?.comp || []
    : [];

  return (
    <div className="space-y-6 p-4">
      {isLoading ? (
        <div className="text-center text-gray-600">Chargement des secteurs...</div>
      ) : (
        <>
          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSkills}
              disabled={!connecte || selectedSkills.length === 0 || isSaving}
              className={`px-4 py-2 rounded-lg transition ${!connecte || selectedSkills.length === 0 || isSaving
                ? "bg-gray-300 text-gray-500"
                : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
            >
              {isSaving ? "Saving..." : "Save Selected Skills"}
            </button>
          </div>

          {/* Sector Selection Section */}
          <div className="rounded-lg p-4 bg-gray-50 shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">
              Choisissez le secteur de compétences qui correspond à votre domaine d'expertise
              <span className="text-sm text-gray-500"> (Choisissez 3 maximum)</span>
            </h2>

            <div className="flex flex-wrap gap-3 mt-3">
              {sectors.map((sector) => (
                <label key={sector} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedSectors.includes(sector)}
                    onChange={() => handleSectorSelect(sector)}
                    className="hidden"
                  />
                  <div
                    className={`flex items-center px-4 py-2 rounded-lg border cursor-pointer transition ${selectedSectors.includes(sector)
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    <span className="mr-2">
                      <input
                        type="checkbox"
                        checked={selectedSectors.includes(sector)}
                        readOnly
                        className="accent-teal-600"
                      />
                    </span>
                    {sector}
                  </div>
                </label>
              ))}
            </div>

            {/* Selected Sectors Bar */}
            {selectedSectors.length > 0 && (
              <div className="flex gap-0 items-center justify-center mt-4">
                {selectedSectors.map((sector, index) => (
                  <button
                    key={sector}
                    className={`px-4 py-2 text-sm font-medium ${selectedSector === sector ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700"
                      } 
                    ${index > 0 ? "border-l-2 border-white" : ""} 
                    ${index === 0 ? "rounded-l-full" : ""} 
                    ${index === selectedSectors.length - 1 ? "rounded-r-full" : ""}`}
                    style={{
                      width: `${100 / selectedSectors.length}%`,
                    }}
                    onClick={() => setSelectedSector(sector)}
                  >
                    {sector}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Jobs and Skills Section */}
          {selectedSectors.length > 0 && selectedSector && selectedSectors.includes(selectedSector) && (
            <div className="rounded-lg p-4 bg-gray-50 shadow-md">
              {/* Jobs Display */}
              <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-gray-700">{selectedSector}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSectorJobs.map((job) => {
                    const selectedSkillsCount = getJobSelectedSkillsCount(job);
                    return (
                      <button
                        key={job.name}
                        className={`px-3 py-1 rounded-lg border transition flex items-center gap-2 ${selectedJob === job.name
                          ? "bg-teal-600 text-white border-teal-600"
                          : "bg-white text-gray-700 border-gray-300"
                          }`}
                        onClick={() => handleJobSelect(job.name)}
                      >
                        {job.name}
                        {selectedSkillsCount > 0 && (
                          <span className={`px-2 py-0.5 rounded-full text-sm ${selectedJob === job.name
                            ? "bg-white text-teal-600"
                            : "bg-teal-100 text-teal-600"
                            }`}>
                            {selectedSkillsCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skills Display */}
              {selectedJob && selectedJobSkills.length > 0 && (
                <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-700">{selectedJob}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedJobSkills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => handleSkillSelect(skill)}
                        className={`px-3 py-1 rounded-lg border transition flex items-center gap-2 ${selectedSkills.includes(skill)
                          ? "bg-teal-600 text-white border-teal-600"
                          : "bg-gray-200 text-gray-700 border-gray-300"
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSkills.includes(skill)}
                          readOnly
                          className="accent-teal-600"
                        />
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Competencies;