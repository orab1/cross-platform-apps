import { FC, memo, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { ActivityIndicator, Avatar, Card, IconButton, Text, withTheme } from "react-native-paper";
import { deleteReviewById, Review } from "../../../Services/Reviews";
import { getMovieById, MovieDTO } from "../../../Services/Movies";
import { getUserById, getUserPicture, User } from "../../../Services/Users";
import { useLoading } from "../../../Providers/loading";
import { useAuth } from "../../../Providers/auth";
import { useNavigation } from "@react-navigation/native";
import { getResource } from "../../../Utils";
import { AntDesign } from "@expo/vector-icons";
import { useCache } from "../../../Providers/cache";
import { get } from "firebase/database";
import { FirebaseError } from "firebase/app";

export interface PopulatedReview extends Review {
    user: User;
    movie: MovieDTO;
}

const ReviewCard = ({ review, theme }: { review: Review, theme: any }) => {
    const { title, body, uId, movieId, rating, id, imageUri } = review;
    const navigation = useNavigation();
    const { user: authUser } = useAuth();
    const { getImage, getMovie: getMovieFromCache, getUser: getUserFromCache } = useCache();
    const { endLoading, startLoading } = useLoading();
    const [user, setUser] = useState<User | null>(null);
    const [movie, setMovie] = useState<MovieDTO | null>(null);
    const [reviewImage, setReviewImage] = useState<string | null>(null);
    const [refetch, setRefetch] = useState<number>(0);

    const getMovie = async () => getResource(
        async () => setMovie(await getMovieFromCache(movieId)),
        'An error occurred while getting the movie', { startLoading, endLoading });

    const getUser = async () => getResource(
        async () => {
            const newUser = await getUserFromCache(uId);
            setUser(prevUser => prevUser ? { ...prevUser, ...newUser } : newUser);
        },
        'An error occurred while getting the user', { startLoading, endLoading });

    const getUserImage = async () => getResource(
        async () => {
            const profileImageUri = await getImage(`${uId}`);
            setUser(prevUser => prevUser ? { ...prevUser, imageUri: profileImageUri } : { imageUri: profileImageUri } as User);
        }, 'An error occurred while getting the user image', { startLoading, endLoading });

    const getReviewImage = async () => getResource(
        async () => setReviewImage(await getImage(`${id}`)),
        'An error occurred while getting the review image', { startLoading, endLoading });

    useEffect(() => {
        getMovie();
        getUser();
        getUserImage();
    }, []);

    useEffect(() => {
        try {
            imageUri && getReviewImage()
        } catch (error: FirebaseError | any) {
            if (error.code === 'storage/object-not-found') {
                setTimeout(() => setRefetch(refetch => refetch + 1), 1000);
            }
            console.error('Error getting review image', error);
        }
    }, [imageUri, refetch]);


    return (<Card style={styles.card} elevation={2}>
        {!(user?.name && movie) ? <ActivityIndicator /> : <>
            <Card.Title
                title={`${user.name.first} ${user.name.last}`}
                subtitle={`${movie.original_title}`}
                left={(props) => user.imageUri ?
                    <Avatar.Image
                        {...props}
                        source={{ uri: user.imageUri }}
                        size={50} /> :
                    <ActivityIndicator />
                }
            />
            {reviewImage ?
                <Image source={{ uri: reviewImage }} style={{ width: '100%', height: 200 }} /> :
                imageUri ?
                    <ActivityIndicator style={{ minHeight: 100 }} /> :
                    movie ?
                        <Card.Cover style={{ minHeight: 100 }} source={{ uri: `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}` }} /> :
                        <ActivityIndicator />}
            <Card.Content>
                <View>
                    <Text variant='headlineSmall'>{title}</Text>
                    <Text variant='bodyLarge'>{body}</Text>
                </View>
                <Text variant='bodyLarge' style={{ marginTop: 2, marginBottom: 2 }}>{rating} <AntDesign name={'staro'} size={15} /></Text>
            </Card.Content>
            {authUser?.uId === user.uId &&
                <Card.Actions style={styles.actions}  >
                    <IconButton
                        icon={'pencil'}
                        size={20}
                        mode="contained"
                        iconColor={theme.colors.secondary}
                        onPress={() => {
                            const { timestamp, ...newReview } = review;
                            navigation.navigate('AddNewReview', { review: { movie, user, ...newReview }, isEdit: true })
                        }}
                    />
                    <IconButton
                        icon={'delete'}
                        size={20}
                        mode="contained"
                        iconColor={theme.colors.secondary}
                        onPress={() => deleteReviewById(review.id!)}
                    />
                </Card.Actions>}
        </>}
    </Card >
    )
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        marginVertical: 10,
        minWidth: '85%',
        maxWidth: '85%',
        minHeight: 200,
        justifyContent: 'center',
    },
    acticityIndicator: {
        flex: 1,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default withTheme(ReviewCard);