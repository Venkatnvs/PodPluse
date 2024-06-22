import { getPodcastsApi } from '@/apis/Profile'
import EmptyListState from '@/components/EmptyListState'
import PodCastCard from '@/components/PodCastCard'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../Layouts/Layout'
import ProfileCard from './ProfileCard'
import { UserIcon } from '@/constants/Icons'

const MainProfile = () => {
    const { id } = useParams()
    const [podcastsData, setPodcastsData] = useState(null)
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        getPodcastsApi(id).then((response) => {
            setPodcastsData(response.data.podcasts)
            setUserData(response.data.user)
        })
    }, [id])

    return (
        <Layout>
        <section className="mt-9 flex flex-col">
        <h1 className="text-20 font-bold text-white-1 max-md:text-center">
            Podcaster Profile
        </h1>
        <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
            <ProfileCard
                podcastData={podcastsData}
                imageUrl={userData?.imageUrl || UserIcon}
                userFirstName={userData?.full_name}
            />
        </div>
        <section className="mt-9 flex flex-col gap-5">
            <h1 className="text-20 font-bold text-white-1">All Podcasts</h1>
            {podcastsData && podcastsData.length > 0 ? (
            <div className="podcast_grid">
                {podcastsData?.slice(0, 4).map((podcast, index) => (
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
            <EmptyListState
                title="You have not created any podcasts yet"
                buttonLink="/create-podcast"
                buttonText="Create Podcast"
            />
            )}
        </section>
        </section>
        
        </Layout>
  )
}

export default MainProfile