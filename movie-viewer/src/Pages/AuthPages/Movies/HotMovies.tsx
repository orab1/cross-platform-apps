import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { FC, useCallback, useEffect, useState } from 'react';
import { Review, subscribeToLatestReviews } from '../../../Services/Reviews';
import { useAuth } from '../../../Providers/auth';
import { getPopularMovies, MovieDTO } from '../../../Services/Movies';
import { getResource } from '../../../Utils';
import { useLoading } from '../../../Providers/loading';
import MovieCard from './MovieCard';
import { useCache } from '../../../Providers/cache';

const HotMovies: FC = () => {
    const { startLoading, endLoading, isLoading } = useLoading();
    const { updateCache } = useCache();
    const [movies, setMovies] = useState<MovieDTO[] | null>(null);
    const [lastPage, setLastPage] = useState<number>(1);

    const getMoviesByPage = async () => {
        const movies = await getPopularMovies(lastPage);
        setMovies(lastMovies => lastMovies !== null ? [...lastMovies, ...movies] : movies);
        movies.forEach(movie => updateCache(movie.id, 'movie', movie));
    }

    const getHotMovies = () => getResource(
        getMoviesByPage,
        'An error occurred while getting the hot movies',
        { startLoading, endLoading }
    )

    useEffect(() => {
        getHotMovies();
    }, [lastPage]);

    return (
        <View style={styles.container} >
            {movies === null ? <ActivityIndicator size={'large'} /> :
                movies.length === 0 ? <Text>No movies found</Text> :
                    <FlatList
                        style={styles.list}
                        data={movies}
                        contentContainerStyle={{ alignItems: 'center', width: '100%' }}
                        renderItem={({ item }) => <MovieCard movie={item} />}
                        keyExtractor={({ id }) => `${id!}`}
                        onEndReached={() => setLastPage(lastPage => lastPage + 1)}
                        ListFooterComponent={() => isLoading ? <ActivityIndicator size={'large'} /> : null}
                    />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    list: {
        width: '100%',

    }
});

export default HotMovies;