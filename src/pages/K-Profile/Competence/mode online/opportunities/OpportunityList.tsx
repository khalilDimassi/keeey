import { useEffect, useState, useRef } from "react";
import { Bookmark } from 'lucide-react';
import { getAuthHeader } from "../../../../../utils/jwt";
import { OpportunityListItem } from "./types";
import axios from "axios";


interface OpportunityListProps {
    items: OpportunityListItem[];
    loading: boolean;
    error: string | null;
    onItemClick: (selectedOpportunity: OpportunityListItem) => void;
}

const ITEMS_PER_PAGE = 5;

const OpportunityList = ({ items, loading, error, onItemClick }: OpportunityListProps) => {
    const [displayedItems, setDisplayedItems] = useState<OpportunityListItem[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastItemRef = useRef<HTMLDivElement | null>(null);

    // Load initial items
    useEffect(() => {
        if (items.length > 0) {
            loadItems(1);
        }
    }, [items]);

    // Reset pagination when items change
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        loadItems(1);
    }, [items]);

    // Set up intersection observer for infinite scroll
    useEffect(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        };

        observerRef.current = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasMore && !loadingMore) {
                loadMoreItems();
            }
        }, options);

        if (lastItemRef.current) {
            observerRef.current.observe(lastItemRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMore, loadingMore, displayedItems]);

    const loadItems = (pageNum: number) => {
        const startIdx = 0;
        const endIdx = pageNum * ITEMS_PER_PAGE;
        const itemsToShow = items.slice(startIdx, endIdx);

        setDisplayedItems(itemsToShow);
        setHasMore(endIdx < items.length);
    };

    const loadMoreItems = () => {
        if (!hasMore || loadingMore) return;

        setLoadingMore(true);
        const nextPage = page + 1;

        // Simulate loading delay for UX
        setTimeout(() => {
            loadItems(nextPage);
            setPage(nextPage);
            setLoadingMore(false);
        }, 300);
    };

    const handleSaveClick = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        try {
            await saveOpportunity(id);
            // You could update UI state here if needed
        } catch (err) {
            console.error("Failed to save opportunity:", err);
        }
    };

    const handleSubmitClick = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        try {
            await submitToOpportunity(id);
            // You could update UI state here if needed
        } catch (err) {
            console.error("Failed to submit to opportunity:", err);
        }
    };

    const setLastItemRef = (el: HTMLDivElement | null) => {
        lastItemRef.current = el;
    };

    if (loading && displayedItems.length === 0) {
        return (
            <div className="text-center py-10">
                <p>Chargement des opportunités...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    if (displayedItems.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p>Aucune opportunité disponible.</p>
            </div>
        );
    }


    // Utils
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
    const calculateMatchPercentage = (opportunity: OpportunityListItem): string => {
        const result = Math.round(opportunity.matching?.total_match_percentage ?? 0)
        return `${result}%`;
    };


    // Services 
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

    return (
        <div className="space-y-6 p-6 max-h-[70vh] overflow-y-auto">
            {displayedItems.map((item, index) => {
                const isLastItem = index === displayedItems.length - 1;
                return (
                    <div
                        key={item.opportunity_id}
                        ref={isLastItem ? setLastItemRef : null}
                        className="bg-white p-4 hover:shadow-lg transition-shadow flex flex-col sm:flex-row gap-4 border-b border-gray-200 relative cursor-pointer"
                        onClick={() => onItemClick(item)}
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
                                    {item.title} <span className="text-sm text-gray-500">{formatTimeAgo(item.created_at)}</span>
                                </h3>

                                {/* Match Percentage and Contract Type */}
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="px-3 py-1 rounded-md bg-teal-600 text-white text-sm">
                                        {calculateMatchPercentage(item)}
                                    </div>
                                    <span className="text-sm text-gray-700">Correspondent à votre profil</span>
                                    <div className="ml-2 px-3 py-1 rounded-md bg-blue-100 text-blue-800 text-sm">
                                        {item.contract_role}
                                    </div>
                                </div>
                            </div>

                            {/* Description - truncated for list view */}
                            <p className="text-gray-700 text-sm leading-relaxed mt-3 line-clamp-2">
                                {item.description || `${item.contract_role} - ${item.crit_location} ${item.crit_remote ? '(Remote)' : ''}`}
                            </p>
                        </div>

                        {/* Icons */}
                        <div className="absolute top-2 right-3 flex gap-4">
                            <button
                                className="text-gray-400 hover:text-gray-600"
                                onClick={(e) => handleSubmitClick(e, item.opportunity_id)}
                            >
                                <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M3.64706 10.7059L1 12.9118L6.2946 16.8049C6.32725 14.2267 8.00184 13.7941 11.1471 13.7941C14.3235 13.7941 15.1176 16.7353 15.1176 18.2059L8.05882 18.1021L10.2647 19.724L16 23.9412L21.7353 19.724L27.9118 15.1825V10.5177V5.85294H22.6176H9.38235H3.64706V10.7059ZM10.7059 8.5C13.7941 8.5 13.7941 12.4706 10.7059 12.4706C7.61765 12.4706 7.61765 8.5 10.7059 8.5Z" fill="white" />
                                    <path d="M31 12.9118V30.5588M31 12.9118L27.9118 15.1825M31 12.9118L27.9118 10.5177M1 12.9118L3.64706 10.7059M1 12.9118V30.5588M1 12.9118L6.2946 16.8049M3.64706 10.7059V5.85294H9.38235M3.64706 10.7059V14.6765M1 30.5588H31M1 30.5588L10.2647 19.724M31 30.5588L21.7353 19.724M21.7353 19.724L16 23.9412L10.2647 19.724M21.7353 19.724L27.9118 15.1825M10.2647 19.724L8.05882 18.1021M9.38235 5.85294L16 1L22.6176 5.85294M9.38235 5.85294H22.6176M22.6176 5.85294H27.9118V10.5177M27.9118 15.1825V10.5177M24.3824 9.38235H21.5147M21.5147 9.38235H18.6471H17.7647H21.5147ZM17.7647 12.4706H21.0735H24.3824M17.7647 15.1825H24.3824M21.7353 17.7647H17.7647M8.05882 18.1021L15.1176 18.2059C15.1176 16.7353 14.3235 13.7941 11.1471 13.7941C8.00184 13.7941 6.32725 14.2267 6.2946 16.8049M8.05882 18.1021L6.2946 16.8049M6.29412 16.8824C6.29412 16.8563 6.29428 16.8305 6.2946 16.8049M10.7059 8.5C13.7941 8.5 13.7941 12.4706 10.7059 12.4706C7.61765 12.4706 7.61765 8.5 10.7059 8.5Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button
                                className="text-gray-500 hover:text-yellow-400"
                                onClick={(e) => handleSaveClick(e, item.opportunity_id)}
                            >
                                <Bookmark size={24} />
                            </button>
                        </div>
                    </div>
                );
            })}

            {/* Loading more indicator */}
            {loadingMore && (
                <div className="text-center py-4">
                    <p>Chargement de plus d'opportunités...</p>
                </div>
            )}
        </div>
    );
};

export default OpportunityList;