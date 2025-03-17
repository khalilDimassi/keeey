import React, { useState } from "react";
import Competences, { Sector } from "./Competences";
import Criteres from "./Criteres";
import { Building2 } from "lucide-react";

interface CompetencesProps {
  sectors: Sector[];
  loading: boolean;
  error: string | null;
}

const CompetencesEtCriteres: React.FC<CompetencesProps> = ({ sectors, loading, error }) => {

  const [selectedContract, setSelectedContract] = useState<string>("CDI");
  const [remoteWork, setRemoteWork] = useState<string>("Non");


  return (
    <div>
      <div className="flex ml-5 items-center space-x-3 mt-1 mb-1">
        <Building2 className="text-blue-800" size={40} />
        <h1 className="text-xl font-semibold">Compétences</h1>
      </div>
      <div className="p-4 flex gap-5">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <Competences
            sectors={sectors}
          // onSelectionChange={handleSelectionChange}
          />
        )}
        <Criteres
          selectedContract={selectedContract}
          setSelectedContract={setSelectedContract}
          remoteWork={remoteWork}
          setRemoteWork={setRemoteWork}
        />
      </div>
    </div>
  );
};

export default CompetencesEtCriteres;