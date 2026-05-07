'use client';

import React, { useState, useEffect } from 'react';
import { auth, googleProvider, githubProvider } from '@/firebase/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { handleEmailSignIn } from './emailandpassword/handleEmailSignIn';
import { handleGoogleSignIn } from './googlesignin/handleGoogleSignIn';
import { handleLogout } from './googlesignin/handleLogout';


const AuthenticationPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const onGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await handleGoogleSignIn(auth, googleProvider);
            // Log the success message from the backend
            if (result.backendData && result.backendData.message) {
                console.log('Backend Verification:', result.backendData.message);
            }
            console.log('Google Sign-in complete ✅', result.backendData.user);
            // TODO: handle post-login redirect here
        } catch (err: unknown) {
            console.error('Google Sign-in failed:', err);
            setError(err instanceof Error ? err.message : 'Google Sign-in failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onLogout = async () => {
        setLoading(true);
        setError('');
        try {
            await handleLogout(auth);
        } catch (err: unknown) {
            console.error('Logout failed:', err);
            setError(err instanceof Error ? err.message : 'Logout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const onEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await handleEmailSignIn(auth, email, password);
            console.log('Email Sign-in complete ✅', result.user);
            // TODO: handle post-login redirect here
        } catch (err: unknown) {
            console.error('Email Sign-in failed:', err);
            setError(err instanceof Error ? err.message : 'Email Sign-in failed. Please check your credentials.');
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

                <form onSubmit={onEmailSignIn} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                            placeholder="name@example.com"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                            placeholder="••••••••"
                            required
                            disabled={loading}
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
                        disabled={loading}
                        className="w-full py-3 px-4 bg-primary text-white font-bold rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
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

                <div className="flex justify-center">
                    <button
                        onClick={user ? onLogout : onGoogleSignIn}
                        disabled={loading}
                        className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-3" />
                        <span className="text-gray-700 font-medium text-sm">
                            {loading 
                                ? (user ? 'Logging out...' : 'Signing in...') 
                                : (user ? 'Log out from Google' : 'Sign in with Google')}
                        </span>
                    </button>
                </div>

                <p className="mt-8 text-center text-sm text-gray-600">
                    Don&apos;t have an account? <a href="#" className="text-primary hover:underline font-medium">Create an account</a>
                </p>
            </div>
        </div>
    );
};

export default AuthenticationPage;
