'use client';

import React, { useState } from 'react';
import { auth, googleProvider, githubProvider } from '@/firebase/firebaseConfig';
import { handleEmailSignIn } from './emailandpassword/handleEmailSignIn';
import { handleGoogleSignIn } from './googlesignin/handleGoogleSignIn';
import { handleGitHubSignIn } from './githubsignin/handleGitHubSignIn';

const AuthenticationPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const onGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            // handleGoogleSignIn:
            // 1. Signs in via Google popup
            // 2. Gets the Firebase ID Token (not the Google ID Token)
            // 3. Sends Firebase ID Token to backend for verification
            // 4. Backend registers new user or logs in existing user
            const result = await handleGoogleSignIn(auth, googleProvider);
            console.log('Google Sign-in complete ✅', result.backendData);
            // TODO: handle post-login redirect here
        } catch (err: any) {
            console.error('Google Sign-in failed:', err);
            setError(err.message || 'Google Sign-in failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-light p-4">
            <div className="material-card w-full max-w-md overflow-hidden bg-white p-8 md:p-10 flex flex-col justify-center">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to <span className="logo-text">Inspire</span></h1>
                    <p className="text-gray-500">Please sign in to your account</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <label className="flex items-center text-sm text-gray-600">
                            <input type="checkbox" className="mr-2 rounded text-primary focus:ring-primary" />
                            Remember me
                        </label>
                        <a href="#" className="text-sm text-primary hover:underline font-medium">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-primary text-white font-bold rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Sign In
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                        onClick={onGoogleSignIn}
                        disabled={loading}
                        className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-3" />
                        <span className="text-gray-700 font-medium text-sm">
                            {loading ? 'Signing in...' : 'Google'}
                        </span>
                    </button>
                    <button
                        className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                        <span className="text-gray-700 font-medium text-sm">GitHub</span>
                    </button>
                </div>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Don't have an account? <a href="#" className="text-primary hover:underline font-medium">Create an account</a>
                </p>
            </div>
        </div>
    );
};

export default AuthenticationPage;
