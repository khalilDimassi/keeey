import React, { useState } from 'react';
import { Plus, Calendar, Search } from 'lucide-react';
import Profile_besoin_specifique from './Profile_besoin_specifique';
import Opportunite_pour_consultant from './Opportunite_pour_consultant';
import CandidatesList from './CandidatesList';
import Opportunite from './Opportunite';

const Competances_Creteres = ({ onClose }: { onClose: () => void }) => {
    const [seniority, setSeniority] = useState(50);
    const [selectedView, setSelectedView] = useState('profile'); // Default to profile view
    const [showProfile, setShowProfile] = useState(true); // State to control profile visibility
    const [showSearchButtons, setShowSearchButtons] = useState(true); // State to control search buttons visibility

    const handleViewChange = (view: React.SetStateAction<string>) => {
        setSelectedView(view);
        setShowProfile(true); // Reset profile visibility when changing views
        setShowSearchButtons(true); // Reset search buttons visibility
    };

    const handleCloseProfile = () => {
     
        onClose(); 
    };

    return (
        <div className="min-h-screen w-full">
            {/* Search Buttons - conditionally rendered */}
            {showSearchButtons && (
                <div className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row gap-4">
                    <button
                        className={`flex-1 px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-colors ${selectedView === 'profile'
                            ? 'bg-[#B5A48B] text-white hover:bg-[#a39379]'
                            : 'bg-white border-2 border-[#B5A48B] text-[#B5A48B] hover:bg-gray-50'
                            }`}
                        onClick={() => handleViewChange('profile')}
                    >
                        <Search className="w-5 h-5" />
                        <span>Vous recherchez un Profile pour un besoin spécifique</span>
                    </button>
                    <button
                        className={`flex-1 px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-colors ${selectedView === 'opportunite'
                            ? 'bg-[#B5A48B] text-white hover:bg-[#a39379]'
                            : 'bg-white border-2 border-[#B5A48B] text-[#B5A48B] hover:bg-gray-50'
                            }`}
                        onClick={() => handleViewChange('opportunite')}
                    >
                        <Search className="w-5 h-5" />
                        <span>Vous recherchez une opportunité pour votre consultant</span>
                    </button>
                </div>
            )}

            {selectedView === 'profile' ? (
                <>
                    {showProfile && <Profile_besoin_specifique />}

                    {showProfile && (
                        <button
                            name='close'
                            className="absolute left-1/2 transform -translate-x-1/2 rounded-full p-1"
                            onClick={handleCloseProfile}
                        >
                            <svg width="40" height="40" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g filter="url(#filter0_d_931_7172)">
                                    <path d="M16 27.5537H40" stroke="#A58E56" strokeWidth="3" strokeLinecap="round" />
                                    <mask id="path-2-inside-1_931_7172" fill="white">
                                        <path d="M46 27.5539C46 37.2487 37.9411 45.1078 28 45.1078C18.0589 45.1078 10 37.2487 10 27.5539C10 17.8592 18.0589 10 28 10C37.9411 10 46 17.8592 46 27.5539ZM12.0581 27.5539C12.0581 36.1402 19.1955 43.1007 28 43.1007C36.8045 43.1007 43.9419 36.1402 43.9419 27.5539C43.9419 18.9676 36.8045 12.0071 28 12.0071C19.1955 12.0071 12.0581 18.9676 12.0581 27.5539Z" />
                                    </mask>
                                    <path d="M46 27.5539C46 37.2487 37.9411 45.1078 28 45.1078C18.0589 45.1078 10 37.2487 10 27.5539C10 17.8592 18.0589 10 28 10C37.9411 10 46 17.8592 46 27.5539ZM12.0581 27.5539C12.0581 36.1402 19.1955 43.1007 28 43.1007C36.8045 43.1007 43.9419 36.1402 43.9419 27.5539C43.9419 18.9676 36.8045 12.0071 28 12.0071C19.1955 12.0071 12.0581 18.9676 12.0581 27.5539Z" fill="#A58E56" stroke="#A58E56" strokeWidth="2" mask="url(#path-2-inside-1_931_7172)" />
                                </g>
                                <defs>
                                    <filter id="filter0_d_931_7172" x="0" y="0" width="56" height="55.1079" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                        <feOffset />
                                        <feGaussianBlur stdDeviation="5" />
                                        <feComposite in2="hardAlpha" operator="out" />
                                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_931_7172" />
                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_931_7172" result="shape" />
                                    </filter>
                                </defs>
                            </svg>
                        </button>
                    )}

                
                </>
            ) : (
                <>
                    {showProfile && <Opportunite_pour_consultant />}

                    {showProfile && (
                        <button
                            name='close'
                            className="absolute left-1/2 transform -translate-x-1/2 rounded-full p-1"
                            onClick={handleCloseProfile}
                        >
                            <svg width="40" height="40" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g filter="url(#filter0_d_931_7172)">
                                    <path d="M16 27.5537H40" stroke="#A58E56" strokeWidth="3" strokeLinecap="round" />
                                    <mask id="path-2-inside-1_931_7172" fill="white">
                                        <path d="M46 27.5539C46 37.2487 37.9411 45.1078 28 45.1078C18.0589 45.1078 10 37.2487 10 27.5539C10 17.8592 18.0589 10 28 10C37.9411 10 46 17.8592 46 27.5539ZM12.0581 27.5539C12.0581 36.1402 19.1955 43.1007 28 43.1007C36.8045 43.1007 43.9419 36.1402 43.9419 27.5539C43.9419 18.9676 36.8045 12.0071 28 12.0071C19.1955 12.0071 12.0581 18.9676 12.0581 27.5539Z" />
                                    </mask>
                                    <path d="M46 27.5539C46 37.2487 37.9411 45.1078 28 45.1078C18.0589 45.1078 10 37.2487 10 27.5539C10 17.8592 18.0589 10 28 10C37.9411 10 46 17.8592 46 27.5539ZM12.0581 27.5539C12.0581 36.1402 19.1955 43.1007 28 43.1007C36.8045 43.1007 43.9419 36.1402 43.9419 27.5539C43.9419 18.9676 36.8045 12.0071 28 12.0071C19.1955 12.0071 12.0581 18.9676 12.0581 27.5539Z" fill="#A58E56" stroke="#A58E56" strokeWidth="2" mask="url(#path-2-inside-1_931_7172)" />
                                </g>
                                <defs>
                                    <filter id="filter0_d_931_7172" x="0" y="0" width="56" height="55.1079" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                        <feOffset />
                                        <feGaussianBlur stdDeviation="5" />
                                        <feComposite in2="hardAlpha" operator="out" />
                                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_931_7172" />
                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_931_7172" result="shape" />
                                    </filter>
                                </defs>
                            </svg>
                        </button>
                    )}
                 
                </>
            )}

        {selectedView === 'profile' ? (
<>   {/* Horizontal Sidebar (CandidatesList) - always visible */}
                    <div className="w-full mt-5">
                        <CandidatesList />
                    </div></>


        ):(<>   {/* Horizontal Sidebar (CandidatesList) - always visible */}
            <div className="w-full mt-5">
            <Opportunite />
            </div></>
)}
        </div>
    );
}

export default Competances_Creteres;