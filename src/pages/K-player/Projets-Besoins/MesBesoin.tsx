import { ChevronRight } from 'lucide-react';
import { Project } from './ProjetsBesoins';

interface ProjectsListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export function MesBesoin({ projects, onSelectProject }: ProjectsListProps) {
  const getStatusColor = (project: { status: string; opportunity_role?: string }) => {
    if (project.opportunity_role === "LIVEWELL") {
      return 'bg-blue-100 text-blue-800';
    }
    switch (project.status) {
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
      {projects.map((project) => (
        <div
          key={project.id || project.opportunity_id}
          className="bg-white rounded-xl shadow-sm p-3 border grid grid-cols-[90px_385px_auto_auto_1fr_160px] gap-4 items-center"
        >
          {/* Status */}
          <span className={`px-2 py-1 rounded text-sm ${getStatusColor(project)} text-center`}>
            {project.opportunity_role === "LIVEWELL" ? "Vivier" : getStatusNameInFrench(project.status)}
          </span>

          {/* Title */}
          <span className="font-medium truncate">{project.title}</span>

          {/* Reference */}
          <span className="text-sm bg-blue-200 text-blue-700 px-4 py-1 rounded whitespace-nowrap text-center">
            {project.reference}
          </span>

          {/* Date */}
          <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded text-center">
            {project.date || project.start_at}
          </span>

          {/* Participants */}
          <div className="flex -space-x-2 justify-self-end">
            {project.participants ? (
              project.participants.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Participant ${index + 1}`}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))
            ) : project.kprofiles ? (
              project.kprofiles.map((profile, _index) => (
                <div
                  key={profile.user_id}
                  className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-sm text-blue-700 border-2 border-white"
                >
                  {profile.first_name[0]}{profile.last_name[0]}
                </div>
              ))
            ) : null}
            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-600 border-2 border-white">
              {project.kprofiles?.length}
            </span>
          </div>

          {/* Button */}
          <button
            onClick={() => onSelectProject(project)}
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