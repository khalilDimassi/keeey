import React, { useState } from 'react';




import { projects } from './projects';
import { VoirDetaile } from './VoirDetaile';
import { MesBesoin } from './MesBesoin';
import { DefinieBesoin_Besoin } from './DefinieBesoin_Besoin';
import CandidatesList from '../CandidatesList';


export interface Project {
    id: number;
    title: string;
    reference: string;
    date: string;
    status: string;
    participants: string[];
  }
function ProjetsBesoins() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDefineNeed, setShowDefineNeed] = useState(false);

  return (
    <div className=" bg-gray-100">
      {showDefineNeed ? (
        <DefinieBesoin_Besoin onBack={() => setShowDefineNeed(false)} />
      ) : selectedProject ? (
        <VoirDetaile
          project={selectedProject} 
          onBack={() => setSelectedProject(null)} 
        />
      ) : (
        <MesBesoin 
          projects={projects}
          onSelectProject={setSelectedProject}
          onDefineNeed={() => setShowDefineNeed(true)}
        />


        
      )}
       
       
    </div>
  );
}

export default ProjetsBesoins;