import React from 'react';
import { Bookmark, Clock, MapPin, Mail } from 'lucide-react';

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
  {
    id: 2,
    title: 'Web Designer',
    timeAgo: 'il y a 2h',
    location: 'Remote',
    description: 'I need a redesign done on some pages to just bring them up to be modern. Simple edits on Figma - Just looking for someone to knock them out tonight! I need a redesign done on some pages to just bring them up to be modern. Simple edits on Figma - Just looking for someone to knock them out tonight.',
    tags: ['Web Design', 'Figma', 'UX'],
    type: 'correspondant à ton profil'
  },
  {
    id: 3,
    title: 'Web Designer',
    timeAgo: 'il y a 2h',
    location: 'Paris',
    description: 'I need a redesign done on some pages to just bring them up to be modern. Simple edits on Figma - Just looking for someone to knock them out tonight! I need a redesign done on some pages to just bring them up to be modern. Simple edits on Figma - Just looking for someone to knock them out tonight.',
    tags: ['Web Design', 'Figma', 'UX'],
    type: 'correspondant à ton profil'
  },
  {
    id: 4,
    title: 'Web Designer',
    timeAgo: 'il y a 2h',
    location: 'London',
    description: 'I need a redesign done on some pages to just bring them up to be modern. Simple edits on Figma - Just looking for someone to knock them out tonight! I need a redesign done on some pages to just bring them up to be modern. Simple edits on Figma - Just looking for someone to knock them out tonight.',
    tags: ['Web Design', 'Figma', 'UX'],
    type: 'correspondant à ton profil'
  }
];

function Oportunite() {
  return (
    <div className="w-full p-6">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-xl font-semibold mb-4 text-gray-800">Opportunités <span className="text-gray-400 text-sm font-normal">(4 offres)</span></h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-lg font-medium text-gray-900">{job.title}</h2>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      {job.timeAgo}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    <div className="mr-2 px-2 py-0.5 rounded-md bg-teal-600 text-white">98%</div>

                      {job.type}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <MapPin size={12} className="mr-1" />
                      {job.location}
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
                <button className="text-gray-400 hover:text-gray-600">
                  < Mail size={20} />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <Bookmark size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Oportunite;