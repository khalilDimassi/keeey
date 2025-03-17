import React from 'react';
import { MessageSquare, Bookmark, BookmarkCheck } from 'lucide-react';

interface Opportunity {
  id: number;
  title: string;
  match: number;
  time: string;
  correspondance: string;
  description: string;
  saved: boolean;
}

const Opportunite: React.FC = () => {
  // Sample data that mimics the screenshot
  const opportunities: Opportunity[] = [
    {
      id: 1,
      title: 'Web Designer',
      match: 90,
      time: 'il y a 2h',
      correspondance: 'correspondant à ton profil',
      description: 'I need a redesign done on some pages to just bring them up to be modern. Simple edits on figma - Just looking for someone to knock them out tonight. I need a redesign done on some pages to just bring them up to be modern. Simple edits on figma - Just looking for someone to knock them out tonight.',
      saved: false
    },
    {
      id: 2,
      title: 'Web Designer',
      match: 90,
      time: 'il y a 2h',
      correspondance: 'correspondant à ton profil',
      description: 'I need a redesign done on some pages to just bring them up to be modern. Simple edits on figma - Just looking for someone to knock them out tonight. I need a redesign done on some pages to just bring them up to be modern. Simple edits on figma - Just looking for someone to knock them out tonight.',
      saved: false
    },
    {
      id: 3,
      title: 'Web Designer',
      match: 90,
      time: 'il y a 2h',
      correspondance: 'correspondant à ton profil',
      description: 'I need a redesign done on some pages to just bring them up to be modern. Simple edits on figma - Just looking for someone to knock them out tonight. I need a redesign done on some pages to just bring them up to be modern. Simple edits on figma - Just looking for someone to knock them out tonight.',
      saved: true
    }
  ];

  const [savedOpportunities, setSavedOpportunities] = React.useState<Record<number, boolean>>(
    opportunities.reduce((acc, opp) => ({ ...acc, [opp.id]: opp.saved }), {})
  );

  const toggleSave = (id: number) => {
    setSavedOpportunities(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className=" mx-auto  py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-gray-800">
          Opportunités <span className="text-gray-500 text-lg font-normal">(10 Opportunités)</span>
        </h1>
        <div className="relative">
          <select 
            className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-200"
            defaultValue="Matching"
          >
            <option value="Matching">Matching</option>
            <option value="Recent">Recent</option>
            <option value="Oldest">Oldest</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {opportunities.map((opportunity) => (
          <div key={opportunity.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start">
              <div className="mr-4 flex-shrink-0">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-500">O</span>
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">{opportunity.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded">
                        {opportunity.match}%
                      </span>
                      <span className="text-gray-500 text-sm">{opportunity.correspondance}</span>
                      <span className="text-gray-400 text-xs">{opportunity.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M3.64706 10.7059L1 12.9118L6.2946 16.8049C6.32725 14.2267 8.00184 13.7941 11.1471 13.7941C14.3235 13.7941 15.1176 16.7353 15.1176 18.2059L8.05882 18.1021L10.2647 19.724L16 23.9412L21.7353 19.724L27.9118 15.1825V10.5177V5.85294H22.6176H9.38235H3.64706V10.7059ZM10.7059 8.5C13.7941 8.5 13.7941 12.4706 10.7059 12.4706C7.61765 12.4706 7.61765 8.5 10.7059 8.5Z" fill="white"/>
<path d="M31 12.9118V30.5588M31 12.9118L27.9118 15.1825M31 12.9118L27.9118 10.5177M1 12.9118L3.64706 10.7059M1 12.9118V30.5588M1 12.9118L6.2946 16.8049M3.64706 10.7059V5.85294H9.38235M3.64706 10.7059V14.6765M1 30.5588H31M1 30.5588L10.2647 19.724M31 30.5588L21.7353 19.724M21.7353 19.724L16 23.9412L10.2647 19.724M21.7353 19.724L27.9118 15.1825M10.2647 19.724L8.05882 18.1021M9.38235 5.85294L16 1L22.6176 5.85294M9.38235 5.85294H22.6176M22.6176 5.85294H27.9118V10.5177M27.9118 15.1825V10.5177M24.3824 9.38235H21.5147M21.5147 9.38235H18.6471H17.7647H21.5147ZM17.7647 12.4706H21.0735H24.3824M17.7647 15.1825H24.3824M21.7353 17.7647H17.7647M8.05882 18.1021L15.1176 18.2059C15.1176 16.7353 14.3235 13.7941 11.1471 13.7941C8.00184 13.7941 6.32725 14.2267 6.2946 16.8049M8.05882 18.1021L6.2946 16.8049M6.29412 16.8824C6.29412 16.8563 6.29428 16.8305 6.2946 16.8049M10.7059 8.5C13.7941 8.5 13.7941 12.4706 10.7059 12.4706C7.61765 12.4706 7.61765 8.5 10.7059 8.5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                    </button>
                    <button 
                      className="text-gray-400 hover:text-amber-500"
                      onClick={() => toggleSave(opportunity.id)}
                    >
                      {savedOpportunities[opportunity.id] ? (
                        <BookmarkCheck className="w-8 h-8 text-amber-500" />
                      ) : (
                        <Bookmark className="w-8 h-8" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                  {opportunity.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Opportunite;