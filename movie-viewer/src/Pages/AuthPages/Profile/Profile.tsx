import TextField from '../../../Components/TextField';
import { useAuth } from '../../../Providers/auth';
import formTextFields, { convertAuthUserToDefaultValues, ImageGalleryPickerUri, registerSchema } from './formFields';
import { Button } from 'react-native-paper';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import ImageGalleryPicker from '../../../Components/ImageGalleryPicker';
import { useLoading } from '../../../Providers/loading';
import { setUserInDB } from '../../../Services/Users';
import { useCache } from '../../../Providers/cache';


const Profile = () => {
    const { user, logout } = useAuth();
    const { startLoading, endLoading, isLoading } = useLoading();
    const { updateCache } = useCache();
    const formMethods = useForm({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: convertAuthUserToDefaultValues(user!)
    });

    const handleRegister = async ({ email, firstName, lastName, profilePicture }: FieldValues) => {
        const id = startLoading();

        try {
            await setUserInDB({ uId: user?.uId, email, name: { first: firstName, last: lastName }, imageUri: profilePicture });
            await updateCache(user?.uId!!, 'user')
            await updateCache(user?.uId!!, 'image')
            alert('Profile updated successfully');
        } catch (error: FirebaseError | any) {
            if (error.code === 'auth/email-already-in-use') alert('Email already in use');
            else if (error.code === 'auth/invalid-email') alert('Invalid email');
            else alert('An error occurred while registering');
        } finally {
            endLoading(id);
        }
    }

    const handleLogout = async () => {
        try {
            logout();
        } catch (error) {
            alert('An error occurred while logging out');
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <FormProvider {...formMethods}>
                <View style={styles.formContainer}>
                    <ImageGalleryPicker isProfile={true} name={ImageGalleryPickerUri.name} />
                    <View style={styles.fieldsContainer}>
                        {formTextFields.map(({ validation, ...field }) =>
                            <View
                                style={styles.textField}
                                key={field.name}>
                                <TextField
                                    {...field}
                                />
                            </View>
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button mode="contained" loading={isLoading} onPress={formMethods.handleSubmit(handleRegister)} style={styles.button}>
                            Save chages in profile
                        </Button>
                        <Button mode="contained" onPress={handleLogout} style={styles.button}>
                            Logout
                        </Button>
                    </View>
                </View>
            </FormProvider>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    formContainer: {
        height: '80%',
        width: '90%',
        marginTop: 20,
        minHeight: 160,
        alignItems: 'center',
        flex: 1,
    },
    fieldsContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 30,
        marginBottom: 40
    },
    helperText: {
        minHeight: 20,
        lineHeight: 10
    },
    button: {
        width: '90%',
        marginBottom: 5
    },
    signUp: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    buttonContainer: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '10%',
    },
    textField: {
        width: '100%',
        marginBottom: 10
    }
});

export default Profile;