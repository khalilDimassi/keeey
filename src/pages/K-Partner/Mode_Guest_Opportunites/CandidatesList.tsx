import React from "react";
import { Star } from "lucide-react";

const CandidatesList: React.FC = () => {
  return (
    <div className=" sm:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-2">
        <h2 className="text-lg md:text-xl font-medium text-gray-800">
          Candidats <span className="text-gray-500">(10 Candidats)</span>
        </h2>
        <div className="relative">
          <button className="flex items-center gap-2 bg-white px-3 py-1 md:px-4 md:py-2 rounded-md border border-gray-300 text-gray-700 text-sm">
            Matching 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Candidates List */}
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="mb-4 bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            {/* Left side - becomes vertical on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 flex-wrap">
              {/* Row 1 on mobile / All in one row on desktop */}
              <div className="flex flex-wrap gap-2 md:gap-4">
                {/* Matching badge */}
                <div className="bg-amber-50 text-amber-800 px-2 md:px-3 py-1 text-xs md:text-sm font-medium rounded-md whitespace-nowrap">
                  80% correspondant
                </div>

                {/* Name */}
                <div className="font-medium text-gray-800">Nom Prenom</div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-600 font-medium text-sm">4.2</span>
                </div>

                {/* Level */}
                <div className="text-gray-600 text-sm">Intermédiaire</div>

                {/* Availability */}
                <div className="text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 text-xs rounded">
                    Immédiate
                  </span>
                </div>
              </div>

              {/* Row 2 on mobile / Same row on desktop */}
              <div className="flex items-center gap-2 mt-2 lg:mt-0">
                <span className="text-gray-600 text-xs md:text-sm">Compétences :</span>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((exp) => (
                    <span key={exp} className="bg-amber-50 text-amber-700 px-2 md:px-3 py-1 text-xs rounded-md">
                      exp
                    </span>
                  ))}
                  <span className="hidden md:inline">
                    {[4, 5].map((exp) => (
                      <span key={exp} className="bg-amber-50 text-amber-700 px-3 py-1 text-xs rounded-md mx-1">
                        exp
                      </span>
                    ))}
                  </span>
                  <span className="bg-gray-800 text-white w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full text-xs">
                    +4
                  </span>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center justify-end gap-2 md:gap-3 mt-2 lg:mt-0">
              {/* Bookmark button */}
              <button className="text-gray-400">
                <svg width="20" height="20" className="md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
              </button>

              {/* Validate interest button */}
              <button className="bg-PartnerColer hover:bg-amber-800 text-white px-2 md:px-4 py-1 md:py-2 rounded-xl md:rounded-xl flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                <svg width="14" height="14" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Valider l'intérêt
              </button>

              {/* Arrow button */}
              <button className="bg-PartnerColer p-1 md:p-2 rounded-full flex items-center justify-center">
                <svg width="14" height="14" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CandidatesList;