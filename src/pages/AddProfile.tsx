import logo from "./assets/logo.png";
import axios from "axios";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { saveToken } from "./utils/jwt";


const AddProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user_role = location.state?.user_role || "K-PROFILE";

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    user_role: user_role
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/public/register`, formData);

      const token = response?.data?.token;
      if (!token) {
        throw new Error("Token is missing in the response.");
      }

      saveToken(token);

      navigate("/home");
    } catch (err: any) {
      setError(err.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-gray-50">
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
        <img src={logo} alt="Keeey Logo" className="h-16 object-contain" />
      </div>

      <div className="relative w-full bg-white p-9 rounded-lg shadow-lg border-green-700" style={{ width: "40rem", boxShadow: "0 4px 15px rgba(0, 128, 0, 0.2)", marginTop: "4rem" }}>
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/LoginOptions")}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-bold text-gray-700 flex-grow text-center pr-6">
            Créer votre compte K-Profile
          </h2>
        </div>

        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 text-sm">Nom</label>
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
                value={formData.first_name}
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm">Prénom</label>
              <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
                value={formData.last_name}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-600 text-sm">Adresse mail</label>
            <input
              type="email"
              name="email"
              placeholder="exemple@mail.com"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
              value={formData.email}
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-600 text-sm">Numéro de téléphone</label>
            <input
              type="tel"
              name="telephone"
              placeholder="Votre numéro"
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
              value={formData.phone}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-600 text-sm">Mot de passe</label>
              <input
                type="password"
                name="password"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
                value={formData.password}
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:border-green-500"
                value={formData.confirmPassword}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

          <div className="mt-6 space-y-4">
            <button
              type="submit"
              className="w-full bg-green-800 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Inscrivez-vous
            </button>

            <button
              type="button"
              className="w-full text-gray-500 text-sm hover:underline"
              onClick={() => navigate("/home")}
            >
              Continuer en tant qu'invité →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProfile;