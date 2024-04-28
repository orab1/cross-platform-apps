import { ref as dbRef, set, push } from "firebase/database";
import { db } from "./firebase";
import { getStorage, ref as storageRef, uploadBytes } from "firebase/storage";

interface Review {
    rating: number;
    title: string;
    body: string;
    movieId: number;
    uId: string;
}

export const saveReviewInDB = async (review: Review) => {
    try {
        console.log({review});
        
        await push(dbRef(db, `reviews`), review)
    } catch (error) {
        console.error('Error creating user:', error);
    }
}