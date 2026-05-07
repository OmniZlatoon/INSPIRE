import { Auth, signInWithCustomToken } from 'firebase/auth';

/**
 * Verifies the OTP with the backend and signs in the user with a custom token.
 * 
 * @param auth - The Firebase Auth instance.
 * @param email - The user's email address.
 * @param otp - The 6-digit OTP code.
 * @returns A promise that resolves to the user credentials.
 */
export const handleVerifyOTP = async (auth: Auth, email: string, otp: string): Promise<any> => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
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
