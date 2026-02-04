import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';

export interface UserSubmission {
    id?: string;
    name: string;
    photoURL: string;
    quizScore?: number; // Score out of 100 (5 questions × 20 points)
    timestamp: Timestamp;
}

/**
 * Save user data to Firestore (with base64 photo stored directly)
 * This is a simpler approach that doesn't require Firebase Storage
 * @param name - User's name
 * @param photoBase64 - Base64 encoded photo (required)
 * @param quizScore - Quiz score out of 100 (optional)
 * @returns Promise with the document ID
 */
export async function saveUserToFirebase(name: string, photoBase64: string, quizScore?: number): Promise<string> {
    try {
        // Save to Firestore with base64 photo and quiz score
        const docRef = await addDoc(collection(db, 'valentine-submissions'), {
            name,
            photoURL: photoBase64,
            quizScore: quizScore || 0,
            timestamp: Timestamp.now(),
        });

        return docRef.id;
    } catch (error) {
        console.error('Error saving user to Firebase:', error);
        throw new Error('Failed to save user data');
    }
}

/**
 * Get all user submissions from Firestore
 * @returns Promise with array of user submissions
 */
export async function getAllUsers(): Promise<UserSubmission[]> {
    try {
        const q = query(collection(db, 'valentine-submissions'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);

        const users: UserSubmission[] = [];
        querySnapshot.forEach((doc) => {
            users.push({
                id: doc.id,
                ...doc.data(),
            } as UserSubmission);
        });

        return users;
    } catch (error) {
        console.error('Error getting users:', error);
        throw new Error('Failed to fetch user data');
    }
}
