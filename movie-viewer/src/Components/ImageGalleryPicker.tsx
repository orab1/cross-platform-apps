import { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFormContext, useWatch } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { HelperText } from 'react-native-paper';

const ImageGalleryPicker: React.FC = ({ name: fieldName = '' }: { name?: string }) => {
    const { watch, setValue, formState: { errors } } = useFormContext();
    const image = useWatch({ name: fieldName });

    const getImagePermissions = async () => {
        const { granted: originalPermissions } = await ImagePicker.getMediaLibraryPermissionsAsync();

        if (!originalPermissions) {
            const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!granted) alert('Sorry, we need camera roll permissions to make this work!');
        }
    };

    useEffect(() => {
        getImagePermissions();
    }, []);


    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
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
                <Image source={{ uri: watch(fieldName)! }} style={{ width: 200, height: 200 }} /> :
                <MaterialCommunityIcons onPress={pickImage} name="image-plus" size={200} color="black" />
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