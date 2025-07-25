import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, Mail, AlertTriangle, Clock } from 'lucide-react';
import { getAuthHeader } from '../../utils/jwt';


const EmailVerifLayout = () => {
    const [status, setStatus] = useState('loading');
    const [errorType, setErrorType] = useState<'4xx' | '5xx' | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isRetrying, setIsRetrying] = useState(false);

    // Mock functions - replace with your actual implementations 
    const verifyEmail = async (token: string) => {
        try {
            // Replace with your actual verification endpoint
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/public/verify-email?token=${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                setStatus('success');
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } else {
                const errorData = await response.json().catch(() => ({}));
                if (errorData.message === "User is already verified") {
                    setStatus('already_verified');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 500);
                    return;
                }

                setErrorMessage(errorData.message || 'Verification failed');
                if (response.status >= 500) {
                    setErrorType('5xx');
                } else if (response.status >= 400) {
                    setErrorType('4xx');
                }
                setStatus('error');
            }
        } catch (error) {
            setErrorMessage('Network error. Please check your connection and try again.');
            setErrorType('5xx');
            setStatus('error');
        }
    };

    const requestNewVerification = async () => {
        setIsRetrying(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/private/request-verification-email`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                }
            });

            if (response.ok) {
                setStatus('resent');
            } else {
                const errorData = await response.json().catch(() => ({}));
                if (errorData.message === "User is already verified") {
                    setStatus('already_verified');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 500);
                    return;
                }

                setErrorMessage(errorData.message || 'Failed to resend verification email');
                setStatus('error');
            }
        } catch (error) {
            setErrorMessage('Failed to resend verification email. Please try again.');
            setStatus('error');
        } finally {
            setIsRetrying(false);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            verifyEmail(token);
        } else {
            setStatus('error');
            setErrorType('4xx');
            setErrorMessage('No verification token provided');
        }
    }, []);

    const LoadingSpinner = () => (
        <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
    );

    const PulsingDots = () => (
        <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {/* Loading State */}
                {status === 'loading' && (
                    <div className="space-y-6">
                        <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                            <Clock className="w-10 h-10 text-blue-600 animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifying Your Email</h1>
                            <p className="text-gray-600 mb-6">Please wait while we confirm your email address...</p>
                            <LoadingSpinner />
                            <div className="mt-4">
                                <PulsingDots />
                            </div>
                        </div>
                    </div>
                )}
                {/* Success State */}
                {(status === 'success' || status === 'already_verified') && (
                    <div className="space-y-6">
                        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-green-800 mb-2">
                                {status === 'success' ? 'Email Verified!' : 'Already Verified!'}
                            </h1>
                            <p className="text-gray-600 mb-4">
                                {status === 'success'
                                    ? 'Your email has been successfully verified.'
                                    : 'Your email was already verified.'}
                            </p>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                <p className="text-green-700 text-sm">
                                    Redirecting you to the dashboard...
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Email Resent State */}
                {status === 'resent' && (
                    <div className="space-y-6">
                        <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                            <Mail className="w-10 h-10 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-blue-800 mb-2">Verification Email Sent!</h1>
                            <p className="text-gray-600 mb-4">A new verification email has been sent to your inbox.</p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-blue-700 text-sm">Please check your email and click the verification link.</p>
                            </div>
                        </div>
                    </div>
                )}
                {/* Error State */}
                {status === 'error' && (
                    <div className="space-y-6">
                        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                            {errorType === '4xx' ? (
                                <AlertTriangle className="w-10 h-10 text-red-600" />
                            ) : (
                                <XCircle className="w-10 h-10 text-red-600" />
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-red-800 mb-2">
                                {errorType === '4xx' ? 'Verification Failed' : 'Something Went Wrong'}
                            </h1>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                <p className="text-red-700 text-sm font-medium mb-2">Error Details:</p>
                                <p className="text-red-600 text-sm">{errorMessage}</p>
                            </div>

                            {errorType === '4xx' && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                                    <p className="text-amber-700 text-sm">
                                        <strong>What you can do:</strong>
                                    </p>
                                    <ul className="text-amber-600 text-sm mt-2 list-disc list-inside space-y-1">
                                        <li>Check if the verification link is correct</li>
                                        <li>The link may have expired</li>
                                        <li>Request a new verification email</li>
                                    </ul>
                                </div>
                            )}

                            {errorType === '5xx' && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <p className="text-blue-700 text-sm">
                                        This appears to be a temporary server issue. Please try again in a moment.
                                    </p>
                                </div>
                            )}

                            <div className="space-y-3">
                                {errorType === '5xx' && (
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        <span>Try Again</span>
                                    </button>
                                )}

                                <button
                                    onClick={requestNewVerification}
                                    disabled={isRetrying}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isRetrying ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-4 h-4" />
                                            <span>Send New Verification Email</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailVerifLayout;