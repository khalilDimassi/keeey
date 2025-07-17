import { useEffect, useState } from "react";
import { FetchOrg, FetchProfile } from "./services";
import { Profile, Organization } from "./types";
import { ProfileCompanySVG } from "../../components/SVGcomponents";

import DetailsCard from "./content/DetailsCard";
import OrgCard from "./content/OrgCard";
import UsersCard from "./content/UsersCard";

const ProfileKPlayer = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [prfLoading, setPrfloading] = useState(true);
  const [prfError, setPrfError] = useState<string | null>(null);

  const fetchProfuileData = async () => {
    setPrfloading(true);
    try {
      const data = await FetchProfile();
      setProfile(data);
      setPrfError(null);
    } catch (err) {
      setPrfError(err instanceof Error ? err.message : "Unknown error occurred");
      setProfile(null);
    } finally {
      setPrfloading(false);
    }
  };

  useEffect(() => {
    fetchProfuileData();
  }, []);

  const [org, setOrg] = useState<Organization | null>(null);
  const [orgLoading, setOrgLoading] = useState(true);
  const [orgError, setOrgError] = useState<string | null>(null);


  const fetchOrgData = async () => {
    setOrgLoading(true);
    try {
      const data = await FetchOrg();
      setOrg(data);
      setOrgError(null);
    } catch (err) {
      setOrgError(err instanceof Error ? err.message : "Unknown error occurred");
      setOrg(null);
    } finally {
      setOrgLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgData();
  }, []);

  function onPrfDataUpdate() {
    fetchProfuileData();
  }

  function onOrgDataUpdate() {
    fetchOrgData();
  }


  return (
    <div className="">
      <div className="flex ml-5 items-center space-x-3 mt-1 mb-1">
        <ProfileCompanySVG color="#215A96" size={40} />
        <h1 className="text-xl font-semibold ">Profil</h1>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col md:flex-row gap-6 bg-gray-100">
        <div className="flex flex-col gap-6 w-full md:w-1/3">
          <DetailsCard
            role={profile?.profile.player_role || "-"}
            profile={profile}
            loading={prfLoading}
            error={prfError}
            onDataUpdate={onPrfDataUpdate}
          />
          <OrgCard
            role={profile?.profile.player_role || "-"}
            org={org}
            loading={orgLoading}
            error={orgError}
            onDataUpdate={onOrgDataUpdate}
          />
        </div>

        <div className="bg-white shadow rounded-lg p-4 flex-1" style={{ boxShadow: "0 0 4px 1px #11355d69", borderRadius: "10px" }}>
          <UsersCard
            role={profile?.profile.player_role || "-"}
          />
        </div>
      </div>
    </div>
  );

};

export default ProfileKPlayer; 