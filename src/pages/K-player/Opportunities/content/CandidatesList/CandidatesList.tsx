import { useEffect, useState } from "react";
import { emitter } from "../../../../../utils/eventEmitter";
import { CandidateSuggestion } from "./types";
import { fetchCandidatesWithMatchData, starCandidate, updateCandidateStatus, validateCandidateInterest } from "./services";
import { isAuthenticated, loadGuestOpportunities } from "../../../../../utils/jwt";
import { fetchUpdateGestOpportunityMatches } from "../../services";
import { GuestOpportunity } from "../../types";

import CandidateDetailModal from "./content/CandidateDetailsModale";
import CandidateCard from "./content/CandidateCard";

interface CandidatesListProps {
  apiType?: string;
  opportunityId?: string;
  selectedCandidateId?: string;
  onClodeModal?: () => void;
}

const Header = ({ apiType, count, error, loading, matchPercentageFilter, onPercentageChange }: { apiType?: string; count?: number; error?: string | null; loading?: boolean; matchPercentageFilter?: number; onPercentageChange?: (value: number) => void; }) => {
  const titleMap = {
    ALL: "Suggestions",
    SUBMITTED: "Submissions",
    default: "Candidates"
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">
        {titleMap[apiType as keyof typeof titleMap] || titleMap.default}
        <span className="text-gray-500">
          {loading ? " (Loading...)" : error ? ` (Error: ${error})` : ` (${count} Candidates)`}
        </span>
      </h2>

      {onPercentageChange && (
        <div className="flex justify-between items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-300 shadow-sm">
          <span className="text-gray-500">Filter by</span>
          <input
            type="number"
            min="0"
            max="100"
            value={matchPercentageFilter}
            onChange={(e) => onPercentageChange(parseInt(e.target.value) || 0)}
            className="w-full text-center outline-none border-2"
          />
          <span className="ml-1">%</span>
        </div>
      )}
    </div>
  );
};

const CandidatesList = ({ apiType = "ALL", opportunityId, selectedCandidateId, onClodeModal }: CandidatesListProps) => {
  const [candidates, setCandidates] = useState<CandidateSuggestion[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<CandidateSuggestion[]>([]);
  const [showExtraSkills, setShowExtraSkills] = useState<Record<string, boolean>>({});
  const [selectedCandidateID, setSelectedCandidateID] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [matchPercentageFilter, setMatchPercentageFilter] = useState<number>(0);

  const isAuth = isAuthenticated();

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (isAuth) {
      fetchCandidatesWithMatchData(apiType, opportunityId)
        .then(data => setCandidates(data))
        .catch(err => setError(err instanceof Error ? err.message : 'Failed to load candidates'))
        .finally(() => setLoading(false));
    } else if (apiType !== "SUBMITTED") {
      // fetchUpdateGestOpportunityMatches(loadGuestOpportunities().find(opportunity => opportunity.id === opportunityId) as GuestOpportunity)
      //   .then((results) => { setCandidates(results) })
      //   .catch(err => setError(err instanceof Error ? err.message : 'Failed to load candidates'))
      //   .finally(() => setLoading(false));
    } else {
      setCandidates([]);
      setError('Cette fonctionnalité est réservée aux utilisateurs enregistrés.');
      setLoading(false);
    }

    const handleRefresh = () => setVersion(v => v + 1);
    emitter.on('refreshSuggestions', handleRefresh);
    return () => emitter.off('refreshSuggestions', handleRefresh);
  }, [apiType, opportunityId, isAuth]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (isAuth) {
      fetchCandidatesWithMatchData(apiType, opportunityId)
        .then(data => setCandidates(data))
        .catch(err => setError(err instanceof Error ? err.message : 'Failed to load candidates'))
        .finally(() => setLoading(false));
    } else if (apiType !== "SUBMITTED") {
      fetchUpdateGestOpportunityMatches(loadGuestOpportunities().find(opportunity => opportunity.id === Number(opportunityId)) as GuestOpportunity)
        .then((results) => { setCandidates(results) })
        .catch(err => setError(err instanceof Error ? err.message : 'Failed to load candidates'))
        .finally(() => setLoading(false));
    } else {
      setCandidates([]);
      setError('Cette fonctionnalité est réservée aux utilisateurs enregistrés.');
      setLoading(false);
    }
  }, [version, apiType, opportunityId, isAuth]);

  useEffect(() => { if (selectedCandidateId) setSelectedCandidateID(selectedCandidateId); }, [selectedCandidateId]);

  // Filter and sort candidates
  useEffect(() => {
    const filtered = candidates.filter(candidate =>
      (candidate.matching?.total_match_percentage ?? 0) >= matchPercentageFilter
    );

    const sorted = [...filtered].sort((a, b) => {
      if (a.isStarred !== b.isStarred) return a.isStarred ? -1 : 1;
      if (a.isValidated !== b.isValidated) return a.isValidated ? -1 : 1;

      return (b.matching?.total_match_percentage ?? 0) - (a.matching?.total_match_percentage ?? 0);
    });

    setFilteredCandidates(sorted);
  }, [matchPercentageFilter, candidates]);

  // Handlers 
  const handleCloseModal = () => {
    setSelectedCandidateID(null);
    onClodeModal?.();
  };

  const updateAndSortCandidates = (userId: string, updates: Partial<CandidateSuggestion>) => {
    setCandidates(prev => {
      const updated = updateCandidateStatus(prev, userId, updates);
      return [...updated].sort((a, b) => {
        if (a.isStarred !== b.isStarred) return a.isStarred ? -1 : 1;
        if (a.isValidated !== b.isValidated) return a.isValidated ? -1 : 1;
        return (b.matching?.total_match_percentage ?? 0) - (a.matching?.total_match_percentage ?? 0);
      });
    });
  };

  const handleStarCandidate = async (userId: string) => {
    try {
      if (!opportunityId) return;
      await starCandidate(opportunityId, userId);
      updateAndSortCandidates(userId, { isStarred: true });
    } catch (error) {
      console.error("Error starring candidate:", error);
    }
  };

  const handleValidateInterest = async (userId: string) => {
    try {
      if (!opportunityId) return;
      await validateCandidateInterest(opportunityId, userId);
      updateAndSortCandidates(userId, { isValidated: true });
    } catch (error) {
      console.error("Error validating candidate interest:", error);
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(1)].map((_, index) => (
        <div
          key={index}
          className="bg-white p-3 rounded-lg shadow-md grid grid-cols-7 gap-4 items-center"
          style={{ boxShadow: "0 0 4px 1px #11355d69", borderRadius: "10px" }}
        >
          {[...Array(7)].map((_, i) => (
            <div key={i} className={`h-8 rounded-md bg-gray-200 ${i === 6 ? 'col-span-1' : ''}`}></div>
          ))}
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <>
        <Header apiType={apiType} count={0} loading />
        <LoadingSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header apiType={apiType} count={0} error={error} />
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</div>
      </>
    );
  }

  return (
    <>
      <Header
        apiType={apiType}
        count={filteredCandidates.length}
        matchPercentageFilter={matchPercentageFilter}
        onPercentageChange={setMatchPercentageFilter}
      />

      {filteredCandidates.map(candidate => (
        <CandidateCard
          key={candidate.user_id}
          candidate={candidate}
          showExtraSkills={showExtraSkills}
          setShowExtraSkills={setShowExtraSkills}
          onStarCandidate={handleStarCandidate}
          onValidateInterest={handleValidateInterest}
          onSelectCandidate={setSelectedCandidateID}
        />
      ))}

      {selectedCandidateID && (
        <CandidateDetailModal
          candidateId={selectedCandidateID}
          matchings={filteredCandidates.find(c => c.user_id === selectedCandidateID)?.matching ?? null}
          onClose={handleCloseModal}
          is_starred={filteredCandidates.find(c => c.user_id === selectedCandidateID)?.isStarred ?? false}
          is_validated={filteredCandidates.find(c => c.user_id === selectedCandidateID)?.isValidated ?? false}
          onStarCandidate={handleStarCandidate}
          onValidateInterest={handleValidateInterest}
        />
      )}
    </>
  );
};

export default CandidatesList;