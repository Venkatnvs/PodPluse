import { cn } from '@/lib/utils'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Progress } from "@/components/ui/progress"
import { Link } from 'react-router-dom'
import { formatTime } from '@/lib/formatTime'
import { ForwardIcon, MuteIcon, PauseIcon, PlayIcon, RewindIcon, UnmuteIcon } from '@/constants/Icons'
import { PlayerDefaultImg } from '@/constants/Images'
import { setAudioIsMuted, setAudioIsPaused, setAudioTime } from '@/store/actions/audioActions'

const areEqual = (prevProps, nextProps) => {
    return prevProps.audio === nextProps.audio && prevProps.currentTime === nextProps.currentTime;
};

const MainPodCastPlayer = React.memo(() => {
    const dispatch = useDispatch();
    const audio = useSelector((state) => state.audio.audio)
    const currentTime = useSelector((state) => state.audio.currentTime);
    const isPaused = useSelector((state) => state.audio.isPaused);
    const isMutedState = useSelector((state) => state.audio.isMuted);

    const [audioCurrentTime, setAudioCurrentTime] = useState(currentTime || 0)
    const [audioDuration, setAudioDuration] = useState(audio?.audio?.duration || 0)
    const [isPlaying, setIsPlaying] = useState(isPaused || false)
    const [isMuted, setIsMuted] = useState(isMutedState || false)
    const [isSeeking, setIsSeeking] = useState(false);
    const audioRef = useRef(null)
    const fullRef = useRef(null)
    const progressBarRef = useRef(null);


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
                dispatch(setAudioTime(audioElement.currentTime));
                dispatch(setAudioIsPaused(audioElement.paused));
                dispatch(setAudioIsMuted(audioElement.muted));
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
                audioElement.currentTime = currentTime;
                if (!isPaused) {
                    audioElement.play().then(() => {
                        setIsPlaying(true);
                    });
                } else {
                    audioElement?.pause();
                    setIsPlaying(false);
                }
                if(isMuted) {
                    audioElement.muted = true;
                }else {
                    audioElement.muted = false;
                }
            }
        } else {
            audioElement?.pause();
            audioElement.currentTime = 0;
            audioElement.muted = false;
            setIsPlaying(false);
        }
    }, [audio]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                if (audioRef.current) {
                    dispatch(setAudioTime(audioRef.current.currentTime));
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [dispatch]);

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

    const handleProgressBarMouseDown = (e) => {
        setIsSeeking(true);
        handleSeek(e);
    };

    const handleProgressBarMouseUp = () => {
        setIsSeeking(false);
    };
    
    const handleProgressBarMouseMove = (e) => {
        if (isSeeking) {
            handleSeek(e);
        }
    };

    const handleSeek = useCallback((e) => {
        const progressBar = progressBarRef.current;
        if (progressBar && audioRef.current) {
            const rect = progressBar.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const progress = Math.min(Math.max(offsetX / rect.width, 0), 1);
            audioRef.current.currentTime = progress * audioDuration;
        }
    }, [audioDuration]);

    return (
        <div className={cn('sticky bottom-0 left-0 flex size-full flex-col', { 
            'hidden': !audio ,
        })}
            ref={fullRef}
        >
            <div
                className='glassmorphism-black flex items-center justify-between px-1 py-2 sm:px-5 md:px-12 max-md:py-2 gap-4 md:gap-5 w-full h-[4px]'
            >
                <h2 className="text-16 font-normal text-white-2">
                    {formatTime(audioCurrentTime)}
                </h2>
                <Progress 
                    value={(audioCurrentTime / audioDuration) * 100}
                    className='w-full h-2 cursor-pointer'
                    max={audioDuration}
                    ref={progressBarRef}
                    onMouseDown={handleProgressBarMouseDown}
                    onMouseUp={handleProgressBarMouseUp}
                    onMouseMove={handleProgressBarMouseMove}
                />
                <h2 className="text-16 font-normal text-white-2">
                    {formatTime(audioDuration)}
                </h2>
            </div>

            <section className="glassmorphism-black flex h-[100px] w-full items-center justify-between px-4 max-md:justify-center max-md:gap-5 md:px-12">
                <audio
                ref={audioRef}
                src={audio?.audio?.audio_file}
                className="hidden"
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleAudioEnded}
                />
                <div className="flex items-center w-1/3 gap-4 max-md:hidden">
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
                <div className="flex-1 flex-center cursor-pointer gap-3 md:gap-6 md:pl-20">
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
                <div className="flex w-1/3 items-center gap-6">
                    <div className="flex w-full gap-3 justify-end">
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
}, areEqual);

MainPodCastPlayer.displayName = 'MainPodCastPlayer';

export default MainPodCastPlayer