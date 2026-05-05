import { Auth, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';

/**
 * Handles email and password sign-in using Firebase Authentication.
 * 
 * @param auth - The Firebase Auth instance.
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise that resolves to the UserCredential on success.
 */
export const handleEmailSignIn = async (auth: Auth, email: string, password: string): Promise<UserCredential> => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log('Email sign-in successful:', result.user);
        return result;
    } catch (error: any) {
        console.error('Email Sign-in Error:', error);
        throw error;
    }
};
