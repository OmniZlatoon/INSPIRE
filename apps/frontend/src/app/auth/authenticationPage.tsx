'use client';

import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '@/firebase/firebaseConfig';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { handleEmailAuth } from './emailandpassword/handleEmailSignIn';
import { handleGoogleSignIn } from './googlesignin/handleGoogleSignIn';
import { handleLogout as handleGoogleLogout } from './googlesignin/handleLogout';
import { handleVerifyOTP } from './emailandpassword/handleVerifyOTP';
import OTPSection from './OTPSection';

type AuthView = 'signin' | 'signup' | 'otp';

const AuthenticationPage = () => {
    const [view, setView] = useState<AuthView>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [isOtpVerified, setIsOtpVerified] = useState(false);

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

    const onGoogleSignIn = async () => {
        if (isOtpVerified) return; // Prevent if already verified via OTP
        setLoading(true);
        setError('');
        try {
            const result = await handleGoogleSignIn(auth, googleProvider);
            console.log('Google Sign-in complete ✅');
        } catch (err: any) {
            console.error('Google Sign-in failed:', err);
            setError(err.message || 'Google Sign-in failed.');
        } finally {
            setLoading(false);
        }
    };

    const onLogout = async () => {
        setLoading(true);
        setError('');
        try {
            // Check if we signed in via Google or Email
            if (user?.providerData.some(p => p.providerId === 'google.com')) {
                await handleGoogleLogout(auth);
            } else {
                await signOut(auth);
            }
            setIsOtpVerified(false);
            setSuccess('Logged out successfully');
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

        try {
            if (view === 'signup') {
                await handleEmailAuth(email, password, 'signup');
                setSuccess('Account created! Please sign in.');
                setView('signin');
                setPassword('');
            } else if (view === 'signin') {
                // Request OTP
                await handleEmailAuth(email, password, 'signin');
                setView('otp');
            }
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
            setView('signin'); // Slide back to main form
            setSuccess('OTP Verified successfully ✅');
        } catch (err: any) {
            setError(err.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    const toggleView = (e: React.MouseEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setView(view === 'signin' ? 'signup' : 'signin');
    };

    const isGoogleUser = user?.providerData.some(p => p.providerId === 'google.com');
    const isEmailUser = !!user && !isGoogleUser;

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-light p-4 overflow-hidden">
            <div className="material-card w-full max-w-md overflow-hidden bg-white p-8 md:p-10 flex flex-col justify-center relative transition-all duration-500">
                
                {/* Header Section */}
                <div className={`mb-8 transition-opacity duration-300 ${view === 'otp' ? 'opacity-0' : 'opacity-100'}`}>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome to <span className="logo-text">Inspire</span>
                    </h1>
                    <p className="text-gray-500">
                        {isGoogleUser ? 'Connected via Google' : (isEmailUser ? 'Connected via Email' : (view === 'signup' ? 'Create your new account' : 'Please sign in to your account'))}
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
                        /* Sign In / Sign Up Views */
                        <form onSubmit={handleAuthSubmit} className="space-y-4 animate-in fade-in slide-in-from-left-8 duration-500">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                        placeholder="name@example.com"
                                        required
                                        disabled={loading || isEmailUser || isGoogleUser}
                                    />
                                </div>

                                {/* Sliding Password Field for Signup */}
                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${view === 'signup' || isEmailUser ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                        placeholder="••••••••"
                                        required={view === 'signup'}
                                        disabled={loading || isEmailUser || isGoogleUser}
                                    />
                                </div>
                            </div>

                            {view === 'signin' && !isEmailUser && !isGoogleUser && (
                                <div className="flex items-center justify-between py-2">
                                    <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                                        <input type="checkbox" className="mr-2 rounded text-primary focus:ring-primary" />
                                        Remember me
                                    </label>
                                    <a href="#" className="text-sm text-primary hover:underline font-medium">Forgot password?</a>
                                </div>
                            )}

                            <button
                                type={isEmailUser ? "button" : "submit"}
                                onClick={isEmailUser ? onLogout : undefined}
                                disabled={loading || isGoogleUser}
                                className={`w-full py-3 px-4 text-white font-bold rounded-lg transition duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                                    ${isEmailUser ? 'bg-danger hover:bg-red-600' : 'bg-primary hover:bg-blue-600'}`}
                            >
                                {loading ? 'Processing...' : (
                                    isEmailUser ? 'Log out' : (view === 'signup' ? 'Create account' : 'Sign In')
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer Section - Social Sign In */}
                {view !== 'otp' && (
                    <div className=" mt-[-20px] transition-all duration-500">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="flex justify-center transition-all duration-500">
                            <button
                                onClick={user ? onLogout : onGoogleSignIn}
                                disabled={loading || isEmailUser}
                                className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-3" />
                                <span className="text-gray-700 font-medium text-sm">
                                    {isGoogleUser ? 'Log out from Google' : 'Sign in with Google'}
                                </span>
                            </button>
                        </div>

                        {!user && (
                            <p className="mt-8 text-center text-sm text-gray-600">
                                {view === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                                <a 
                                    href="#" 
                                    onClick={toggleView}
                                    className="ml-1 text-primary hover:underline font-medium"
                                >
                                    {view === 'signup' ? 'Sign In' : 'Create an account'}
                                </a>
                            </p>
                        )}
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

export default AuthenticationPage;
