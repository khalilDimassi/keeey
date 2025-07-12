import { useEffect, useState } from "react";
import { ArrowLeft, Bookmark, Building, MailCheck, MapPin, User, Loader2, AlertCircle } from 'lucide-react';
import axios from "axios";
import { MatchPercentages, Opportunity, OpportunityCompetences } from "./types";

interface OpportunityDetailModalProps {
  opportunityId: number;
  matchings: MatchPercentages | null;
  onClose: () => void;
  is_saved: boolean;
  is_applied: boolean;
  onSaveOpportunity: (opportunityId: number, is_saved: boolean) => void;
  onSubmitOpportunity: (opportunityId: number, is_applied: boolean) => void;
}

const OpportunityDetailModal = ({ opportunityId, matchings, onClose, is_saved, is_applied, onSaveOpportunity, onSubmitOpportunity }: OpportunityDetailModalProps) => {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [opportunityCompetences, setOpportunityCompetences] = useState<OpportunityCompetences | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const loadOpportunityDetails = async () => {
      try {
        const response = await axios.get<Opportunity>(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${opportunityId}`
        )
        setOpportunity(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load opportunity details.');
      }
    };

    const loadOpportunityCompentances = async () => {
      try {
        const response = await axios.get<OpportunityCompetences>(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities/${opportunityId}/skills`
        )
        setOpportunityCompetences(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load opportunity compentances.');
      } finally {
        setLoading(false);
      }
    };

    loadOpportunityDetails();
    loadOpportunityCompentances();
  }, [opportunityId]);

  const calculateCompetenceScore = (scores: MatchPercentages | null): number => {
    if (!scores) return 0;
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

  const handleAction = (e: React.MouseEvent, id: number, action: string) => {
    e.stopPropagation();

    if (action === "save") {
      onSaveOpportunity(id, !is_saved);
    } else if (action === "apply") {
      onSubmitOpportunity(id, !is_applied);
    } else {
      console.error("Invalid action");
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300); // Wait for exit animation
  };

  // Loading State
  const LoadingContent = () => (
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

  // Error State
  const ErrorContent = () => (
    <div className={`transform transition-all duration-300 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
      <div className="bg-white rounded-xl w-full max-w-2xl mx-auto shadow-xl p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-600 text-center mb-6">
          {error || "Échec du chargement des détails de l'opportunité."}
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    </div>
  );

  // Main Content
  const MainContent = () => {
    // Determine if we have any description content
    const hasDescriptions =
      opportunity?.description || opportunity?.context ||
      opportunity?.candidate_profile || opportunity?.mission;

    // Determine if we have any competences content
    const hasCompetences =
      (opportunityCompetences?.sectors && opportunityCompetences?.sectors?.length > 0) ||
      (opportunityCompetences?.jobs && opportunityCompetences?.jobs?.length > 0) ||
      (opportunityCompetences?.tools && opportunityCompetences?.tools?.length > 0) ||
      (opportunityCompetences?.qualities && opportunityCompetences?.qualities?.length > 0) ||
      (opportunityCompetences?.languages && opportunityCompetences?.languages?.length > 0);

    // Calculate grid columns
    const gridColumns = () => {
      if (!hasDescriptions && !hasCompetences) return "grid-cols-1";
      return "grid-cols-2";
    };

    return (
      <div className={`transform transition-all duration-500 ease-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="bg-white rounded-xl shadow-xl relative flex flex-col overflow-y-hidden">
          {/* Header - unchanged */}
          <div className="flex flex-row gap-10 justify-between items-center py-4 pr-8">
            <div className="flex flex-row gap-2">
              <button onClick={handleClose} className="flex justify-self-start pl-2 rounded-lg transition-colors hover:bg-gray-100">
                <ArrowLeft size={25} className="text-gray-600" />
              </button>
              <div className="w-24 h-24 bg-green-400 rounded-full flex items-center justify-center transform transition-transform hover:scale-105">
                <User className="h-16 w-16 text-green-900" />
              </div>
              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-gray-900">{opportunity?.title}</h2>
                <span className="bg-green-200 text-green-800 text-sm px-2 py-1 rounded font-medium w-fit">
                  {matchings?.total_match_percentage ? matchings.total_match_percentage.toFixed(2) : "0.00"}%
                </span>
                <div className="flex flex-row items-center justify-start gap-4 text-sm text-gray-600 ">
                  {opportunity?.organization && <span className="flex items-center gap-1">
                    <Building size={15} />
                    {opportunity?.organization ? opportunity?.organization : "-"}
                  </span>}
                  {opportunity?.crit_location && <span className="flex items-center gap-1">
                    <MapPin size={15} />
                    {opportunity?.crit_location ? opportunity?.crit_location : "-"}
                  </span>}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              {(() => {
                const competenceScore = calculateCompetenceScore(matchings ?? null);
                return (
                  <div className="flex gap-2 w-full">
                    {/* Competences */}
                    <div className="relative group">
                      <span className={`px-3 py-1 rounded-full font-medium text-sm transition-all hover:scale-105 ${getTagColorClass(competenceScore)}`}>
                        Compétences
                      </span>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-full p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <p>Score: {Math.round(competenceScore)}%</p>
                        <hr className="my-1" />
                        <p>Emplois: {Math.round(matchings?.jobs_match_percentage ?? 0)}%</p>
                        <p>Langues: {Math.round(matchings?.languages_match_percentage ?? 0)}%</p>
                        <p>Outils: {Math.round(matchings?.tools_match_percentage ?? 0)}%</p>
                        <p>Qualités: {Math.round(matchings?.qualities_match_percentage ?? 0)}%</p>
                        <p>Autorisations: {Math.round(matchings?.authorizations_match_percentage ?? 0)}%</p>
                      </div>
                    </div>

                    {/* Seniority */}
                    <div className="relative group">
                      <span className={`px-3 py-1 rounded-full font-medium text-sm transition-all hover:scale-105 ${getTagColorClass(matchings?.seniority_match_percentage ?? 0)}`}>
                        Séniorité
                      </span>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 w-full bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        Score: {Math.round(matchings?.seniority_match_percentage ?? 0)}%
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="relative group">
                      <span className={`px-3 py-1 rounded-full font-medium text-sm transition-all hover:scale-105 ${getTagColorClass(matchings?.availability_match_percentage ?? 0)}`}>
                        Dispo
                      </span>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 w-full bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        Score: {Math.round(matchings?.availability_match_percentage ?? 0)}%
                      </div>
                    </div>

                    {/* Mobility */}
                    <div className="relative group">
                      <span className={`px-3 py-1 rounded-full font-medium text-sm transition-all hover:scale-105 ${getTagColorClass(matchings?.mobility_match_percentage ?? 0)}`}>
                        Mobilité
                      </span>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 w-full bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        Score: {Math.round(matchings?.mobility_match_percentage ?? 0)}%
                      </div>
                    </div>

                    {/* TJM (Rate) */}
                    <div className="relative group">
                      <span className={`px-3 py-1 rounded-full font-medium text-sm transition-all hover:scale-105 ${getTagColorClass(matchings?.rate_match_percentage ?? 0)}`}>
                        TJM
                      </span>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 w-full bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        Score: {Math.round(matchings?.rate_match_percentage ?? 0)}%
                      </div>
                    </div>
                  </div>
                );
              })()}
              <div className="flex flex-row items-center justify-end gap-6 w-full">
                <select
                  className="px-3 py-2 w-1/3 mr-5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  name={"Default"}
                >
                  <option value={"Saved"}>Saved</option>
                  <option value={"Applied"}>Applied</option>
                </select>
                <button
                  onClick={(e) => handleAction(e, opportunityId, "apply")}
                  title={`${is_applied ? "abort ?" : "apply ?"}`}
                  className="hover:bg-gray-100 rounded-lg transition-all transform hover:scale-110"
                >
                  <MailCheck size={30} fill={is_applied ? "#fbbf24" : "none"} stroke={is_applied ? "#fbbf24" : "currentColor"} />
                </button>
                <button
                  onClick={(e) => handleAction(e, opportunityId, "save")}
                  title={`${is_saved ? "remove ?" : "save ?"}`}
                  className="hover:bg-gray-100 rounded-lg transition-all transform hover:scale-110"
                >
                  <Bookmark size={30} fill={is_saved ? "#fbbf24" : "none"} stroke={is_saved ? "#fbbf24" : "currentColor"} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#30797F] h-[2px] mx-8" />

          {/* Content */}
          <div className={`grid gap-px bg-[#30797F] mx-1 ${gridColumns()}`}>
            {/* Left Column - Always show Critères */}
            <div className="bg-white px-4 pb-4">
              <h1 className="text-xl font-semibold text-gray-900 my-2">Critères</h1>
              {/* Contract Type */}
              {opportunity?.contract_roles &&
                <div className="flex flex-row items-center gap-3 mb-3">
                  <label className="block text-xs font-medium text-gray-700">Contrats proposés</label>
                  {opportunity?.contract_roles.map((item, index) => (
                    <div key={index} className="bg-green-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-green-300">{item}</div>
                  ))}
                </div>
              }
              <div className="grid grid-cols-2 gap-4 mb-3">
                {/* Dates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de démarrage</label>
                  <span className="block border border-gray-300 rounded-xl px-2 py-1 bg-gray-50 text-sm text-gray-700 transition-all hover:bg-gray-100">
                    {opportunity?.start_at ? new Date(opportunity.start_at).toLocaleDateString('fr-FR') : '25/12/2024'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durée initiale</label>
                  <span className="block px-2 py-1 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700 transition-all hover:bg-gray-100">{opportunity?.duration} mois</span>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                  <span className="block px-2 py-1 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700 transition-all hover:bg-gray-100">{opportunity?.crit_location ?? "-"}</span>
                </div>
                {opportunity?.crit_remote &&
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Télétravail</label>
                    <span className="block px-2 py-1 border border-gray-300 rounded-xl bg-gray-50 text-sm text-gray-700 transition-all hover:bg-gray-100">{opportunity?.crit_remote ? "Oui" : "-"}</span>
                  </div>
                }
              </div>

              {/* Only show Compétences here if we have descriptions (otherwise they'll be in right column) */}
              {hasDescriptions && hasCompetences && (
                <div className="space-y-4">
                  <h1 className="text-xl my-2 font-semibold text-gray-900">Compétences</h1>

                  {/* Sectors */}
                  {opportunityCompetences?.sectors && opportunityCompetences?.sectors?.length > 0 && (
                    <div className="grid grid-cols-5 gap-3 items-center">
                      <label className="col-span-1 text-xs font-medium text-gray-700">Secteurs</label>
                      <div className="col-span-4 flex flex-wrap gap-2">
                        {opportunityCompetences?.sectors.map((item, index) => (
                          <div
                            key={index}
                            className="bg-green-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-green-300 hover:scale-105"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Jobs */}
                  {opportunityCompetences?.jobs && opportunityCompetences?.jobs?.length > 0 && (
                    <div className="grid grid-cols-5 gap-3 items-center">
                      <label className="col-span-1 text-xs font-medium text-gray-700">Métiers</label>
                      <div className="col-span-4 flex flex-wrap gap-2">
                        {opportunityCompetences?.jobs.map((item, index) => (
                          <div
                            key={index}
                            className="bg-green-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-green-300 hover:scale-105"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tools */}
                  {opportunityCompetences?.tools && opportunityCompetences?.tools?.length > 0 && (
                    <div className="grid grid-cols-5 gap-3 items-center">
                      <label className="col-span-1 text-xs font-medium text-gray-700">Outils</label>
                      <div className="col-span-4 flex flex-wrap gap-2">
                        {opportunityCompetences?.tools.map((item, index) => (
                          <div
                            key={index}
                            className="bg-green-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-green-300 hover:scale-105"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Qualities */}
                  {opportunityCompetences?.qualities && opportunityCompetences?.qualities?.length > 0 && (
                    <div className="grid grid-cols-5 gap-3 items-center">
                      <label className="col-span-1 text-xs font-medium text-gray-700">Qualités</label>
                      <div className="col-span-4 flex flex-wrap gap-2">
                        {opportunityCompetences?.qualities.map((item, index) => (
                          <div
                            key={index}
                            className="bg-green-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-green-300 hover:scale-105"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {opportunityCompetences?.languages && opportunityCompetences?.languages?.length > 0 && (
                    <div className="grid grid-cols-5 gap-3 items-center">
                      <label className="col-span-1 text-xs font-medium text-gray-700">Langues</label>
                      <div className="col-span-4 flex flex-wrap gap-2">
                        {opportunityCompetences?.languages.map((item, index) => (
                          <div
                            key={index}
                            className="bg-green-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-green-300 hover:scale-105"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Show either descriptions or competences */}
            {(hasDescriptions || hasCompetences) && (
              <div className="bg-white px-4 pb-4 overflow-y-scroll">
                {hasDescriptions ? (
                  <>
                    <h1 className="text-xl font-semibold text-gray-900 my-2">Description du poste</h1>
                    {opportunity?.description && (<div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description :</label>
                      <div className="p-2 border border-gray-300 bg-[#d4e3e6] rounded-xl min-h-7">
                        <div className="text-sm text-black">{opportunity.description}</div>
                      </div>
                    </div>)}
                    {opportunity?.context && (<div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contexte :</label>
                      <div className="p-2 border border-gray-300 bg-[#d4e3e6] rounded-xl min-h-7">
                        <div className="text-sm text-black">{opportunity.context}</div>
                      </div>
                    </div>)}
                    {opportunity?.mission && (<div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Missions :</label>
                      <div className="p-2 border border-gray-300 bg-[#d4e3e6] rounded-xl min-h-7">
                        <div className="text-sm text-black">{opportunity.mission}</div>
                      </div>
                    </div>)}
                    {opportunity?.candidate_profile && (<div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profil attendu :</label>
                      <div className="p-2 border border-gray-300 bg-[#d4e3e6] rounded-xl min-h-7">
                        <div className="text-sm text-black">{opportunity.candidate_profile}</div>
                      </div>
                    </div>)}
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <h1 className="text-xl my-2 font-semibold text-gray-900">Compétences</h1>

                      {/* Sectors */}
                      {opportunityCompetences?.sectors && opportunityCompetences?.sectors?.length > 0 && (
                        <div className="grid grid-cols-5 gap-3 items-center">
                          <label className="col-span-1 text-xs font-medium text-gray-700">Secteurs</label>
                          <div className="col-span-4 flex flex-wrap gap-2">
                            {opportunityCompetences?.sectors.map((item, index) => (
                              <div
                                key={index}
                                className="bg-green-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-green-300 hover:scale-105"
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Jobs */}
                      {opportunityCompetences?.jobs && opportunityCompetences?.jobs?.length > 0 && (
                        <div className="grid grid-cols-5 gap-3 items-center">
                          <label className="col-span-1 text-xs font-medium text-gray-700">Métiers</label>
                          <div className="col-span-4 flex flex-wrap gap-2">
                            {opportunityCompetences?.jobs.map((item, index) => (
                              <div
                                key={index}
                                className="bg-green-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-green-300 hover:scale-105"
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tools */}
                      {opportunityCompetences?.tools && opportunityCompetences?.tools?.length > 0 && (
                        <div className="grid grid-cols-5 gap-3 items-center">
                          <label className="col-span-1 text-xs font-medium text-gray-700">Outils</label>
                          <div className="col-span-4 flex flex-wrap gap-2">
                            {opportunityCompetences?.tools.map((item, index) => (
                              <div
                                key={index}
                                className="bg-green-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-green-300 hover:scale-105"
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Qualities */}
                      {opportunityCompetences?.qualities && opportunityCompetences?.qualities?.length > 0 && (
                        <div className="grid grid-cols-5 gap-3 items-center">
                          <label className="col-span-1 text-xs font-medium text-gray-700">Qualités</label>
                          <div className="col-span-4 flex flex-wrap gap-2">
                            {opportunityCompetences?.qualities.map((item, index) => (
                              <div
                                key={index}
                                className="bg-green-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-green-300 hover:scale-105"
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Languages */}
                      {opportunityCompetences?.languages && opportunityCompetences?.languages?.length > 0 && (
                        <div className="grid grid-cols-5 gap-3 items-center">
                          <label className="col-span-1 text-xs font-medium text-gray-700">Langues</label>
                          <div className="col-span-4 flex flex-wrap gap-2">
                            {opportunityCompetences?.languages.map((item, index) => (
                              <div
                                key={index}
                                className="bg-green-200 rounded-xl text-xs font-medium px-2 py-0.5 transition-all hover:bg-green-300 hover:scale-105"
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4 transform transition-all duration-500 ease-in-out ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
    >
      <div className="w-4/6" onClick={(e) => e.stopPropagation()}>
        {loading && <LoadingContent />}
        {error && !loading && <ErrorContent />}
        {!loading && !error && <MainContent />}
      </div>
    </div>
  );
};

export default OpportunityDetailModal;