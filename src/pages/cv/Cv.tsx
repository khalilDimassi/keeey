import axios from "axios";
import { ChevronDown, Download, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { MdBookmark } from 'react-icons/md';
import { getAuthHeader } from "../utils/jwt";

interface ResumeData {
  personalData: PersonalData
  profile: Profile
  trainings: Training[]
  experiences: Experience[]
  certifications: Certificat[]
  interests: Interest[]
  skills: Skill[]
  projects: Project[]
  qualities: Quality[]
  languages: Language[]
  authorizations: Authorization[]
  tools: Tool[]
}

interface PersonalData {
  first_name: string
  last_name: string
  title: string
  email: string
  phone: string
  gender: string
  street: string
  zip_code: string
  city: string
  birthdate: string
  birthplace: string
  driving_permit: string
  nationality: string
  linked_in: string
  img: string
}

interface Profile {
  description: string
}

interface Training {
  training_id: number
  name: string
  description: string
  organization: string
  city: string
  started_at: string
  ended_at: string
}

interface Experience {
  experience_id: number
  title: string
  description: string
  employer: string
  city: string
  started_at: string
  ended_at: string
}

interface Language {
  language_id: number
  name: string
  level: number
}

interface Interest {
  interest_id: number
  name: string
}

interface Skill {
  skill_id: number
  sector: string
  job: string
  seniority: number
}

interface Certificat {
  certification_id: number
  name: string
  description: string
  started_at: string
  ended_at: string
}

interface Quality {
  quality_id: number
  name: string
}

interface Project {
  project_id: number
  name: string
  description: string
}

interface Authorization {
  authorization_id: number
  name: string
}

interface Tool {
  tool_id: number
  name: string
}

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
import { resolveMotionValue } from "framer-motion";

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
  ];

  // Fetch personal data when the component mounts
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const [resumeResponse, personalResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/resume`, {
            headers: getAuthHeader(),
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/personal`, {
            headers: getAuthHeader(),
          }),
        ]);

        const resumeData = resumeResponse.data;
        const personalData = personalResponse.data;

        setResumeData({
          personalData: {
            first_name: personalData.first_name || resumeData.first_name,
            last_name: personalData.last_name || resumeData.last_name,
            title: personalData.title || resumeData.title,
            email: personalData.email || resumeData.email,
            phone: personalData.phone || resumeData.phone,
            gender: personalData.gender || resumeData.gender,
            street: personalData.street || resumeData.street,
            zip_code: personalData.zip_code || resumeData.zip_code,
            city: personalData.city || resumeData.city,
            birthdate: personalData.birthdate || resumeData.birthdate,
            birthplace: personalData.birthplace || resumeData.birthplace,
            driving_permit: personalData.driving_permit || resumeData.driving_permit,
            nationality: personalData.nationality || resumeData.nationality,
            linked_in: personalData.linked_in || resumeData.linkedin,
            img: personalData.img,
          },
          profile: { description: resumeData.profile_description },
          trainings: resumeData.trainings,
          experiences: resumeData.experiences,
          certifications: resumeData.certifications,
          interests: resumeData.interests,
          skills: resumeData.skills,
          projects: resumeData.projects,
          qualities: resumeData.qualities,
          languages: resumeData.languages,
          authorizations: resumeData.authorizations,
          tools: resumeData.tools,
        });
      } catch (error) {
        setError(error);
        console.error('Error fetching resume data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, []);


  const renderSection = () => {
    switch (activeSection) {
      case "Informations personnelles":
        return <PersonalInfo data={resumeData?.personalData ?? { first_name: '', last_name: '', title: '', email: '', phone: '', gender: '', street: '', zip_code: '', city: '', birthdate: '', birthplace: '', driving_permit: '', nationality: '', linked_in: '', img: '' }} />;
      case "Profil":
        return <Profil data={resumeData?.profile ?? { description: '' }} />;
      case "Formations":
        return <Formation data={resumeData?.trainings ?? []} />;
      case "Expérience professionnelle":
        return <Experience data={resumeData?.experiences ?? []} />;
      case "Certificats":
        return <Certificats data={resumeData?.certifications ?? []} />;
      case "Centre d'intérêt":
        return <Centre data={resumeData?.interests ?? []} />;
      case "Compétences":
        return <Competences data={resumeData?.skills ?? []} />;
      case "Réalisations":
        return <Realisation data={resumeData?.projects ?? []} />;
      case "Qualités":
        return <Qualites data={resumeData?.qualities ?? []} />;
      case "Langue":
        return <Languages data={resumeData?.languages ?? []} />;
      // case "Outils":
      //   return <Outils data={resumeData?.tools ?? []} />;
      // case "Autorisations":
      //   return <Authorizations data={resumeData?.authorizations ?? []} />;

      default:
        return <div className="text-gray-500">Section en construction...</div>;
    }
  };

  return (
    <div className="min-h-screen" style={{ marginTop: "10px" }}>
      {/* Top Header */}
      <div className="bg-white">
        <div className=" mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div className="flex items-center space-x-2">
                <MdBookmark className="text-teal-600" size={27} />
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
                  className={`w-full flex items-center justify-between p-4 rounded-md transition-colors ${activeSection === section ? "bg-teal-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
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
