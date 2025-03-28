import { ChevronDown, Download, FileText, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuthHeader } from "../../../utils/jwt";
import axios from "axios";
// Components
import Experience from "./Experience";
import Profil from "./Profile";
import PersonalInfo from "./PersonalInfo";
import Languages from "./Languages";
import Certificats from "./Certificats";
import Centre from "./Centre";
import Competences from "./Competences";
import Realisation from "./Realisation";
import Qualites from "./Qualites";
import Formation from "./Formation";
import Outils from "./Outils";
import Autorisations from "./Autorisations";

interface ResumeData {
  personalInfo: PersonalData;
  trainings: {
    id: number;
    name: string;
    description: string;
    organization: string;
    city: string;
    started_at: string;
    ended_at: string;
    present: boolean;
  }[];
  experiences: {
    id: number;
    title: string;
    description: string;
    employer: string;
    city: string;
    started_at: string;
    ended_at: string;
    present: boolean;
  }[];
  certifications: {
    id: number;
    name: string;
    description: string;
    started_at: string;
    ended_at: string;
    present: boolean;
  }[];
  interests: {
    id: number;
    name: string;
  }[];
  sectors: {
    id: number;
    name: string;
    jobs: {
      id: number;
      name: string;
      skills: {
        id: number;
        name: string;
        seniority: number;
      }[];
    }[];
  }[];
  projects: {
    id: number;
    name: string;
    description: string;
  }[];
  qualities: {
    id: number;
    name: string;
  }[];
  languages: {
    id: number;
    name: string;
    level: number;
  }[];
  authorizations: {
    id: number;
    name: string;
  }[];
  tools: {
    id: number;
    name: string;
  }[];
}

interface PersonalData {
  first_name: string
  last_name: string
  title: string
  email: string
  phone: string
  gender: string
  img: string
  street: string
  zip_code: string
  city: string
  birthdate: string
  birthplace: string
  driving_permit: string
  nationality: string
  linked_in: string
  description: string
}

function Cv() {
  const [activeSection, setActiveSection] = useState("Informations personnelles");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

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

  const fetchResumeData = async () => {
    try {
      const [resumeResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume/v2`, {
          headers: getAuthHeader(),
        })
      ]);

      const resumeData = resumeResponse.data;
      setResumeData({
        personalInfo: {
          first_name: resumeData.personal_info.first_name || '',
          last_name: resumeData.personal_info.last_name || '',
          title: resumeData.personal_info.title || '',
          email: resumeData.personal_info.email || '',
          phone: resumeData.personal_info.phone || '',
          gender: resumeData.personal_info.gender || '',
          img: resumeData.personal_info.img || '',
          street: resumeData.personal_info.street || '',
          zip_code: resumeData.personal_info.zip_code || '',
          city: resumeData.personal_info.city || '',
          birthdate: resumeData.personal_info.birthdate || '',
          birthplace: resumeData.personal_info.birthplace || '',
          driving_permit: resumeData.personal_info.driving_permit || '',
          nationality: resumeData.personal_info.nationality || '',
          linked_in: resumeData.personal_info.linked_in || '',
          description: resumeData.personal_info.description || '',
        },
        trainings: resumeData.trainings || [],
        experiences: resumeData.experiences || [],
        certifications: resumeData.certifications || [],
        interests: resumeData.interests || [],
        sectors: resumeData.sectors || [],
        projects: resumeData.projects || [],
        qualities: resumeData.qualities || [],
        languages: resumeData.languages || [],
        authorizations: resumeData.authorizations || [],
        tools: resumeData.tools || [],
      });
    } catch (error) {
      setError(error);
      console.error('Error fetching resume data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch personal data when the component mounts
  useEffect(() => {
    fetchResumeData();
  }, []);

  const handleDataUpdated = () => {
    fetchResumeData();
  };

  const renderSection = () => {
    if (loading) {
      return <div className="text-gray-500">Chargement en cours...</div>;
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
    <div className="min-h-screen">
      {/* Top Header */}
      <div className="">
        <div className=" mx-auto  py-1">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center justify-between w-full sm:w-auto">
           
              <button className="sm:hidden text-gray-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu size={24} />
              </button>
            </div>

           
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
                {/* <button className="bg-gradient-to-b from-[#30797F] to-[#039DAA] text-white px-4 py-2 rounded-3xl hover:bg-gradient-to-b from-[#30797F] to-[#039DAA]">Enregistrer</button> */}
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
    </div>
  );
}

export default Cv;
