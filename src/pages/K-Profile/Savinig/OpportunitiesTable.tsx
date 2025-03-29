import React from 'react';
import JobOpportunities from '../Competence/mode online/JobOpportunities';

interface Opportunity {
  percentage: number;
  company: string;
  title: string;
  startDate: string;
  duration: string;
  location: string;
  tjm: number;
  skills: string[];
  seniority: string;
  comment: string;
  status: string;
}

const opportunitiesData: Opportunity[] = [
  {
    percentage: 80,
    company: "Digiweb",
    title: "CEO",
    startDate: "11/11/2024",
    duration: "6 mois",
    location: "Paris",
    tjm: 500,
    skills: ["Management", "Digital Strategy"],
    seniority: "Senior",
    comment: "Commentaire",
    status: "Statut"
  },
  // Repeat the object to match the screenshot
  {
    percentage: 80,
    company: "Digiweb",
    title: "CEO",
    startDate: "11/11/2024",
    duration: "6 mois",
    location: "Paris",
    tjm: 500,
    skills: ["Management", "Digital Strategy"],
    seniority: "Senior",
    comment: "Commentaire",
    status: "Statut"
  }
  ,
  // Repeat the object to match the screenshot
  {
    percentage: 80,
    company: "Digiweb",
    title: "CEO",
    startDate: "11/11/2024",
    duration: "6 mois",
    location: "Paris",
    tjm: 500,
    skills: ["Management", "Digital Strategy"],
    seniority: "Senior",
    comment: "Commentaire",
    status: "Statut"
  }
  ,
  // Repeat the object to match the screenshot
  {
    percentage: 80,
    company: "Digiweb",
    title: "CEO",
    startDate: "11/11/2024",
    duration: "6 mois",
    location: "Paris",
    tjm: 500,
    skills: ["Management"],
    seniority: "Senior",
    comment: "Commentaire",
    status: "Statut"
  }
  ,
  // Repeat the object to match the screenshot
  {
    percentage: 80,
    company: "Digiweb",
    title: "CEO",
    startDate: "11/11/2024",
    duration: "6 mois",
    location: "Paris",
    tjm: 500,
    skills: ["Management", "Digital Strategy"],
    seniority: "Senior",
    comment: "Commentaire",
    status: "Statut"
  }
  ,
  // Repeat the object to match the screenshot
  {
    percentage: 80,
    company: "Digiweb",
    title: "CEO",
    startDate: "11/11/2024",
    duration: "6 mois",
    location: "Paris",
    tjm: 500,
    skills: ["Management", "Digital Strategy"],
    seniority: "Senior",
    comment: "Commentaire",
    status: "Statut"
  }
];

const OpportunitiesTable = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="relative w-full">
      <div className="w-full overflow-x-auto rounded-lg px-4">
        <div className="flex items-center space-x-3 py-4">
          <svg width="45" height="46" viewBox="0 0 45 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="45" height="46" fill="white" />
            <path d="M30 3.83301H15C11.8125 3.83301 9.375 6.32467 9.375 9.58301V40.2497C9.375 40.633 9.375 40.8247 9.5625 41.208C10.125 42.1663 11.25 42.358 12.1875 41.9747L22.5 35.8413L32.8125 41.9747C33.1875 42.1663 33.375 42.1663 33.75 42.1663C34.875 42.1663 35.625 41.3997 35.625 40.2497V9.58301C35.625 6.32467 33.1875 3.83301 30 3.83301Z" fill="#30797F" />
          </svg>

            <h1 className="text-xl font-semibold">Opportunités sauvegardées</h1>

          </div>
          <table className="w-full ">
            <thead className=" border-b-4">
              <tr>
                {[
                  "% Matching", "Société", "Titre", "Démarrage", "Durée",
                  "Localisation", "TJM", "Compétences", "Séniorité",
                  "Commentaire", "Statut", ""
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className=" divide-y divide-gray-200">
              {opportunitiesData.map((opp, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {opp.percentage}%
                    </span>
                  </td>
                  <td className="px-4 py-2">{opp.company}</td>
                  <td className="px-4 py-2">{opp.title}</td>
                  <td className="px-4 py-2">{opp.startDate}</td>
                  <td className="px-4 py-2">{opp.duration}</td>
                  <td className="px-4 py-2">{opp.location}</td>
                  <td className="px-4 py-2">
                    <div className="w-6 h-6 rounded-full border bg-orange-200 shadow-sm mx-auto"></div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="w-6 h-6 rounded-full border bg-green-200 shadow-3xl mx-auto"></div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="w-6 h-6 rounded-full border bg-green-100 shadow-3xl mx-auto"></div>
                  </td>


                  <td className="px-4 py-2">{opp.comment}</td>
                  <td className="px-4 py-2">
                    <select className="block w-full py-2 px-4 border border-gray-800 bg-white rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option>{opp.status}</option>
                      <option>Statut 1</option>
                      <option>Statut 2</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2 gap-4">

                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="14" cy="14" r="14" fill="#30797F" />
                        <path d="M10.3926 16.6667L16.6671 10.3922M16.6671 10.3922H10.3926M16.6671 10.3922V16.6667" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>


                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.64706 10.7059L1 12.9118L6.2946 16.8049C6.32725 14.2267 8.00184 13.7941 11.1471 13.7941C14.3235 13.7941 15.1176 16.7353 15.1176 18.2059L8.05882 18.1021L10.2647 19.724L16 23.9412L21.7353 19.724L27.9118 15.1825V10.5177V5.85294H22.6176H9.38235H3.64706V10.7059ZM10.7059 8.5C13.7941 8.5 13.7941 12.4706 10.7059 12.4706C7.61765 12.4706 7.61765 8.5 10.7059 8.5Z" fill="white" />
                        <path d="M31 12.9118V30.5588M31 12.9118L27.9118 15.1825M31 12.9118L27.9118 10.5177M1 12.9118L3.64706 10.7059M1 12.9118V30.5588M1 12.9118L6.2946 16.8049M3.64706 10.7059V5.85294H9.38235M3.64706 10.7059V14.6765M1 30.5588H31M1 30.5588L10.2647 19.724M31 30.5588L21.7353 19.724M21.7353 19.724L16 23.9412L10.2647 19.724M21.7353 19.724L27.9118 15.1825M10.2647 19.724L8.05882 18.1021M9.38235 5.85294L16 1L22.6176 5.85294M9.38235 5.85294H22.6176M22.6176 5.85294H27.9118V10.5177M27.9118 15.1825V10.5177M24.3824 9.38235H21.5147M21.5147 9.38235H18.6471H17.7647H21.5147ZM17.7647 12.4706H21.0735H24.3824M17.7647 15.1825H24.3824M21.7353 17.7647H17.7647M8.05882 18.1021L15.1176 18.2059C15.1176 16.7353 14.3235 13.7941 11.1471 13.7941C8.00184 13.7941 6.32725 14.2267 6.2946 16.8049M8.05882 18.1021L6.2946 16.8049M6.29412 16.8824C6.29412 16.8563 6.29428 16.8305 6.2946 16.8049M10.7059 8.5C13.7941 8.5 13.7941 12.4706 10.7059 12.4706C7.61765 12.4706 7.61765 8.5 10.7059 8.5Z" stroke="#30797F" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>


                      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.75 26.25C8.0625 26.25 7.47396 26.0052 6.98438 25.5156C6.49479 25.026 6.25 24.4375 6.25 23.75V7.5H5V5H11.25V3.75H18.75V5H25V7.5H23.75V23.75C23.75 24.4375 23.5052 25.026 23.0156 25.5156C22.526 26.0052 21.9375 26.25 21.25 26.25H8.75ZM21.25 7.5H8.75V23.75H21.25V7.5ZM11.25 21.25H13.75V10H11.25V21.25ZM16.25 21.25H18.75V10H16.25V21.25Z" fill="#30797F" />
                      </svg>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
        <div className="flex justify-center mt-4">
        <button
          className="bg-white rounded-full p-1 shadow-sm border border-gray-200"
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
      <JobOpportunities />;
    </div>
  );
};

export default OpportunitiesTable;