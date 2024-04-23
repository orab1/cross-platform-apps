import { Control, Controller, FieldValues } from "react-hook-form"
import { TextInput, TextInputIconProps } from "react-native-paper"

export interface TextFieldProps {
    control: Control<FieldValues, any>;
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
    keyboardType?: string,
    secureTextEntry: boolean
}

const TextField = ({ name, style, defaultValue = '', label, textContentType = 'none', keyboardType, secureTextEntry = false }: TextFieldProps) => {
    return (
        <Controller
            name={name}
            defaultValue={defaultValue}
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
                />
            )}
        />
    )
}

export default TextField