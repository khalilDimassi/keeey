import { useEffect, useState } from "react";
import { OpportunityBasicInfo } from "../../OpportunityDetailsKPlayer/types";
import { OrgMember } from "../../../../Profile/types";
import { FetchOrgMembers } from "../../../../Profile/services";
import { ChevronDown } from "lucide-react";
import { getUserFullName, isAuthenticated } from "../../../../../../utils/jwt";

const GeneralInformationForm = ({ onChange, formData }: { onChange: (data: any) => void; formData: OpportunityBasicInfo; }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);
  const [showOrgMembersDropdown, setShowOrgMembersDropdown] = useState(false);
  const isAuth = isAuthenticated();

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (isAuth) {
      FetchOrgMembers()
        .then(data => {
          setOrgMembers(data);
          setLoading(false);
        })
        .catch(error => {
          setOrgMembers([]);
          setError(error instanceof Error ? error.message : "An unknown error occurred.");
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError(null);
    }
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    onChange({
      ...formData,
      [id]: value || null
    });
  };

  const handleChange = (id: string, value: string) => {
    onChange({
      ...formData,
      [id]: value
    });
  };

  return (
    <div className='p-4'>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Row 1 */}
        <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              id="title"
              value={formData.title || ''}
              onChange={(e) => handleChange(e.target.id, e.target.value)}
              placeholder="Titre"
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {!isAuth ? (
            <div className="relative col-span-1">
              <label htmlFor="operational_manager" className="block text-sm font-medium text-gray-700 mb-1">Responsable opérationnel</label>
              <input disabled
                type="text"
                id="operational_manager"
                value="Gest User: " // TODO: add guest id
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="relative col-span-1">
              <label htmlFor="operational_manager" className="block text-sm font-medium text-gray-700 mb-1">Responsable opérationnel</label>
              <div className="relative">
                <input
                  type="text"
                  id="operational_manager"
                  placeholder={loading ? "Chargement..." : "Responsable opérationnel"}
                  value={formData.operational_manager || ''}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleChange(e.target.id, e.target.value);
                    setShowOrgMembersDropdown(true);
                  }}
                  onFocus={() => {
                    setShowOrgMembersDropdown(true);
                  }}
                  className="w-full border rounded-xl px-3 py-2 text-sm pr-8"
                  disabled={loading}
                />
                <ChevronDown
                  size={20}
                  className="absolute right-2 top-2 text-gray-400 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOrgMembersDropdown(!showOrgMembersDropdown);
                  }}
                />
              </div>

              {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
              )}

              {showOrgMembersDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  <div
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b-2 border-b-gray-500"
                    onClick={() => {
                      handleChange("operational_manager", getUserFullName() || '');
                      setShowOrgMembersDropdown(false);
                    }}
                  >
                    <span className="font-sm border-l-4 pl-3 border-l-blue-500">
                      {getUserFullName()} (Moi)
                    </span>
                  </div>

                  {orgMembers
                    ?.filter((member: OrgMember) => `${member.first_name} ${member.last_name}`.toLowerCase().includes(formData.operational_manager?.toLowerCase() || ''))
                    ?.map((member: OrgMember) => (
                      <div
                        key={member.ID}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          handleChange("operational_manager", `${member.first_name} ${member.last_name}`);
                          setShowOrgMembersDropdown(false);
                        }}
                      >
                        <span className={`font-sm border-l-4 pl-3 ${member.email_verified ? "border-green-500" : "border-orange-500"}`}>
                          {member.first_name} {member.last_name}
                        </span>
                      </div>
                    ))
                  }
                  {orgMembers
                    ?.filter(member => `${member.first_name} ${member.last_name}`.toLowerCase().includes(formData.operational_manager?.toLowerCase() || ''))
                    ?.length === 0 && (<div className="px-4 py-2 text-gray-500">Aucun membre trouvé</div>)
                  }
                </div>
              )}
            </div>
          )}
        </div>

        {/* Row 2 */}
        <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              id="status"
              value={formData.status || ''}
              onChange={(e) => handleChange(e.target.id, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez un statut</option>
              <option value="PENDING">En attente</option>
              <option value="ACCEPTED">Accepté</option>
              <option value="REJECTED">Refusé</option>
              <option value="ONGOING">En cours</option>
              <option value="CONCLUDED">Terminé</option>
              <option value="OPEN">Ouvert</option>
              <option value="CLOSED">Fermé</option>
            </select>
          </div>
          <div className="col-span-1">
            <label htmlFor="opportunity_role" className="block text-sm font-medium text-gray-700 mb-1">Certitude du besoin</label>
            <select
              id="opportunity_role"
              value={formData.opportunity_role || ''}
              onChange={(e) => handleChange(e.target.id, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez une option</option>
              <option value="BUDGET">Budget confirmé</option>
              <option value="REQUIREMENT">Besoin probable</option>
              <option value="LIVEWELL">Vivier</option>
            </select>
          </div>
        </div>

        {/* Row 3 */}
        <div className="col-span-1">
          <label htmlFor="start_at" className="block text-sm font-medium text-gray-700 mb-1">Date de démarrage</label>
          <div className="relative">
            <input
              type="date"
              id="start_at"
              value={formData.start_at || ''}
              onChange={handleDateChange}
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="col-span-1">
          <label htmlFor="announce_at" className="block text-sm font-medium text-gray-700 mb-1">Date de l'appel d'offre</label>
          <div className="relative">
            <input
              type="date"
              id="announce_at"
              value={formData.announce_at || ''}
              onChange={handleDateChange}
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="col-span-1">
          <label htmlFor="responded_at" className="block text-sm font-medium text-gray-700 mb-1">Date de réponse</label>
          <div className="relative">
            <input
              type="date"
              id="responded_at"
              value={formData.responded_at || ''}
              onChange={handleDateChange}
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Row 4 */}
        <div className="col-span-3 grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-1">Contexte</label>
            <textarea
              id="context"
              value={formData.context || ''}
              onChange={(e) => handleChange(e.target.id, e.target.value)}
              placeholder="Contexte"
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={8}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descriptif de la mission</label>
            <textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleChange(e.target.id, e.target.value)}
              placeholder="Descriptif"
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={8}
            />
          </div>
          <div>
            <label htmlFor="candidate_profile" className="block text-sm font-medium text-gray-700 mb-1">Profil attendu</label>
            <textarea
              id="candidate_profile"
              value={formData.candidate_profile || ''}
              onChange={(e) => handleChange(e.target.id, e.target.value)}
              placeholder="Profil attendu"
              className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={8}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInformationForm;