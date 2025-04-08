import { useEffect, useState, useRef } from "react";
import { Bookmark, MailCheck, MailX } from 'lucide-react';
import { OpportunityListItem } from "./types";

interface OpportunityListProps {
    items: OpportunityListItem[];
    loading: boolean;
    error: string | null;
    onItemClick: (selectedOpportunity: OpportunityListItem) => void;
    onSaveOpportunity: (opportunityId: number, is_saved: boolean) => void;
    onSubmitOpportunity: (opportunityId: number, is_applied: boolean) => void;
}

const ITEMS_PER_PAGE = 5;

const OpportunityList = ({
    items,
    loading,
    error,
    onItemClick,
    onSaveOpportunity,
    onSubmitOpportunity
}: OpportunityListProps) => {
    const [displayedItems, setDisplayedItems] = useState<OpportunityListItem[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastItemRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (items.length > 0) {
            loadItems(1);
        } else {
            setDisplayedItems([]);
        }
    }, [items]);

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
    }, [hasMore, loadingMore, displayedItems])

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

        setTimeout(() => {
            loadItems(nextPage);
            setPage(nextPage);
            setLoadingMore(false);
        }, 300);
    };

    const handleSaveClick = (e: React.MouseEvent, id: number, is_saved: boolean) => {
        e.stopPropagation();
        onSaveOpportunity(id, !is_saved);
    };

    const handleSubmitClick = (e: React.MouseEvent, id: number, is_applied: boolean) => {
        e.stopPropagation();
        onSubmitOpportunity(id, !is_applied);
    };

    const setLastItemRef = (el: HTMLDivElement | null) => {
        lastItemRef.current = el;
    };

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

    const calculateMatchPercentage = (opportunity: OpportunityListItem): string => {
        const result = Math.round(opportunity.matching?.total_match_percentage ?? 0)
        return `${result}%`;
    };

    const OpportunitySkeleton = ({ error = false, count = 3 }: { error?: boolean; count?: number }) => (
        <div className="space-y-6 p-6 max-h-[70vh] overflow-y-auto">
            {[...Array(count)].map((_, index) => (
                <div
                    key={index}
                    className={`bg-white p-4 border-b border-gray-200 relative flex flex-col sm:flex-row gap-4 ${error ? 'border-red-500' : ''}`}
                >
                    {/* Avatar skeleton */}
                    <div
                        className={`w-16 h-16 rounded-full flex-shrink-0 mx-auto ${error ? 'bg-red-200' : 'bg-gray-200'} animate-pulse`}
                    ></div>

                    {/* Job details skeleton */}
                    <div className="flex-1 min-w-0 space-y-3">
                        {/* Title & Time */}
                        <div className="space-y-2">
                            <div className={`h-6 w-3/4 rounded ${error ? 'bg-red-300' : 'bg-gray-300'}`}></div>
                            <div className={`h-4 w-1/4 rounded ${error ? 'bg-red-200' : 'bg-gray-200'}`}></div>
                        </div>

                        {/* Match Percentage */}
                        <div className="flex items-center gap-2">
                            <div className={`h-6 w-16 rounded-xl ${error ? 'bg-red-300' : 'bg-gray-300'}`}></div>
                            <div className={`h-4 w-1/3 rounded ${error ? 'bg-red-200' : 'bg-gray-200'}`}></div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <div className={`h-4 w-full rounded ${error ? 'bg-red-200' : 'bg-gray-200'}`}></div>
                            <div className={`h-4 w-5/6 rounded ${error ? 'bg-red-200' : 'bg-gray-200'}`}></div>
                        </div>
                    </div>

                    {/* Icons skeleton */}
                    <div className="absolute top-2 right-3 flex gap-4">
                        <div className={`h-6 w-6 rounded-md ${error ? 'bg-red-300' : 'bg-gray-300'}`}></div>
                        <div className={`h-6 w-6 rounded-md ${error ? 'bg-red-300' : 'bg-gray-300'}`}></div>
                    </div>
                </div>
            ))}
        </div>
    );

    if (loading && displayedItems.length === 0) {
        return <OpportunitySkeleton count={1} />;
    }

    if (error) {
        return (
            <>
                <OpportunitySkeleton error count={1} />
                <div className="text-center py-4 text-red-500 font-medium">
                    <p>{error}</p>
                </div>
            </>
        );
    }

    if (displayedItems.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p>Aucune opportunité disponible.</p>
            </div>
        );
    }

    const getInitials = (title: string) => {
        const words = title.split(/\s+/).filter(word => word.length > 0);
        const firstWords = words.slice(0, 3);
        const initials = firstWords.map(word => word[0].toUpperCase()).join('');

        return initials;
    };

    const getRandomColor = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const h = Math.abs(hash) % 360; // Hue (0-360)
        const s = 10 + Math.abs(hash) % 15; // Saturation (70-85%)
        const l = 40 + Math.abs(hash) % 10; // Lightness (40-50%) - keeps it medium-dark

        return `hsl(${h}, ${s}%, ${l}%)`;
    };

    return (
        <div className="space-y-6 p-6 max-h-[70vh] overflow-y-auto">
            {displayedItems.map((item, index) => {
                const isLastItem = index === displayedItems.length - 1;
                return (
                    <div
                        key={item.opportunity_id}
                        ref={isLastItem ? setLastItemRef : null}
                        className="bg-white p-4 hover:shadow transition-shadow flex flex-col sm:flex-row gap-4 border-b border-gray-200 relative cursor-pointer"
                        onClick={() => onItemClick(item)}
                    >
                        {/* Avatar with initials as placeholder */}
                        <div
                            className="w-16 h-16 rounded-full flex-shrink-0 object-cover mx-auto flex items-center justify-center text-sm text-black font-bold"
                            style={{ backgroundColor: getRandomColor(item.title) }}
                        >
                            {getInitials(item.title)}
                        </div>

                        {/* Job details */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col">
                                {/* Title & Time */}
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                    {item.title} <span className="text-sm text-gray-500">{formatTimeAgo(item.created_at)}</span>
                                </h3>

                                {/* Match Percentage and Contract Type */}
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="px-3 rounded-xl bg-[#9FC5C8] text-[#30797F] text-sm font-bold">
                                        {calculateMatchPercentage(item)}
                                    </div>
                                    <span className="text-sm text-gray-700">Correspondent à votre profil</span>
                                </div>
                            </div>

                            {/* Description - truncated for list view */}
                            <p className="text-gray-700 text-sm leading-relaxed mt-3 line-clamp-2">
                                {item.description ||
                                    `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
                                }
                            </p>
                        </div>

                        {/* Icons */}
                        <div className="absolute top-2 right-3 flex gap-4">
                            {/* Apply Button */}
                            <button
                                className={`p-1 rounded-md transition-all duration-200 ${item.is_applied
                                    ? 'text-green-500 hover:text-red-500'
                                    : 'text-black hover:text-green-500'
                                    }`}
                                onClick={(e) => handleSubmitClick(e, item.opportunity_id, item.is_applied)}
                                aria-label={item.is_applied ? "Applied" : "Apply"}
                                title={item.is_applied ? 'Cancel application' : 'Send application'}
                            >
                                {item.is_applied ? <MailX /> : <MailCheck />}
                            </button>

                            {/* Save Button */}
                            <button
                                className={`p-1 rounded-md transition-all duration-200 ${item.is_saved
                                    ? "text-black hover:text-red-500 "
                                    : "text-black hover:text-yellow-400 "
                                    }`}
                                onClick={(e) => handleSaveClick(e, item.opportunity_id, item.is_saved)}
                                aria-label={item.is_saved ? "Saved" : "Save"}
                            >
                                <Bookmark
                                    size={24}
                                    fill={item.is_saved ? "yellow" : "none"}
                                />
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