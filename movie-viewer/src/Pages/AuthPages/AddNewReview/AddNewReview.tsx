import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TAutocompleteDropdownItem } from 'react-native-autocomplete-dropdown';

import { useLoading } from '../../../Providers/loading';
import MoviesAutoComplete from './MoviesAutoComplete';
import TextField from '../../../Components/TextField';
import { addNewReviewValidationSchema, convertReviewToSubmitProps, imageGalleryPickerUri, movieField, ratingField, reviewBodyField, reviewTitleField } from './formFields';
import { Button, Text } from 'react-native-paper';
import { zodResolver } from '@hookform/resolvers/zod';
import { Review, upsertReview } from '../../../Services/Reviews';
import { useAuth } from '../../../Providers/auth';
import { getDefaultValues } from '../../../Utils';
import { useNavigation } from '@react-navigation/native';
import { PopulatedReview } from '../Feed/ReviewCard';
import ImageGalleryPicker from '../../../Components/ImageGalleryPicker';
import { CacheKey, useCache } from '../../../Providers/cache';

export interface AddNewReviewSubmitProps {
    rating: number;
    movie: TAutocompleteDropdownItem;
    reviewTitle: string;
    reviewBody: string;
    picture: string;
}

const convertOriginalReviewToDefaultValues = (review: PopulatedReview): TAutocompleteDropdownItem => ({
    id: `${review.movie.id}`,
    title: review.movie.original_title
});

const AddNewReview: React.FC<{ route: { params: { isEdit: boolean, review?: PopulatedReview } } }> = ({ route: { params = { isEdit: false, review: null } } }) => {
    const { isEdit, review: originalReview } = params;
    const formMethods = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        resolver: zodResolver(addNewReviewValidationSchema),
        defaultValues: !isEdit ?
            getDefaultValues([ratingField, reviewBodyField, reviewTitleField, imageGalleryPickerUri, (originalReview?.movie ? { name: movieField.name, defaultValue: convertOriginalReviewToDefaultValues(originalReview!) } : movieField)]) :
            convertReviewToSubmitProps(originalReview!)
    });
    const { endLoading, startLoading, isLoading } = useLoading();
    const { user } = useAuth();
    const { updateCache } = useCache();
    const navigation = useNavigation();
    const { validation: ratingValidation, ...ratingFieldProps } = ratingField;
    const { validation: titleValidation, ...reviewTitleFieldProps } = reviewTitleField;
    const { validation: bodyValidation, ...reviewBodyFieldProps } = reviewBodyField;

    const postReview = async ({ rating, movie: { id }, reviewTitle, reviewBody, picture }: FieldValues) => {
        const loadingId = startLoading();

        try {
            if (!user) throw new Error('User not found');
            const newReview = {
                rating,
                movieId: parseInt(id),
                title: reviewTitle,
                body: reviewBody,
                uId: user?.uId,
                imageUri: picture
            }
            const newReviewId = await upsertReview(newReview, isEdit ? originalReview?.id : undefined);
            await updateCache(newReviewId as CacheKey, 'review', newReview);
            setTimeout(() => updateCache(newReviewId as CacheKey, 'image'), 2000);
            alert(`Review ${isEdit ? 'edited' : 'posted'} successfully`);
            navigation.goBack()
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
                    <MoviesAutoComplete defaultValue={!originalReview?.movie ? movieField.defaultValue : { id: `${originalReview?.movie.id}`, title: originalReview?.movie.original_title }} disable={Boolean(originalReview?.movie)} />
                    <View style={styles.fieldsContainer}>
                        <TextField style={styles.textField} {...ratingFieldProps} />
                        <TextField style={styles.textField} {...reviewTitleFieldProps} />
                        <TextField style={styles.body} {...reviewBodyFieldProps} />
                    </View>
                    <Text>
                        Put a picture of your review, you dont have to but it would be nice
                    </Text>
                    <ImageGalleryPicker name={imageGalleryPickerUri.name} width={350} isProfile={false} />
                    <Button loading={isLoading} mode="contained" onPress={formMethods.handleSubmit(postReview)} style={styles.button}>
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