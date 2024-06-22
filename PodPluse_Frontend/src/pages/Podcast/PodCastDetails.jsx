import { getPodcastApi, getSimilarPodcastsApi } from '@/apis/PodCast'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from "../Layouts/Layout";
import PodCastCard from '@/components/PodCastCard';
import LoaderSpinner from '@/components/LoaderSpinner';
import EmptyListState from '@/components/EmptyListState';
import PodcastDetailPlayer from './PodcastDetailPlayer';
import { useSelector } from 'react-redux';
import { HeadphoneIcon } from '@/constants/Icons';

const PodCastDetails = () => {
    const { id } = useParams()
    const [podcast, setPodcast] = useState(null)
    const [similarPodcasts, setSimilarPodcasts] = useState(null)
    const user = useSelector((state) => state.auth.user)

    const isOwner = user?.id === podcast?.user

    // set scroll to top
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [id])

    useEffect(() => {
        getPodcastApi(id).then((response) => {
            console.log(response.data[0])
            setPodcast(response.data[0])
        })
        getSimilarPodcastsApi(id).then((response) => {
            setSimilarPodcasts(response.data)
        })
    }, [id])

    if (!podcast) {
        return <LoaderSpinner />
    }

    return (
        <Layout>
        <section className="flex w-full flex-col">
        <header className="mt-9 flex items-center justify-between">
            <h1 className="text-20 font-bold text-white-1">
            Currenty Playing
            </h1>
            <figure className="flex gap-3">
            <img
                src={HeadphoneIcon}
                width={24}
                height={24}
                alt="headphone"
            />
            <h2 className="text-16 font-bold text-white-1">{podcast?.reactions?.length}</h2>
            </figure>
        </header>

        <PodcastDetailPlayer
            isOwner={isOwner}
            podcast={podcast}
        />

        <p className="text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center">{podcast?.description}</p>

        <div className="flex flex-col gap-8">
            <div className='flex flex-col gap-4'>
            <h1 className='text-18 font-bold text-white-1'>Transcription</h1>
            <p className="text-16 font-medium text-white-2">{podcast?.audio?.voice_prompt}</p>
            </div>
            <div className='flex flex-col gap-4'>
            <h1 className='text-18 font-bold text-white-1'>Thumbnail Prompt</h1>
            <p className="text-16 font-medium text-white-2">{podcast?.image?.image_prompt}</p>
            </div>
        </div>

        <section className="mt-8 flex flex-col gap-5">
            <h1 className="text-20 font-bold text-white-1">Similar Podcasts</h1>

            {similarPodcasts && similarPodcasts.length > 0 ? (
            <div className="podcast_grid">
                {similarPodcasts?.map((podcast,index) => (
                <PodCastCard
                key={index}
                imgURL={podcast.image.full_image_url}
                title={podcast.title}
                description={podcast.description}
                id={podcast.uuid}
                />
                ))}
            </div>
            ) : (
            <> 
                <EmptyListState 
                title="No similar podcasts found"
                buttonLink="/discover"
                buttonText="Discover more podcasts"
                />
            </>
            )}
        </section>

        </section>
        </Layout>
    )
}

export default PodCastDetails