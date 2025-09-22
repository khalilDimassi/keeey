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

  const handleTransportModeChange = (mode: string) => {
    updateGuestData({ section: "criterias", data: { crit_mobility: mode } });
  };

  const handleMobilityChange = (option: string) => {
    updateGuestData({ section: "criterias", data: { crit_mobility: option } });
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
      <h3 className="mb-2 font-semibold">Type de contrat souhaité/accepté</h3>
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
        <div className="flex flex-wrap gap-6 mb-2">
          {Object.entries(['Locale', 'Régionale', 'France', 'Internationale']).map(([id, option]) => (
            <label key={option} className="flex items-center">
              <input
                id={id}
                type="checkbox"
                checked={option === profile.crit_mobility}
                onChange={() => handleMobilityChange(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
        <div className='flex gap-2 items-center justify-center'>
          <input
            type="text"
            placeholder="Ville"
            value={profile.crit_location}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="border border-gray-300 rounded-xl p-2 w-1/3"
          />
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span>{profile.crit_distance} km</span>
              <span>100 km</span>
            </div>
            <div
              className="relative w-full h-4 mb-1 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                let percent = (e.clientX - rect.left) / rect.width;
                percent = Math.max(0, Math.min(1, percent));
                handleDistanceChange(Math.round(percent * 100).toString());
              }}
            >
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full transform -translate-y-1/2"></div>
              <div
                className="absolute top-1/2 left-0 h-1 bg-[#297280] rounded-full transform -translate-y-1/2"
                style={{ width: `${profile.crit_distance}%` }}
              ></div>
              <div
                className="absolute top-1/2 w-3 h-3 bg-[#297280] rounded-full transform -translate-y-1/2 -translate-x-1/2 shadow-sm"
                style={{ left: `${profile.crit_distance}%` }}
              ></div>
              <input
                type="range"
                min="0"
                max="100"
                value={profile.crit_distance}
                onChange={(e) => handleDistanceChange(e.target.value)}
                className="absolute w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="text-xs text-gray-500">Distance</div>
          </div>
        </div>
      </div>

      <h3 className="mb-2 font-semibold">Mode de transport</h3>
      <div className="mb-6">
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="transport"
              value="personal"
              checked={profile.crit_mobility === 'personal'}
              onChange={() => handleTransportModeChange('personal')}
              className="mr-2"
            />
            Pas de contrainte : Véhicule personnel ou autre mode de transport
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="transport"
              value="public"
              checked={profile.crit_mobility === 'public'}
              onChange={() => handleTransportModeChange('public')}
              className="mr-2"
            />
            Modes doux ou transport en commun uniquement
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="transport"
              value="remote"
              checked={profile.crit_mobility === 'remote'}
              onChange={() => handleTransportModeChange('remote')}
              className="mr-2"
            />
            Télétravail uniquement
          </label>
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

      <button
        type="button"
        title="Modifications détectées. Cliquez pour enregistrer!"
        className="flex items-center justify-center md:ml-[-20%] mx-auto px-5 py-2 bg-kprofile-500 text-white hover:bg-kprofile-600 hover:text-white rounded-full  transition-colors"
        onClick={onSave}>
        {loading ? <><LoaderIcon className="w-5 h-5 text-red-600 animate-spin mr-4" /> Changements Détectés!</> : <><Check className="w-5 h-5 text-green-200 mr-4" /> Enregistrée</>}
      </button>
    </div>
  );
};

export default GuestCriterias;