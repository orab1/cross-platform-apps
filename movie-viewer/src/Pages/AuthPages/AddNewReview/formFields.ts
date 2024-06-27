import { z } from "zod";
import { FormField } from "../../../Utils";
import { TAutocompleteDropdownItem } from "react-native-autocomplete-dropdown";
import { Review } from "../../../Services/Reviews";
import { AddNewReviewSubmitProps } from "./AddNewReview";
import { PopulatedReview } from "../Feed/ReviewCard";

export const ratingField: FormField<string> = {
    name: 'rating',
    label: 'Rating (1-10)',
    defaultValue: '',
    textContentType: 'none',
    keyboardType: 'numeric',
    validation: z.string().regex(/^(?:[1-9]|10)$/, 'Rating must be between 1 and 10')
}

export const reviewTitleField: FormField<string> = {
    name: 'reviewTitle',
    label: 'Review Title',
    defaultValue: '',
    textContentType: 'none',
    keyboardType: 'default',
    validation: z.string().optional()
}


export const reviewBodyField :FormField<string> = {
    name: 'reviewBody',
    label: 'Review Body',
    defaultValue: '',
    textContentType: 'none',
    keyboardType: 'default',
    multiline: true,
    validation: z.string().optional()
}

export const movieField: FormField<TAutocompleteDropdownItem> = {
    name: 'movie',
    label: 'Movie',
    defaultValue: { id: '', title: '' } as TAutocompleteDropdownItem,
    textContentType: 'name',
    keyboardType: 'default',
    validation: z.object({
        id: z.string(),
        title: z.string().min(1, 'Movie must be selected')
    })
}

export const imageGalleryPickerUri: FormField<string> = {
    name: 'picture',
    label: 'Profile Picture',
    defaultValue: '',
    validation: z.string({ message: 'You have to enter a profile picture' }).optional()
}

export const formFields: Record<string, FormField<object | string | TAutocompleteDropdownItem>> = { ratingField, reviewTitleField, reviewBodyField, movieField, imageGalleryPickerUri }
export const addNewReviewValidationSchema = z.object({
    ...Object.keys(formFields).reduce((acc, keys) => ({ ...acc, [formFields[keys].name]: formFields[keys].validation }), {})
})
export const convertReviewToSubmitProps = ({ rating, title, body, movie: { original_title, id }, imageUri }: PopulatedReview): AddNewReviewSubmitProps => ({
    rating,
    reviewTitle: title,
    reviewBody: body,
    movie: {
        id: `${id}`,
        title: original_title
    },
    picture: imageUri!
})
