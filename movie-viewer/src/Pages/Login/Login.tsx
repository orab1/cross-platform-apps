import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useForm, FieldValues, FormProvider } from 'react-hook-form';
import TextField from '../../Components/TextField';
import { useAuth } from '../../Providers/auth';
import formFields, { loginSchema } from './formFields';
import { Button, HelperText } from 'react-native-paper';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@hookform/error-message';
import { FirebaseError } from 'firebase/app';

const Login = () => {
    const formMethods = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });

    const { login } = useAuth();

    const handleLogin = async ({ email, password }: FieldValues) => {
        try {
            await login(email, password);
        } catch (error: FirebaseError | any) {
            error.code === 'auth/user-not-found' && alert('User not found');
            error.code === 'auth/invalid-credential' && alert('Email or password is incorrect');
        }
    }

    return (
        <View style={styles.container}>
            <FormProvider {...formMethods}>
                <View style={styles.formContainer}>
                    <View style={styles.fieldsContainer}>
                        {formFields.map((field) =>
                            <>
                                <TextField
                                    key={field.name}
                                    {...field}
                                />
                                <ErrorMessage
                                    name={field.name}
                                    render={({ message }) =>
                                        <HelperText type="error">{message}</HelperText>}
                                />
                            </>
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button mode="contained" onPress={formMethods.handleSubmit(handleLogin)} style={styles.button}>
                            Login
                        </Button>
                        <Text style={styles.signUp} >
                            Don't have an account? Sign up
                        </Text>
                    </View>
                </View>
            </FormProvider>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        height: '35%',
        width: '90%',
        justifyContent: 'space-between',
        minHeight: 160,
        alignItems: 'center',
    },
    fieldsContainer: {
        justifyContent: 'space-between',
        height: '50%',
        width: '100%',
    },
    button: {
        width: '90%'
        //marginTop: 20,
    },
    signUp: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    buttonContainer: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '25%',
    }
});

export default Login;