import { useState } from "react";
import { Namedsectors } from "../../types";

const Competences = ({ data }: { data: Namedsectors[] }) => {
  const [sectors, _setSectors] = useState(data ?? []);

  return (
    <>
      {sectors.length > 0 ? (
        <div className="space-y-4">
          {sectors.map(sector => {
            const sectorData = sectors.find(s => s.sector === sector.sector);
            return (
              <div key={sector.sector} className="border rounded-xl p-4 bg-gray-50 hover:shadow-md">
                <div className="flex justify-between items-center mb-2 ">
                  <h3 className="font-medium">{sectorData?.sector}</h3>
                  <div className="flex items-center">
                    <span className="font-medium">
                      {sector.seniority <= 4 ? "Junior" :
                        sector.seniority <= 9 ? "Mid-Level" :
                          sector.seniority <= 14 ? "Senior" :
                            sector.seniority <= 19 ? "Chef" :
                              "Principal"}
                    </span>
                    <span className="text-sm text-gray-600 mx-2">Seniorité ({sector.seniority} ans)</span>
                  </div>
                </div>
                {sector.jobs.length > 0 && (
                  <div>
                    <p className="text-gray-600 mb-1">Métiers</p>
                    <div className="space-y-2">
                      {sector.jobs.map(job => {
                        const jobData = sectorData?.jobs?.find(j => j.job === job.job);
                        return (
                          <div key={job.job} className="pl-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-[#297280] text-white px-3 py-1 rounded-xl">
                                {jobData?.job}
                              </span>
                              {job.skills.length > 0 && (
                                <span className="text-sm text-gray-500">
                                  ({job.skills.length} compétence{job.skills.length > 1 ? 's' : ''})
                                </span>
                              )}
                            </div>

                            {job.skills.length > 0 && (
                              <div className="flex flex-wrap gap-2 pl-4 rounded-xl">
                                {job.skills.map(skillId => {
                                  const skill = jobData?.skills?.find(s => s === skillId);
                                  return (
                                    <span
                                      key={skillId}
                                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
                                    >
                                      {skill}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">Aucun secteur sélectionné</p>
      )}
    </>
  );
};

export default Competences;
