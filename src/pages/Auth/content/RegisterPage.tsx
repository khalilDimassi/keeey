import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { saveToken, saveUserId } from '../../../utils/jwt';
import RegisterForm from './RegisterForm';

const RegisterPage = () => {
    const { userType } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (formData: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        password: string;
        confirmPassword: string;
        user_role: string;
    }) => {
        setIsLoading(true);
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/public/register`,
                formData
            );

            const token = response?.data?.token;
            const userId = response?.data?.user?.id || response?.data?.user?.ID;

            if (!token) throw new Error("Token is missing in the response.");

            saveToken(token);
            if (userId) saveUserId(userId);

            // Determine redirect path based on user role
            const redirectPath = formData.user_role === "K-PROFILE" ? "/Layout/kprofile" :
                formData.user_role === "K-PLAYER" ? "/Layout/kplayer" :
                    "/Layout/kpartner";

            navigate(redirectPath);
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Une erreur est survenue. Veuillez réessayer."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <RegisterForm
            userType={userType || 'kprofile'}
            onRegister={handleRegister}
            error={error || ''}
            isLoading={isLoading}
        />
    );
};

export default RegisterPage;