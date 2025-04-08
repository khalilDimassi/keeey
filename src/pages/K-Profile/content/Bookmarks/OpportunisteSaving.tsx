import { useState } from 'react';
import { Clock } from 'lucide-react';

// Ensure type safety with TypeScript-like interface
interface Job {
  id: number;
  title: string;
  timeAgo: string;
  location: string;
  description: string;
  tags: string[];
  type: string;
}

// Default job data with a fallback
const defaultJobs: Job[] = [
  {
    id: 1,
    title: 'Web Designer',
    timeAgo: 'il y a 2h',
    location: 'San Francisco',
    description: 'No description available',
    tags: ['Web Design', 'Figma', 'UX'],
    type: 'correspondant à ton profil'
  }, {
    id: 2,
    title: 'Web Designer',
    timeAgo: 'il y a 2h',
    location: 'San Francisco',
    description: 'I need a redesign done on some pages to just bring them up to be modern. Simple edits on Figma - Just looking for someone to knock them out tonight! I need a redesign done on some pages to just bring them up to be modern. Simple edits on Figma - Just looking for someone to knock them out tonight.',
    tags: ['Web Design', 'Figma', 'UX'],
    type: 'correspondant à ton profil'
  },
  {
    id: 3,
    title: 'Web Designer',
    timeAgo: 'il y a 2h',
    location: 'San Francisco',
    description: 'I need a redesign done on some pages to just bring them up to be modern. Simple edits on Figma - Just looking for someone to knock them out tonight! I need a redesign done on some pages to just bring them up to be modern. Simple edits on Figma - Just looking for someone to knock them out tonight.',
    tags: ['Web Design', 'Figma', 'UX'],
    type: 'correspondant à ton profil'
  },
  {
    id: 4,
    title: 'Web Designer',
    timeAgo: 'il y a 2h',
    location: 'San Francisco',
    description: 'I need a redesign done on some pages to just bring them up to be modern. Simple edits on Figma - Just looking for someone to knock them out tonight! I need a redesign done on some pages to just bring them up to be modern. Simple edits on Figma - Just looking for someone to knock them out tonight.',
    tags: ['Web Design', 'Figma', 'UX'],
    type: 'correspondant à ton profil'
  },
];

function OpportunisteSaving() {
  const [jobs] = useState<Job[]>(defaultJobs);
  const [selectedJob, setSelectedJob] = useState<Job>(jobs[0]);

  // Fallback rendering if no jobs
  if (jobs.length === 0) {
    return <div>No job opportunities available</div>;
  }
  return (
    <div className="flex p-10 gap-10 w-full min-h-screen">
      <div className="w-1/2">
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              style={
                selectedJob.id === job.id
                  ? { boxShadow: "0 1px 6px 4px rgba(64, 116, 96, 0.3)" }
                  : {}
              }
              className={`bg-white rounded-xl p-6 shadow-sm  border-gray-100 cursor-pointer 
                ${selectedJob.id === job.id ? 'border-green-600' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    {/* Image Avatar */}
                    <div className="flex justify-center">
                      <img
                        src="https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500-300x300.jpg"
                        alt="Avatar"
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                      />
                    </div>

                    {/* Pourcentage et type de job */}
                    <span className="flex flex-col gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {/* Titre + Temps écoulé */}
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-medium text-gray-900">{job.title}</h2>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={12} />
                          {job.timeAgo}
                        </span>
                      </div>

                      {/* Score + Type de job sur la même ligne */}
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-0.5 rounded-md bg-gradient-to-b from-[#30797F] to-[#039DAA] text-white">
                          98%
                        </div>
                        {job.type}
                      </div>
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                  <div className="flex gap-2">
                    {job.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/2 p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <img
              src="https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500-300x300.jpg"
              alt="Company Logo"
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{selectedJob.title}</h1>
              <p className="text-gray-500">nom de l'entreprise</p>
            </div>
          </div>
          <button className="bg-gradient-to-b from-[#30797F] to-[#039DAA] text-white px-6 py-2 rounded-full hover:bg-teal-700 transition-colors">
            Postuler
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Job description</h2>
          <p className="text-gray-600">{selectedJob.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Skills</h2>
          <div className="flex gap-2">
            {selectedJob.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpportunisteSaving;