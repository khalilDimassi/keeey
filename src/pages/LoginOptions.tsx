
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";
const LoginOptions = () => {
    const navigate = useNavigate();

  const handleClick = () => {
    navigate('/Register');
  };
    return (
      <div className="flex justify-center items-center min-h-screen px-4 bg-gray-50">
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
          <img src={logo} alt="Keeey Logo" className="h-16 object-contain" />
        </div>
  
        <div className="relative w-full max-w-md bg-white p-9 rounded-lg shadow-lg" 
             style={{boxShadow: "0 4px 15px rgba(0, 128, 0, 0.2)"}}>
          <h2 className="text-center text-xl font-bold text-gray-700 mb-2">
            Créer un nouveau compte K-Profil
          </h2>
          
          <div className="text-center text-sm text-gray-600 mb-6">
            Vous avez déjà un compte ? 
            <a href="/LoginPage" className="text-green-700 ml-1 hover:underline">Connectez-vous</a>
          </div>
  
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 p-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
              </svg>
              <span>Continuer avec Google</span>
            </button>
  
            <button className="w-full flex items-center justify-center gap-2 p-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span>Continuer avec apple</span>
            </button>
  
            <button className="w-full flex items-center justify-center gap-2 p-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition">
              <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
              </svg>
              <span>Continuer avec facebook</span>
            </button>
  
            <button
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-2 p-2.5 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
        />
      </svg>
      <span>Continuer avec email</span>
    </button>
          </div>
  
          <button className="w-full text-gray-500 text-sm mt-6 hover:underline"
               onClick={() => navigate("/home")} >
            continuer en tant qu'invité →
          </button>
        </div>
      </div>
    );
  };
  
  export default LoginOptions;
