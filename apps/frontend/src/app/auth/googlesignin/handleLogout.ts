import { Auth, signOut } from 'firebase/auth';

/**
 * Handles the logout flow for Google and Firebase.
 * 
 * Flow:
 * 1. Get the current Firebase ID token.
 * 2. Send it to the backend /logout endpoint to revoke refresh tokens.
 * 3. Call Firebase signOut() to clear the client-side session.
 * 
 * @param auth - The Firebase Auth instance.
 * @returns A promise that resolves when logout is complete.
 */
export const handleLogout = async (auth: Auth) => {
    try {
        const user = auth.currentUser;
        
        if (user) {
            // 1. Obtain the Firebase ID Token for backend verification
            const firebaseIdToken = await user.getIdToken();

            // 2. Notify the backend to revoke tokens
            console.log('Notifying backend to revoke tokens...');
            const response = await fetch('http://localhost:5000/api/inspire/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${firebaseIdToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.warn('Backend logout warning:', errorData.error || 'Failed to revoke tokens on backend');
                // We continue with client-side sign out even if backend fails
            } else {
                console.log('Backend tokens revoked successfully ✅');
            }
        }

        // 3. Sign out from Firebase client-side
        await signOut(auth);
        
        // 4. Explicitly clear local storage and session storage to remove any stale auth state
        localStorage.clear();
        sessionStorage.clear();
        
        console.log('Firebase client-side sign-out and storage clearing complete ✅');
        
    } catch (error: any) {
        console.error('Logout Error:', error);
        throw error;
    }
};
