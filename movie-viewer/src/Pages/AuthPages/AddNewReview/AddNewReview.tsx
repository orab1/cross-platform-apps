import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { ScrollView, ScrollViewBase, StyleSheet, View } from 'react-native';
import { AutocompleteDropdown, TAutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';
import { MovieDTO, searchMovies } from '../../../Services/Movies';
import { useEffect, useState } from 'react';
import { useLoading } from '../../../Providers/loading';
import MoviesAutoComplete from './MoviesAutoComplete';
import TextField from '../../../Components/TextField';
import { addNewReviewValidationSchema, movieField, ratingField, reviewBodyField, reviewTitleField } from './formFields';
import { Button } from 'react-native-paper';
import { zodResolver } from '@hookform/resolvers/zod';
import { saveReviewInDB } from '../../../Services/Reviews';
import { useAuth } from '../../../Providers/auth';
import { getDefaultValues } from '../../../Utils';

interface AddNewReviewSubmitProps {
    rating: number;
    movie: TAutocompleteDropdownItem;
    reviewTitle: string;
    reviewBody: string;
}

const AddNewReview: React.FC = () => {
    const formMethods = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        resolver: zodResolver(addNewReviewValidationSchema),
        defaultValues: getDefaultValues([ratingField, reviewBodyField, reviewTitleField, movieField])
    });
    const { isLoading, endLoading, startLoading } = useLoading();
    const { user } = useAuth();
    const { validation: ratingValidation, ...ratingFieldProps } = ratingField;
    const { validation: titleValidation, ...reviewTitleFieldProps } = reviewTitleField;
    const { validation: bodyValidation, ...reviewBodyFieldProps } = reviewBodyField;

    console.log(formMethods.formState.errors);


    const postReview = async ({ rating, movie: { id }, reviewTitle, reviewBody }: AddNewReviewSubmitProps) => {
        const loadingId = startLoading();
        try {
            console.log({ rating, movie: { id }, title: reviewTitle, body: reviewBody });

            if (!user) throw new Error('User not found');
            await saveReviewInDB({ rating, movieId: parseInt(id), title: reviewTitle, body: reviewBody, uId: user?.uid });

        } catch (error) {
            console.error(error);
            alert('An error occurred while posting your review');
        } finally {
            endLoading(loadingId);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.formContainer}>
                <FormProvider {...formMethods}>
                    <MoviesAutoComplete />
                    <View style={styles.fieldsContainer}>
                        <TextField style={styles.textField} {...ratingFieldProps} />
                        <TextField style={styles.textField} {...reviewTitleFieldProps} />
                        <TextField style={styles.body} {...reviewBodyFieldProps} />
                    </View>
                    <Button mode="contained" onPress={formMethods.handleSubmit(postReview)} style={styles.button}>
                        Post my review
                    </Button>
                </FormProvider>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 30,
    },
    formContainer: {
        height: '80%',
        width: '90%',
        minHeight: 160,
        alignItems: 'center',
        flex: 1,
    },
    fieldsContainer: {
        width: '100%',
    },
    buttonContainer: {
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
    },
    button: {
        width: '100%',
        marginTop: 20,
    },
    signUp: {
        marginTop: 20,
        color: 'blue',
    },
    helperText: {
        width: '100%',
        textAlign: 'center',
    },
    textField: {
        width: '100%',
        marginTop: 20
    },
    body: {
        marginTop: 20,
        width: '100%',
        height: 200,
    }
});

export default AddNewReview;