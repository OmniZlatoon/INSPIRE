import { Auth, GoogleAuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';

/**
 * Handles Google sign-in flow following Firebase documentation best practices.
 * 
 * Flow:
 * 1. Sign in with Google using a popup.
 * 2. Retrieve the Google ID Token from the credential.
 * 3. Retrieve the Firebase ID Token (exchanged/generated for the authenticated user).
 * 4. Send the Firebase ID Token to the backend for verification and user sync.
 * 
 * @param auth - The Firebase Auth instance.
 * @param googleProvider - The Google Auth provider instance.
 * @returns A promise that resolves to the user credential and backend response.
 */
export const handleGoogleSignIn = async (auth: Auth, googleProvider: GoogleAuthProvider) => {
    try {
        // 1. Sign in with Google Popup
        const result: UserCredential = await signInWithPopup(auth, googleProvider);

        // 2. Obtain Google ID Token from the credential (if needed for other purposes)
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) {
            throw new Error('Google authentication failed: No credentials obtained');
        }

        // Note: For backend verification using Firebase Admin SDK, we use the Firebase ID Token.
        // result.user.getIdToken() provides this.

        // 3. Obtain the Firebase ID Token
        const firebaseIdToken = await result.user.getIdToken();
        console.log('Firebase ID Token obtained for backend verification');

        // 4. Verify across the backend
        // This endpoint handles both registration (if new) and login (if existing)
        const response = await fetch('http://localhost:5000/api/inspire/google', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${firebaseIdToken}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Backend validation failed');
        }

        console.log('Google Sign-in successful and verified by backend ✅');
        return { user: result.user, backendData: data };
    } catch (error: any) {
        console.error('Google Sign-in Error:', error);
        throw error;
    }
};
