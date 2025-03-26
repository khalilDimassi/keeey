import { Bookmark, Clock, MapPin } from 'lucide-react';

// Fake job data
const jobs = [
  {
    id: 1,
    title: 'Web Designer',
    timeAgo: 'il y a 2h',
    location: 'San Francisco',
    description: 'I need a redesign done on some pages to just bring them up to be modern. Simple edits on Figma - Just looking for someone to knock them out tonight! I need a redesign done on some pages to just bring them up to be modern. Simple edits on Figma - Just looking for someone to knock them out tonight.',
    tags: ['Web Design', 'Figma', 'UX'],
    type: 'correspondant à ton profil'
  },
];

function Oportunite() {
  return (
    <div className="w-full py-6">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-xl font-semibold mb-4 text-gray-800">Opportunités <span className="text-gray-400 text-sm font-normal">(4 offres)</span></h1>
        <div className="grid grid-cols-1  gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div className="flex-1">


                  <div className="flex items-center gap-4 mb-3">
                    {/* Image Avatar */}
                    <div className="flex justify-center">
                      <img
                        src="https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500-300x300.jpg"
                        alt="Avatar"
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 d"
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


                    {/* Localisation */}

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
    </div>
  );
}

export default Oportunite;