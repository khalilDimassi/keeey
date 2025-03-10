import { ChevronDown, Download, FileText, Menu } from "lucide-react";
import { useEffect, useState } from "react";


function CvCompetences() {
 

  const sections = [
    "Informations personnelles",
    "Profil",
    "Formations",
    "Expérience professionnelle",
    "Langue",
    "Centre d'intérêt",
    "Compétences",
    "Certificats",
    "Qualités",
    "Réalisations",
    "Outils",
    "Autorisations",
  ];


  return (
    <div className="min-h-screen">
    

      {/* Main Content */}
      <div className="max-w-8xl bg-white mx-auto px-4 sm:px-6 "   >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          

          {/* Right Column - Navigation */}
          <div className={`lg:col-span-4 order-2 lg:order-1 `}>
            <div className="flex justify-center gap-4 mt-4 mb-4">
              <button className="bg-white text-teal-800 px-4 w-1/2 py-2 rounded-3xl border border-teal-800 hover:bg-gray-100">
                Télécharger un CV existant
              </button>
              <button className="bg-white text-teal-800 px-4 w-1/2 py-2 rounded-3xl border border-teal-800 hover:bg-gray-100">
                Importer votre profil LinkedIn
              </button>
            </div>
            <div className="space-y-2">
              {sections.map((section, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-colors"
                    }`}
                
                >
                  <span>{section}</span>
                  <ChevronDown size={20} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CvCompetences;
