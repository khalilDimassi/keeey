import React, { useState } from "react";
import { Bookmark, Mail } from "lucide-react";

interface JobPost {
  id: string;
  title: string;
  timePosted: string;
  salary: string;
  description: string;
  Avatar?: string; // Added an optional Avatar field
}

const allJobPosts: JobPost[] = [
  {
    id: "1",
    title: "Web Designer",
    timePosted: "il y a 2h",
    salary: "98%",
    description:
      "I need a redesign done on some pages to just bring them up to be modern. Simple edits on Figma - Just looking for someone to knock them out tonight.",
    Avatar: "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg", // Example Avatar
  },
  {
    id: "2",
    title: "UI/UX Designer",
    timePosted: "il y a 3h",
    salary: "88%",
    description:
      "Looking for a UI/UX expert to refine our mobile app design. Experience with modern trends and Figma required.",
    Avatar: "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg", // Example Avatar
  },
  {
    id: "3",
    title: "Frontend Developer",
    timePosted: "il y a 1h",
    salary: "92%",
    description:
      "Need a React developer to implement a new design system and optimize components for performance.",
    Avatar: "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg", // Example Avatar
  },
];

const savedJobPosts: JobPost[] = [
  {
    id: "1",
    title: "Backend Developer",
    timePosted: "il y a 1h",
    salary: "85%",
    description: "Looking for a backend developer to help optimize our server-side code.",
    Avatar: "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg", // Example Avatar
  },
  {
    id: "2",
    title: "Full Stack Developer",
    timePosted: "il y a 5h",
    salary: "90%",
    description: "Looking for a full stack developer to handle both frontend and backend tasks.",
    Avatar: "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg", // Example Avatar
  },
];

const contactBasedJobPosts: JobPost[] = [
  {
    id: "1",
    title: "Product Manager",
    timePosted: "il y a 4h",
    salary: "95%",
    description: "Seeking a Product Manager for an innovative mobile application.",
    Avatar: "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg", // Example Avatar
  },
  {
    id: "2",
    title: "Data Analyst",
    timePosted: "il y a 2h",
    salary: "93%",
    description: "Looking for a data analyst to work on large datasets and generate insights.",
    Avatar: "https://images.pexels.com/photos/1181356/pexels-photo-1181356.jpeg", // Example Avatar
  },
];

const JobOpportunities2 = () => {
  const [category, setCategory] = useState("developer");
  const [selection, setSelection] = useState("Opportunités");
  const [currentJobPosts, setCurrentJobPosts] = useState<JobPost[]>(allJobPosts);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);

  // Handle category selection
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value);
  };

  // Handle selection change (Opportunités, Saved, or Contact-based)
  const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelection(selectedValue);

    // Dynamically change job posts based on the selected value
    if (selectedValue === "Opportunités") {
      setCurrentJobPosts(allJobPosts);
    } else if (selectedValue === "Opportunités sauvegardées") {
      setCurrentJobPosts(savedJobPosts);
    } else if (selectedValue === "Opportunités selon mes contacts") {
      setCurrentJobPosts(contactBasedJobPosts);
    }
  };

  // Dynamically set the page title based on the selection
  const pageTitle =
    selection === "Opportunités"
      ? "Opportunités"
      : selection === "Opportunités sauvegardées"
      ? "Saved Opportunities"
      : "Opportunités selon mes contacts";

  const handleJobClick = (job: JobPost) => {
    setSelectedJob(job); // Open modal with job details
  };

  const closeModal = () => {
    setSelectedJob(null); // Close modal
  };

  return (
    <div className="w-full p-6">
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-800">
            {pageTitle}{" "}
            <span className="text-gray-400 text-sm font-normal">
              ({currentJobPosts.length} offres)
            </span>
          </h1>

          {/* Right side selection bars */}
          <div className="flex gap-4">
            {/* Category Selection */}
            <select
              value={category}
              onChange={handleCategoryChange}
              className="px-4 py-2 font-medium text-gray-500 border border-gray-200 rounded-md focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="manager">Manager</option>
              <option value="qa">QA Engineer</option>
            </select>

            {/* Selection Type (Opportunités, Saved, or Contact-based) */}
            <select
              value={selection}
              onChange={handleSelectionChange}
              className="px-4 py-2 font-medium text-gray-500 border border-gray-200 rounded-md focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="Opportunités">Opportunités</option>
              <option value="Opportunités sauvegardées">Opportunités sauvegardées</option>
              <option value="Opportunités selon mes contacts">Opportunités selon mes contacts</option>
            </select>
          </div>
        </div>

        <div className="w-full "style={{boxShadow: "0 0 4px 1px rgba(0, 128, 0, 0.2)" ,borderRadius:"10px"}}  >
          <div className="relative bg-white shadow-sm rounded-lg">
            {/* Job List */}
            <div className="space-y-6 p-6">
              {currentJobPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-4 hover:shadow-lg transition-shadow flex flex-col sm:flex-row gap-4 border-b border-gray-200 relative"
                  onClick={() => handleJobClick(post)} // Open modal when clicked
                >
                  {/* Avatar (replaced with image) */}
                  <img
                    src={post.Avatar}
                    alt="avatar"
                    className="w-16 h-16 rounded-full flex-shrink-0 object-cover mx-auto"
                  />

                  {/* Job details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                      {/* Title & Time */}
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {post.title}{" "}
                        <span className="text-sm text-gray-500">{post.timePosted}</span>
                      </h3>

                      {/* Salary and Match */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="px-3 py-1 rounded-md bg-teal-600 text-white text-sm">
                          {post.salary}
                        </div>
                        <span className="text-sm text-gray-700">Corresponding to your profile</span>
                      </div>
                    </div>

                    {/* Description with more space */}
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

              {/* Modal for Job Details */}
              {selectedJob && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white p-6 rounded-lg w-3/4 min-h-[80vh] shadow-lg relative flex">
                    {/* Left Section */}
                    <div className="flex flex-col w-2/3">
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-semibold text-gray-900">{selectedJob.title}</h3>
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
                      <p className="mt-4 text-lg text-gray-700">{selectedJob.description}</p>
                    </div>

                    {/* Vertical Divider */}
                    <div className="border-l-2 border-gray-300 mx-4"></div>

                    {/* Right Section */}
                    <div className="flex flex-col items-center w-1/3">
                      {/* Apply Button and Bookmark Icon (side by side) */}
                      <div className="flex items-center gap-2 mb-4">
                        <button className="bg-teal-600 text-white py-4 px-6 text-lg rounded-md">
                          Postuler
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Bookmark size={22} />
                        </button>
                      </div>

                      {/* Avatar */}
                      <img
                        src={selectedJob.Avatar}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full mb-4"
                      />
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
        </div>
      </div>
    </div>
  );
};

export default JobOpportunities2;