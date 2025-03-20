import { ChevronRight } from 'lucide-react';
import { Opportunity } from './ProjetsBesoins';

interface OpportunitiesListProps {
  Opportunities: Opportunity[];
  onSelectOpportunity: (Opportunity: Opportunity) => void;
}

export function MesBesoin({ Opportunities, onSelectOpportunity }: OpportunitiesListProps) {
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

  return (
    <div className="space-y-4 bg-white rounded-lg p-4" style={{ boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)", borderRadius: "10px" }}>
      {Opportunities.map((Opportunity) => (
        <div
          key={Opportunity.id || Opportunity.opportunity_id}
          className="bg-white rounded-xl shadow-sm p-3 border grid grid-cols-[90px_385px_auto_auto_1fr_160px] gap-4 items-center"
        >
          {/* Status */}
          <span className={`px-2 py-1 rounded text-sm ${getStatusColor(Opportunity)} text-center`}>
            {Opportunity.opportunity_role === "LIVEWELL" ? "Vivier" : getStatusNameInFrench(Opportunity.status)}
          </span>

          {/* Title */}
          <span className="font-medium truncate">{Opportunity.title}</span>

          {/* Reference */}
          <span className="text-sm bg-blue-200 text-blue-700 px-4 py-1 rounded whitespace-nowrap text-center">
            {Opportunity.reference}
          </span>

          {/* Date */}
          <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded text-center">
            {Opportunity.date || Opportunity.start_at}
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
            onClick={() => onSelectOpportunity(Opportunity)}
            className="flex items-center gap-1 bg-blue-700 text-white px-4 py-1 rounded-lg text-center"
            style={{ borderRadius: "20px", backgroundColor: "#215A96" }}
          >
            <ChevronRight size={16} />
            Voir détails
          </button>
        </div>
      ))}
    </div>
  );
}