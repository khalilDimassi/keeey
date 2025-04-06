import { ChevronDown, Menu } from "lucide-react";
import { useEffect, useState } from "react";
// Components
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
import { ResumeData } from "../types";
import { fetchResumeData } from "../services";


function ResumeTab() {
  const [activeSection, setActiveSection] = useState("Informations personnelles");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <>
      {/* Top Header */}
      <div className=" mx-auto  py-1">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <button className="sm:hidden text-gray-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl bg-white mx-auto px-4 sm:px-6 py-8"   >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Dynamic Content */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">{activeSection}</h2>
              </div>
              {renderSection()}
            </div>
          </div>

          {/* Right Column - Navigation */}
          <div className={`lg:col-span-4 order-2 lg:order-1 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
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
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-colors ${activeSection === section ? "bg-gradient-to-b from-[#30797F] to-[#039DAA] text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  onClick={() => {
                    setActiveSection(section);
                    setMobileMenuOpen(false);
                  }}
                >
                  <span>{section}</span>
                  <ChevronDown size={20} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResumeTab;
