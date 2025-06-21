import { ChevronDown, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { ResumeData } from "../types";
import { fetchResumeData } from "../services";

import Experience from "./resumeContent/Experience";
import Profil from "./resumeContent/Profile";
import PersonalInfo from "./resumeContent/PersonalInfo";
import Languages from "./resumeContent/Languages";
import Certificats from "./resumeContent/Certificats";
import Centre from "./resumeContent/Centre";
import Competences from "./resumeContent/Competences";
import Realisation from "./resumeContent/Realisation";
import Qualites from "./resumeContent/Qualites";
import Formation from "./resumeContent/Formation";
import Outils from "./resumeContent/Outils";
import Autorisations from "./resumeContent/Autorisations";


function ResumeTab() {
  const [activeSection, setActiveSection] = useState("Informations personnelles");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
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

  const fetchResume = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchResumeData();
      setResumeData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching resume data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleDataUpdated = () => {
    fetchResume();
  };

  const renderSection = () => {
    if (loading) {
      switch (activeSection) {
        case "Informations personnelles":
          return <PersonalInfo personalData={null} onDataUpdated={handleDataUpdated} />;
        default:
          return <div className="text-gray-500">Chargement en cours...</div>;
      }
    }

    if (error) {
      return <div className="text-red-500">Une erreur est survenue: {String(error)}</div>;
    }

    if (!resumeData) {
      return <div className="text-gray-500">Aucune donnée disponible.</div>;
    }

    switch (activeSection) {
      case "Informations personnelles":
        return <PersonalInfo personalData={resumeData.personalInfo} onDataUpdated={handleDataUpdated} />;
      case "Profil":
        return <Profil data={resumeData.personalInfo.description} onDataUpdated={handleDataUpdated} />;
      case "Formations":
        return <Formation data={resumeData.trainings} onDataUpdated={handleDataUpdated} />;
      case "Expérience professionnelle":
        return <Experience data={resumeData.experiences} onDataUpdated={handleDataUpdated} />;
      case "Certificats":
        return <Certificats data={resumeData.certifications} onDataUpdated={handleDataUpdated} />;
      case "Centre d'intérêt":
        return <Centre data={resumeData.interests} onDataUpdated={handleDataUpdated} />;
      case "Compétences":
        return <Competences data={resumeData.sectors} />;
      case "Réalisations":
        return <Realisation data={resumeData.projects} onDataUpdated={handleDataUpdated} />;
      case "Qualités":
        return <Qualites data={resumeData.qualities} onDataUpdated={handleDataUpdated} />;
      case "Langue":
        return <Languages data={resumeData.languages} onDataUpdated={handleDataUpdated} />;
      case "Outils":
        return <Outils data={resumeData.tools} />;
      case "Autorisations":
        return <Autorisations data={resumeData.authorizations} />;

      default:
        return <div className="text-gray-500">Section en construction...</div>;
    }
  };

  return (
    <div className="max-w-8xl bg-white mx-auto px-4 sm:px-6 py-4">
      <div className="flex gap-8">
        {/* Left Column - Navigation */}
        <div className="w-1/5">
          <div className="flex-row space-y-2 my-2">
            <button className="bg-white text-teal-800 px-4 w-full py-2 rounded-3xl border border-teal-800 hover:bg-gray-100">
              Télécharger un CV existant
            </button>
            <button className="bg-white text-teal-800 px-4 w-full py-2 rounded-3xl border border-teal-800 hover:bg-gray-100">
              Importer votre profil LinkedIn
            </button>
          </div>
          <div className="space-y-2">
            {sections.map((section, index) => (
              <button
                key={index}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-colors 
                  ${activeSection === section ?
                    "bg-[#297280] text-white" :
                    "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                onClick={() => { setActiveSection(section); }}
              >
                <span>{section}</span>
                <ChevronDown size={20} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Dynamic Content */}
        <div className="w-4/5">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">{activeSection}</h2>
            </div>
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeTab;
