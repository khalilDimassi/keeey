import { Job } from "../../types";

// Define color scheme enums
export enum JobButtonColorScheme {
    kprofile = "kprofile",
    kplayer = "kplayer",
    kpartner = "kpartner"
}

// Define color schemes
const colorSchemes = {
    [JobButtonColorScheme.kprofile]: {
        selected: {
            bg: 'bg-[#297280]',
            text: 'text-white',
            hover: 'bg-[#3E808D]'
        },
        unselected: {
            bg: 'bg-gray-50',
            text: 'text-gray-700',
            border: 'border-gray-300',
            hover: 'bg-[#BFD5D9]'
        },
        badge: {
            bg: 'bg-red-500',
            text: 'text-white'
        }
    },
    [JobButtonColorScheme.kplayer]: {
        selected: {
            bg: 'bg-[#215A96]',
            text: 'text-white',
            hover: 'bg-[#bccee0] hover:text-gray-800'
        },
        unselected: {
            bg: 'bg-gray-100',
            text: 'text-gray-600',
            border: 'border-gray-200',
            hover: 'bg-[#bccee0] text-gray-800'
        },
        badge: {
            bg: 'bg-red-500',
            text: 'text-white'
        }
    },
    [JobButtonColorScheme.kpartner]: {
        selected: {
            bg: 'bg-[#6A0DAD]',
            text: 'text-white',
            hover: 'bg-[#7D3CFF]'
        },
        unselected: {
            bg: 'bg-gray-50',
            text: 'text-purple-800',
            border: 'border-purple-200',
            hover: 'bg-[#E6E6FA]'
        },
        badge: {
            bg: 'bg-teal-500',
            text: 'text-white'
        }
    }
};

export const JobButton = ({
    job,
    isSelected,
    hasSkills,
    selectedSkillCount = 0,
    isToggleHovered,
    colorScheme = JobButtonColorScheme.kprofile,
    onMainClick,
    onToggleClick,
    onToggleMouseEnter,
    onToggleMouseLeave,
    disabled = false
}: {
    job: Job;
    isSelected: boolean;
    hasSkills: boolean;
    selectedSkillCount?: number;
    isToggleHovered: boolean;
    colorScheme?: JobButtonColorScheme;
    onMainClick: () => void;
    onToggleClick: () => void;
    onToggleMouseEnter: () => void;
    onToggleMouseLeave: () => void;
    disabled?: boolean;
}) => {
    // Get colors based on the selected scheme
    const colors = colorSchemes[colorScheme];

    const getButtonStyles = () => {
        if (isSelected) {
            return isToggleHovered
                ? `${colors.selected.hover} ${colors.selected.text}`
                : `${colors.selected.bg} ${colors.selected.text}`;
        } else {
            return isToggleHovered
                ? `${colors.unselected.hover} ${colors.unselected.text}`
                : `${colors.unselected.border} ${colors.unselected.bg} ${colors.unselected.text}`;
        }
    };

    return (
        <div className="relative">
            <button
                type="button"
                className={`flex items-center px-3 py-2 border shadow rounded-xl space-x-2 cursor-auto whitespace-nowrap flex-grow-0 flex-shrink-0 ${getButtonStyles()}`}
                disabled={disabled}
            >
                <span
                    className="cursor-pointer"
                    onClick={onMainClick}
                >{job.Name}</span>

                <span
                    className="ml-2 border-l-2 pl-2 cursor-pointer"
                    onMouseEnter={onToggleMouseEnter}
                    onMouseLeave={onToggleMouseLeave}
                    onClick={onToggleClick}
                >
                    {isSelected ? "-" : "+"}
                </span>
            </button>

            {/* Skills count badge - positioned absolutely in top-right corner */}
            {hasSkills && isSelected && selectedSkillCount > 0 && (
                <div className={`absolute -top-2 -right-2 w-5 h-5 ${colors.badge.bg} ${colors.badge.text} rounded-full flex items-center justify-center text-xs font-medium`}>
                    {selectedSkillCount > 99 ? '99+' : selectedSkillCount}
                </div>
            )}
        </div>
    );
};