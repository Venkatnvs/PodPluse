import { fetchUser } from '@/store/actions/authActions'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {UserIcon, RightArrowIcon} from '../constants/Icons'
import HeaderTextWithLink from './HeaderTextWithLink';
import Carousel from './Carousel';
import { getTopPodCastersApi } from '@/apis/PodCast';
import { cn } from '@/lib/utils'

const RightSideBar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user)
  const audio = useSelector((state) => state.audio.audio)

  const [topPodCasters, setTopPodCasters] = useState([])

  if (!user) {
    const res = dispatch(fetchUser());
    if (res.status === 200 || res.status === 201) {
      window.location.reload()
    }
  }

  useEffect(() => {
    getTopPodCastersApi().then((response) => {
      setTopPodCasters(response.data)
    })
  }, [])


  return (
    <section className={cn("right_sidebar h-[calc(100vh-5px)]", {
      'h-[calc(100vh-120px)]': audio?.audio
    })}>
        {
          user && (
            <>
              <Link to={`/profile/${user?.id}`} className="flex gap-3 pb-12">
                <img
                  src={user?.ImageUrl || UserIcon}
                  width={30}
                  height={30}
                  alt="Caster icon"
                  className="size-[30px] rounded-full object-cover"
                />
                <div className="flex w-full items-center justify-between">
                  <h1 className="text-16 truncate font-semibold text-white-1">
                    {user?.first_name} {user?.last_name}
                  </h1>
                  <img 
                    src={RightArrowIcon}
                    alt="arrow"
                    width={24}
                    height={24}
                  />
                </div>
              </Link>
            </>
          )
        }
        <section>
          <HeaderTextWithLink headerTitle="Popular Podcasters" />
          <Carousel topPodCastDetail={topPodCasters}/>
        </section>
        <section className="flex flex-col gap-8 pt-12">
          <HeaderTextWithLink headerTitle="Top Podcastrs" />
          <div className="flex flex-col gap-6">
            {topPodCasters?.slice(0, 3).map((podcaster, index) => (
              <div key={index} className="flex cursor-pointer justify-between" onClick={() => navigate(`/profile/${podcaster.id}`)}>
                <figure className="flex items-center gap-2">
                  <img
                    src={podcaster.imageUrl || UserIcon}
                    alt={podcaster.first_name}
                    width={25}
                    height={25}
                    className="aspect-square rounded-lg"
                  />
                  <h2 className="text-14 font-semibold text-white-1">{podcaster.podcasts[0]?.author}</h2>
                </figure>
                <div className="flex items-center">
                  <p className="text-12 font-normal text-white-1">{podcaster.podcast_count} podcasts</p>
                </div> 
              </div>
            ))}
          </div>
        </section>
    </section>
  )
}

export default RightSideBar