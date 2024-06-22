import React from 'react'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { DiscoverIcon, EmptyStateIcon } from '@/constants/Icons'

const EmptyListState = ({
  title,
  search,
  buttonLink,
  buttonText,
}) => {
  return (
    <section className="flex-center size-full flex-col gap-3">
      <img src={EmptyStateIcon} width={250} height={250} alt="empty state" />
      <div className="flex-center w-full max-w-[254px] flex-col gap-3">
        <h1 className="text-16 text-center font-medium text-white-1">{title}</h1>
        {search && (
          <p className="text-16 text-center font-medium text-white-2">Try adjusting your search to find what you are looking for</p>
        )}
        {buttonLink && (
          <Button className="bg-orange-1">
            <Link to={buttonLink} className="gap-1 flex">
              <img 
                src={DiscoverIcon}
                width={20}
                height={20}
                alt='discover'
              />
              <h1 className="text-16 font-extrabold text-white-1">{buttonText}</h1>
            </Link>
          </Button>
        )}
      </div>
    </section>
  )
}

export default EmptyListState