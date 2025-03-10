import { useState } from "react";
import { Bookmark, Mail } from 'lucide-react';

interface JobPost {
  Avatar?: string;
  id: string;
  title: string;
  timePosted: string;
  salary: string;
  description: string;
}

const allJobPosts: JobPost[] = [
  {
    id: "1",
    Avatar: "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg",
    title: "Web Designer",
    timePosted: "il y a 3h",
    salary: "98%",
    description:
      "I need a redesign done on some pages to just bring them up to be modern. Simple edits on Figma - Just looking for someone to knock them out tonight.",
  },
  {
    id: "2",
    Avatar: "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg",
    title: "UI/UX Designer",
    timePosted: "il y a 3h",
    salary: "88%",
    description:
      "Looking for a UI/UX expert to refine our mobile app design. Experience with modern trends and Figma required.",
  },
  {
    id: "3",
    Avatar: "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg",
    title: "Frontend Developer",
    timePosted: "il y a 1h",
    salary: "92%",
    description:
      "Need a React developer to implement a new design system and optimize components for performance.",
  },
];

const savedJobPosts: JobPost[] = [
  {
    id: "1",
    Avatar: "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg",
    title: "Backend Developer",
    timePosted: "il y a 1h",
    salary: "85%",
    description: "Looking for a backend developer to help optimize our server-side code.",
  },
  {
    id: "2",
    Avatar: "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg",
    title: "Full Stack Developer",
    timePosted: "il y a 5h",
    salary: "90%",
    description: "Looking for a full stack developer to handle both frontend and backend tasks.",
  },
];

const contactBasedJobPosts: JobPost[] = [
  {
    id: "1",
    Avatar: "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg",
    title: "Product Manager",
    timePosted: "il y a 4h",
    salary: "95%",
    description: "Seeking a Product Manager for an innovative mobile application.",
  },
  {
    id: "2",
    Avatar: "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg",
    title: "Data Analyst",
    timePosted: "il y a 2h",
    salary: "93%",
    description: "Looking for a data analyst to work on large datasets and generate insights.",
  },
];

const JobOpportunities = () => {
  const [activeTab, setActiveTab] = useState("Opportunités");
  const [currentJobPosts, setCurrentJobPosts] = useState<JobPost[]>(allJobPosts);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    if (tab === "Opportunités") {
      setCurrentJobPosts(allJobPosts);
    } else if (tab === "Opportunités sauvegardées") {
      setCurrentJobPosts(savedJobPosts);
    } else if (tab === "Opportunités selon mes contacts") {
      setCurrentJobPosts(contactBasedJobPosts);
    }
  };

  const handleJobClick = (job: JobPost) => {
    setSelectedJob(job); // Ouvrir la modale avec les détails du job sélectionné
  };

  const closeModal = () => {
    setSelectedJob(null); // Fermer la modale
  };

  return (
    <div className=" mt-10 ">
      <div className="relative  shadow-sm rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between ">
          {/* Tabs with spacing */}
         






          <div className="flex gap-2 relative">
            <button
              style={{
                boxShadow: activeTab === "Opportunités"
                  ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(103, 109, 103, 0.14)"
                  : "none"
              }}
              className={`px-8 py-3 flex gap-2 font-medium transition-all relative ${activeTab === "Opportunités"
                  ? "text-gray-900 bg-white rounded-t-xl z-10"
                  : "text-gray-400 bg-gray-100/50"
              }`}
              onClick={() => handleTabChange("Opportunités")}
            >
                       Opportunités
            </button>
            <button
              style={{
                boxShadow: activeTab === "Opportunités sauvegardées"
                  ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(40, 44, 40, 0.14)"
                  : "none"
              }}
              className={`px-8 flex gap-2 py-3 font-medium transition-all relative ${activeTab === "Opportunités sauvegardées"
                  ? "text-gray-900 bg-white rounded-t-xl z-10"
                  : "text-gray-400 bg-gray-100/50"
              }`}
              onClick={() => handleTabChange("Opportunités sauvegardées")}
            >
             Opportunités sauvegardées
            </button>
            <button
              style={{
                boxShadow: activeTab === "Opportunités selon mes contacts"
                  ? "0 -4px 4px -2px rgba(97, 102, 97, 0.11), 4px 0 4px -2px rgba(97, 102, 97, 0), -4px 0 4px -2px rgba(103, 109, 103, 0.14)"
                  : "none"
              }}
              className={`px-8 py-3 flex gap-2 font-medium transition-all relative ${activeTab === "Opportunités selon mes contacts"
                  ? "text-gray-900 bg-white rounded-t-xl z-10"
                  : "text-gray-400 bg-gray-100/50"
              }`}
              onClick={() => handleTabChange("Opportunités selon mes contacts")}
            >
             Opportunités selon mes contacts
            </button>
            
          
          </div>























          {/* Category Selector aligned to the right */}
          <select className="ml-auto px-4 py-2 font-medium text-gray-500 border border-gray-200 rounded-md focus:ring-teal-500 focus:border-teal-500">
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="manager">Manager</option>
            <option value="qa">QA Engineer</option>
          </select>
        </div>

        {/* Job List */}
        <div className="space-y-6  bg-white p-6" style={{ borderRadius:"0px 0px 20px 20px", boxShadow: "1px 10px 10px  rgba(96, 105, 110, 0.29)" }}>
          {currentJobPosts.map((post) => (
            <div key={post.id} className="bg-white p-4 hover:shadow-lg transition-shadow flex flex-col sm:flex-row gap-4 border-b border-gray-200 relative" onClick={() => handleJobClick(post)}>
              {/* Avatar */}
              <img
                src={post.Avatar} // Replace with actual image URL
                alt="avatar"
                className="w-16 h-16 rounded-full flex-shrink-0 object-cover mx-auto"
              />

              {/* Job details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col">
                  {/* Title & Time */}
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {post.title} <span className="text-sm text-gray-500">{post.timePosted}</span>
                  </h3>

                  {/* Salary */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="px-3 py-1 rounded-md bg-teal-600 text-white text-sm">
                      {post.salary}
                    </div>
                    <span className="text-sm text-gray-700">Correspondent à votre profil</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm leading-relaxed mt-3">
                  {post.description}
                </p>
              </div>

              {/* Icons */}
              <div className="absolute top-2 right-3 flex gap-4">
                <button className="text-gray-400 hover:text-gray-600">
                  
<svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.64706 10.7059L1 12.9118L6.2946 16.8049C6.32725 14.2267 8.00184 13.7941 11.1471 13.7941C14.3235 13.7941 15.1176 16.7353 15.1176 18.2059L8.05882 18.1021L10.2647 19.724L16 23.9412L21.7353 19.724L27.9118 15.1825V10.5177V5.85294H22.6176H9.38235H3.64706V10.7059ZM10.7059 8.5C13.7941 8.5 13.7941 12.4706 10.7059 12.4706C7.61765 12.4706 7.61765 8.5 10.7059 8.5Z" fill="white"/>
<path d="M31 12.9118V30.5588M31 12.9118L27.9118 15.1825M31 12.9118L27.9118 10.5177M1 12.9118L3.64706 10.7059M1 12.9118V30.5588M1 12.9118L6.2946 16.8049M3.64706 10.7059V5.85294H9.38235M3.64706 10.7059V14.6765M1 30.5588H31M1 30.5588L10.2647 19.724M31 30.5588L21.7353 19.724M21.7353 19.724L16 23.9412L10.2647 19.724M21.7353 19.724L27.9118 15.1825M10.2647 19.724L8.05882 18.1021M9.38235 5.85294L16 1L22.6176 5.85294M9.38235 5.85294H22.6176M22.6176 5.85294H27.9118V10.5177M27.9118 15.1825V10.5177M24.3824 9.38235H21.5147M21.5147 9.38235H18.6471H17.7647H21.5147ZM17.7647 12.4706H21.0735H24.3824M17.7647 15.1825H24.3824M21.7353 17.7647H17.7647M8.05882 18.1021L15.1176 18.2059C15.1176 16.7353 14.3235 13.7941 11.1471 13.7941C8.00184 13.7941 6.32725 14.2267 6.2946 16.8049M8.05882 18.1021L6.2946 16.8049M6.29412 16.8824C6.29412 16.8563 6.29428 16.8305 6.2946 16.8049M10.7059 8.5C13.7941 8.5 13.7941 12.4706 10.7059 12.4706C7.61765 12.4706 7.61765 8.5 10.7059 8.5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                </button>
                <button className="text-gray-500 hover:text-yellow-400">
                  <Bookmark size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Job Details */}

        {/* Modal for Job Details */}
     {selectedJob && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
    <div className="bg-white rounded-2xl w-4/5 max-w-6xl min-h-[80vh] shadow-xl relative flex overflow-hidden">
      
      {/* Left Section */}
      <div className="flex flex-col w-2/3 p-8">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h3>
          <p className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{selectedJob.timePosted}</p>
        </div>

        {/* Salary and Tags */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="px-4 py-2 rounded-lg bg-teal-600 text-white font-medium">
            {selectedJob.salary}
          </div>
          <div className="px-4 py-2 rounded-lg bg-green-100 text-green-800 font-medium text-sm">
            Corresponding to your profile
          </div>
        </div>

        {/* Job Description */}
        <div className="mt-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
          <div className="text-gray-700 leading-relaxed overflow-y-auto max-h-[50vh] pr-4">
            <p>{selectedJob.description}</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col w-1/3 bg-gray-50 p-8 border-l border-gray-200">
        <div className="flex flex-col items-start">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Apply for this position</h4>
          
          {/* Avatar */}
          <div className="flex justify-center w-full mb-8">
            <img 
              src={selectedJob.Avatar} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow-md" 
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col w-full gap-4">
            <button className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 text-base font-medium rounded-xl transition duration-200 w-full flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Postuler
            </button>
            
            <button className="border border-gray-300 hover:border-gray-400 bg-white text-gray-700 py-3 px-6 text-base font-medium rounded-xl transition duration-200 w-full flex items-center justify-center gap-2">
              <Bookmark size={18} />
              Save Job
            </button>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-white rounded-full p-2 shadow-md transition-all duration-200 hover:shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default JobOpportunities;