import { getPodcastApi } from '@/apis/PodCast'
import LoaderSpinner from '@/components/LoaderSpinner'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { HeadphoneIcon, PlayIcon, VerifiedIcon } from '@/constants/Icons'
import { setAudioAction } from '@/store/actions/audioActions'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const ProfileCard = ({
    podcastData,
    imageUrl,
    userFirstName,
}) => {
    const dispatch = useDispatch()
    const { toast } = useToast();
    const [randomPodcast, setRandomPodcast] = useState(null);

    const playRandomPodcast = () => {
        const randomIndex = Math.floor(Math.random() * podcastData?.length);
        getPodcastApi(podcastData[randomIndex]?.uuid).then((response) => {
            setRandomPodcast(response.data[0])
        })
    }

    useEffect(() => {
        if (randomPodcast) {
            if (randomPodcast?.audio) {
                dispatch(setAudioAction(randomPodcast));
            } else {
            toast({
                title: "Error",
                description: "No audio found",
                variant: "destructive",
            });
            }
        }
    }, [randomPodcast])


    if (!imageUrl) return <LoaderSpinner />;
  return (
    <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
      <img
        src={imageUrl}
        width={250}
        height={250}
        alt="Podcaster"
        className="aspect-square rounded-lg"
      />
      <div className="flex flex-col justify-center max-md:items-center">
        <div className="flex flex-col gap-2.5">
          <figure className="flex gap-2 max-md:justify-center">
            <img
              src={VerifiedIcon}
              width={15}
              height={15}
              alt="verified"
            />
            <h2 className="text-14 font-medium text-white-2">
              Verified Creator
            </h2>
          </figure>
          <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1">
            {userFirstName}
          </h1>
        </div>
        <figure className="flex gap-3 py-6">
          <img
            src={HeadphoneIcon}
            width={24}
            height={24}
            alt="headphones"
          />
          <h2 className="text-16 font-semibold text-white-1">
            {podcastData?.listeners} &nbsp;
            <span className="font-normal text-white-2">monthly listeners</span>
          </h2>
        </figure>
        {podcastData?.length > 0 && (
          <Button
            onClick={playRandomPodcast}
            className="text-16 bg-orange-1 font-extrabold text-white-1"
          >
            <img
              src={PlayIcon}
              width={20}
              height={20}
              alt="random play"
            />{" "}
            &nbsp; Play a random podcast
          </Button>
        )}
      </div>
    </div>
  )
}

export default ProfileCard