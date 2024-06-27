import React, { createContext, useState, useEffect, useContext, Dispatch, SetStateAction } from 'react';
import { getUserById, getUserPicture, User } from '../Services/Users';
import { getMovieById, MovieDTO } from '../Services/Movies';
import { getReviewById, Review, subscribeToLatestReviews } from '../Services/Reviews';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPicture } from '../Services/Pictures';

interface CacheContextProps {
    getImage: (key: string) => Promise<string>;
    updateCache: (key: CacheKey, itemType: CacheType, value?: CacheEntity | null) => Promise<CacheEntity | undefined>;
    imageCache: Record<string, string>;
    moviesCache: Record<number, MovieDTO>;
    usersCache: Record<string, User>;
    reviewsCache: Record<string, Review>;
    getMovie: (key: number) => Promise<MovieDTO>;
    getUser: (key: string) => Promise<User>;
    refreshCache: (itemType: CacheType) => Promise<void>;
}

export type CacheEntity = string | MovieDTO | User | Review;
export type CacheKey = string | number;
export type Cache = Record<CacheKey, CacheEntity>;
export type CacheType = 'image' | 'movie' | 'user' | 'review';

export const CacheContext = createContext<CacheContextProps>({
    getImage: async () => '',
    updateCache: async () => ({} as CacheEntity),
    imageCache: {},
    moviesCache: {},
    usersCache: {},
    reviewsCache: {},
    getMovie: async () => ({} as MovieDTO),
    getUser: async () => ({} as User),
    refreshCache: async () => { }
});

export const CacheProvider: React.FC<{ children: any }> = ({ children }) => {
    const [imageCache, setImageCache] = useState<Cache>({});
    const [moviesCache, setMoviesCache] = useState<Cache>({});
    const [usersCache, setUsersCache] = useState<Cache>({});
    const [reviewsCache, setReviewsCache] = useState<Cache>({});

    const caches: Record<CacheType, {
        cache: Cache,
        setCache: Dispatch<SetStateAction<Cache>>,
        getValue?: (key: CacheKey) => Promise<CacheEntity>
    }> = {
        movie: {
            cache: moviesCache,
            setCache: setMoviesCache,
            getValue: getMovieById as (key: CacheKey) => Promise<CacheEntity>
        },
        user: {
            cache: usersCache,
            setCache: setUsersCache,
            getValue: getUserById as (key: CacheKey) => Promise<CacheEntity>
        },
        review: {
            cache: reviewsCache,
            setCache: setReviewsCache,
            getValue: getReviewById as (key: CacheKey) => Promise<CacheEntity>
        },
        image: {
            cache: imageCache,
            setCache: setImageCache,
            getValue: getPicture as (key: CacheKey) => Promise<CacheEntity>
        }
    };

    const getItem = (itemType: CacheType) => (key: CacheKey) => {
        const { cache } = caches[itemType];
        if (cache[key]) {
            updateCache(key, itemType)
            return cache[key];
        }

        return updateCache(key, itemType)
    }

    const updateCache = async (key: CacheKey, itemType: CacheType, value: CacheEntity | null = null) => {
        const { setCache, getValue } = caches[itemType];
        if (!getValue) return;

        const newValue = value || await getValue(key);
        setCache(oldCache => ({ ...oldCache, [key]: newValue }));

        return newValue;
    }

    const refreshCache = async (itemType: CacheType) => {
        const { setCache, getValue, cache } = caches[itemType];
        if (!getValue) return;

        const newCacheObjects = await Promise.all(Object.keys(cache).map(async key => ({ [key]: await getValue(key) })));
        setCache(() => newCacheObjects.reduce((acc, obj) => ({ ...acc, ...obj }), {}));
    }

    const refreshAllCaches = () => {
        const { review, ...cacheToRefresh } = caches;
        Promise.all(Object.keys(cacheToRefresh).map(itemType => refreshCache(itemType as CacheType)));
    }

    useEffect(() => {
        const intervalId = setInterval(refreshAllCaches, 30000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const unsubscribe = subscribeToLatestReviews(setReviewsCache as Dispatch<SetStateAction<Record<string, Review>>>);

        return unsubscribe;
    }, []);


    return (
        <CacheContext.Provider value={{
            getImage: getItem('image') as (key: string) => Promise<string>,
            getMovie: getItem('movie') as (key: number) => Promise<MovieDTO>,
            getUser: getItem('user') as (key: string) => Promise<User>,
            imageCache: imageCache as Record<string, string>,
            moviesCache: moviesCache as Record<number, MovieDTO>,
            usersCache: usersCache as Record<string, User>,
            reviewsCache: reviewsCache as Record<string, Review>,
            updateCache,
            refreshCache
        }}>
            {children}
        </CacheContext.Provider>
    );
};

export const useCache = () => useContext(CacheContext);