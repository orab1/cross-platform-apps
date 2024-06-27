import { useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { AutocompleteDropdown, TAutocompleteDropdownItem } from "react-native-autocomplete-dropdown";
import { useLoading } from "../../../Providers/loading";
import { FC, useEffect, useState } from "react";
import { MovieDTO, searchMovies } from "../../../Services/Movies";
import { movieField } from "./formFields";
import { ErrorMessage } from "@hookform/error-message";
import { HelperText, TextInput, useTheme } from "react-native-paper";

const MoviesAutoComplete: FC<{ defaultValue?: TAutocompleteDropdownItem, disable: boolean }> = ({ defaultValue , disable = false }) => {
    const { setValue, formState: { errors } } = useFormContext();
    const { colors: { secondaryContainer } } = useTheme();
    const { isLoading, endLoading, startLoading } = useLoading();
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState<TAutocompleteDropdownItem[]>([]);

    const formatReleaseYear = (date: string) => new Date(date).getFullYear();

    const setMoviesAfterSearch = async () => {
        const id = startLoading();
        try {
            const movieDTOs: MovieDTO[] = await searchMovies(query);
            setMovies(() => movieDTOs.map(({ id, original_title, release_date }: MovieDTO): TAutocompleteDropdownItem => ({
                id: `${id}`,
                title: `${original_title} (${formatReleaseYear(release_date)})`
            })))
        } catch (error) {
            alert('An error occurred while searching for movies');
        } finally {
            endLoading(id);
        }
    }

    useEffect(() => {
        query !== '' && setMoviesAfterSearch()
    }, [query])

    return (
        <>
            <View style={{ flexDirection: 'row', width: '100%' }}>
                {disable ? <TextInput
                    placeholderTextColor={'black'}
                    defaultValue={defaultValue!.title!}
                    disabled={disable}
                    style={{ width: '100%', backgroundColor: secondaryContainer }} /> :
                    <AutocompleteDropdown
                        clearOnFocus={false}
                        closeOnBlur={true}
                        closeOnSubmit={false}
                        onChangeText={(text: string) => setQuery(() => text)}
                        dataSet={movies}
                        showChevron={false}
                        loading={isLoading}
                        containerStyle={{ width: '100%', backgroundColor: secondaryContainer }}
                        textInputProps={{
                            placeholder: 'Choose a movie',
                            placeholderTextColor: 'black',
                            style: { backgroundColor: secondaryContainer }
                        }}
                        onSelectItem={(item: TAutocompleteDropdownItem) => setValue(movieField.name, item)}
                        emptyResultText="Search for a movie..."
                        initialValue={defaultValue}
                    />}
            </View>
            {errors[movieField.name] &&
                <ErrorMessage
                    name={movieField.name}
                    render={({ message }) =>
                        <HelperText style={styles.helperText} type="error">{message}</HelperText>}
                />}
        </>
    )
};

const styles = StyleSheet.create({
    helperText: {
        minHeight: 20,
        lineHeight: 10,
        alignSelf: 'flex-start'
    },
})


export default MoviesAutoComplete;