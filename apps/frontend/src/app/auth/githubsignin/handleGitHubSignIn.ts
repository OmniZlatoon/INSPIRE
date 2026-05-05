import { Auth, GithubAuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';

/**
 * Handles GitHub sign-in flow following Firebase documentation best practices.
 * 
 * @param auth - The Firebase Auth instance.
 * @param githubProvider - The GitHub Auth provider instance.
 * @returns A promise that resolves to the user credential and backend response.
 */
export const handleGitHubSignIn = async (auth: Auth, githubProvider: GithubAuthProvider) => {
    try {
        // 1. Sign in with GitHub Popup
        const result: UserCredential = await signInWithPopup(auth, githubProvider);
        
        // 2. Obtain the Firebase ID Token
        const firebaseIdToken = await result.user.getIdToken();
        console.log('Firebase ID Token obtained for GitHub backend verification');

        // 3. Verify across the backend
        const response = await fetch('http://localhost:5000/api/inspire/github', {
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

        console.log('GitHub Sign-in successful and verified by backend ✅');
        return { user: result.user, backendData: data };
    } catch (error: any) {
        console.error('GitHub Sign-in Error:', error);
        throw error;
    }
};
