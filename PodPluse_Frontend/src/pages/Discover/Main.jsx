import React, { useEffect, useState } from 'react';
import Layout from '../Layouts/Layout';
import EmptyListState from '@/components/EmptyListState';
import PodCastCard from '@/components/PodCastCard';
import LoaderSpinner from '@/components/LoaderSpinner';
import SearchBar from './SearchBar';
import { getTrendingPodcastsApi, searchPodcastsApi } from '@/apis/PodCast';
import { useDebounce } from '@/lib/useDebounce';

export const Main = () => {
  const [podcastsData, setPodcastsData] = useState(null);
  const [search, setSearch] = useState('');

  const debouncedValue = useDebounce(search, 300);

  useEffect(() => {
    if (debouncedValue) {
      searchPodcastsApi(debouncedValue).then((response) => {
        setPodcastsData(response.data);
      });
    } else {
      getTrendingPodcastsApi().then((response) => {
        setPodcastsData(response.data);
      });
    }
  }, [debouncedValue]);

  return (
    <Layout>
      <div className="flex flex-col gap-9 mt-9">
        <SearchBar 
          search={search} 
          setSearch={setSearch}
        />
        <div className="flex flex-col gap-9">
          <h1 className="text-18 font-bold text-white-1">
            {!search ? 'Discover Podcasts' : 'Search results for '}
            {search && <span className="text-white-2">{search}</span>}
          </h1>
          {podcastsData ? (
            <>
              {podcastsData.length > 0 ? (
                <div className="podcast_grid">
                  {podcastsData?.map((podcast, index) => (
                    <PodCastCard
                      key={index}
                      imgURL={podcast.image.full_image_url}
                      title={podcast.title}
                      description={podcast.description}
                      id={podcast.uuid} />
                  ))}
                </div>
              ) : <EmptyListState title="No results found" />}
            </>
          ) : <LoaderSpinner />}
        </div>
      </div>
    </Layout>
  );
};

export default Main;