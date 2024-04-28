import { ErrorMessage } from "@hookform/error-message";
import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form"
import { KeyboardTypeOptions, StyleSheet } from "react-native";
import { HelperText, TextInput } from "react-native-paper"

export interface TextFieldProps extends React.ComponentProps<typeof TextInput> {
    name: string;
    style?: any;
    defaultValue?: string;
    label?: string;
    textContentType: | 'none'
    | 'emailAddress'
    | 'name'
    | 'telephoneNumber'
    | 'username'
    | 'password'
    | 'newPassword'
    | 'birthdate';
    keyboardType?: KeyboardTypeOptions,
    secureTextEntry: boolean
}

const TextField: FC<TextFieldProps> = ({ name, style, label, textContentType = 'none', keyboardType = 'default', secureTextEntry = false, ...props }: TextFieldProps) => {
    const { formState: { errors } } = useFormContext();
    return (
        <>
            <Controller
                name={name}
                render={({ field: { onChange, value, onBlur, name } }) => (
                    <TextInput
                        textContentType={textContentType}
                        label={label || name}
                        value={value}
                        onChangeText={onChange}
                        style={style}
                        onBlur={onBlur}
                        keyboardType={keyboardType}
                        secureTextEntry={secureTextEntry}
                        {...props}
                    />
                )}
            />
            {errors[name] &&
                <ErrorMessage
                    name={name}
                    render={({ message }) =>
                        <HelperText style={styles.helperText} type="error">{message}</HelperText>}
                />
            }
        </>
    )
}

const styles = StyleSheet.create({
    helperText: {
        minHeight: 20,
        lineHeight: 10
    }
})

export default TextField