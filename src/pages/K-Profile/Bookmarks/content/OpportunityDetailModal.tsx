import { ArrowLeft, User, Building, MapPin, MailX, MailCheck, Bookmark, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchOpportunityDetails } from "../services";
import { BaseMatchPercentages, Enhancements, Opportunity, OpportunityCompetences } from "../types";

const LoadingContent = ({ isVisible }: { isVisible: boolean }) => (
  <div className={`transform transition-all duration-300 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
    <div className="bg-white rounded-xl w-full max-w-2xl mx-auto shadow-xl p-8 flex flex-col items-center justify-center min-h-[300px]">
      <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
      <p className="text-gray-600 text-lg font-medium">Chargement des détails de l'opportunité...</p>
      <div className="mt-4 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-green-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
      </div>
    </div>
  </div>
);

const ErrorContent = ({ isVisible, error, onClose, onRetry }: { isVisible: boolean, error: string, onClose: () => void, onRetry: () => void }) => (
  <div className={`transform transition-all duration-300 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
    <div className="bg-white rounded-xl w-full max-w-2xl mx-auto shadow-xl p-8 flex flex-col items-center justify-center min-h-[300px]">
      <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
      <p className="text-gray-600 text-center mb-6">{error}</p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Fermer
        </button>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  </div>
);

const DescriptionsSection = ({ opportunity }: { opportunity: Opportunity }) => (
  <>
    <h1 className="text-xl font-semibold text-gray-900 my-2">Description du poste</h1>
    {opportunity.description && (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description :</label>
        <div className="p-2 border border-gray-300 bg-[#d4e3e6] rounded-xl min-h-7">
          <div className="text-sm text-black">{opportunity.description}</div>
        </div>
      </div>
    )}
    {opportunity.context && (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">Contexte :</label>
        <div className="p-2 border border-gray-300 bg-[#d4e3e6] rounded-xl min-h-7">
          <div className="text-sm text-black">{opportunity.context}</div>
        </div>
      </div>
    )}
    {opportunity.mission && (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">Missions :</label>
        <div className="p-2 border border-gray-300 bg-[#d4e3e6] rounded-xl min-h-7">
          <div className="text-sm text-black">{opportunity.mission}</div>
        </div>
      </div>
    )}
    {opportunity.candidate_profile && (
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">Profil attendu :</label>
        <div className="p-2 border border-gray-300 bg-[#d4e3e6] rounded-xl min-h-7">
          <div className="text-sm text-black">{opportunity.candidate_profile}</div>
        </div>
      </div>
    )}
  </>
);

const CompetenceCategory = ({ label, items }: { label: string; items: string[] }) => (
  <div className="grid grid-cols-5 gap-3 items-center">
    <label className="col-span-1 text-xs font-medium text-gray-700">{label}</label>
    <div className="col-span-4 flex flex-wrap gap-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-green-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-green-300 hover:scale-105"
        >
          {item}
        </div>
      ))}
    </div>
  </div>
);

const CompetencesSection = ({ competences }: { competences: OpportunityCompetences }) => (
  <div className="space-y-4">
    <h1 className="text-xl my-2 font-semibold text-gray-900">Compétences</h1>
    {competences.sectors && competences.sectors.length > 0 && (
      <CompetenceCategory label="Secteurs" items={competences.sectors} />
    )}
    {competences.jobs && competences.jobs.length > 0 && (
      <CompetenceCategory label="Métiers" items={competences.jobs} />
    )}
    {competences.tools && competences.tools.length > 0 && (
      <CompetenceCategory label="Outils" items={competences.tools} />
    )}
    {competences.qualities && competences.qualities.length > 0 && (
      <CompetenceCategory label="Qualités" items={competences.qualities} />
    )}
    {competences.languages && competences.languages.length > 0 && (
      <CompetenceCategory label="Langues" items={competences.languages} />
    )}
  </div>
);

const OpportunityDetailModal = ({ opportunityID, enchantments, isVisible, handleCloseModal, onSubmit, onSave }: { opportunityID: number, enchantments: Enhancements, isVisible: boolean, handleCloseModal: () => void, onSubmit: () => void, onSave: () => void }) => {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunity = async (opportunityID: number) => {
    setLoading(true);
    try {
      const opportunity = await fetchOpportunityDetails(opportunityID);
      setOpportunity(opportunity);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred while fetching opportunity details.');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
  };

  useEffect(() => {
    fetchOpportunity(opportunityID);
  }, [opportunityID]);

  const calculateCompetenceScore = (scores: BaseMatchPercentages): number => {
    return (
      (scores.jobs_match_percentage * 0.75) +
      (scores.languages_match_percentage * 0.125) +
      (scores.qualities_match_percentage * 0.025) +
      (scores.tools_match_percentage * 0.075) +
      (scores.authorizations_match_percentage * 0.025)
    );
  };

  const getTagColorClass = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-700';
    if (score >= 80) return 'bg-teal-100 text-teal-700';
    if (score >= 70) return 'bg-blue-100 text-blue-700';
    if (score >= 60) return 'bg-indigo-100 text-indigo-700';
    if (score >= 50) return 'bg-purple-100 text-purple-700';
    if (score >= 40) return 'bg-yellow-100 text-yellow-700';
    if (score >= 30) return 'bg-amber-100 text-amber-700';
    if (score >= 20) return 'bg-orange-100 text-orange-700';
    if (score >= 10) return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const hasDescriptions = opportunity
    ? opportunity.description || opportunity.context || opportunity.candidate_profile || opportunity.mission
    : false;

  const hasCompetences = opportunity
    ? (opportunity.sectors?.length > 0) ||
    (opportunity.jobs?.length > 0) ||
    (opportunity.tools?.length > 0) ||
    (opportunity.qualities?.length > 0) ||
    (opportunity.languages?.length > 0)
    : false;

  const gridColumns = (!hasDescriptions && !hasCompetences)
    ? "grid-cols-1"
    : "grid-cols-2";

  return (
    <div
      onClick={handleCloseModal}
      className={`fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4 transform transition-all duration-500 ease-in-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
    >
      <div className="w-4/6" onClick={(e) => e.stopPropagation()}>
        {loading ? (
          <LoadingContent isVisible={isVisible} />
        ) : error ? (
          <ErrorContent
            isVisible={isVisible}
            error={error}
            onClose={handleCloseModal}
            onRetry={() => { }}
          />
        ) : (
          <div className={`transform transition-all duration-500 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="bg-white rounded-xl shadow-xl relative flex flex-col overflow-y-hidden pb-4">
              {/* Header */}
              <div className="flex flex-row gap-10 justify-between items-center py-4 pr-8">
                <div className="flex flex-row gap-2">
                  <button onClick={handleCloseModal} className="flex justify-self-start pl-2 rounded-lg transition-colors hover:bg-gray-100">
                    <ArrowLeft size={25} className="text-gray-600" />
                  </button>
                  <div className="w-24 h-24 bg-green-400 rounded-full flex items-center justify-center transform transition-transform hover:scale-105">
                    <User className="h-16 w-16 text-green-900" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h2 className="text-xl font-semibold text-gray-900">{opportunity!.title}</h2>
                    <span className="bg-green-200 text-green-800 text-sm px-2 py-1 rounded font-medium w-fit">
                      {enchantments.total_match_percentage ? enchantments.total_match_percentage.toFixed(2) : "0.00"}%
                    </span>
                    <div className="flex flex-row items-center justify-start gap-4 text-sm text-gray-600 ">
                      {opportunity!.organization && (
                        <span className="flex items-center gap-1">
                          <Building size={15} />
                          {opportunity!.organization}
                        </span>
                      )}
                      {opportunity!.crit_location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={15} />
                          {opportunity!.crit_location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match indicators */}
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-2 w-full">
                    {['Compétences', 'Séniorité', 'Dispo', 'Mobilité', 'TJM'].map((label, idx) => {
                      const score = idx === 0 ? calculateCompetenceScore(enchantments) :
                        idx === 1 ? enchantments.seniority_match_percentage ?? 0 :
                          idx === 2 ? enchantments.availability_match_percentage ?? 0 :
                            idx === 3 ? enchantments.mobility_match_percentage ?? 0 :
                              enchantments.rate_match_percentage ?? 0;

                      return (
                        <div key={label} className="relative group">
                          <span className={`px-3 py-1 rounded-full font-medium text-sm transition-all hover:scale-105 ${getTagColorClass(score)}`}>
                            {label}
                          </span>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-full p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            Score: {Math.round(score)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row items-center justify-end gap-6 w-full">
                    <select className="px-3 py-2 w-1/3 mr-5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value={"Saved"}>Saved</option>
                      <option value={"Applied"}>Applied</option>
                    </select>
                    {enchantments.is_applied ? (
                      <MailX
                        className="hover:text-red-500 text-green-600 transition-all duration-200 transform hover:scale-110"
                        cursor={"pointer"}
                        onClick={onSubmit}
                        aria-label="Cancel"
                        size={30}
                      />
                    ) : (
                      <MailCheck
                        className="hover:text-green-500 transition-all duration-200 transform hover:scale-110"
                        cursor={"pointer"}
                        onClick={onSubmit}
                        aria-label="Apply"
                        size={30}
                      />
                    )}
                    <Bookmark
                      className="hover:bg-gray-100 transition-all transform hover:scale-110"
                      onClick={onSave}
                      fill={enchantments.is_saved ? "#fbbf24" : "none"}
                      cursor={"pointer"}
                      size={30}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#30797F] h-[2px] mx-8" />

              {/* Content */}
              <div className={`grid gap-px bg-[#30797F] mx-1 ${gridColumns}`}>
                {/* Left Column - Always show Critères */}
                <div className="bg-white px-4 pb-4">
                  <h1 className="text-xl font-semibold text-gray-900 my-2">Critères</h1>
                  {/* Contract Type */}
                  {opportunity!.contract_roles && (
                    <div className="flex flex-row items-center gap-3 mb-3">
                      <label className="block text-xs font-medium text-gray-700">Contrats proposés</label>
                      {opportunity!.contract_roles.map((item, index) => (
                        <div key={index} className="bg-green-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-green-300">
                          {item}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Other criteria */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date de démarrage</label>
                      <span className="block border border-gray-300 rounded-xl px-2 py-1 bg-gray-50 text-sm text-gray-700 transition-all hover:bg-gray-100">
                        {opportunity!.start_at ? new Date(opportunity!.start_at).toLocaleDateString('fr-FR') : '25/12/2024'}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Durée initiale</label>
                      <span className="block px-2 py-1 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700 transition-all hover:bg-gray-100">
                        {opportunity!.duration} mois
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                      <span className="block px-2 py-1 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700 transition-all hover:bg-gray-100">
                        {opportunity!.crit_location ?? "-"}
                      </span>
                    </div>
                    {opportunity!.crit_remote && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Télétravail</label>
                        <span className="block px-2 py-1 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700 transition-all hover:bg-gray-100">
                          {opportunity!.crit_remote ? "Oui" : "-"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Competences section if needed */}
                  {hasDescriptions && hasCompetences && (
                    <CompetencesSection competences={{ sectors: opportunity!.sectors, jobs: opportunity!.jobs, tools: opportunity!.tools, qualities: opportunity!.qualities, languages: opportunity!.languages }} />
                  )}
                </div>

                {/* Right Column - Show either descriptions or competences */}
                {(hasDescriptions || hasCompetences) && (
                  <div className="bg-white px-4 pb-4 overflow-y-scroll">
                    {hasDescriptions ? (
                      <DescriptionsSection opportunity={opportunity!} />
                    ) : (
                      hasCompetences && opportunity && <CompetencesSection competences={{ sectors: opportunity!.sectors, jobs: opportunity!.jobs, tools: opportunity!.tools, qualities: opportunity!.qualities, languages: opportunity!.languages }} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OpportunityDetailModal