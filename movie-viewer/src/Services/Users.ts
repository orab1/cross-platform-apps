import { ref as dbRef, get, set } from "firebase/database";
import { db } from "./firebase";
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage";
import { getPicture, uploadPicture } from "./Pictures";

export interface User {
    name: { first: string, last: string };
    email: string;
    uId: string;
    imageUri?: string;
}

const uploadProfilePicture = async (uri: string, uId: string) => uploadPicture(uri, `${uId}`);

export const getUserPicture = (uId: string) => getPicture(`${uId}`);

export const setUserInDB = async ({ imageUri, uId, ...user }: Partial<User>) => {
    try {
        await set(dbRef(db, `users/${uId}`), { uId, ...user });
        imageUri && await uploadProfilePicture(imageUri!, uId!);
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

export const getUserById = async (uId: string) => {
    const user = await get(dbRef(db, `users/${uId}`));

    return user.val() as User;
}