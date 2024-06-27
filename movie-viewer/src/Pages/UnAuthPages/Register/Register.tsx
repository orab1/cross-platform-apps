import TextField from '../../../Components/TextField';
import { useAuth } from '../../../Providers/auth';
import formTextFields, { ImageGalleryPickerUri, registerSchema } from './formFields';
import { Button, Text } from 'react-native-paper';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ImageGalleryPicker from '../../../Components/ImageGalleryPicker';
import { getDefaultValues } from '../../../Utils';
import { useLoading } from '../../../Providers/loading';


const Register = () => {
    const navigation = useNavigation();
    const { register } = useAuth();
    const { startLoading, endLoading, isLoading } = useLoading();
    const formMethods = useForm({
        resolver: zodResolver(registerSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: getDefaultValues([...formTextFields, ImageGalleryPickerUri])
    });

    const handleRegister = async ({ email, password, firstName, lastName, profilePicture }: FieldValues) => {
        const id = startLoading();
        try {
            await register(email, password, { first: firstName, last: lastName }, profilePicture);
        } catch (error: FirebaseError | any) {
            if (error.code === 'auth/email-already-in-use') alert('Email already in use');
            else if (error.code === 'auth/invalid-email') alert('Invalid email');
            else alert('An error occurred while registering');
        } finally {
            endLoading(id);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <FormProvider {...formMethods}>
                <View style={styles.formContainer}>
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
                        <ImageGalleryPicker name={ImageGalleryPickerUri.name} isProfile={true} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button mode="contained" loading={isLoading} onPress={formMethods.handleSubmit(handleRegister)} style={styles.button}>
                            Register
                        </Button>
                        <Text style={styles.signUp} onPress={() => navigation.navigate('Login')}>
                            Back to login
                        </Text>
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
        width: '90%'
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

export default Register;