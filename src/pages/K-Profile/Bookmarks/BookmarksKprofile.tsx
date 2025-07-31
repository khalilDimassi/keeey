import { ArrowUpCircle, ArrowUpRight, MailCheck, MailX, Trash2 } from 'lucide-react';
import { fetchOpportunities, deleteOpportunity, submitOpportunity } from './services';
import { Enhancements, Opportunity, OpportunityStatus } from './types';
import { OpportunitiesSVG } from '../../components/SVGcomponents';
import { useState, useEffect } from 'react';

import JobOpportunities from './JobOpportunities';

const statusLabels: Record<OpportunityStatus, string> = {
  OPEN: 'Ouvert',
  PENDING: 'En attente',
  ACCEPTED: 'Accepté',
  ONGOING: 'En cours',
  CONCLUDED: 'Terminé',
  REJECTED: 'Rejeté',
  CLOSED: 'Fermé'
};

const BookmarksKProfile = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [_selectedID, setSelectedID] = useState<number | null>(null);

  if (error) {
    console.error(">> Error: " + error);
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const results = await fetchOpportunities();
        setOpportunities(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error: trying to load saved opportunities');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteOpportunity(id);
      setOpportunities(prev => prev.filter(opp => opp.id !== id));
    } catch (err) {
      console.error('Failed to delete opportunity:', err);
    }
  };

  const handleSubmit = async (id: number) => {
    try {
      const updatedOpportunity = await submitOpportunity(id);
      setOpportunities(prev =>
        prev.map(opp => opp.id === id ? updatedOpportunity : opp)
      );
    } catch (err) {
      console.error('Failed to submit opportunity:', err);
    }
  };

  const OpportunitySkeleton = () => {
    return (
      <tr className="animate-pulse">
        <td className="px-4 py-2">
          <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
        </td>
        <td className="px-4 py-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </td>
        <td className="px-4 py-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </td>
        <td className="px-4 py-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </td>
        <td className="px-4 py-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </td>
        <td className="px-4 py-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </td>
        <td className="px-4 py-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 mx-auto"></div>
        </td>
        <td className="px-4 py-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 mx-auto"></div>
        </td>
        <td className="px-4 py-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 mx-auto"></div>
        </td>
        <td className="px-4 py-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </td>
        <td className="px-4 py-2">
          <div className="h-10 bg-gray-200 rounded-xl w-24"></div>
        </td>
        <td className="px-4 py-2">
          <div className="flex space-x-2 gap-4">
            <div className="w-7 h-7 rounded-full bg-gray-200"></div>
            <div className="w-7 h-7 rounded-full bg-gray-200"></div>
            <div className="w-7 h-7 rounded-full bg-gray-200"></div>
          </div>
        </td>
      </tr>
    );
  };

  const getTagColorClass = (score: number) => {
    if (score >= 90) return 'bg-green-300';
    if (score >= 80) return 'bg-teal-300';
    if (score >= 70) return 'bg-blue-300';
    if (score >= 60) return 'bg-indigo-300';
    if (score >= 50) return 'bg-purple-300';
    if (score >= 40) return 'bg-yellow-300';
    if (score >= 30) return 'bg-amber-300';
    if (score >= 20) return 'bg-orange-300';
    if (score >= 10) return 'bg-red-300';
    return 'bg-gray-300';
  };

  const calculateCompetenceScore = (scores: Enhancements | null): number => {
    if (!scores) return 0;
    return (
      (scores.jobs_match_percentage * 0.75) +
      (scores.languages_match_percentage * 0.125) +
      (scores.qualities_match_percentage * 0.025) +
      (scores.tools_match_percentage * 0.075) +
      (scores.authorizations_match_percentage * 0.025)
    );
  };

  const SavedOpportunities = () => {
    return (
      <table className="w-full">
        <thead>
          <tr>
            {[
              "% Matching", "Société", "Titre", "Démarrage", "Durée",
              "Localisation", "TJM", "Compétences", "Séniorité",
              "Commentaire", "Statut", ""
            ].map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left text-xs font-medium text-gray-600 tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <OpportunitySkeleton />
          ) : (
            opportunities.map((opp) => {
              const competenceScore = calculateCompetenceScore(opp.enhancements ?? null);
              return (
                <tr key={opp.id} className="hover:bg-white">
                  <td className="px-4 py-2 text-xs font-medium">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {Math.round(opp.enhancements?.total_match_percentage ?? 0 * 10)}%
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs font-medium">{opp.company || "-"}</td>
                  <td className="px-4 py-2 text-xs font-medium">{opp.title || "-"}</td>
                  <td className="px-4 py-2 text-xs font-medium">{opp.start_date || "-"}</td>
                  <td className="px-4 py-2 text-xs font-medium">{opp.duration || "-"}</td>
                  <td className="px-4 py-2 text-xs font-medium">{opp.location || "-"}</td>
                  <td className="px-4 py-2 text-xs font-medium">
                    <div className="relative group mx-auto w-6 h-6">
                      <div className={`w-6 h-6 rounded-full border shadow-sm mx-auto ${getTagColorClass(opp.enhancements?.rate_match_percentage ?? 0)}`}></div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                        Score: {Math.round(opp.enhancements?.rate_match_percentage ?? 0)}%
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-xs font-medium">
                    {/* Competence */}
                    <div className="relative group mx-auto w-6 h-6">
                      <div className={`w-6 h-6 rounded-full border shadow-sm mx-auto ${getTagColorClass(competenceScore)}`}></div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                        <p>Score: {Math.round(competenceScore)}%</p>
                        <p>Emplois: {Math.round(opp.enhancements?.jobs_match_percentage ?? 0)}%</p>
                        <p>Langues: {Math.round(opp.enhancements?.languages_match_percentage ?? 0)}%</p>
                        <p>Outils: {Math.round(opp.enhancements?.tools_match_percentage ?? 0)}%</p>
                        <p>Qualités: {Math.round(opp.enhancements?.qualities_match_percentage ?? 0)}%</p>
                        <p>Autorisations: {Math.round(opp.enhancements?.authorizations_match_percentage ?? 0)}%</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-xs font-medium">
                    {/* Seniority */}
                    <div className="relative group mx-auto w-6 h-6">
                      <div className={`w-6 h-6 rounded-full border shadow-sm mx-auto ${getTagColorClass(opp.enhancements?.seniority_match_percentage ?? 0)}`}></div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                        Score: {Math.round(opp.enhancements?.seniority_match_percentage ?? 0)}%
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-xs font-medium">{opp.comment || "-"}</td>
                  <td className="px-4 py-2 text-xs font-medium">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${opp.status === 'OPEN' ? 'bg-blue-100 text-blue-800' :
                      opp.status === 'PENDING' ? 'bg-yellow-200 text-yellow-900' :
                        opp.status === 'ACCEPTED' ? 'bg-green-200 text-green-900' :
                          opp.status === 'ONGOING' ? 'bg-purple-200 text-purple-900' :
                            opp.status === 'CONCLUDED' ? 'bg-gray-200 text-gray-900' :
                              opp.status === 'REJECTED' ? 'bg-red-200 text-red-900' :
                                'bg-gray-200 text-gray-800'
                      }`}>
                      {statusLabels[opp.status]}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs font-medium">
                    <div className="flex space-x-2 gap-4">
                      <button
                        className="p-0.5 text-white bg-[#297280] rounded-full hover:bg-gray-500 transition-colors"
                        title="Open user profile"
                        onClick={() => { setSelectedID(opp.id) }}
                      >
                        <ArrowUpRight size={15} />
                      </button>
                      {opp.enhancements?.is_applied ? (
                        <MailX
                          className="text-[#297280] hover:text-red-500 transition-all duration-200 transform hover:scale-110"
                          cursor={"pointer"}
                          size={20}
                          strokeWidth={2.5}
                          onClick={() => { handleSubmit(opp.id) }}
                        />
                      ) : (
                        <MailCheck
                          className="text-[#297280] hover:text-green-500 transition-all duration-200 transform hover:scale-110"
                          cursor={"pointer"}
                          size={20}
                          strokeWidth={2.5}
                          onClick={() => { handleSubmit(opp.id) }}
                        />
                      )}
                      <Trash2
                        size={20}
                        color="#297280"
                        className="cursor-pointer hover:text-[#1e5d63]"
                        onClick={() => handleDelete(opp.id)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="flex items-center space-x-3 my-4">
        <OpportunitiesSVG
          size={35}
          color="#297280"
        />
        <h1 className="text-xl font-semibold text-black">
          Opportunités
        </h1>
      </div>

      <JobOpportunities SavedOpportunities={SavedOpportunities()} />
    </div>
  );
};

export default BookmarksKProfile;