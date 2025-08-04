import { AlertCircle, ChevronRight, FolderOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { CSSProperties, useEffect, useState } from 'react';
import { Opportunity } from '../types';
import { useNavigate } from 'react-router-dom';

interface OpportunityItemProps {
  Opportunity: Opportunity;
  getStatusColor: (Opportunity: { status: string; opportunity_role?: string }) => string;
  getStatusNameInFrench: (status: string) => string;
  onSelect: (OpportunityId: number) => void;
  style?: CSSProperties;
}

const OpportunityItem = ({ Opportunity, getStatusColor, getStatusNameInFrench, onSelect, style }: OpportunityItemProps) => (
  <div
    className="bg-white rounded-xl shadow-sm p-3 border grid grid-cols-[90px_385px_auto_auto_1fr_160px] gap-4  my-2 items-center"
    style={style}
  >
    {/* Status */}
    <span className={`px-2 py-1 rounded text-sm ${getStatusColor(Opportunity)} text-center`}>
      {Opportunity.opportunity_role === "LIVEWELL" ? "Vivier" : getStatusNameInFrench(Opportunity.status)}
    </span>

    {/* Title */}
    <span className="font-medium truncate">{Opportunity.title}</span>

    {/* Reference */}
    <span className="text-sm bg-blue-200 text-blue-700 px-4 py-1 rounded whitespace-nowrap text-center  w-32">
      {Opportunity.reference}
    </span>

    {/* Date */}
    <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded text-center w-20">
      {Opportunity.date || Opportunity.start_at || 'N/A'}
    </span>

    {/* Participants */}
    <div className="flex -space-x-2 justify-self-end">
      {Opportunity.participants ? (
        Opportunity.participants.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Participant ${index + 1}`}
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        ))
      ) : Opportunity.kprofiles ? (
        Opportunity.kprofiles.map((profile, _index) => (
          <div
            key={profile.user_id}
            className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-sm text-blue-700 border-2 border-white"
          >
            {profile.first_name[0]}{profile.last_name[0]}
          </div>
        ))
      ) : null}
      <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-600 border-2 border-white">
        {Opportunity.kprofiles?.length}
      </span>
    </div>

    {/* Button */}
    <button
      onClick={() => { onSelect(Opportunity.opportunity_id) }}
      className="flex justify-center items-center gap-1 bg-[#215A96] text-white mx-4 px-2 py-1 rounded-xl text-center"
    >
      <ChevronRight size={16} />
      Voir détails
    </button>
  </div>
);

interface ProjectsListProps {
  Opportunities: Opportunity[];
  loading: boolean;
  error: string;
}

type SortField = 'status'
  | 'title'
  | 'reference'
  | 'date';

type SortDirection = 'asc'
  | 'desc';

const MIN_LOADING_TIME = 300;

const OpportunitiesList = ({ Opportunities, loading, error }: ProjectsListProps) => {
  const [sortField, setSortField] = useState<SortField>('status');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showLoader, setShowLoader] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      setShowLoader(true);
      setIsInitialLoad(false);
    } else {
      timer = setTimeout(() => {
        setShowLoader(false);
      }, MIN_LOADING_TIME);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const getStatusColor = (Opportunity: { status: string; opportunity_role?: string }) => {
    if (Opportunity.opportunity_role === "LIVEWELL") {
      return 'bg-blue-100 text-blue-800';
    }
    switch (Opportunity.status) {
      case 'PENDING':
        return 'bg-gray-100 text-gray-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'ONGOING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONCLUDED':
        return 'bg-purple-100 text-purple-800';
      case 'OPEN':
        return 'bg-blue-100 text-blue-800';
      case 'CLOSED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusNameInFrench = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'ACCEPTED':
        return 'Accepté';
      case 'REJECTED':
        return 'Rejeté';
      case 'ONGOING':
        return 'En cours';
      case 'CONCLUDED':
        return 'Terminé';
      case 'OPEN':
        return 'Ouvert';
      case 'CLOSED':
        return 'Fermé';
      default:
        return 'Inconnu';
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortOpportunities = (opportunities: Opportunity[]) => {
    return [...opportunities].sort((a, b) => {
      // Always keep LIVEWELL opportunities at the bottom
      if (a.opportunity_role === "LIVEWELL" && b.opportunity_role !== "LIVEWELL") return 1;
      if (a.opportunity_role !== "LIVEWELL" && b.opportunity_role === "LIVEWELL") return -1;

      let compareValue = 0;

      switch (sortField) {
        case 'status':
          compareValue = (a.status || '').localeCompare(b.status || '');
          break;
        case 'title':
          compareValue = (a.title || '').localeCompare(b.title || '');
          break;
        case 'reference':
          compareValue = (a.reference || '').localeCompare(b.reference || '');
          break;
        case 'date':
          const dateA = a.date || a.start_at || '';
          const dateB = b.date || b.start_at || '';
          compareValue = dateA.localeCompare(dateB);
          break;
      }

      return sortDirection === 'asc' ? compareValue : -compareValue;
    });
  };

  const sortedOpportunities = sortOpportunities(Opportunities);

  if (showLoader) {
    return (
      <div className="space-y-4 bg-white rounded-lg p-4 transition-opacity duration-300"
        style={{ boxShadow: "0 0 4px 1px #11355d69", borderRadius: "10px" }}>
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-sm p-3 border grid grid-cols-[90px_385px_auto_auto_1fr_160px] gap-4 items-center ${isInitialLoad ? '' : 'animate-pulse'
              }`}
          >
            {/* Status Skeleton */}
            <div className="h-6 bg-gray-200 rounded"></div>

            {/* Title Skeleton */}
            <div className="h-4 bg-gray-200 rounded"></div>

            {/* Reference Skeleton */}
            <div className="h-6 bg-gray-200 rounded"></div>

            {/* Date Skeleton */}
            <div className="h-6 bg-gray-200 rounded"></div>

            {/* Participants Skeleton */}
            <div className="flex -space-x-2 justify-self-end">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
              ))}
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
            </div>

            {/* Button Skeleton */}
            <div className="h-8 bg-gray-200 rounded-lg" style={{ borderRadius: "20px" }}></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 bg-white rounded-lg p-4" style={{ boxShadow: "0 0 4px 1px #11355d69", borderRadius: "10px" }}>
        <div className="bg-white rounded-xl shadow-sm p-3 border grid grid-cols-1 gap-4 items-center justify-center text-center">
          <div className="text-red-500 font-medium">
            <AlertCircle className="inline mr-2" size={20} />
            Erreur de chargement
          </div>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (Opportunities.length === 0) {
    return (
      <div className="space-y-4 bg-white rounded-lg p-4" style={{ boxShadow: "0 0 4px 1px #11355d69", borderRadius: "10px" }}>
        <div className="bg-white rounded-xl shadow-sm p-3 border grid grid-cols-1 gap-4 items-center justify-center text-center">
          <div className="text-gray-500">
            <FolderOpen className="inline mr-2" size={20} />
            Aucune opportunité trouvée
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-white rounded-lg p-4" style={{ boxShadow: "0 0 4px 1px #11355d69", borderRadius: "10px" }}>
      {/* Header with sorting options */}
      <div className="bg-white rounded-xl shadow-sm p-3 border grid grid-cols-[90px_385px_auto_auto_1fr_160px] gap-4 items-center font-medium">
        <button
          className="flex justify-self-center items-center gap-1"
          onClick={() => handleSort('status')}
        >
          Statut
          {sortField === 'status' ? (
            sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
          ) : null}
        </button>

        <button
          className="flex items-center gap-1 text-left"
          onClick={() => handleSort('title')}
        >
          Titre
          {sortField === 'title' ? (
            sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
          ) : null}
        </button>

        <button
          className="flex items-center justify-center gap-1 w-32"
          onClick={() => handleSort('reference')}
        >
          Référence
          {sortField === 'reference' ? (
            sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
          ) : null}
        </button>

        <button
          className="flex justify-center items-center gap-1 w-20"
          onClick={() => handleSort('date')}
        >
          Date
          {sortField === 'date' ? (
            sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
          ) : null}
        </button>

        <div className="text-right">Participants</div>
        <div className="text-center">Actions</div>
      </div>
      <div className="animate-stagger">
        {/* Regular opportunities */}
        {sortedOpportunities.filter(opp => opp.opportunity_role !== "LIVEWELL").map((Opportunity, index) => (
          <OpportunityItem
            key={Opportunity.id || Opportunity.opportunity_id}
            Opportunity={Opportunity}
            getStatusColor={getStatusColor}
            getStatusNameInFrench={getStatusNameInFrench}
            onSelect={(opportunityId) => navigate(`/kplayer/opportunities/${opportunityId}`)}
            style={{ animationDelay: `${index * 0.05}s` }}
          />
        ))}
        {/* LIVEWELL opportunities section */}
        {sortedOpportunities.some(opp => opp.opportunity_role === "LIVEWELL") && (<>
          <div className="border-t border-gray-200 my-4"></div>
          {sortedOpportunities.filter(opp => opp.opportunity_role === "LIVEWELL").map((Opportunity, index) => (
            <OpportunityItem
              key={Opportunity.id || Opportunity.opportunity_id}
              Opportunity={Opportunity}
              getStatusColor={getStatusColor}
              getStatusNameInFrench={getStatusNameInFrench}
              onSelect={(opportunityId) => navigate(`/kplayer/opportunities/${opportunityId}`)}
              style={{ animationDelay: `${index * 0.05}s` }}
            />
          ))}
        </>)}
      </div>
    </div>
  );
}

export default OpportunitiesList;