import { z } from "zod";
import { FormField } from "../../../Utils";

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
    },
    {
        name: 'password',
        label: 'Password',
        defaultValue: '',
        textContentType: 'password',
        secureTextEntry: true,
        validation: z.string()
            .min(6, 'password must be at least 6 characters long')
            .regex(/^(?=.*[a-zA-Z])(?=.*\d).*$/, 'Password must contain at least one letter and one number')
    },
    {
        name: 'confirmPassword',
        label: 'Confirm Password',
        defaultValue: '',
        textContentType: 'password',
        secureTextEntry: true,
        validation: z.string()
            .min(6, 'password must be at least 6 characters long')
            .regex(/^(?=.*[a-zA-Z])(?=.*\d).*$/, 'Password must contain at least one letter and one number')
    },
];

export const ImageGalleryPickerUri: FormField<string> = {
    name: 'profilePicture',
    label: 'Profile Picture',
    defaultValue: '',
    validation: z.string({ message: 'You have to enter a profile picture' }).min(1)
}

export const registerSchema = z
    .object([...formTextFields, ImageGalleryPickerUri].reduce((acc, field) => ({ ...acc, [field.name]: field.validation }), {}))
    .required()
    .refine(({ password, confirmPassword }: any) => password === confirmPassword,
        {
            message: 'Passwords do not match',
            path: ['confirmPassword']
        });

export default formTextFields;