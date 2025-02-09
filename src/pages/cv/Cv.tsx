import { ChevronDown, Download, Menu, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { MdBookmark } from 'react-icons/md';

// Components
import Experience from "./Experience";
import Formation from "./Formation";

import Profil from "./Profile";
import PersonalInfo from "./PersonalInfo";
import Languages from "./Languages";
import Certificats from "./Certificats";
import Centre from "./Centre";
import Competences from "./Competences";
import Realisation from "./Realisation";
import Qualites from "./Qualites";

function Cv() {
  const [activeSection, setActiveSection] = useState("Informations personnelles");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "Informations personnelles":
        return <PersonalInfo />;
      case "Profil":
        return <Profil />;
     
      case "Formations":
        return <Formation />;
      case "Expérience professionnelle":
        return <Experience />;
        case "Certificats":
                    return <Certificats />;
                    case "Centre d'intérêt":
                        return <Centre />;
                        case "Compétences":
                            return <Competences />;
                            case "Réalisations":
                                return <Realisation />;
                                case "Qualités":
                                    return <Qualites />;
        case "Langue":
            
        return <Languages />;
      default:
        return <div className="text-gray-500">Section en construction...</div>;
    }
  };

  return (
    <div className="min-h-screen" style={{marginTop:"10px"}}>
      {/* Top Header */}
      <div className="bg-white">
        <div className=" mx-auto px-1 sm:px-10 py-2">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto">
  <div className="flex items-center space-x-2 mt-10">
    <MdBookmark className="text-teal-600" size={35} />
    <h1 className="text-xl font-semibold ">CV</h1>
  </div>
  <button className="sm:hidden text-gray-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
    <Menu size={24} />
  </button>
</div>

            <button className="text-teal-600 border border-teal-600 px-4 py-2 rounded-md hover:bg-teal-50 flex items-center gap-2">
              <Download size={18} />
              <span>Télécharger mon CV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Dynamic Content */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">{activeSection}</h2>
                <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">Enregistrer</button>
              </div>
              {renderSection()}
            </div>
          </div>

          {/* Right Column - Navigation */}
          <div className={`lg:col-span-5 order-1 lg:order-2 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="flex justify-center gap-4 mt-4 mb-4">
              <button className="bg-white text-teal-600 px-4 w-1/2 py-2 rounded-md border border-teal-600 hover:bg-gray-100">
                Télécharger un CV existant
              </button>
              <button className="bg-white text-teal-600 px-4 w-1/2 py-2 rounded-md border border-teal-600 hover:bg-gray-100">
                Importer votre profil LinkedIn
              </button>
            </div>
            <div className="space-y-2">
              {sections.map((section, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center justify-between p-4 rounded-md transition-colors ${
                    activeSection === section ? "bg-teal-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
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
    </div>
  );
}

export default Cv;
