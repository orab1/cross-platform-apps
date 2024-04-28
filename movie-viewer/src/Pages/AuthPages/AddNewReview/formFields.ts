import { z } from "zod";
import { FormField } from "../../../Utils";
import { TAutocompleteDropdownItem } from "react-native-autocomplete-dropdown";

export const ratingField = {
    name: 'rating',
    label: 'Rating (1-10)',
    defaultValue: '',
    textContentType: 'none',
    keyboardType: 'numeric',
    validation: z.string().regex(/^[1-9]|10$/, 'Rating must be between 1 and 10')
}

export const reviewTitleField = {
    name: 'reviewTitle',
    label: 'Review Title',
    defaultValue: '',
    textContentType: 'none',
    keyboardType: 'default',
    validation: z.string().optional()
}


export const reviewBodyField = {
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
        id: z.string().regex(/^[1-9]|10$/, 'Rating must be between 1 and 10'),
        title: z.string().min(1, 'Movie must be selected')
    })
}


export const formFields: Record<string, FormField<object | string | TAutocompleteDropdownItem>> = { ratingField, reviewTitleField, reviewBodyField, movieField }
export const addNewReviewValidationSchema = z.object({
    ...Object.keys(formFields).reduce((acc, keys) => ({ ...acc, [formFields[keys].name]: formFields[keys].validation }), {})
})