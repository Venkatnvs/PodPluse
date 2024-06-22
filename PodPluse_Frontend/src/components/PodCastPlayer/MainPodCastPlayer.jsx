import { cn } from '@/lib/utils'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Progress } from "@/components/ui/progress"
import { Link } from 'react-router-dom'
import { formatTime } from '@/lib/formatTime'
import { ForwardIcon, MuteIcon, PauseIcon, PlayIcon, RewindIcon, UnmuteIcon } from '@/constants/Icons'
import { PlayerDefaultImg } from '@/constants/Images'


const MainPodCastPlayer = () => {
    const audio = useSelector((state) => state.audio.audio)
    const [audioCurrentTime, setAudioCurrentTime] = useState(0)
    const [audioDuration, setAudioDuration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const audioRef = useRef(null)

    const togglePlayPause = () => {
        if (audioRef.current?.paused) {
            audioRef.current?.play();
            setIsPlaying(true);
        } else {
            audioRef.current?.pause();
            setIsPlaying(false);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted((prev) => !prev);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setAudioDuration(audioRef.current.duration);
        }
    };

    const forward = () => {
        if (
            audioRef.current &&
            audioRef.current.currentTime &&
            audioRef.current.duration &&
            audioRef.current.currentTime + 5 < audioRef.current.duration
        ) {
            audioRef.current.currentTime += 5;
        }
    };

    const rewind = () => {
        if (audioRef.current && audioRef.current.currentTime - 5 > 0) {
            audioRef.current.currentTime -= 5;
        } else if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    };

    useEffect(() => {
        const updateCurrentTime = () => {
            if (audioRef.current) {
                setAudioCurrentTime(audioRef.current.currentTime);
            }
        };

        const audioElement = audioRef.current;
        if (audioElement) {
            audioElement.addEventListener("timeupdate", updateCurrentTime);

            return () => {
            audioElement.removeEventListener("timeupdate", updateCurrentTime);
            };
        }
    }, []);

    useEffect(() => {
        const audioElement = audioRef.current;
        if (audio?.audio?.audio_file) {
            if (audioElement) {
            audioElement.play().then(() => {
                setIsPlaying(true);
            });
            }
        } else {
            audioElement?.pause();
            setIsPlaying(false);
        }
    }, [audio]);

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

    return (
        <div className={cn('sticky bottom-0 left-0 flex size-full flex-col', { 
            'hidden': !audio ,
        })}>
            <Progress 
                value={(audioCurrentTime / audioDuration) * 100}
                className='w-full'
                max={audioDuration}
            />

            <section className="glassmorphism-black flex h-[112px] w-full items-center justify-between px-4 max-md:justify-center max-md:gap-5 md:px-12">
                <audio
                ref={audioRef}
                src={audio?.audio?.audio_file}
                className="hidden"
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleAudioEnded}
                />
                <div className="flex items-center gap-4 max-md:hidden">
                <Link to={`/podcast/${audio?.uuid}`}>
                    <img
                    src={audio?.image?.full_image_url || PlayerDefaultImg}
                    width={64}
                    height={64}
                    alt="player1"
                    className="aspect-square rounded-xl"
                    />
                </Link>
                <div className="flex w-[160px] flex-col">
                    <h2 className="text-14 truncate font-semibold text-white-1">
                    {audio?.title}
                    </h2>
                    <p className="text-12 font-normal text-white-2">{audio?.author}</p>
                </div>
                </div>
                <div className="flex-center cursor-pointer gap-3 md:gap-6">
                <div className="flex items-center gap-1.5">
                    <img
                    src={RewindIcon}
                    width={24}
                    height={24}
                    alt="rewind"
                    onClick={rewind}
                    />
                    <h2 className="text-12 font-bold text-white-4">-5</h2>
                </div>
                <img
                    src={isPlaying ? PauseIcon : PlayIcon}
                    width={30}
                    height={30}
                    alt="play"
                    onClick={togglePlayPause}
                />
                <div className="flex items-center gap-1.5">
                    <h2 className="text-12 font-bold text-white-4">+5</h2>
                    <img
                    src={ForwardIcon}
                    width={24}
                    height={24}
                    alt="forward"
                    onClick={forward}
                    />
                </div>
                </div>
                <div className="flex items-center gap-6">
                <h2 className="text-16 font-normal text-white-2 max-md:hidden">
                    {formatTime(audioDuration)}
                </h2>
                <div className="flex w-full gap-2">
                    <img
                    src={isMuted ? UnmuteIcon : MuteIcon}
                    width={24}
                    height={24}
                    alt="mute unmute"
                    onClick={toggleMute}
                    className="cursor-pointer"
                    />
                </div>
                </div>
            </section>
        </div>
    )
}

export default MainPodCastPlayer