import { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFormContext, useWatch } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { HelperText } from 'react-native-paper';

const ImageGalleryPicker: React.FC<{ name?: string, isProfile: boolean, width?: number, height?: number }> = ({ name: fieldName = '', isProfile = false, width = 200, height = 200 }) => {
    const { watch, setValue, formState: { errors } } = useFormContext();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: isProfile ? [4, 4] : [6, 4],
            quality: 1,
            allowsMultipleSelection: false
        });

        if (!result.canceled) {
            setValue(fieldName, result.assets[0].uri);
        }
    };

    return (
        <View>
            {watch(fieldName) ?
                <TouchableOpacity onPress={pickImage}>
                    <Image source={{ uri: watch(fieldName)! }} style={{ width, height, ...(isProfile && { borderRadius: 5 }) }} />
                </TouchableOpacity> :
                <MaterialCommunityIcons onPress={pickImage} name="image-plus" size={200} color="black" style={isProfile && { borderRadius: 5 }} />
            }
            {errors[fieldName] &&
                <ErrorMessage
                    name={fieldName}
                    render={({ message }) =>
                        <HelperText style={styles.helperText} type="error">{message}</HelperText>}
                />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    helperText: {
        textAlign: 'center',
        minHeight: 20,
        lineHeight: 10

    }
})

export default ImageGalleryPicker;