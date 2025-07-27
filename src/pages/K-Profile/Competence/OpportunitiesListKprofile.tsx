import { useEffect } from 'react';
import { useSidebar } from '../../components/SidebarContext';

const OpportunitiesListKprofile = () => {
    const { isHorizontal, toggleOrientation } = useSidebar();

    // Set to horizontal when component mounts
    useEffect(() => {
        if (!isHorizontal) {
            toggleOrientation();
        }
    }, []);

    // Cleanup function to toggle back when component unmounts
    useEffect(() => {
        return () => {
            if (isHorizontal) {
                toggleOrientation();
            }
        };
    }, [isHorizontal, toggleOrientation]);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Opportunities</h2>
            <div className="bg-white rounded-lg shadow p-6">
                <p>List of available opportunities...</p>
            </div>
        </div>
    );
};

export default OpportunitiesListKprofile;