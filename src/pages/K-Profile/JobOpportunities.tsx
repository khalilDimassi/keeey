import React, { useState } from "react";
import { Bookmark, Mail } from 'lucide-react';

interface JobPost {
    Avatar?:string;
  id: string;
  title: string;
  timePosted: string;
  salary: string;
  description: string;
}

const allJobPosts: JobPost[] = [
  {
    id: "1",
    Avatar : "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg",
    title: "Web Designer",
    timePosted: "il y a 2h",
    salary: "98%",
    description:
      "I need a redesign done on some pages to just bring them up to be modern. Simple edits on Figma - Just looking for someone to knock them out tonight.",
  },
  {
    id: "2",
     Avatar : "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg",
    title: "UI/UX Designer",
    timePosted: "il y a 3h",
    salary: "88%",
    description:
      "Looking for a UI/UX expert to refine our mobile app design. Experience with modern trends and Figma required.",
  },
  {
    id: "3",
     Avatar : "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg",
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
    Avatar : "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg",
    title: "Backend Developer",
    timePosted: "il y a 1h",
    salary: "85%",
    description: "Looking for a backend developer to help optimize our server-side code.",
  },
  {
    id: "2",
     Avatar : "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg",
    title: "Full Stack Developer",
    timePosted: "il y a 5h",
    salary: "90%",
    description: "Looking for a full stack developer to handle both frontend and backend tasks.",
  },
];

const contactBasedJobPosts: JobPost[] = [
  {
    id: "1",
     Avatar : "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg",
    title: "Product Manager",
    timePosted: "il y a 4h",
    salary: "95%",
    description: "Seeking a Product Manager for an innovative mobile application.",
  },
  {
    id: "2",
     Avatar : "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg",
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
    <div className="w-full border border-gray-100">
      <div className="relative bg-white shadow-sm rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 px-4">
          {/* Tabs with spacing */}
          <div className="flex gap-2 mt-2">
            <button
              className={`px-4 py-2 font-medium transition-all flex items-center gap-2 rounded-md ${
                activeTab === "Opportunités"
                  ? "text-teal-600 bg-white shadow-md border border-gray-100"
                  : "text-gray-500 hover:text-teal-600 hover:bg-gray-50"
              }`}
              onClick={() => handleTabChange("Opportunités")}
            >
              Opportunités
            </button>
            <button
              className={`px-4 py-2 font-medium transition-all flex items-center gap-2 rounded-md ${
                activeTab === "Opportunités sauvegardées"
                  ? "text-teal-600 bg-white shadow-md border border-gray-100"
                  : "text-gray-500 hover:text-teal-600 hover:bg-gray-50"
              }`}
              onClick={() => handleTabChange("Opportunités sauvegardées")}
            >
              Opportunités sauvegardées
            </button>
            <button
              className={`px-4 py-2 font-medium transition-all flex items-center gap-2 rounded-md ${
                activeTab === "Opportunités selon mes contacts"
                  ? "text-teal-600 bg-white shadow-md border border-gray-100"
                  : "text-gray-500 hover:text-teal-600 hover:bg-gray-50"
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
        <div className="space-y-6 p-6">
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
                  <Mail size={20} />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <Bookmark size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

       {/* Modal for Job Details */}

{/* Modal for Job Details */}
{selectedJob && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg w-3/4 min-h-[80vh] shadow-lg relative flex"> {/* Increased width and height */}
      
      {/* Left Section */}
      <div className="flex flex-col w-2/3">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-semibold text-gray-900">{selectedJob.title}</h3> {/* Increased title size */}
          <p className="text-sm text-gray-500">{selectedJob.timePosted}</p>
        </div>

        {/* Salary and Tags */}
        <div className="mt-2 flex items-center gap-2">
          <div className="px-3 py-1 rounded-md bg-teal-600 text-white text-sm">
            {selectedJob.salary}
          </div>
          <span className="text-sm text-gray-700">Corresponding to your profile</span>
        </div>

        {/* Job Description */}
        <p className="mt-4 text-lg text-gray-700">{selectedJob.description}</p> {/* Increased description text size */}
      </div>

      {/* Vertical Divider */}
      <div className="border-l-2 border-gray-300 mx-4"></div>

      {/* Right Section */}
      <div className="flex flex-col items-center w-1/3">
        {/* Apply Button and Bookmark Icon (side by side) */}
        <div className="flex items-center gap-2 mb-4">
          <button className="bg-teal-600 text-white py-4 px-6 text-lg rounded-md"> {/* Increased button size */}
            Postuler 
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <Bookmark size={22} /> {/* Increased bookmark icon size */}
          </button>
        </div>

        {/* Avatar */}
        <img src={selectedJob.Avatar} alt="Avatar" className="w-20 h-20 rounded-full mb-4" /> {/* Increased avatar size */}
      </div>

      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
      >
        &times;
      </button>
    </div>
  </div>
)}





      </div>
    </div>
  );
};

export default JobOpportunities;