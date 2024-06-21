import React, { useCallback } from 'react'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import LoaderSpinner from './LoaderSpinner'
import { useNavigate } from 'react-router-dom'

const Carousel = ({ topPodCastDetail }) => {
    const navigate = useNavigate()

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])

    const onNavButtonClick = useCallback((emblaApi) => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay) return

        const resetOrStop =
        autoplay.options.stopOnInteraction === false
            ? autoplay.reset
            : autoplay.stop

        resetOrStop()
    }, [])

    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
        emblaApi,
        onNavButtonClick
    )

    const slides = topPodCastDetail && topPodCastDetail?.filter((item) => item.totalPodcasts > 0)

    if(!slides) return <LoaderSpinner />

    return (
        <section className="flex w-full flex-col gap-4 overflow-hidden" ref={emblaRef}>
        <div className="flex">
            {slides.slice(0, 5).map((item) => (
            <figure
                key={item._id}
                className="carousel_box"
                onClick={() => navigate.push(`/podcasts/${item.podcast[0]?.podcastId}`)}
            >
                <img 
                    src={item.imageUrl}
                    alt="card"
                    className="absolute size-full rounded-xl border-none object-cover"
                />
                <div className="glassmorphism-black relative z-10 flex flex-col rounded-b-xl p-4">
                <h2 className="text-14 font-semibold text-white-1">{item.podcast[0]?.podcastTitle}</h2>
                <p className="text-12 font-normal text-white-2">{item.name}</p>
                </div>
            </figure>
            ))}
        </div>
        <div className="flex justify-center gap-2">
            {scrollSnaps.map((_, index) => (
            <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                selected={index === selectedIndex}
                />
            ))}
        </div>
        </section>
    )
}

export default Carousel
