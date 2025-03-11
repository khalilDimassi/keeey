import { useEffect, useState } from "react";
import { Bookmark } from 'lucide-react';
import axios from "axios";
import { getAuthHeader } from "../../../../utils/jwt";
import { log } from "console";

interface Opportunity {
  opportunity_id: number;
  user_id: string;
  title: string;
  description: string;
  rate: number;
  responded_at: string;
  start_at: string;
  announce_at: string;
  contract_role: string;
  opportunity_role: string;
  status: string;
  satisfaction: number;
  duration: number;
  crit_start_date: string;
  crit_start_date_lastest: string;
  crit_forecast_date: string;
  crit_forecast_date_lastest: string;
  crit_location: string;
  crit_remote: boolean;
  crit_target_rate: number;
  crit_max_rate: number;
  created_at: string;
  updated_at: string;
}

// Helper function to format date
const formatTimeAgo = (dateString: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInMonths = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 30));
  const diffInDays = Math.floor((diffInMilliseconds % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor((diffInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  let timeAgo = "il y a";

  if (diffInMonths > 0) {
    timeAgo += ` ${diffInMonths} mois`;
  }
  if (diffInDays > 0) {
    timeAgo += ` ${diffInDays} jours`;
  }
  if (diffInHours > 0) {
    timeAgo += ` ${diffInHours}h`;
  }

  return timeAgo.trim();
};


// Helper function to calculate match percentage
const calculateMatchPercentage = (opportunity: Opportunity): string => {
  // TODO: inject actual filtring logic
  return `${80}%`;
};

const submitToOpportunity = async (opportunityId: number) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunityId}/submit?state=apply`,
      {},
      {
        headers: {
          ...getAuthHeader(),
        },
      }
    );

    if (response.status === 200) {
      console.log("Successfully submitted to opportunity:", opportunityId);
      // Optionally, update the UI or show a success message
    }
  } catch (error) {
    console.error("Failed to submit to opportunity:", error);
    // Optionally, show an error message to the user
  }
};

const saveOpportunity = async (opportunityId: number) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/${opportunityId}/submit?state=save`,
      {},
      {
        headers: {
          ...getAuthHeader(),
        },
      }
    );

    if (response.status === 200) {
      console.log("Successfully saved opportunity:", opportunityId);
      // Optionally, update the UI or show a success message
    }
  } catch (error) {
    console.error("Failed to save opportunity:", error);
    // Optionally, show an error message to the user
  }
};

const JobOpportunities = () => {
  const [activeTab, setActiveTab] = useState("Opportunités");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<Opportunity[]>([]);
  const [contactOpportunities, setContactOpportunities] = useState<Opportunity[]>([]);
  const [currentOpportunities, setCurrentOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const opportunitiesResponse = await axios.get<Opportunity[]>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/opportunities`
      );
      const savedOpportunitiesIdsResponse = await axios.get<number[]>(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/private/opportunities/saved-opportunities`,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );

      var savedOpportunities: Opportunity[] = []

      if (Array.isArray(savedOpportunitiesIdsResponse.data)) {
        savedOpportunities = opportunitiesResponse.data.filter(opportunity =>
          savedOpportunitiesIdsResponse.data.includes(opportunity.opportunity_id)
        );
      }

      console.log(savedOpportunities);


      // All opportunities
      setOpportunities(opportunitiesResponse.data);
      setSavedOpportunities(savedOpportunities);

      // For demo purposes, we'll simulate saved opportunities and contact-based opportunities
      // In a real app, these would come from separate endpoints or be filtered differently 
      setContactOpportunities(opportunitiesResponse.data.slice(2, 4));

      // Set current tab data
      // setCurrentOpportunities(opportunitiesResponse.data);

    } catch (err) {
      console.error(err);
      setError('Failed to fetch opportunities. Please try again later. ' + err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    if (tab === "Opportunités") {
      setCurrentOpportunities(opportunities);
    } else if (tab === "Opportunités sauvegardées") {
      setCurrentOpportunities(savedOpportunities);
    } else if (tab === "Opportunités selon mes contacts") {
      setCurrentOpportunities(contactOpportunities);
    }
  };

  const handleOpportunityClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
  };

  const closeModal = () => {
    setSelectedOpportunity(null);
  };

  return (
    <div className="mt-10">
      <div className="relative shadow-sm rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
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
            <option value="all">Tous les contrats</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>

        {/* Opportunity List */}
        <div className="space-y-6 bg-white p-6" style={{ borderRadius: "0px 0px 20px 20px", boxShadow: "1px 10px 10px rgba(96, 105, 110, 0.29)" }}>
          {loading ? (
            <div className="text-center py-10">
              <p>Chargement des opportunités...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>{error}</p>
            </div>
          ) : currentOpportunities.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>Aucune opportunité disponible.</p>
            </div>
          ) : (
            currentOpportunities.map((opportunity) => (
              <div
                key={opportunity.opportunity_id}
                className="bg-white p-4 hover:shadow-lg transition-shadow flex flex-col sm:flex-row gap-4 border-b border-gray-200 relative cursor-pointer"
                onClick={() => handleOpportunityClick(opportunity)}
              >
                {/* Avatar - using placeholder */}
                <img
                  src="https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500-300x300.jpg"
                  alt="avatar"
                  className="w-16 h-16 rounded-full flex-shrink-0 object-cover mx-auto"
                />

                {/* Job details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col">
                    {/* Title & Time */}
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                      {opportunity.title} <span className="text-sm text-gray-500">{formatTimeAgo(opportunity.created_at)}</span>
                    </h3>

                    {/* Match Percentage and Contract Type */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="px-3 py-1 rounded-md bg-teal-600 text-white text-sm">
                        {calculateMatchPercentage(opportunity)}
                      </div>
                      <span className="text-sm text-gray-700">Correspondent à votre profil</span>
                      <div className="ml-2 px-3 py-1 rounded-md bg-blue-100 text-blue-800 text-sm">
                        {opportunity.contract_role}
                      </div>
                    </div>
                  </div>

                  {/* Description - truncated for list view */}
                  <p className="text-gray-700 text-sm leading-relaxed mt-3 line-clamp-2">
                    {opportunity.description || `${opportunity.contract_role} - ${opportunity.crit_location} ${opportunity.crit_remote ? '(Remote)' : ''}`}
                  </p>
                </div>

                {/* Icons */}
                <div className="absolute top-2 right-3 flex gap-4">
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      submitToOpportunity(opportunity.opportunity_id);
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M3.64706 10.7059L1 12.9118L6.2946 16.8049C6.32725 14.2267 8.00184 13.7941 11.1471 13.7941C14.3235 13.7941 15.1176 16.7353 15.1176 18.2059L8.05882 18.1021L10.2647 19.724L16 23.9412L21.7353 19.724L27.9118 15.1825V10.5177V5.85294H22.6176H9.38235H3.64706V10.7059ZM10.7059 8.5C13.7941 8.5 13.7941 12.4706 10.7059 12.4706C7.61765 12.4706 7.61765 8.5 10.7059 8.5Z" fill="white" />
                      <path d="M31 12.9118V30.5588M31 12.9118L27.9118 15.1825M31 12.9118L27.9118 10.5177M1 12.9118L3.64706 10.7059M1 12.9118V30.5588M1 12.9118L6.2946 16.8049M3.64706 10.7059V5.85294H9.38235M3.64706 10.7059V14.6765M1 30.5588H31M1 30.5588L10.2647 19.724M31 30.5588L21.7353 19.724M21.7353 19.724L16 23.9412L10.2647 19.724M21.7353 19.724L27.9118 15.1825M10.2647 19.724L8.05882 18.1021M9.38235 5.85294L16 1L22.6176 5.85294M9.38235 5.85294H22.6176M22.6176 5.85294H27.9118V10.5177M27.9118 15.1825V10.5177M24.3824 9.38235H21.5147M21.5147 9.38235H18.6471H17.7647H21.5147ZM17.7647 12.4706H21.0735H24.3824M17.7647 15.1825H24.3824M21.7353 17.7647H17.7647M8.05882 18.1021L15.1176 18.2059C15.1176 16.7353 14.3235 13.7941 11.1471 13.7941C8.00184 13.7941 6.32725 14.2267 6.2946 16.8049M8.05882 18.1021L6.2946 16.8049M6.29412 16.8824C6.29412 16.8563 6.29428 16.8305 6.2946 16.8049M10.7059 8.5C13.7941 8.5 13.7941 12.4706 10.7059 12.4706C7.61765 12.4706 7.61765 8.5 10.7059 8.5Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    className="text-gray-500 hover:text-yellow-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      saveOpportunity(opportunity.opportunity_id);
                    }}
                  >
                    <Bookmark size={24} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal for Opportunity Details */}
        {selectedOpportunity && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
            <div className="bg-white rounded-2xl w-4/5 max-w-6xl min-h-[80vh] shadow-xl relative flex overflow-hidden">

              {/* Left Section */}
              <div className="flex flex-col w-2/3 p-8">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedOpportunity.title}</h3>
                  <div className="flex gap-2">
                    <p className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {formatTimeAgo(selectedOpportunity.created_at)}
                    </p>
                    <p className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                      {selectedOpportunity.contract_role}
                    </p>
                  </div>
                </div>

                {/* Salary and Tags */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="px-4 py-2 rounded-lg bg-teal-600 text-white font-medium">
                    {calculateMatchPercentage(selectedOpportunity)}
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-green-100 text-green-800 font-medium text-sm">
                    Corresponding to your profile
                  </div>
                  {selectedOpportunity.crit_remote && (
                    <div className="px-4 py-2 rounded-lg bg-purple-100 text-purple-800 font-medium text-sm">
                      Remote
                    </div>
                  )}
                </div>

                {/* Job Details */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Location</h4>
                    <p className="text-gray-800">{selectedOpportunity.crit_location || 'Non spécifié'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Rate</h4>
                    <p className="text-gray-800">{selectedOpportunity.rate} €</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Duration</h4>
                    <p className="text-gray-800">{selectedOpportunity.duration} {selectedOpportunity.duration > 1 ? 'months' : 'month'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-1">Start Date</h4>
                    <p className="text-gray-800">{selectedOpportunity.start_at ? new Date(selectedOpportunity.start_at).toLocaleDateString() : 'Flexible'}</p>
                  </div>
                </div>

                {/* Job Description */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                  <div className="text-gray-700 leading-relaxed overflow-y-auto max-h-[50vh] pr-4">
                    {selectedOpportunity.description ? (
                      <p>{selectedOpportunity.description}</p>
                    ) : (
                      <div>
                        <p className="mb-2">
                          This is a {selectedOpportunity.contract_role} position located in {selectedOpportunity.crit_location}
                          {selectedOpportunity.crit_remote ? ' with remote work option' : ''}.
                        </p>
                        <p className="mb-2">
                          The rate is {selectedOpportunity.rate}€ and the position is expected to last for {selectedOpportunity.duration} {selectedOpportunity.duration > 1 ? 'months' : 'month'}.
                        </p>
                        <p>
                          Start date: {selectedOpportunity.start_at ? new Date(selectedOpportunity.start_at).toLocaleDateString() : 'Flexible'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Criteria */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-semibold text-gray-500 mb-1">Target Rate</h5>
                      <p className="text-gray-800">{selectedOpportunity.crit_target_rate}€</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-gray-500 mb-1">Max Rate</h5>
                      <p className="text-gray-800">{selectedOpportunity.crit_max_rate}€</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-gray-500 mb-1">Status</h5>
                      <p className="text-gray-800">{selectedOpportunity.status}</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-gray-500 mb-1">Role</h5>
                      <p className="text-gray-800">{selectedOpportunity.opportunity_role}</p>
                    </div>
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
                      src="https://mtek3d.com/wp-content/uploads/2018/01/image-placeholder-500x500-300x300.jpg"
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 shadow-md"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col w-full gap-4">
                    <button
                      className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 text-base font-medium rounded-xl transition duration-200 w-full flex items-center justify-center gap-2"
                      onClick={() => submitToOpportunity(selectedOpportunity.opportunity_id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Postuler
                    </button>

                    <button
                      className="border border-gray-300 hover:border-gray-400 bg-white text-gray-700 py-3 px-6 text-base font-medium rounded-xl transition duration-200 w-full flex items-center justify-center gap-2"
                      onClick={() => saveOpportunity(selectedOpportunity.opportunity_id)}
                    >
                      <Bookmark size={18} />
                      Save Job
                    </button>
                  </div>

                  {/* Key Details Summary */}
                  <div className="mt-8 w-full">
                    <h5 className="text-md font-semibold text-gray-700 mb-4">Key Details</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">Contract Type</span>
                        <span className="font-medium">{selectedOpportunity.contract_role}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">Location</span>
                        <span className="font-medium">{selectedOpportunity.crit_location}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">Remote Work</span>
                        <span className="font-medium">{selectedOpportunity.crit_remote ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">Rate</span>
                        <span className="font-medium">{selectedOpportunity.rate}€</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">Start Date</span>
                        <span className="font-medium">{selectedOpportunity.start_at ? new Date(selectedOpportunity.start_at).toLocaleDateString() : 'Flexible'}</span>
                      </div>
                    </div>
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