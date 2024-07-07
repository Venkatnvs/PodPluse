import AXIOS_INSTANCE from '../axios';

export const generatePodcastApi = (formData) => 
    AXIOS_INSTANCE.post('/core/podcast/generate/', formData, {
        responseType: 'arraybuffer',
    });

export const createPodcastApi = (formData) =>
    AXIOS_INSTANCE.post('/core/podcast/create/', formData,{
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

export const getTrendingPodcastsApi = () =>
    AXIOS_INSTANCE.get('/core/podcast/trending/');

export const getPodcastApi = (podcastUUID) =>
    AXIOS_INSTANCE.get(`/core/podcast/${podcastUUID}/`);

export const getSimilarPodcastsApi = (podcastUUID) =>
    AXIOS_INSTANCE.get(`/core/podcast/${podcastUUID}/similar/`);

export const deletePodcastApi = (podcastUUID) =>
    AXIOS_INSTANCE.delete(`/core/podcast/${podcastUUID}/delete/`);

export const getTopPodCastersApi = () =>
    AXIOS_INSTANCE.get('/core/podcast/top-podcasters/');

export const searchPodcastsApi = (search) =>
    AXIOS_INSTANCE.get(`/core/podcast/search/?q=${search}`);

export const getPodcastAvailableLanguagesApi = () =>
    AXIOS_INSTANCE.get('/core/podcast/available-languages/');