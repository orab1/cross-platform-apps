import { KeyboardTypeOptions } from "react-native";
import { ZodType } from "zod";

export interface FormField<T> {
    name: string;
    defaultValue?: T;
    textContentType?: | 'none'
    | 'emailAddress'
    | 'name'
    | 'telephoneNumber'
    | 'username'
    | 'password'
    | 'newPassword'
    | 'birthdate';
    secureTextEntry?: boolean;
    validation?: ZodType;
    label?: string;
    keyboardType?: KeyboardTypeOptions;
    multiline?: boolean;
}

export const getDefaultValues = (formFields: FormField<string | boolean | number | object>[]) => formFields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue }), {});

export const getResource = async (getFunc: () => Promise<void>, errorMessage: string, { endLoading, startLoading }: { endLoading: (id: number) => void, startLoading: () => number }) => {
    const id = startLoading();

    try {
        await getFunc();
    } catch (error) {
        console.error(errorMessage, error);
        alert(errorMessage);
    } finally {
        endLoading(id);
    }
}