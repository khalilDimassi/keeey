import { createContext, useContext, useState } from 'react';

type SidebarContextType = {
    isHorizontal: boolean;
    toggleOrientation: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isHorizontal, setIsHorizontal] = useState(false);

    const toggleOrientation = () => {
        setIsHorizontal(prev => !prev);
    }

    return (
        <SidebarContext.Provider value={{ isHorizontal, toggleOrientation }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};