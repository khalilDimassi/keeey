import { useState } from "react";
import { isAuthenticated } from "../../../utils/jwt";
import { CompetenceSVG } from "../../components/SVGcomponents";

import GuestMode from "./content/GuestMode";
import OnlineMode from "./content/OnlineMode";
import JobOpportunities from "./content/JobOpportunities";

const ProfileKProfile = ({ onClose }: { onClose: () => void }) => {
  const [isOnline] = useState(isAuthenticated);

  return (
    <div className="w-full">
      <div className="flex items-center space-x-3 my-4">
        <CompetenceSVG
          className={`w-8 h-8 md:w-4 md:h-4 lg:w-8 lg:h-8 transition-all duration-500 `}
          color="#297280"
        />
        <h1 className="text-xl font-semibold text-black">
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

export default ProfileKProfile;