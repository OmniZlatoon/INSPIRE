/**
 * Handles email and password authentication by calling the backend API.
 * 
 * @param email - The user's email address.
 * @param password - The user's password.
 * @param action - 'signin' or 'signup'.
 * @returns A promise that resolves to the backend response.
 */
export const handleEmailAuth = async (email: string, password: string, action: 'signin' | 'signup'): Promise<any> => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/inspire/${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `${action} failed`);
        }

        console.log(`${action} request successful:`, data);
        return data;
    } catch (error: any) {
        console.error(`${action} Error:`, error);
        throw error;
    }
};
