import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, Timestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export interface UserSubmission {
    id: string; // id is mandatory for existing items
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

/**
 * Delete a user submission from Firestore
 * @param id - Document ID
 */
export async function deleteUser(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, 'valentine-submissions', id));
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user');
    }
}

/**
 * Update a user's quiz score in Firestore
 * @param id - Document ID
 * @param score - New quiz score
 */
export async function updateUserScore(id: string, score: number): Promise<void> {
    try {
        const userRef = doc(db, 'valentine-submissions', id);
        await updateDoc(userRef, {
            quizScore: score
        });
    } catch (error) {
        console.error('Error updating user score:', error);
        throw new Error('Failed to update score');
    }
}
