import { useEffect, useState } from 'react';
import { Check, ChevronDown, Loader2, PenBox, X } from 'lucide-react';
import { OpportunityBasicInfo } from '../types';
import { updateOpportunityBasicInfo } from '../services';
import { OrgMember } from '../../../../Profile/types';
import { getUserFullName, isAuthenticated } from '../../../../../../utils/jwt';
import { FetchOrgMembers } from '../../../../Profile/services';

interface GeneralInformationTabProps {
  formData: OpportunityBasicInfo;
  loading: boolean;
  error: string | null;
  opportunity_id: string
}

const GeneralInformationTab = ({ formData, loading, error, opportunity_id }: GeneralInformationTabProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localFormData, setLocalFormData] = useState<OpportunityBasicInfo>(formData);
  const [prevFormData, setPrevFormData] = useState<OpportunityBasicInfo>(formData);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);
  const [orgMembers, setOrgMembers] = useState<OrgMember[]>([]);
  const [showOrgMembersDropdown, setShowOrgMembersDropdown] = useState(false);

  const isAuth = isAuthenticated();

  useEffect(() => {
    setMembersLoading(true);
    setMembersError(null);
    if (isAuth) {
      FetchOrgMembers()
        .then(data => {
          setOrgMembers(data);
          setMembersLoading(false);
        })
        .catch(error => {
          setOrgMembers([]);
          setMembersError(error instanceof Error ? error.message : "An unknown error occurred.");
          setMembersLoading(false);
        })
        .finally(() => {
          setMembersLoading(false);
        });
    } else {
      setOrgMembers([]);
      setMembersError(null);
      setMembersLoading(false);
    }
  }, [isAuth]);

  useEffect(() => {
    if (!isEditing && formData !== prevFormData) {
      setLocalFormData({ ...formData });
      setPrevFormData(formData);
    }
  }, [formData, isEditing, prevFormData]);

  const handleChange = (name: keyof OpportunityBasicInfo, value: string | number) => {
    setLocalFormData(prev => ({
      ...prev,
      [name]: value
    }))
  };

  const handleSubmit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      setSubmitError(null);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    // Prepare the update payload with only changed fields
    const updatePayload: Partial<OpportunityBasicInfo> = {};

    if (localFormData.title !== formData.title) updatePayload.title = localFormData.title;
    if (localFormData.status !== formData.status) updatePayload.status = localFormData.status;
    if (localFormData.opportunity_role !== formData.opportunity_role) updatePayload.opportunity_role = localFormData.opportunity_role;
    if (localFormData.operational_manager !== formData.operational_manager) updatePayload.operational_manager = localFormData.operational_manager;
    if (localFormData.start_at !== formData.start_at) updatePayload.start_at = localFormData.start_at;
    if (localFormData.announce_at !== formData.announce_at) updatePayload.announce_at = localFormData.announce_at;
    if (localFormData.responded_at !== formData.responded_at) updatePayload.responded_at = localFormData.responded_at;
    if (localFormData.context !== formData.context) updatePayload.context = localFormData.context;
    if (localFormData.description !== formData.description) updatePayload.description = localFormData.description;

    // Check if there are any changes to submit
    if (Object.keys(updatePayload).length === 0) {
      setIsEditing(false);
      setIsSubmitting(false);
      return;
    }

    updateOpportunityBasicInfo(updatePayload, opportunity_id)
      .then(() => {
        setLocalFormData(prev => ({
          ...prev,
          ...updatePayload
        }));
        setIsEditing(false);
      })
      .catch(error => {
        const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue lors de la mise à jour";
        setSubmitError(errorMessage);
        alert(`Erreur de mise à jour: ${errorMessage}`);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleCancel = () => {
    setLocalFormData(formData);
    setIsEditing(false);
    setSubmitError(null); // Clear errors on cancel
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-b-xl rounded-r-xl shadow-lg p-4">
        <div className="max-w-7xl mx-auto rounded-lg p-4 animate-pulse">
          <div className="flex justify-end mb-4">
            <div className="h-10 w-24 bg-gray-300 rounded-xl"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="col-span-1">
                <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
                <div className="h-10 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {[1, 2].map((i) => (
              <div key={i} className="col-span-1">
                <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
                <div className="h-10 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {[1, 2].map((i) => (
              <div key={i} className="col-span-1">
                <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
                <div className="h-10 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>

          <div className="flex gap-6">
            <div className="w-2/3 space-y-4">
              <div>
                <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
                <div className="h-20 bg-gray-200 rounded-xl"></div>
              </div>
              <div>
                <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
                <div className="h-32 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto rounded-lg p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-b-xl rounded-r-xl shadow-lg p-4">
      <div className="flex justify-end mb-4">
        {isEditing ? (
          <div className="flex gap-2">
            <X
              cursor={isSubmitting ? "not-allowed" : "pointer"}
              size={24}
              color="red"
              onClick={isSubmitting ? undefined : handleCancel}
            />
            {isSubmitting
              ? <Loader2
                className="animate-spin"
                size={24}
                color="#215A96"
              />
              : <Check
                size={24}
                color="#215A96"
                onClick={handleSubmit}
                cursor={"pointer"}
              />
            }
          </div>
        ) : (
          <PenBox
            cursor={"pointer"}
            size={24}
            color="#215A96"
            onClick={handleSubmit}
          />
        )}
      </div>

      {/* Submission Error Display */}
      {submitError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur de soumission! </strong>
          <span className="block sm:inline">{submitError}</span>
          <button
            className="absolute top-0 right-0 px-2 py-1 text-red-700"
            onClick={() => setSubmitError(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Row 1 */}
        <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">Référence de l'offre</label>
            <div className="p-2 bg-gray-100 rounded-xl">{isAuth ? localFormData.reference || '-' : 'Gest Test: ' + opportunity_id || '-'}</div>
          </div>
          <div className="col-span-1">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            {isEditing ? (
              <input
                type="text"
                id="title"
                value={localFormData.title}
                onChange={(e) => handleChange(e.target.id as keyof OpportunityBasicInfo, e.target.value)}
                placeholder="Titre"
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="p-2 bg-gray-100 rounded-xl">{localFormData.title || '-'}</div>
            )}
          </div>
          <div className="col-span-1">
            <label htmlFor="operational_manager" className="block text-sm font-medium text-gray-700 mb-1">Responsable opérationnel</label>
            {isEditing ? (
              <div className="relative">
                {!isAuth ? (
                  <input disabled
                    type="text"
                    id="operational_manager"
                    value="Gest User: " // TODO: add guest id
                    className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <>
                    <input
                      type="text"
                      id="operational_manager"
                      value={localFormData.operational_manager || ''}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleChange(e.target.id as keyof OpportunityBasicInfo, e.target.value);
                        setShowOrgMembersDropdown(true);
                      }}
                      onFocus={() => {
                        setShowOrgMembersDropdown(true);
                      }}
                      placeholder={membersLoading ? "Chargement..." : "Responsable opérationnel"}
                      className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                      disabled={membersLoading}
                    />
                    <ChevronDown
                      size={20}
                      className="absolute right-2 top-2 text-gray-400 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowOrgMembersDropdown(!showOrgMembersDropdown);
                      }}
                    />

                    {membersError && (
                      <p className="text-red-500 text-xs mt-1">{membersError}</p>
                    )}

                    {showOrgMembersDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                        <div
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b-2 border-b-gray-500"
                          onClick={() => {
                            handleChange("operational_manager" as keyof OpportunityBasicInfo, getUserFullName() || '');
                            setShowOrgMembersDropdown(false);
                          }}
                        >
                          <span className="font-sm border-l-4 pl-3 border-l-blue-500">
                            {getUserFullName()} (Moi)
                          </span>
                        </div>

                        {orgMembers
                          .filter(member =>
                            `${member.first_name} ${member.last_name}`.toLowerCase().includes(localFormData.operational_manager?.toLowerCase() || '')
                          )
                          .map((member) => (
                            <div
                              key={member.ID}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                handleChange("operational_manager" as keyof OpportunityBasicInfo, `${member.first_name} ${member.last_name}`)
                                setShowOrgMembersDropdown(false);
                              }}
                            >
                              <span className={`font-sm border-l-4 pl-3 ${member.email_verified ? "border-green-500" : "border-orange-500"}`}>
                                {member.first_name} ${member.last_name}
                              </span>
                            </div>
                          ))
                        }
                        {orgMembers.filter(member =>
                          `${member.first_name} ${member.last_name}`.toLowerCase().includes(localFormData.operational_manager?.toLowerCase() || '')
                        ).length === 0 && (
                            <div className="px-4 py-2 text-gray-500">
                              Aucun membre trouvé
                            </div>
                          )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="p-2 bg-gray-100 rounded-xl">{localFormData.operational_manager || '-'}</div>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            {isEditing ? (
              <select
                id="status"
                value={localFormData.status || ''}
                onChange={(e) => handleChange(e.target.id as keyof OpportunityBasicInfo, e.target.value)}
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
            ) : (
              <div className="p-2 bg-gray-100 rounded-xl">
                {localFormData.status === 'PENDING' ? 'En attente' :
                  localFormData.status === 'ACCEPTED' ? 'Accepté' :
                    localFormData.status === 'REJECTED' ? 'Refusé' :
                      localFormData.status === 'ONGOING' ? 'En cours' :
                        localFormData.status === 'CONCLUDED' ? 'Terminé' :
                          localFormData.status === 'OPEN' ? 'Ouvert' :
                            localFormData.status === 'CLOSED' ? 'Fermé' : '-'}
              </div>
            )}
          </div>
          <div className="col-span-1">
            <label htmlFor="opportunity_role" className="block text-sm font-medium text-gray-700 mb-1">Certitude du besoin</label>
            {isEditing ? (
              <select
                id="opportunity_role"
                value={localFormData.opportunity_role}
                onChange={(e) => handleChange(e.target.id as keyof OpportunityBasicInfo, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionnez une option</option>
                <option value="BUDGET">Budget confirmé</option>
                <option value="REQUIREMENT">Besoin probable</option>
                <option value="LIVEWELL">Vivier</option>
              </select>
            ) : (
              <div className="p-2 bg-gray-100 rounded-xl">
                {localFormData.opportunity_role === 'BUDGET' ? 'Budget confirmé' :
                  localFormData.opportunity_role === 'REQUIREMENT' ? 'Besoin probable' :
                    localFormData.opportunity_role === 'LIVEWELL' ? 'Vivier' : '-'}
              </div>
            )}
          </div>
        </div>

        {/* Row 3 */}
        <div className="col-span-1">
          <label htmlFor="start_at" className="block text-sm font-medium text-gray-700 mb-1">Date de démarrage</label>
          {isEditing ? (
            <div className="relative">
              <input
                type="date"
                id="start_at"
                value={localFormData.start_at}
                onChange={(e) => handleChange(e.target.id as keyof OpportunityBasicInfo, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="p-2 bg-gray-100 rounded-xl">{formatDate(localFormData.start_at) || '-'}</div>
          )}
        </div>
        <div className="col-span-1">
          <label htmlFor="announce_at" className="block text-sm font-medium text-gray-700 mb-1">Date de l'appel d'offre</label>
          {isEditing ? (
            <div className="relative">
              <input
                type="date"
                id="announce_at"
                value={localFormData.announce_at ? localFormData.announce_at : ''}
                onChange={(e) => handleChange(e.target.id as keyof OpportunityBasicInfo, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="p-2 bg-gray-100 rounded-xl">{formatDate(localFormData.announce_at) || '-'}</div>
          )}
        </div>
        <div className="col-span-1">
          <label htmlFor="responded_at" className="block text-sm font-medium text-gray-700 mb-1">Date de réponse</label>
          {isEditing ? (
            <div className="relative">
              <input
                type="date"
                id="responded_at"
                value={localFormData.responded_at ? localFormData.responded_at : ''}
                onChange={(e) => handleChange(e.target.id as keyof OpportunityBasicInfo, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="p-2 bg-gray-100 rounded-xl">{formatDate(localFormData.responded_at) || '-'}</div>
          )}
        </div>

        {/* Rows 4-6 */}
        <div className="col-span-3 grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-1">Contexte</label>
            {isEditing ? (
              <textarea
                id="context"
                value={localFormData.context}
                onChange={(e) => handleChange(e.target.id as keyof OpportunityBasicInfo, e.target.value)}
                placeholder="Contexte"
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={6}
              />
            ) : (
              <div className="p-2 bg-gray-100 rounded-xl min-h-24">{localFormData.context || '-'}</div>
            )}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descriptif de la mission</label>
            {isEditing ? (
              <textarea
                id="description"
                value={localFormData.description}
                onChange={(e) => handleChange(e.target.id as keyof OpportunityBasicInfo, e.target.value)}
                placeholder="Descriptif"
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={6}
              />
            ) : (
              <div className="p-2 bg-gray-100 rounded-xl min-h-24">{localFormData.description || '-'}</div>
            )}
          </div>
          <div>
            <label htmlFor="candidat_profile" className="block text-sm font-medium text-gray-700 mb-1">Candidat attendu</label>
            {isEditing ? (
              <textarea
                id="candidat_profile"
                value={localFormData.candidate_profile}
                onChange={(e) => handleChange(e.target.id as keyof OpportunityBasicInfo, e.target.value)}
                placeholder="Descriptif"
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={6}
              />
            ) : (
              <div className="p-2 bg-gray-100 rounded-xl min-h-24">{localFormData.candidate_profile || '-'}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInformationTab;