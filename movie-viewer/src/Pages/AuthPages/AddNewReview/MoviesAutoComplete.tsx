import { useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { AutocompleteDropdown, TAutocompleteDropdownItem } from "react-native-autocomplete-dropdown";
import { useLoading } from "../../../Providers/loading";
import { useEffect, useState } from "react";
import { MovieDTO, searchMovies } from "../../../Services/Movies";
import { movieField } from "./formFields";
import { ErrorMessage } from "@hookform/error-message";
import { HelperText, useTheme } from "react-native-paper";

const MoviesAutoComplete = () => {
    const { setValue, formState: { errors } } = useFormContext();
    const { colors: { primaryContainer } } = useTheme();
    const { isLoading, endLoading, startLoading } = useLoading();
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState<TAutocompleteDropdownItem[]>([]);

    const formatReleaseYear = (date: string) => new Date(date).getFullYear();

    const setMoviesAfterSearch = async () => {
        const id = startLoading();

        try {
            const movieDTOs: MovieDTO[] = await searchMovies(query);
            setMovies(movieDTOs.map(({ id, original_title, release_date }: MovieDTO): TAutocompleteDropdownItem => ({
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
                <AutocompleteDropdown
                    clearOnFocus={false}
                    closeOnBlur={true}
                    closeOnSubmit={false}
                    onChangeText={(text: string) => setQuery(() => text)}
                    dataSet={movies}
                    showChevron={false}
                    loading={isLoading}
                    containerStyle={{ width: '100%', backgroundColor: primaryContainer }}
                    textInputProps={{
                        placeholder: 'Choose a movie',
                        placeholderTextColor: 'black',
                        style: { backgroundColor: primaryContainer }
                    }}
                    onSelectItem={(item: TAutocompleteDropdownItem) => setValue(movieField.name, item)}
                />
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