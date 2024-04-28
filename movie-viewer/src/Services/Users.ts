import { ref as dbRef, set } from "firebase/database";
import { db } from "./firebase";
import { getStorage, ref as storageRef, uploadBytes} from "firebase/storage";

interface User {
    name: { first: string, last: string };
    email: string;
    uId: string;
    imageUri: string;
}

const uriToBlob = async (uri: string) => {
    const response = await fetch(uri);
    return response.blob();
};

const uploadProfilePicture = async (uri: string, uId: string) => {
    try {
        const profilePictureBlob = await uriToBlob(uri);
        const profilePicturesRef = storageRef(getStorage(), `profilePictures/${uId}`);

        await uploadBytes(profilePicturesRef, profilePictureBlob, { contentType: 'image/jpeg' });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
    }

}

export const createUserInDB = async ({ imageUri, uId, ...user }: User) => {
    try {
        await uploadProfilePicture(imageUri, uId);
        await set(dbRef(db, `users/${uId}`), { uId, ...user });
    } catch (error) {
        console.error('Error creating user:', error);
    }
}