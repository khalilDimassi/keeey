import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FileText, Award, BrainCircuit } from "lucide-react";
import SearchCriteria from "./SearchCriteria";
import Competencies from "./Competencies";
import { isAuthenticated } from "../../../utils/jwt";

import InformationsGnerales from "./InformationsGnerales";
import CompetencesCriteres from "./CompetencesCriteres";
import CvCompetences from "./CvCompetences";

const KProfile = ({ onClose }: { onClose: () => void }) => {
  
  const [isOnline] = useState(isAuthenticated); // Connection state
  const [activeTab, setActiveTab] = useState(isOnline ? "Informations" : "criteria");
  return (
    <div className="w-full">
      <div className="flex items-center space-x-3 mt-1 mb-7">
        <svg width="40" height="37" viewBox="0 0 40 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M34.8015 27.0631C36.4718 27.0631 39.0469 28.2375 39.0469 31.5369C39.0469 34.8363 36.0542 35.5913 34.8015 35.5913C33.5487 35.5913 30.6952 34.4728 30.6952 31.5369C30.6952 28.601 33.1311 27.0631 34.8015 27.0631Z" fill="#30797F" />
          <path d="M31.1824 14.9H38.3509V22.1H31.1824V14.9Z" fill="#30797F" />
          <path d="M30.904 7.83986H38.6293L34.7895 1.08006L30.904 7.83986Z" fill="#30797F" />
          <path d="M8.1458 8.88833C8.04685 8.88833 7.94959 8.88562 7.85403 8.88028C5.59188 8.87472 1.04689 10.1056 1.04688 15.3894V22.869H4.45714L5.2923 36.5H10.7905L11.8344 22.869H15.2447V15.3894C15.2447 12.1039 12.5443 8.88833 8.1458 8.88833Z" fill="#30797F" />
          <path d="M8.1458 8.88833C13.644 8.88833 13.9224 0.500068 8.1458 0.5C2.47319 0.499933 2.63958 8.58913 7.85403 8.88028C7.95615 8.88053 8.05361 8.8833 8.1458 8.88833Z" fill="#30797F" />
          <path d="M8.1458 8.88833C13.644 8.88833 13.9224 0.500068 8.1458 0.5C2.47319 0.499933 2.63958 8.58913 7.85403 8.88028M8.1458 8.88833C12.5443 8.88833 15.2447 12.1039 15.2447 15.3894M8.1458 8.88833C8.04685 8.88833 7.94959 8.88562 7.85403 8.88028M8.1458 8.88833C8.05361 8.8833 7.95615 8.88053 7.85403 8.88028M1.04688 15.3894C1.04687 20.9117 1.04688 22.869 1.04688 22.869M1.04688 15.3894C1.04689 10.1056 5.59188 8.87472 7.85403 8.88028M1.04688 15.3894V22.869M1.04688 22.869H4.45714M4.45714 22.869V15.3894M4.45714 22.869L5.2923 36.5H10.7905L11.8344 22.869M11.8344 22.869V15.3894M11.8344 22.869H15.2447M15.2447 22.869C15.2447 22.869 15.2447 18.6748 15.2447 15.3894M15.2447 22.869V15.3894M19.2813 18.535H23.9443M23.9443 18.535V5.74278H28.4681M23.9443 18.535V31.5369H28.3289M23.9443 18.535H28.3289M34.8015 1.05929L34.7895 1.08006M34.7895 1.08006L30.904 7.83986H38.6293L34.7895 1.08006ZM31.1824 14.9H38.3509V22.1H31.1824V14.9ZM34.8015 27.0631C36.4718 27.0631 39.0469 28.2375 39.0469 31.5369C39.0469 34.8363 36.0542 35.5913 34.8015 35.5913C33.5487 35.5913 30.6952 34.4728 30.6952 31.5369C30.6952 28.601 33.1311 27.0631 34.8015 27.0631Z" stroke="#30797F" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        <h1 className="text-xl font-semibold ">Compétence</h1>
      </div>
      
      {isOnline ? (
        <>
          <div className="flex gap-2 relative">
            <button
              style={{
                boxShadow: activeTab === "Informations"
                  ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(103, 109, 103, 0.14)"
                  : "none"
              }}
              className={`px-8 py-3 flex gap-2 font-medium transition-all relative ${
                activeTab === "Informations"
                  ? "text-gray-900 bg-white rounded-t-xl z-10"
                  : "text-gray-400 bg-gray-100/50"
              }`}
              onClick={() => setActiveTab("Informations")}
            >
              Informations Générales
            </button>
            <button
              style={{
                boxShadow: activeTab === "Compétences_Critères"
                  ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(40, 44, 40, 0.14)"
                  : "none"
              }}
              className={`px-8 flex gap-2 py-3 font-medium transition-all relative ${
                activeTab === "Compétences_Critères"
                  ? "text-gray-900 bg-white rounded-t-xl z-10"
                  : "text-gray-400 bg-gray-100/50"
              }`}
              onClick={() => setActiveTab("Compétences_Critères")}
            >
              Compétences & Critères
            </button>
            <button
              style={{
                boxShadow: activeTab === "CV_compéténces"
                  ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(103, 109, 103, 0.14)"
                  : "none"
              }}
              className={`px-8 py-3 flex gap-2 font-medium transition-all relative ${
                activeTab === "CV_compéténces"
                  ? "text-gray-900 bg-white rounded-t-xl z-10"
                  : "text-gray-400 bg-gray-100/50"
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
              {activeTab === "CV_compéténces" && <CvCompetences />}
              <button
        className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-1 shadow-sm border border-gray-200"
        onClick={onClose}
      >
        <svg width="34" height="34" viewBox="5 4 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_d_9011_8527)">
            <path d="M28 40V16" stroke="#30797F" stroke-width="3" stroke-linecap="round" />
            <path d="M20 26L28 16" stroke="#30797F" stroke-width="3" stroke-linecap="round" />
            <path d="M36 26L28 16" stroke="#30797F" stroke-width="3" stroke-linecap="round" />
            <mask id="path-4-inside-1_9011_8527" fill="white">
              <path d="M46 27.5539C46 37.2487 37.9411 45.1078 28 45.1078C18.0589 45.1078 10 37.2487 10 27.5539C10 17.8592 18.0589 10 28 10C37.9411 10 46 17.8592 46 27.5539ZM12.0581 27.5539C12.0581 36.1402 19.1955 43.1007 28 43.1007C36.8045 43.1007 43.9419 36.1402 43.9419 27.5539C43.9419 18.9676 36.8045 12.0071 28 12.0071C19.1955 12.0071 12.0581 18.9676 12.0581 27.5539Z" />
            </mask>
            <path d="M46 27.5539C46 37.2487 37.9411 45.1078 28 45.1078C18.0589 45.1078 10 37.2487 10 27.5539C10 17.8592 18.0589 10 28 10C37.9411 10 46 17.8592 46 27.5539ZM12.0581 27.5539C12.0581 36.1402 19.1955 43.1007 28 43.1007C36.8045 43.1007 43.9419 36.1402 43.9419 27.5539C43.9419 18.9676 36.8045 12.0071 28 12.0071C19.1955 12.0071 12.0581 18.9676 12.0581 27.5539Z" fill="#30797F" stroke="#30797F" stroke-width="2" mask="url(#path-4-inside-1_9011_8527)" />
          </g>
          <defs>
            <filter id="filter0_d_9011_8527" x="0" y="0" width="56" height="55.1078" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
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
        </>
      ) : (
        <>
          <div className="flex gap-2 relative">
            <button
              style={{
                boxShadow: activeTab === "competencies"
                  ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(103, 109, 103, 0.14)"
                  : "none"
              }}
              className={`px-8 py-3 flex gap-2 font-medium transition-all relative ${
                activeTab === "competencies"
                  ? "text-gray-900 bg-white rounded-t-xl z-10"
                  : "text-gray-400 bg-gray-100/50"
              }`}
              onClick={() => setActiveTab("competencies")}
            >
              <Award className={`w-5 h-5 ${activeTab === "competencies" ? "text-teal-600" : "text-gray-400"}`} />
              Mes Compétences
            </button>

            <button
              style={{
                boxShadow: activeTab === "criteria"
                  ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(40, 44, 40, 0.14)"
                  : "none"
              }}
              className={`px-8 flex gap-2 py-3 font-medium transition-all relative ${
                activeTab === "criteria"
                  ? "text-gray-900 bg-white rounded-t-xl z-10"
                  : "text-gray-400 bg-gray-100/50"
              }`}
              onClick={() => setActiveTab("criteria")}
            >
              <FileText className={`w-5 h-5 ${activeTab === "criteria" ? "text-teal-600" : "text-gray-400"}`} />
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
            <path d="M28 40V16" stroke="#30797F" stroke-width="3" stroke-linecap="round" />
            <path d="M20 26L28 16" stroke="#30797F" stroke-width="3" stroke-linecap="round" />
            <path d="M36 26L28 16" stroke="#30797F" stroke-width="3" stroke-linecap="round" />
            <mask id="path-4-inside-1_9011_8527" fill="white">
              <path d="M46 27.5539C46 37.2487 37.9411 45.1078 28 45.1078C18.0589 45.1078 10 37.2487 10 27.5539C10 17.8592 18.0589 10 28 10C37.9411 10 46 17.8592 46 27.5539ZM12.0581 27.5539C12.0581 36.1402 19.1955 43.1007 28 43.1007C36.8045 43.1007 43.9419 36.1402 43.9419 27.5539C43.9419 18.9676 36.8045 12.0071 28 12.0071C19.1955 12.0071 12.0581 18.9676 12.0581 27.5539Z" />
            </mask>
            <path d="M46 27.5539C46 37.2487 37.9411 45.1078 28 45.1078C18.0589 45.1078 10 37.2487 10 27.5539C10 17.8592 18.0589 10 28 10C37.9411 10 46 17.8592 46 27.5539ZM12.0581 27.5539C12.0581 36.1402 19.1955 43.1007 28 43.1007C36.8045 43.1007 43.9419 36.1402 43.9419 27.5539C43.9419 18.9676 36.8045 12.0071 28 12.0071C19.1955 12.0071 12.0581 18.9676 12.0581 27.5539Z" fill="#30797F" stroke="#30797F" stroke-width="2" mask="url(#path-4-inside-1_9011_8527)" />
          </g>
          <defs>
            <filter id="filter0_d_9011_8527" x="0" y="0" width="56" height="55.1078" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
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
      
        </>
      )}

     
    </div>
  );
};

export default KProfile;