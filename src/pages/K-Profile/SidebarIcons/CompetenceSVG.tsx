import { forwardRef } from "react";
import { LucideProps } from "lucide-react";

const CompetenceSVG = forwardRef<SVGSVGElement, LucideProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 40 37"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path fill={color} d="M34.8015 27.0631C36.4718 27.0631 39.0469 28.2375 39.0469 31.5369C39.0469 34.8363 36.0542 35.5913 34.8015 35.5913C33.5487 35.5913 30.6952 34.4728 30.6952 31.5369C30.6952 28.601 33.1311 27.0631 34.8015 27.0631Z" />
        <path fill={color} d="M31.1824 14.9H38.3509V22.1H31.1824V14.9Z" />
        <path fill={color} d="M30.904 7.83986H38.6293L34.7895 1.08006L30.904 7.83986Z" />
        <path fill={color} d="M8.1458 8.88833C8.04685 8.88833 7.94959 8.88562 7.85403 8.88028C5.59188 8.87472 1.04689 10.1056 1.04688 15.3894V22.869H4.45714L5.2923 36.5H10.7905L11.8344 22.869H15.2447V15.3894C15.2447 12.1039 12.5443 8.88833 8.1458 8.88833Z" />
        <path fill={color} d="M8.1458 8.88833C13.644 8.88833 13.9224 0.500068 8.1458 0.5C2.47319 0.499933 2.63958 8.58913 7.85403 8.88028C7.95615 8.88053 8.05361 8.8833 8.1458 8.88833Z" />
        <path stroke={color} strokeLinecap="round" strokeLinejoin="round" d="M19.2813 18.535H23.9443M23.9443 18.535V5.74278H28.4681M23.9443 18.535V31.5369H28.3289M23.9443 18.535H28.3289M34.8015 1.05929L34.7895 1.08006M34.7895 1.08006L30.904 7.83986H38.6293L34.7895 1.08006ZM31.1824 14.9H38.3509V22.1H31.1824V14.9ZM34.8015 27.0631C36.4718 27.0631 39.0469 28.2375 39.0469 31.5369C39.0469 34.8363 36.0542 35.5913 34.8015 35.5913C33.5487 35.5913 30.6952 34.4728 30.6952 31.5369C30.6952 28.601 33.1311 27.0631 34.8015 27.0631Z" />
      </svg>
    );
  }
);

CompetenceSVG.displayName = "CompetenceSVG";

export default CompetenceSVG;
