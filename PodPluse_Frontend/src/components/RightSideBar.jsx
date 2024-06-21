import { fetchUser } from '@/store/actions/authActions'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import UserIcon from '../assets/icons/avatar.svg';
import RightArrowIcon from '../assets/icons/right-arrow.svg';
import HeaderTextWithLink from './HeaderTextWithLink';
import Carousel from './Carousel';
import { getTopPodCastersApi } from '@/apis/PodCast';

const RightSideBar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user)

  const [topPodCasters, setTopPodCasters] = useState([])

  if (!user) {
    const res = dispatch(fetchUser());
    if (res.status === 200 || res.status === 201) {
      window.location.reload()
    }
  }

  useEffect(() => {
    getTopPodCastersApi().then((response) => {
      console.log(response.data)
      setTopPodCasters(response.data)
    })
  }, [])

  console.log(user)

  return (
    <section className='right_sidebar text-white-1 h-[calc(100vh-5px)]'>
        {
          user && (
            <>
              <Link href={`/profile/${user?.id}`} className="flex gap-3 pb-12">
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
          <Carousel />
        </section>
    </section>
  )
}

export default RightSideBar