'use client'

import Link from 'next/link'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Genre } from '@/utils/types'
import { AppContext } from './Context'
import { fetchGenres } from '@/utils/fetchGenres'

type SideNavProps = {
  genres: Genre[]
}

export default function SideNav({ genres }: SideNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const { translations, currentLanguage } = useContext(AppContext);

  const t = useMemo(() => translations[currentLanguage], [translations, currentLanguage]);

  const [currentGenres, setCurrentGenres] = useState<Genre[]>(genres);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const updatedGenre = await fetchGenres(currentLanguage);
        setCurrentGenres(updatedGenre.genres);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    }

    fetchMovie();
  }, [currentLanguage]);

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 relative">
      <div className="md:hidden flex justify-between items-center mb-4">
        <Link
          className="flex items-end justify-start rounded-md bg-yellow-400 p-4"
          href="/"
        >
          <div className="text-black">
            MyMDB
          </div>
        </Link>
        <button onClick={toggleMenu} className="text-white focus:outline-none z-50">
          <svg className='w-8 h-8' fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      <Link
        className="md:flex hidden lg:flex items-end justify-start rounded-md bg-yellow-400 p-4"
        href="/"
      >
        <div className="text-black">
          MyMDB
        </div>
      </Link>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black opacity-50" onClick={closeMenu}></div>
      )}
      <div className={`fixed inset-y-0 right-0 z-50 bg-zinc-950 p-4 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out w-1/2 md:relative md:transform-none md:translate-x-0 md:w-full`}>
        <button onClick={toggleMenu} className="absolute top-4 right-4 text-white focus:outline-none md:hidden">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col space-y-2">
          {currentGenres.map(genre => (
            <Link className='text-white text-sm pl-3 py-1' key={genre.id} href={`/genre/${genre.id}?genre=${genre.name}`} onClick={closeMenu}>
              {genre.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}