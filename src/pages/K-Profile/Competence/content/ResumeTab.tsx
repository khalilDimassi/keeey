import { ChevronDown, Link, Plus, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { ResumeData } from "../types";
import { fetchResumeData } from "../services";
import { LinkImagePopup, FileImagePopup } from "./resumeContent/pfpUpload";

import Experience from "./resumeContent/Experience";
import Profile from "./resumeContent/Profile";
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
  const [activeSection, setActiveSection] = useState("Profile");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showOptionalPopup, setShowOptionalPopup] = useState(false);

  const obligatorySections = [
    "Profile",
    "Formations",
    "Expériences",
    "Compétences",
    "Langue"
  ];

  const optionalSections = [
    "Outils",
    "Certificats",
    "Qualités",
    "Réalisations",
    "Autorisations",
    "Centre d'intérêt"
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

  const isSectionEmpty = (section: string): boolean => {
    if (!resumeData) return true;

    switch (section) {
      case "Profile":
        return !resumeData.personalInfo?.description || resumeData.personalInfo.description.trim() === "";
      case "Formations":
        return !resumeData.trainings || resumeData.trainings.length === 0;
      case "Expériences":
        return !resumeData.experiences || resumeData.experiences.length === 0;
      case "Compétences":
        return !resumeData.sectors || resumeData.sectors.length === 0;
      case "Langue":
        return !resumeData.languages || resumeData.languages.length === 0;
      case "Outils":
        return !resumeData.tools || resumeData.tools.length === 0;
      case "Certificats":
        return !resumeData.certifications || resumeData.certifications.length === 0;
      case "Qualités":
        return !resumeData.qualities || resumeData.qualities.length === 0;
      case "Centre d'intérêt":
        return !resumeData.interests || resumeData.interests.length === 0;
      case "Réalisations":
        return !resumeData.projects || resumeData.projects.length === 0;
      case "Autorisations":
        return !resumeData.authorizations || resumeData.authorizations.length === 0;
      default:
        return true;
    }
  };

  // Get sections that should be displayed (obligatory + non-empty optional)
  const visibleSections = [
    ...obligatorySections,
    ...optionalSections.filter(section => !isSectionEmpty(section))
  ];

  // Get optional sections that are empty and can be added
  const addableOptionalSections = optionalSections.filter(section => isSectionEmpty(section));

  const renderSection = () => {
    if (loading) {
      switch (activeSection) {
        case "Profile":
          return <Profile data={null} onDataUpdated={handleDataUpdated} />;
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
      case "Profile":
        return <Profile data={resumeData.personalInfo.description} onDataUpdated={handleDataUpdated} />;
      case "Formations":
        return <Formation data={resumeData.trainings} onDataUpdated={handleDataUpdated} />;
      case "Expériences":
        return <Experience data={resumeData.experiences} onDataUpdated={handleDataUpdated} />;
      case "Compétences":
        return <Competences data={resumeData.sectors} />;
      case "Langue":
        return <Languages data={resumeData.languages} onDataUpdated={handleDataUpdated} />;
      case "Outils":
        return <Outils data={resumeData.tools} />;
      case "Certificats":
        return <Certificats data={resumeData.certifications} onDataUpdated={handleDataUpdated} />;
      case "Qualités":
        return <Qualites data={resumeData.qualities} onDataUpdated={handleDataUpdated} />;
      case "Centre d'intérêt":
        return <Centre data={resumeData.interests} onDataUpdated={handleDataUpdated} />;
      case "Réalisations":
        return <Realisation data={resumeData.projects} onDataUpdated={handleDataUpdated} />;
      case "Autorisations":
        return <Autorisations data={resumeData.authorizations} />;
      default:
        return <div className="text-gray-500">Section en construction...</div>;
    }
  };

  const handleAddOptionalSection = (section: string) => {
    setActiveSection(section);
    setShowOptionalPopup(false);
  };

  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [showFilePopup, setShowFilePopup] = useState(false);
  const [profileImage, setProfileImage] = useState('');

  const handleLinkClick = () => {
    setShowLinkPopup(true);
  };

  const handleFileClick = () => {
    setShowFilePopup(true);
  };

  const handleSaveImage = (finalUrl: string, cropData: { x: number; y: number; size: number }) => {
    setProfileImage(finalUrl);
    console.info('Image saved:', { finalUrl, cropData });
  };

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-md min-h-[75vh]">
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
            {visibleSections.map((section, index) => {
              const isObligatory = obligatorySections.includes(section);
              const isEmpty = isSectionEmpty(section);
              const showPulse = isObligatory && isEmpty;

              return (
                <button
                  key={index}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-colors relative
                    ${activeSection === section ?
                      "bg-[#297280] text-white" :
                      "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  onClick={() => { setActiveSection(section); }}
                >
                  <div className="flex items-center gap-3">
                    {showPulse && (
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                    <span>{section}</span>
                  </div>
                  <ChevronDown size={20} />
                </button>
              );
            })}

            {/* Add Optional Section Button */}
            {addableOptionalSections.length > 0 && (
              <div className="relative">
                <button
                  className="w-full flex items-center justify-center p-3 rounded-2xl bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-dashed border-gray-300 transition-colors"
                  onClick={() => setShowOptionalPopup(!showOptionalPopup)}
                >
                  <Plus size={16} className="mr-2" />
                  <span className="text-sm">Ajouter une section</span>
                </button>

                {/* Optional Sections Popup */}
                {showOptionalPopup && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {addableOptionalSections.map((section, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 text-sm border-b border-gray-100 last:border-b-0"
                        onClick={() => handleAddOptionalSection(section)}
                      >
                        {section}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Dynamic Content */}
        <div className="w-4/5">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 m-2 rounded-xl border hover:shadow-md hover:shadow-gray-200 transition-all duration-100">
            <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center group shadow-lg ring-4 ring-[#297280] cursor-pointer">
              {resumeData?.personalInfo.img ? (
                <img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="text-[#297280] font-medium">Photo</div>
              )}
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200">
                <div
                  className="absolute left-0 top-0 w-1/2 h-full bg-blue-500 bg-opacity-20 rounded-l-full flex items-center justify-center cursor-pointer hover:bg-opacity-100 transition-all duration-200"
                  onClick={() => handleLinkClick()}
                >
                  <Link className="text-white" size={16} />
                </div>
                <div
                  className="absolute right-0 top-0 w-1/2 h-full bg-green-500 bg-opacity-20 rounded-r-full flex items-center justify-center cursor-pointer hover:bg-opacity-100 transition-all duration-200"
                  onClick={() => handleFileClick()}
                >
                  <Upload className="text-white" size={16} />
                </div>
              </div>
            </div>
            {/* Popups */}
            <LinkImagePopup
              isOpen={showLinkPopup}
              onClose={() => setShowLinkPopup(false)}
              onSave={handleSaveImage}
            />
            <FileImagePopup
              isOpen={showFilePopup}
              onClose={() => setShowFilePopup(false)}
              onSave={handleSaveImage}
            />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-800">{resumeData?.personalInfo.first_name} {resumeData?.personalInfo.last_name}</h2>
              <div className="text-lg text-teal-600 font-medium">{resumeData?.personalInfo.occupation}</div>
              <div className="text-gray-600 mt-1">{resumeData?.personalInfo.email} | {resumeData?.personalInfo.phone}</div>
            </div>
          </div>

          {/* Data Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">{activeSection}</h2>
            </div>
            {renderSection()}
          </div>
        </div>
      </div>

      {/* Backdrop to close popup when clicking outside */}
      {showOptionalPopup && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowOptionalPopup(false)}
        />
      )}
    </div>
  );
}

export default ResumeTab;