import { ref as dbRef, push, query, orderByChild, onValue, remove, set, get } from "firebase/database";
import { db } from "./firebase";
import { Dispatch } from "react";
import { uploadPicture } from "./Pictures";
import { KeyboardAvoidingView } from "react-native";

export interface Review {
    rating: number;
    title: string;
    body: string;
    movieId: number;
    uId: string;
    timestamp?: Date | number;
    id?: string;
    imageUri?: string;
}

export const saveReviewInDB = async (review: Review) => {
    try {
        await push(dbRef(db, `reviews`), { ...review, timestamp: Date.now() })
    } catch (error) {
        console.error('Error creating user:', error);
    }
}


export const subscribeToLatestReviews = (setData: Dispatch<React.SetStateAction<Record<string, Review>>>) => {
    try {
        const reviewsRef = query(dbRef(db, 'reviews'), orderByChild('timestamp'));

        return onValue(reviewsRef, (snapshot) => {
            const reviews = snapshot.val() as { [key: string]: Review };
            setData(() => reviews || {});
        }, error => console.error('Error getting latest reviews', error));
    } catch (error) {
        console.error('Error getting latest reviews', error);
    }
}

export const deleteReviewById = async (reviewId: string) => {
    try {
        await remove(dbRef(db, `reviews/${reviewId}`));
    } catch (error) {
        console.error('Error deleting review:', error);
    }
}

const uploadReviewPicture = async (uri: string, id: string) => uploadPicture(uri, `${id}`);

export const upsertReview = async (review: Review, reviewId?: string) => {
    try {
        if (reviewId) {
            review.imageUri && await uploadReviewPicture(review.imageUri, reviewId!);
            await set(dbRef(db, `reviews/${reviewId}`), review);

            return reviewId;
        } else {
            const { key } = await push(dbRef(db, `reviews`));
            review.imageUri && await uploadReviewPicture(review.imageUri, key!);
            await set(dbRef(db, `reviews/${key}`), { ...review, timestamp: Date.now() });

            return key;
        }
    } catch (error) {
        console.error('Error creating/editing review:', error);
    }
}

export const getReviewById = async (reviewId: string) => {
    const review = await get(dbRef(db, `reviews/${reviewId}`));

    return review.val() as Review;
}