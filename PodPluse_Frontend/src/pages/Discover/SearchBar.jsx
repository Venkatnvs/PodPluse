import { Input } from '@/components/ui/input'
import { SearchIcon } from '@/constants/Icons'
import React from 'react'

const SearchBar = ({
    search,
    setSearch = () => {},
}) => {
  return (
    <div className="relative mt-8 block">
      <Input
        className="input-class py-6 pl-12 focus-visible:ring-offset-orange-1"
        placeholder='Search for podcasts'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onLoad={() => setSearch('')}
      />
      <img 
        src={SearchIcon}
        alt="search"
        height={20}
        width={20}
        className="absolute left-4 top-3.5"
      />
    </div>
  )
}

export default SearchBar