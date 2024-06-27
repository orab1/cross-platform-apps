import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useForm, FieldValues, FormProvider } from 'react-hook-form';
import TextField from '../../../Components/TextField';
import { useAuth } from '../../../Providers/auth';
import formFields, { loginSchema } from './formFields';
import { Button } from 'react-native-paper';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { useNavigation } from '@react-navigation/native';
import { getDefaultValues } from '../../../Utils';
import { useLoading } from '../../../Providers/loading';

const Login = () => {
    const { login } = useAuth();
    const { startLoading, endLoading, isLoading } = useLoading();
    const navigation = useNavigation();
    const formMethods = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: getDefaultValues(formFields)
    });


    const handleLogin = async ({ email, password }: FieldValues) => {
        const id = startLoading();
        try {
            await login(email, password);
        } catch (error: FirebaseError | any) {
            error.code === 'auth/user-not-found' && alert('User not found');
            error.code === 'auth/invalid-credential' && alert('Email or password is incorrect');
        } finally {
            endLoading(id);
        }
    }

    return (
        <View style={styles.container}>
            <FormProvider {...formMethods}>
                <View style={styles.formContainer}>
                    <View style={styles.fieldsContainer}>
                        {formFields.map(({ validation, ...field }) =>
                            <View key={field.name}>
                                <TextField
                                    key={field.name}
                                    {...field}
                                />
                            </View>
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button mode="contained" loading={isLoading} onPress={formMethods.handleSubmit(handleLogin)} style={styles.button}>
                            Login
                        </Button>
                        <Text style={styles.signUp} onPress={() => navigation.navigate('Register')}>
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
        alignItems: 'center'
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
        height: '65%',
        width: '100%',
        alignSelf: 'center',
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
        height: '25%',
    }
});

export default Login;