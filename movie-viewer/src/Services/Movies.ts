import axios, { AxiosInstance } from 'axios';
import qs from 'qs';

const movieApi: AxiosInstance = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    timeout: 5000,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NGMxZGYwYmZiYTRiYTMyMTVlMDY0NDJlZDVhODRmNSIsInN1YiI6IjY2MjNiOTgyMmUyYjJjMDE4NzY2MjkxNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZoOoGJkG8Q0s0iDo81dda5qivTjBCV7TokWNP8r7shE`,
    },
});

export type MovieDTO = {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    overview: string;
    vote_average: number;
    popularity: number;
    genre_ids: number[];
    original_language: string;
    original_title: string;
    backdrop_path: string;
    adult: boolean;
    video: boolean;
    vote_count: number;
}

export const searchMovies = async (query: string) => {
    const { data: { results } } = await movieApi.get(`/search/movie?${qs.stringify({ query, page: 1, include_adul: false })}`);

    return results;
}

export const getMovieById = async (id: number) => {
    const { data } = await movieApi.get(`/movie/${id}`);

    return data as MovieDTO;
}

export const getPopularMovies = async (page: number) => {
    const { data: { results } } = await movieApi.get(`/discover/movie?${qs.stringify({ sort_by: 'popularity.desc', page, include_adult: false, include_video: false, language: 'en-US' })}`);

    return results as MovieDTO[];
}

export default movieApi;