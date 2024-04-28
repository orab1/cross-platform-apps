import { ZodType } from "zod";

export interface FormField<T> {
    name: string;
    defaultValue?: T;
    textContentType?: string;
    secureTextEntry?: boolean;
    validation?: ZodType;
    label?: string;
    keyboardType?: string;
}

export const getDefaultValues = (formFields: FormField<string | boolean | number | object>[]) => formFields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue }), {});