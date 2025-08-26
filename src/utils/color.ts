import { getUserRole, UserRole } from "./jwt";

const colorScales = {
  'K-PROFILE': {
    100: '#c2e1e6',
    200: '#96cdd6',
    300: '#6ab9c6',
    400: '#3ea5b6',
    500: '#297280',
    600: '#205a66',
    700: '#18434d',
    800: '#0f2b33',
    900: '#061419',
  },
  'K-PLAYER': {
    100: '#c7d9ef',
    200: '#9ab9df',
    300: '#6d99cf',
    400: '#4079bf',
    500: '#215A96',
    600: '#1a4878',
    700: '#14365a',
    800: '#0d243c',
    900: '#06121e',
  },
  'K-PARTNER': {
    100: '#e8e4da',
    200: '#d5cebc',
    300: '#c2b89e',
    400: '#afa280',
    500: '#A89B7B',
    600: '#867c62',
    700: '#645d4a',
    800: '#423e31',
    900: '#201f18',
  },
  'default': {
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
};

let mainColor = colorScales.default;

export const initializeThemeColors = (role: UserRole): void => {
  const userRole = role || getUserRole();
  mainColor = colorScales[userRole] || colorScales.default;

  // Optional: Set CSS custom properties for global use
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    Object.entries(mainColor).forEach(([shade, value]) => {
      root.style.setProperty(`--maincolor-${shade}`, value);
    });
  }
};

export const getColor = (shade: keyof typeof mainColor): string => {
  return mainColor[shade];
};

export const getColorScale = () => {
  return { ...mainColor };
};

// Initialize on import 
initializeThemeColors(getUserRole() ?? 'default');