import React, { useEffect, useState } from 'react';

export interface Job {
  id: number;
  job: string;
}

export interface Sector {
  id: number;
  sector: string;
  jobs: Job[];
}

export interface UserSelection {
  id: number;
  seniority: number;
  jobs: number[];
}

interface SectorsProps {
  sectors: Sector[];
  initialSelections?: UserSelection[];
  onSelectionChange: (selections: UserSelection[]) => void;
}

const Sectors: React.FC<SectorsProps> = ({
  sectors,
  initialSelections = [],
  onSelectionChange
}) => {
  const [selectedSectors, setSelectedSectors] = useState<number[]>([]);
  const [activeSector, setActiveSector] = useState<number | null>(null);
  const [seniority, setSeniority] = useState<{ [key: number]: number }>({});
  const [selectedJobs, setSelectedJobs] = useState<{ [key: number]: number[] }>({});

  useEffect(() => {
    if (initialSelections.length > 0) {
      const sectorIds = initialSelections.map(selection => selection.id);
      const seniorityData: { [key: number]: number } = {};
      const jobsData: { [key: number]: number[] } = {};

      initialSelections.forEach(selection => {
        seniorityData[selection.id] = selection.seniority;
        jobsData[selection.id] = selection.jobs;
      });

      setSelectedSectors(sectorIds);
      setSeniority(seniorityData);
      setSelectedJobs(jobsData);
      if (sectorIds.length > 0) {
        setActiveSector(sectorIds[0]);
      }
    }
  }, [initialSelections]);

  // Handle sector selection
  const toggleSector = (sectorId: number) => {
    if (selectedSectors.includes(sectorId)) {
      setSelectedSectors(selectedSectors.filter(id => id !== sectorId));
      setSeniority(prev => {
        const updated = { ...prev };
        delete updated[sectorId];
        return updated;
      });
      setSelectedJobs(prev => {
        const updated = { ...prev };
        delete updated[sectorId];
        return updated;
      });
      if (activeSector === sectorId) {
        // Set the next available sector as active or null if none left
        const remainingSectors = selectedSectors.filter(id => id !== sectorId);
        setActiveSector(remainingSectors.length > 0 ? remainingSectors[0] : null);
      }
    } else if (selectedSectors.length < 3) {
      setSelectedSectors([...selectedSectors, sectorId]);
      setSeniority(prev => ({ ...prev, [sectorId]: 1 }));
      setSelectedJobs(prev => ({ ...prev, [sectorId]: [] }));
      setActiveSector(sectorId);
    }
  };

  // Handle seniority change
  const handleSeniorityChange = (sectorId: number, value: number) => {
    setSeniority(prev => ({ ...prev, [sectorId]: value }));
  };

  // Handle job selection
  const toggleJob = (sectorId: number, jobId: number) => {
    setSelectedJobs(prev => {
      const jobs = prev[sectorId] || [];
      if (jobs.includes(jobId)) {
        return { ...prev, [sectorId]: jobs.filter(id => id !== jobId) };
      } else {
        return { ...prev, [sectorId]: [...jobs, jobId] };
      }
    });
  };

  // Collect and return user selections
  const collectSelections = () => {
    const selections = selectedSectors.map(sectorId => ({
      id: sectorId,
      seniority: seniority[sectorId],
      jobs: selectedJobs[sectorId] || [],
    }));
    onSelectionChange(selections);
  };

  // Render seniority slider
  const renderSenioritySlider = (sectorId: number) => {
    const seniorityLevels = [
      { level: 1, name: "Junior", description: "1 - 4 ans" },
      { level: 2, name: "Mid-Level", description: "5 - 9 ans" },
      { level: 3, name: "Senior", description: "10 - 14 ans" },
      { level: 4, name: "Lead", description: "15 - 19 ans" },
      { level: 5, name: "Principal", description: "20+ ans" },
    ];
    const currentLevel = seniority[sectorId] || 1;
    const currentSeniority = seniorityLevels.find(level => level.level === currentLevel);

    return (
      <div className="my-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{currentSeniority?.name}</span>
          <span>{currentSeniority?.description}</span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          value={currentLevel}
          onChange={(e) => handleSeniorityChange(sectorId, parseInt(e.target.value))}
          className="w-full"
        />
      </div>
    );
  };

  // Render jobs list
  const renderJobs = (sectorId: number) => {
    const sector = sectors.find(s => s.id === sectorId);
    if (!sector) return null;
    return (
      <div className="flex flex-wrap gap-2 my-4">
        {sector.jobs.map(job => (
          <button
            key={job.id}
            className={`px-4 py-2 rounded-full text-sm flex items-center ${selectedJobs[sectorId]?.includes(job.id) ? 'bg-teal-700 text-white' : 'bg-white border border-gray-300'
              }`}
            onClick={() => toggleJob(sectorId, job.id)}
          >
            {job.job} <span className="ml-1">+</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <h3 className="text-gray-600 mb-3 text-sm">Secteur</h3>
      <div className="flex flex-wrap gap-2 mb-6">
        {sectors.map(sector => (
          <button
            key={sector.id}
            className={`
              px-4 py-2 rounded-full text-sm flex items-center 
              ${selectedSectors.includes(sector.id) ? 'bg-teal-700 text-white' : 'bg-white border border-gray-300'}
            `}
            onClick={() => toggleSector(sector.id)}
            disabled={!selectedSectors.includes(sector.id) && selectedSectors.length >= 3}
          >
            {sector.sector} <span className="ml-1">{selectedSectors.includes(sector.id) ? '-' : '+'}</span>
          </button>
        ))}
      </div>

      {/* Selected sectors display */}
      {selectedSectors.length > 0 && (
        <div className="flex justify-center items-center">
          <div
            className="inline-flex border border-gray-300 rounded-md overflow-hidden mb-6"
            style={{ borderRadius: "20px" }}
          >
            {selectedSectors.map(sectorId => (
              <button
                key={sectorId}
                className={`px-4 py-2 ${activeSector === sectorId
                  ? "bg-teal-700 text-white"
                  : "bg-white border-r border-gray-300"
                  }`}
                onClick={() => setActiveSector(sectorId)}
              >
                {activeSector === sectorId && (
                  <span className="inline-flex items-center justify-center w-4 h-4 bg-teal-700 text-white rounded-full mr-1 text-xs">
                    ✓
                  </span>
                )}
                {sectors.find(s => s.id === sectorId)?.sector}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeSector !== null && (
        <div className="my-6">
          {renderSenioritySlider(activeSector)}
          {renderJobs(activeSector)}
        </div>
      )}

      <button
        className="mt-6 px-4 py-2 bg-teal-700 text-white rounded-full"
        onClick={collectSelections}
      >
        Save Selections
      </button>
    </>
  );
};

export default Sectors; 