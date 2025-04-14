import { useState, useEffect, FC } from 'react';
import { fetchOpportunities, deleteOpportunity, submitOpportunity, cancelSubmission } from './services';
import { Enhancements, Opportunity, OpportunityStatus } from './types';
import { ArrowUpCircle, ArrowUpRight, BookmarkIcon, MailCheck, MailX, Trash2 } from 'lucide-react';
import JobOpportunities from '../Competence/content/JobOpportunities';

interface OpportunitiesTableProps {
  onClose: () => void;
}

const statusLabels: Record<OpportunityStatus, string> = {
  OPEN: 'Ouvert',
  PENDING: 'En attente',
  ACCEPTED: 'Accepté',
  ONGOING: 'En cours',
  CONCLUDED: 'Terminé',
  REJECTED: 'Rejeté',
  CLOSED: 'Fermé'
};

const OpportunitiesTable: FC<OpportunitiesTableProps> = ({ onClose }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    try {
      await deleteOpportunity(id);
      setOpportunities(prev => prev.filter(opp => opp.id !== id));
    } catch (err) {
      console.error('Failed to delete opportunity:', err);
    }
  };

  const handleSubmit = async (id: string) => {
    try {
      const updatedOpportunity = await submitOpportunity(id);
      setOpportunities(prev =>
        prev.map(opp => opp.id === id ? updatedOpportunity : opp)
      );
    } catch (err) {
      console.error('Failed to submit opportunity:', err);
    }
  };

  const handleCancelSubmission = async (id: string) => {
    try {
      const updatedOpportunity = await cancelSubmission(id);
      setOpportunities(prev =>
        prev.map(opp => opp.id === id ? updatedOpportunity : opp)
      );
    } catch (err) {
      console.error('Failed to cancel submission:', err);
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

  return (
    <div className="relative w-full">
      <div className="w-full overflow-x-auto rounded-lg px-4">
        <div className="flex items-center space-x-3 py-4">
          <BookmarkIcon color='#30797F' fill='#30797F' size={40} />
          <h1 className="text-xl font-semibold">Opportunités sauvegardées</h1>
        </div>

        <table className="w-full">
          <thead className="border-b-4">
            <tr>
              {[
                "Matching %", "Société", "Titre", "Démarrage", "Durée",
                "Localisation", "TJM", "Compétences", "Séniorité",
                "Commentaire", "Statut", ""
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <>
                {[...Array(5)].map((_, index) => (
                  <OpportunitySkeleton key={index} />
                ))}
              </>
            ) : (
              opportunities.map((opp) => {
                const competenceScore = calculateCompetenceScore(opp.enhancements ?? null);

                return (
                  <tr key={opp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {Math.round(opp.enhancements?.total_match_percentage ?? 0 * 10) / 10}%
                      </span>
                    </td>
                    <td className="px-4 py-2">{opp.company || "-"}</td>
                    <td className="px-4 py-2">{opp.title || "-"}</td>
                    <td className="px-4 py-2">{opp.start_date || "-"}</td>
                    <td className="px-4 py-2">{opp.duration || "-"}</td>
                    <td className="px-4 py-2">{opp.location || "-"}</td>
                    <td className="px-4 py-2">
                      <div className="relative group mx-auto w-6 h-6">
                        <div className={`w-6 h-6 rounded-full border shadow-sm mx-auto ${getTagColorClass(opp.enhancements?.rate_match_percentage ?? 0)}`}></div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                          Score: {Math.round(opp.enhancements?.rate_match_percentage ?? 0)}%
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
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
                    <td className="px-4 py-2">
                      {/* Seniority */}
                      <div className="relative group mx-auto w-6 h-6">
                        <div className={`w-6 h-6 rounded-full border shadow-sm mx-auto ${getTagColorClass(opp.enhancements?.seniority_match_percentage ?? 0)}`}></div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                          Score: {Math.round(opp.enhancements?.seniority_match_percentage ?? 0)}%
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">{opp.comment || "-"}</td>
                    <td className="px-4 py-2">
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
                    <td className="px-4 py-2">
                      <div className="flex space-x-2 gap-4">
                        <button
                          className="p-2 text-white bg-[#30797F] rounded-full hover:bg-gray-500 transition-colors"
                          title="Open user profile"
                          onClick={() => { }}
                        >
                          <ArrowUpRight size={15} />
                        </button>
                        <button
                          onClick={() => {
                            opp.enhancements?.is_applied
                              ? handleCancelSubmission(opp.id)
                              : handleSubmit(opp.id)
                          }}
                          className={`px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors ${opp.enhancements?.is_applied
                            ? 'text-green-500 hover:text-red-500'
                            : 'text-black hover:text-green-500'
                            }`}
                          title={opp.enhancements?.is_applied ? 'Cancel submission' : 'Submit opportunity'}
                        >
                          {opp.enhancements?.is_applied ? (
                            <MailX size={24} />
                          ) : (
                            <MailCheck size={24} />
                          )}
                        </button>
                        <Trash2
                          size={32}
                          color="#30797F"
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
      </div>

      <div className="flex justify-center mt-4">
        <button
          className="bg-white rounded-full p-1 shadow-sm border border-gray-200"
          onClick={onClose}
        >
          <ArrowUpCircle size={32} color="#30797F" />
        </button>
      </div>

      <JobOpportunities />
    </div >
  );
};

export default OpportunitiesTable;