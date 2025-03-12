import React from 'react';
import { Plus, ChevronRight, Briefcase, Search } from 'lucide-react';
import CandidatesList from '../Competances/CandidatesList';


export interface Project {
    id: number;
    title: string;
    reference: string;
    date: string;
    status: string;
    participants: string[];
  }
interface ProjectsListProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onDefineNeed: () => void;
}

export function MesBesoin({ projects, onSelectProject, onDefineNeed }: ProjectsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours':
        return 'bg-green-100 text-green-800';
      case 'Clôturé':
        return 'bg-orange-100 text-orange-800';
      case 'Annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-2 w-full mx-auto ml-2">
      <div className="flex flex-col gap-6 ">
        <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3  mb-2">
    <Search className="" style={{color: "#215A96"}} size={40} />
    <h1 className="text-xl font-semibold ">Projets/Besoins</h1>
  </div>

          <div className="flex  mx-auto rounded-full">
            <button className="px-6 py-2 text-sm text-blue-700 bg-blue-200 border " style={{borderRadius:"20px  0  0 20px",border:"solid 1px "}}>
              Mes besoins
            </button>
            <button className="px-6 py-2 text-sm text-gray-600 bg-gray-50 border"style={{border:"solid 1px "}}>
              Besoins de ma société
            </button>
            <button className="px-6 py-2 text-sm text-gray-600 bg-gray-50 border"style={{borderRadius:"0 20px 20px 0",border:"solid 1px "}}>
              Besoins de mon réseau
            </button>
          </div>

          <button 
            onClick={onDefineNeed}
            className="flex items-center  gap-2 bg-blue-700 text-white px-4 py-2 rounded-xl ml-auto" style={{width:"12rem",backgroundColor:"#215A96" }}
          >
            <Plus size={15} />
            Définir un besoin
          </button>
        </div>
      </div>

      <div className="space-y-4 bg-white rounded-lg p-4 "style={{boxShadow: "0 0 4px 1px rgba(17, 53, 93, 0.41)" ,borderRadius:"10px"}}>
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm p-3 border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <span className={`px-2 py-1 rounded text-sm ${getStatusColor(project.status)} min-w-[90px] text-center`}>
                  {project.status}
                </span>
                <span className="font-medium min-w-[250px]">{project.title}</span>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-4">
                    <span className="text-sm bg-blue-200 text-blue-700 px-6 py-1 rounded min-w-[140px] whitespace-nowrap"style={{borderRadius:"10px"}}>
                      Référence: {project.reference}
                    </span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded">
              {project.date}
            </span>
                    
                    
                  
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex -space-x-2">
                  {project.participants.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Participant ${index + 1}`}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ))}
                  <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-600 border-2 border-white">
                    +4
                  </span>
                </div>
                <button
                  onClick={() => onSelectProject(project)}
                  className="flex items-center gap-1 bg-blue-700 text-white px-6 py-1 rounded-lg ml-5  text-center min-w-[160px]"style={{borderRadius:"20px",backgroundColor:"#215A96" }}
                >
                  <ChevronRight size={16} />
                  Voir détails
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
           <CandidatesList />
         </div>
    </div>
  );
}