import AXIOS_INSTANCE from '../axios';

export const getPodcastsApi = (userId) => 
    AXIOS_INSTANCE.get(`/core/podcast/${userId}/podcasts/`);