import { LoaderIcon, Check } from "lucide-react";
import { GuestData, ContractRole, OrganizationRole, Availability, GuestProfile } from "../types";

interface GuestCriteriasProps {
  guestData: GuestData;
  updateGuestData: (change: { section: "criterias"; data: Partial<GuestProfile> }) => void;
  loading: boolean;
  onSave: () => void;
}

const GuestCriterias = ({ guestData, updateGuestData, loading, onSave }: GuestCriteriasProps) => {
  const profile = guestData.profile;

  const toggleContractRole = (role: ContractRole) => {
    const newRoles = profile.contract_roles.includes(role)
      ? profile.contract_roles.filter(r => r !== role)
      : [...profile.contract_roles, role];

    updateGuestData({ section: "criterias", data: { contract_roles: newRoles } });
  };

  const toggleOrganizationRole = (role: OrganizationRole) => {
    const newRoles = profile.organization_roles.includes(role)
      ? profile.organization_roles.filter(r => r !== role)
      : [...profile.organization_roles, role];

    updateGuestData({ section: "criterias", data: { organization_roles: newRoles } });
  };

  const handleSalaryChange = (field: "crit_daily_rate" | "crit_yearly_rate", value: number) => {
    updateGuestData({ section: "criterias", data: { [field]: value } });
  };

  const handleDistanceChange = (value: string) => {
    updateGuestData({ section: "criterias", data: { crit_distance: value } });
  };

  const handleLocationChange = (newLocation: string) => {
    updateGuestData({ section: "criterias", data: { crit_location: newLocation } });
  };

  const handleAvailabilityChange = (newAvailability: Availability | string) => {
    updateGuestData({ section: "criterias", data: { availability: newAvailability } });
  };

  const contractTranslations: Record<ContractRole, string> = {
    FREELANCE: "Freelance / Indépendant",
    PORTAGE: "Portage",
    CDI: "CDI",
    CDD: "CDD",
    "CDI-C": "CDI-C",
  };

  const companyTranslations: Record<OrganizationRole, string> = {
    OTHER: "Tout/Pas de critère",
    LARGE: "Grandes entreprises",
    INDUSTRIAL: "Entreprise industrielle / Client final",
    "PME/TPE": "PME/TPE",
    ESN: `Bureaux d'Études / ESN / Conseil`,
  };

  const isDate = /^\d{4}-\d{2}-\d{2}$/.test(profile.availability);

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-4">
        <h3 className="mb-2 font-semibold">Type de contrat souhaité/accepté</h3>
        <button
          type="button"
          title="Modifications détectées. Cliquez pour enregistrer!"
          className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          onClick={onSave}>
          {loading ? <LoaderIcon className="w-5 h-5 text-gray-700 animate-spin" /> : <Check className="w-5 h-5 text-green-700" />}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(contractTranslations) as ContractRole[]).map(role => (
          <button
            key={role}
            className={`px-4 py-2 rounded-xl text-sm flex items-center ${profile.contract_roles.includes(role)
              ? "bg-[#297280] border-gray-300 text-white"
              : "bg-white border border-gray-300"
              }`}
            onClick={() => toggleContractRole(role)}
          >
            {contractTranslations[role]}
          </button>
        ))}
      </div>

      <h3 className="mb-2 font-semibold">Type d'entreprise visées</h3>
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(companyTranslations) as OrganizationRole[]).map(role => (
          <button
            key={role}
            className={`px-4 py-2 rounded-xl text-sm flex items-center ${profile.organization_roles.includes(role)
              ? "bg-[#297280] border-gray-300 text-white"
              : "bg-white border border-gray-300"
              }`}
            onClick={() => toggleOrganizationRole(role)}
          >
            {companyTranslations[role]}
          </button>
        ))}
      </div>

      <h3 className="mb-2 font-semibold">TJM - Prétentions salariales</h3>
      <div className="flex gap-3 my-3">
        <input
          type="number"
          value={profile.crit_daily_rate}
          onChange={e => handleSalaryChange("crit_daily_rate", Number(e.target.value))}
          className="border border-gray-300 rounded-xl p-2 w-1/5"
        />
        <label className="flex items-center justify-start w-1/5">€ HT / jour</label>
        <input
          type="number"
          value={profile.crit_yearly_rate}
          onChange={e => handleSalaryChange("crit_yearly_rate", Number(e.target.value))}
          className="border border-gray-300 rounded-xl p-2 w-1/5"
        />
        <label className="flex items-center justify-start w-1/5">€ brut / an</label>
      </div>

      <h3 className="mb-2 font-semibold">Mobilité</h3>
      <div className="mb-6">
        <div className="flex gap-2 items-center justify-center">
          <input
            type="text"
            placeholder="Ville"
            value={profile.crit_location}
            onChange={e => handleLocationChange(e.target.value)}
            className="border border-gray-300 rounded-xl p-2 w-1/3"
          />
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span>{profile.crit_distance} km</span>
              <span>100 km</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={parseInt(profile.crit_distance || "0")}
              onChange={e => handleDistanceChange(e.target.value)}
              className="w-full"
            />
            <div className="text-xs text-gray-500">Distance</div>
          </div>
        </div>
      </div>

      <h3 className="mb-2 font-semibold">Disponibilité</h3>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center">
            <input
              type="radio"
              name="availability"
              value="IMMEDIATE"
              checked={profile.availability === "IMMEDIATE" && !isDate}
              onChange={() => handleAvailabilityChange("IMMEDIATE")}
              className="mr-2"
            />
            Immédiate
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="availability"
              value="ONE_MONTH"
              checked={profile.availability === "ONE_MONTH" && !isDate}
              onChange={() => handleAvailabilityChange("ONE_MONTH")}
              className="mr-2"
            />
            &gt; 1 mois
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="availability"
              value="THREE_MONTHS"
              checked={profile.availability === "THREE_MONTHS" && !isDate}
              onChange={() => handleAvailabilityChange("THREE_MONTHS")}
              className="mr-2"
            />
            &gt; 3 mois
          </label>
          <input
            type="date"
            value={isDate ? profile.availability : ""}
            onChange={e => handleAvailabilityChange(e.target.value)}
            className="border border-gray-300 rounded-xl p-2 w-60"
          />
        </div>
      </div>
    </div>
  );
};

export default GuestCriterias;
