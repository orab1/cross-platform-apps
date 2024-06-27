import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage";

const uriToBlob = async (uri: string) => {
    const response = await fetch(uri);
    return response.blob();
};

export const uploadPicture = async (uri: string, route: string) => {
    try {
        const profilePictureBlob = await uriToBlob(uri);
        const profilePicturesRef = storageRef(getStorage(), `platform-images/${route}`);

        await uploadBytes(profilePicturesRef, profilePictureBlob, { contentType: 'image/jpeg' });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
    }
}

export const getPicture = async (route: string) => {    
    try {
        const picturesRef = storageRef(getStorage(), `platform-images/${route}`);
        const downloadUrl = await getDownloadURL(picturesRef);

        return downloadUrl;
    } catch (error) {
        console.error('Error retrieving picture:', error);
        return '';
    }
}
