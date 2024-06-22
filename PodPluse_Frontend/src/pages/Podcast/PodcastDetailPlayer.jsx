import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { deletePodcastApi } from '@/apis/PodCast';
import { useDispatch } from 'react-redux';
import { setAudioAction } from '@/store/actions/audioActions';
import { DeleteIcon, PlayIcon, ThreeDotsIcon, UserIcon } from '@/constants/Icons';

const PodcastDetailPlayer = ({
  isOwner,
  podcast,
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async() => {
    try {
      const response = await deletePodcastApi(podcast?.uuid);
      if(response.status === 204){
        toast({
          title: "Success",
          description: "Podcast deleted successfully",
        });
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }

  const handlePlay = () => {
    if (podcast?.audio) {
      dispatch(setAudioAction(podcast));
    } else {
      toast({
        title: "Error",
        description: "No audio found",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="mt-6 flex w-full justify-between max-md:justify-center">
      <div className="flex flex-col gap-8 max-md:items-center md:flex-row">
        <img
          src={podcast?.image?.full_image_url}
          width={250}
          height={250}
          alt="Podcast image"
          className="aspect-square rounded-lg"
        />
        <div className="flex w-full flex-col gap-5 max-md:items-center md:gap-9">
          <article className="flex flex-col gap-2 max-md:items-center">
            <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1">
              {podcast?.title}
            </h1>
            <figure
              className="flex cursor-pointer items-center gap-2"
              onClick={() => {
                navigate(`/profile/${podcast?.user}`);
              }}
            >
              <img
                src={podcast?.authorImageUrl || UserIcon}
                width={30}
                height={30}
                alt="Caster icon"
                className="size-[30px] rounded-full object-cover"
              />
              <h2 className="text-16 font-normal text-white-3">{podcast.author}</h2>
            </figure>
          </article>

          <Button
            onClick={handlePlay}
            className="text-16 w-full max-w-[250px] bg-orange-1 font-extrabold text-white-1"
          >
            <img
              src={PlayIcon}
              width={20}
              height={20}
              alt="random play"
            />{" "}
            &nbsp; Play podcast
          </Button>
        </div>
      </div>
      {isOwner && (
        <div className="relative mt-2">
          <img
            src={ThreeDotsIcon}
            width={20}
            height={30}
            alt="Three dots icon"
            className="cursor-pointer"
            onClick={() => setIsDeleting((prev) => !prev)}
          />
          {isDeleting && (
            <div
              className="absolute -left-32 -top-2 z-10 flex w-32 cursor-pointer justify-center gap-2 rounded-md bg-black-6 py-1.5 hover:bg-black-2"
              onClick={handleDelete}
            >
              <img
                src={DeleteIcon}
                width={16}
                height={16}
                alt="Delete icon"
              />
              <h2 className="text-16 font-normal text-white-1">Delete</h2>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PodcastDetailPlayer