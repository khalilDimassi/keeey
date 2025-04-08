import { useState } from "react";
import { isAuthenticated } from "../../../../utils/jwt";
import GuestMode from "./content/GuestMode";
import OnlineMode from "./content/OnlineMode";
import JobOpportunities from "./content/JobOpportunities";

const KProfile = ({ onClose }: { onClose: () => void }) => {
  const [isOnline] = useState(isAuthenticated);

  return (
    <div className="w-full">
      <div className="flex items-center space-x-3 my-4">
        <h1 className="text-xl font-semibold bg-gradient-to-b from-[#30797F] to-[#039DAA] bg-clip-text text-transparent">
          Mon Profil
        </h1>
      </div>

      {isOnline ? (
        <OnlineMode onClose={onClose} />
      ) : (
        <GuestMode onClose={onClose} />
      )}

      <JobOpportunities />
    </div>
  );
};

export default KProfile;