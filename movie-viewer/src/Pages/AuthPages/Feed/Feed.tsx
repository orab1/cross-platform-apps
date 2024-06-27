import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Review, subscribeToLatestReviews } from '../../../Services/Reviews';
import ReviewCard from './ReviewCard';
import { useAuth } from '../../../Providers/auth';
import { useCache } from '../../../Providers/cache';
import { useLoading } from '../../../Providers/loading';

const Feed: FC<{ route: { params: { myPosts: boolean } } }> = memo(({ route: { params: { myPosts } } }) => {
    const { user } = useAuth();
    const { reviewsCache, imageCache } = useCache();
    const [lastPage, setLastPage] = useState<number>(1);

    const filterMyPosts = useCallback((review: Review) => !myPosts || user?.uId === review.uId, [myPosts, user, reviewsCache]);

    const reviews = useMemo(() => {
        const newReviews = Object.keys(reviewsCache)
            .map(key => ({ ...reviewsCache[key], id: key }))
            .filter(filterMyPosts)
            .sort((a, b) => (b.timestamp as number) - (a.timestamp as number))
            .slice(0, 5 * lastPage);
        return newReviews;
    }, [reviewsCache, lastPage, imageCache]);

    const renderReview = useCallback(({ item }: { item: Review }) => <ReviewCard review={item} />, []);

    return (
        <View style={styles.container} >
            {reviews === null ? <ActivityIndicator size={'large'} /> :
                reviews.length === 0 ? <Text>No reviews found</Text> :
                    <FlatList
                        style={styles.list}
                        data={reviews}
                        contentContainerStyle={{ alignItems: 'center', width: '100%' }}
                        renderItem={renderReview}
                        keyExtractor={Item => Item.id! as string}
                        onEndReached={() => setLastPage(lastPage => lastPage + 1)}
                        ListFooterComponent={() => Object.keys(reviewsCache).map(reviewId => reviewsCache[reviewId]).filter(filterMyPosts).length !== reviews.length ? <ActivityIndicator size={'large'} /> : null}
                    />
            }
        </View>
    );
});

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

export default Feed;