import { z } from "zod";
import { FormField } from "../../../Utils";
import { User } from "../../../Services/Users";

const formTextFields: FormField<string>[] = [
    {
        name: 'firstName',
        label: 'First Name',
        defaultValue: '',
        textContentType: 'name',
        keyboardType: 'default',
        validation: z.string()
            .min(2, 'First name must be at least 2 characters long')
            .regex(/^[a-zA-Z]+$/, 'First name must contain only letters')
    },
    {
        name: 'lastName',
        label: 'Last Name',
        defaultValue: '',
        textContentType: 'name',
        keyboardType: 'default',
        validation: z.string()
            .min(2, 'Last name must be at least 2 characters long')
            .regex(/^[a-zA-Z]+$/, 'Last name must contain only letters')
    },
    {
        name: 'email',
        label: 'Email',
        defaultValue: '',
        textContentType: 'emailAddress',
        keyboardType: 'email-address',
        validation: z.string().email()
    }
];

export const ImageGalleryPickerUri: FormField<string> = {
    name: 'profilePicture',
    label: 'Profile Picture',
    defaultValue: '',
    validation: z.string({ message: 'You have to enter a profile picture' }).min(1)
}

export const registerSchema = z
    .object([ImageGalleryPickerUri, ...formTextFields].reduce((acc, field) => ({ ...acc, [field.name]: field.validation }), {}))
    .required()
    .refine(({ password, confirmPassword }: any) => password === confirmPassword,
        {
            message: 'Passwords do not match',
            path: ['confirmPassword']
        });

export const convertAuthUserToDefaultValues = ({ name: { first, last }, email, imageUri }: User) =>
({
    firstName: first,
    lastName: last,
    email,
    profilePicture: imageUri
})

export default formTextFields;