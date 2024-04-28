import { z } from "zod";
import { FormField } from "../../../Utils";

const formFields: FormField[] = [
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
            .min(6, 'password must be at least 6 charecters long')
            .regex(/^(?=.*[a-zA-Z])(?=.*\d).*$/, 'Password must contain at least one letter and one number')
    },
];

export const loginSchema = z.object(formFields.reduce((acc, field) => ({ ...acc, [field.name]: field.validation }), {})).required();

export default formFields;