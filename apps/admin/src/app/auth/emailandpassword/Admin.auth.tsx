'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/firebase/firebaseConfig';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { handleEmailAuth } from './handleEmailSignIn';
import OTPSection, { handleVerifyOTP } from './OTPverify';

type AuthView = 'signin' | 'otp';

const AdminAuth = () => {
    const [view, setView] = useState<AuthView>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [isOtpVerified, setIsOtpVerified] = useState(false);

    // Admin Credentials from Environment Variables
    const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS;
    const ADMIN_EMAIL_2 = process.env.NEXT_PUBLIC_ADMIN_EMAIL_2;
    const ADMIN_PASS_2 = process.env.NEXT_PUBLIC_ADMIN_PASS_2;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setIsOtpVerified(false);
                setView('signin');
            }
        });
        return () => unsubscribe();
    }, []);

    const onLogout = async () => {
        setLoading(true);
        setError('');
        try {
            await signOut(auth);
            setIsOtpVerified(false);
            setSuccess('Admin logged out successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            console.error('Logout failed:', err);
            setError(err.message || 'Logout failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // 1. Validate against Admin Credentials
        const isFirstAdmin = email === ADMIN_EMAIL && password === ADMIN_PASS;
        const isSecondAdmin = email === ADMIN_EMAIL_2 && password === ADMIN_PASS_2;

        if (!isFirstAdmin && !isSecondAdmin) {
            setError('Invalid Admin Credentials');
            setLoading(false);
            return;
        }

        try {
            // 2. Request OTP via Backend
            await handleEmailAuth(email, password, 'signin');
            setView('otp');
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const onVerifyOTP = async (otpCode: string) => {
        setLoading(true);
        setError('');
        try {
            await handleVerifyOTP(auth, email, otpCode);
            setIsOtpVerified(true);
            setView('signin');
            setSuccess('Admin OTP Verified successfully ✅');
        } catch (err: any) {
            setError(err.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-light p-4 overflow-hidden">
            <div className="material-card w-full max-w-md overflow-hidden bg-white p-8 md:p-10 flex flex-col justify-center relative transition-all duration-500">

                {/* Header Section */}
                <div className={`mb-8 transition-opacity duration-300 ${view === 'otp' ? 'opacity-0' : 'opacity-100'}`}>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome to <span className="logo-text">Inspire </span>
                    </h1>
                    <p className="text-gray-500">
                        {isOtpVerified ? 'Connected via Secure Session' : 'Please sign in to your administrator account'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm animate-pulse">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm">
                        {success}
                    </div>
                )}

                {/* Main Content Area */}
                <div className="relative min-h-[300px]">

                    {/* OTP View */}
                    {view === 'otp' ? (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            <OTPSection
                                email={email}
                                loading={loading}
                                onVerify={onVerifyOTP}
                                onResend={() => handleEmailAuth(email, password, 'signin')}
                            />
                        </div>
                    ) : (
                        /* Admin Sign In Form - Exactly like Frontend */
                        <form onSubmit={handleAuthSubmit} className="space-y-4 animate-in fade-in slide-in-from-left-8 duration-500">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                        placeholder="admin@example.com"
                                        required
                                        disabled={loading || isOtpVerified}
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
                                        disabled={loading || isOtpVerified}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                                    <input type="checkbox" className="mr-2 rounded text-primary focus:ring-primary" />
                                    Remember me
                                </label>
                                <a href="#" className="text-sm text-primary hover:underline font-medium">Forgot password?</a>
                            </div>

                            <button
                                type={isOtpVerified ? "button" : "submit"}
                                onClick={isOtpVerified ? onLogout : undefined}
                                disabled={loading}
                                className={`w-full py-3 px-4 text-white font-bold rounded-lg transition duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                                    ${isOtpVerified ? 'bg-danger hover:bg-red-600' : 'bg-primary hover:bg-blue-600'}`}
                            >
                                {loading ? 'Processing...' : (
                                    isOtpVerified ? 'Log out' : 'Sign In'
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer Section - Matches Frontend Visual Style */}
                {view !== 'otp' && (
                    <div className=" mt-[-20px] transition-all duration-500">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium">Internal Secure Access</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-gray-400 italic">
                                This is a restricted area for system administrators.
                                Unauthorized access is strictly prohibited.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .animate-in {
                    animation: animate-in 0.5s ease-out;
                }
                @keyframes animate-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default AdminAuth;
