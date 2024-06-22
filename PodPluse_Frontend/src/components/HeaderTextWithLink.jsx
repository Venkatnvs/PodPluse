import { cn } from '@/lib/utils'
import React from 'react'
import { Link } from 'react-router-dom'

const HeaderTextWithLink = ({
    headerTitle,
    titleClassName,
}) => {
  return (
    <header className="flex items-center justify-between">
      {headerTitle ? (
        <h1 className={cn('text-18 font-bold text-white-1', titleClassName)}>{headerTitle}</h1>
      ): <div />}
      <Link to="/discover" className="text-16 font-semibold text-orange-1">
        See all
      </Link>
    </header>
  )
}

export default HeaderTextWithLink