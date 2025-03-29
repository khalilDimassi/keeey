import { useState } from "react";
import { FileText, Award } from "lucide-react";
import { isAuthenticated } from "../../../utils/jwt";



import InformationsGnerales from "./mode online/InformationsGnerales";
import CompetencesCriteres from "./mode online/competences & criteres/CompetencesCriteres"
import CvCompetences from "./mode online/CvCompetences";

import JobOpportunities from "./mode online/JobOpportunities";
import SearchCriteria from "./Mode guest/SearchCriteria";
import Competencies from "./Mode guest/Competencies";
import JobOpportunities2 from "./Mode guest/JobOpportunities2";
import Cv from "../cv/Cv";
import Oportunite from "./Oportunite";



const KProfile = ({ onClose }: { onClose: () => void }) => {
  const [isOnline] = useState(isAuthenticated);
  const [activeTab, setActiveTab] = useState(isOnline ? "Informations" : "criteria");
  return (
    <div className="w-full">
      <div className="flex items-center space-x-3 my-4">


        <h1 className="text-xl font-semibold bg-gradient-to-b from-[#30797F] to-[#039DAA] bg-clip-text text-transparent">Mon Profil</h1>
      </div>

      {isOnline ? (
        <>
          <div className="flex gap-2 relative">
            <button
              style={{
                boxShadow: activeTab === "Informations"
                  ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(103, 109, 103, 0.14)"
                  : "none",
               
                fontWeight: 500,
                fontSize: '20px',
                lineHeight: 'Body Large/Line Height',
                letterSpacing: 'Body Large/Tracking',
                textAlign: 'center',
                verticalAlign: 'middle'
              }}
              className={`px-4 py-2 flex gap-2 font-medium transition-all relative ${activeTab === "Informations"
                ? "text-gray-900 bg-white rounded-t-xl z-10"
                : ""
                }`}
              onClick={() => setActiveTab("Informations")}
            >
              Informations Générales
            </button>
            <button
              style={{
                boxShadow: activeTab === "Compétences_Critères"
                  ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(40, 44, 40, 0.14)"
                  : "none",
                  fontWeight: 500,
                  fontSize: '20px',
                  lineHeight: 'Body Large/Line Height',
                  letterSpacing: 'Body Large/Tracking',
                  textAlign: 'center',
                  verticalAlign: 'middle'
              }}
              className={`px-8 flex gap-2 py-2 font-medium transition-all relative ${activeTab === "Compétences_Critères"
                ? "text-gray-900 bg-white rounded-t-xl z-10"
                : " "
                }`}
              onClick={() => setActiveTab("Compétences_Critères")}
            >
              Compétences & Critères
            </button>
            <button
              style={{
                boxShadow: activeTab === "CV_compéténces"
                  ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(103, 109, 103, 0.14)"
                  : "none",
                  fontWeight: 500,
                  fontSize: '20px',
                  lineHeight: 'Body Large/Line Height',
                  letterSpacing: 'Body Large/Tracking',
                  textAlign: 'center',
                  verticalAlign: 'middle'
              }}
              className={`px-8 py-2 flex gap-2 font-medium transition-all relative ${activeTab === "CV_compéténces"
                ? "text-gray-900 bg-white rounded-t-xl z-10"
                : " "
                }`}
              onClick={() => setActiveTab("CV_compéténces")}
            >
              CV / Dossier de compéténces
            </button>
          </div>

          <div className="relative bg-white " >
            <div className="hover-box p-4" style={{ boxShadow: "1px 10px 10px rgba(96, 105, 110, 0.29)", borderRadius: "20px" }}>
              {activeTab === "Informations" && <InformationsGnerales />}
              {activeTab === "Compétences_Critères" && <CompetencesCriteres />}
              {activeTab === "CV_compéténces" && <Cv />}
              <button
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1 shadow-sm border border-gray-200"
                onClick={onClose}
              >
                <svg width="34" height="34" viewBox="5 4 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_d_9011_8527)">
                    <path d="M28 40V16" stroke="#30797F" strokeWidth="3" strokeLinecap="round" />
                    <path d="M20 26L28 16" stroke="#30797F" strokeWidth="3" strokeLinecap="round" />
                    <path d="M36 26L28 16" stroke="#30797F" strokeWidth="3" strokeLinecap="round" />
                    <mask id="path-4-inside-1_9011_8527" fill="white">
                      <path d="M46 27.5539C46 37.2487 37.9411 45.1078 28 45.1078C18.0589 45.1078 10 37.2487 10 27.5539C10 17.8592 18.0589 10 28 10C37.9411 10 46 17.8592 46 27.5539ZM12.0581 27.5539C12.0581 36.1402 19.1955 43.1007 28 43.1007C36.8045 43.1007 43.9419 36.1402 43.9419 27.5539C43.9419 18.9676 36.8045 12.0071 28 12.0071C19.1955 12.0071 12.0581 18.9676 12.0581 27.5539Z" />
                    </mask>
                    <path d="M46 27.5539C46 37.2487 37.9411 45.1078 28 45.1078C18.0589 45.1078 10 37.2487 10 27.5539C10 17.8592 18.0589 10 28 10C37.9411 10 46 17.8592 46 27.5539ZM12.0581 27.5539C12.0581 36.1402 19.1955 43.1007 28 43.1007C36.8045 43.1007 43.9419 36.1402 43.9419 27.5539C43.9419 18.9676 36.8045 12.0071 28 12.0071C19.1955 12.0071 12.0581 18.9676 12.0581 27.5539Z" fill="#30797F" stroke="#30797F" strokeWidth="2" mask="url(#path-4-inside-1_9011_8527)" />
                  </g>
                  <defs>
                    <filter id="filter0_d_9011_8527" x="0" y="0" width="56" height="55.1078" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset />
                      <feGaussianBlur stdDeviation="5" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_9011_8527" />
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_9011_8527" result="shape" />
                    </filter>
                  </defs>
                </svg>
              </button>
            </div>
          </div>

          <JobOpportunities />;
        </>
      ) : (
        <>
          <div className="flex gap-2 relative">
            <button
              style={{
                boxShadow: activeTab === "competencies"
                  ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(103, 109, 103, 0.14)"
                  : "none",
                  fontWeight: 500,
                  fontSize: '20px',
                  lineHeight: 'Body Large/Line Height',
                  letterSpacing: 'Body Large/Tracking',
                  textAlign: 'center',
                  verticalAlign: 'middle'
              }}
              className={`px-8 py-2 flex gap-2 font-medium transition-all relative ${activeTab === "competencies"
                ? "text-gray-900 bg-white rounded-t-xl z-10"
                : "text-gray-400 bg-gray-100/50"
                }`}
              onClick={() => setActiveTab("competencies")}
            >
             
              Mes Compétences
            </button>
            <button
              style={{
                boxShadow: activeTab === "criteria"
                  ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(40, 44, 40, 0.14)"
                  : "none",
                
                  fontWeight: 500,
                  fontSize: '20px',
                  lineHeight: 'Body Large/Line Height',
                  letterSpacing: 'Body Large/Tracking',
                  textAlign: 'center',
                  verticalAlign: 'middle'
              }}
              className={`px-8 flex gap-2 py-2 font-medium transition-all relative ${activeTab === "criteria"
                ? "text-gray-900 bg-white rounded-t-xl z-10"
                : "text-gray-400 bg-gray-100/50"
                }`}
              onClick={() => setActiveTab("criteria")}
            >
              
              Mes critères de recherche
            </button>
          </div>

          <div className="relative bg-white rounded-xl">
            <div className="hover-box p-4" style={{ boxShadow: "1px 10px 10px rgba(96, 105, 110, 0.29)", borderRadius: "20px" }}>
              {activeTab === "criteria" ? <SearchCriteria /> : <Competencies />}
              {/* Close Button */}
              <button
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1 shadow-sm border border-gray-200"
                onClick={onClose}
              >
                <svg width="34" height="34" viewBox="5 4 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_d_9011_8527)">
                    <path d="M28 40V16" stroke="#30797F" strokeWidth="3" strokeLinecap="round" />
                    <path d="M20 26L28 16" stroke="#30797F" strokeWidth="3" strokeLinecap="round" />
                    <path d="M36 26L28 16" stroke="#30797F" strokeWidth="3" strokeLinecap="round" />
                    <mask id="path-4-inside-1_9011_8527" fill="white">
                      <path d="M46 27.5539C46 37.2487 37.9411 45.1078 28 45.1078C18.0589 45.1078 10 37.2487 10 27.5539C10 17.8592 18.0589 10 28 10C37.9411 10 46 17.8592 46 27.5539ZM12.0581 27.5539C12.0581 36.1402 19.1955 43.1007 28 43.1007C36.8045 43.1007 43.9419 36.1402 43.9419 27.5539C43.9419 18.9676 36.8045 12.0071 28 12.0071C19.1955 12.0071 12.0581 18.9676 12.0581 27.5539Z" />
                    </mask>
                    <path d="M46 27.5539C46 37.2487 37.9411 45.1078 28 45.1078C18.0589 45.1078 10 37.2487 10 27.5539C10 17.8592 18.0589 10 28 10C37.9411 10 46 17.8592 46 27.5539ZM12.0581 27.5539C12.0581 36.1402 19.1955 43.1007 28 43.1007C36.8045 43.1007 43.9419 36.1402 43.9419 27.5539C43.9419 18.9676 36.8045 12.0071 28 12.0071C19.1955 12.0071 12.0581 18.9676 12.0581 27.5539Z" fill="#30797F" stroke="#30797F" strokeWidth="2" mask="url(#path-4-inside-1_9011_8527)" />
                  </g>
                  <defs>
                    <filter id="filter0_d_9011_8527" x="0" y="0" width="56" height="55.1078" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset />
                      <feGaussianBlur stdDeviation="5" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_9011_8527" />
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_9011_8527" result="shape" />
                    </filter>
                  </defs>
                </svg>
              </button>
            </div>
          </div>

          <Oportunite />;
        </>
      )}
    </div>
  );
};

export default KProfile;