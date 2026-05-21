'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Auth, signInWithCustomToken } from 'firebase/auth';

/**
 * Verifies the OTP with the backend and signs in the user with a custom token.
 */
export const handleVerifyOTP = async (auth: Auth, email: string, otp: string): Promise<any> => {
    try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? '');
        const response = await fetch(`${apiUrl}/api/inspire/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'OTP verification failed');
        }

        if (!data.customToken) {
            throw new Error('No custom token returned from backend');
        }

        // Sign in with the custom token provided by the backend
        const userCredential = await signInWithCustomToken(auth, data.customToken);
        console.log('Successfully signed in with custom token ✅', userCredential.user);
        
        return {
            user: userCredential.user,
            backendData: data
        };
    } catch (error: any) {
        console.error('OTP Verification Error:', error);
        throw error;
    }
};

interface OTPverifyProps {
    email: string;
    loading: boolean;
    onVerify: (otp: string) => void;
    onResend: () => void;
}

const OTPverify: React.FC<OTPverifyProps> = ({ email, loading, onVerify, onResend }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Focus first input on mount
        if (inputs.current[0]) {
            inputs.current[0].focus();
        }
    }, []);

    const handleChange = (value: string, index: number) => {
        if (value && !/^[a-zA-Z0-9]+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1).toUpperCase();
        setOtp(newOtp);

        if (value && index < 5 && inputs.current[index + 1]) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0 && inputs.current[index - 1]) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text').slice(0, 6).toUpperCase();
        if (!/^[A-Z0-9]+$/.test(data)) return;

        const newOtp = [...otp];
        data.split('').forEach((char, index) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtp(newOtp);
        
        const nextIndex = Math.min(data.length, 5);
        inputs.current[nextIndex]?.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullOtp = otp.join('');
        if (fullOtp.length === 6) {
            onVerify(fullOtp);
        }
    };

    return (
        <div className="flex flex-col space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Admin OTP</h2>
                <p className="text-sm text-gray-500">
                    Secure code sent to <span className="font-medium text-gray-700">{email}</span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            inputMode="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            ref={(el) => { inputs.current[index] = el; }}
                            className="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none transition-all"
                            disabled={loading}
                        />
                    ))}
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onResend}
                        disabled={loading}
                        className="text-sm text-primary hover:underline font-medium disabled:opacity-50"
                    >
                        Resend OTP
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading || otp.join('').length < 6}
                    className="w-full py-3 px-4 bg-primary text-white font-bold rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Verifying...' : 'Verify Admin Access'}
                </button>
            </form>
        </div>
    );
};

export default OTPverify;
