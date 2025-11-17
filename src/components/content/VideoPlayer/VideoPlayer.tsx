import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw, Settings } from 'lucide-react'
import { movieService } from '@/services/content/movieService'
import '@/styles/VideoPlayer.css'

interface VideoPlayerProps {
    videoUrl: string
    title: string
    currentEpisode: number
    movieId?: string
}

export const VideoPlayer = ({ videoUrl, movieId }: VideoPlayerProps) => {
    // Check if videoUrl is an embedded streaming link
    const isEmbedded = videoUrl.includes('opstream') ||
                       videoUrl.includes('ophim') ||
                       videoUrl.includes('youtube.com') ||
                       videoUrl.includes('vimeo.com') ||
                       videoUrl.includes('vidsrc') ||
                       videoUrl.includes('embed.su') ||
                       videoUrl.includes('/embed/') ||
                       videoUrl.includes('/player/') ||
                       videoUrl.includes('/share/') ||
                       videoUrl.includes('archive.org/embed')

    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const videoRef = useRef<HTMLVideoElement>(null)
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

    // Save progress to database
    const saveProgress = async (watchedSeconds: number) => {
        if (!movieId || watchedSeconds <= 0 || !duration) return

        try {
            await movieService.updateWatchProgress(movieId, {
                currentTime: watchedSeconds,
                duration: Math.floor(duration)
            })
            console.log('[VideoPlayer] Progress saved:', watchedSeconds, '/', Math.floor(duration))
        } catch (error) {
            console.error('[VideoPlayer] Failed to save progress:', error)
        }
    }

    // Auto-save progress every 10 seconds while playing
    useEffect(() => {
        if (isPlaying && movieId && currentTime > 0) {
            // Save progress every 10 seconds
            progressIntervalRef.current = setInterval(() => {
                saveProgress(Math.floor(currentTime))
            }, 10000)
        }

        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current)
            }
        }
    }, [isPlaying, currentTime, movieId])

    // Save progress when component unmounts (user leaves page)
    useEffect(() => {
        return () => {
            if (movieId && currentTime > 0) {
                saveProgress(Math.floor(currentTime))
            }
        }
    }, [movieId, currentTime])

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime)
        }
    }

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration)
        }
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value)
        if (videoRef.current) {
            videoRef.current.currentTime = time
            setCurrentTime(time)
        }
    }

    const skip = (seconds: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime += seconds
        }
    }

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen()
            } else {
                videoRef.current.requestFullscreen()
            }
        }
    }

    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600)
        const minutes = Math.floor((time % 3600) / 60)
        const seconds = Math.floor(time % 60)

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    // Render embedded iframe for streaming services
    if (isEmbedded) {
        return (
            <div className="video-player-wrapper">
                <div className="video-player-container">
                    <iframe
                        src={videoUrl}
                        className="video-element"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none'
                        }}
                    />
                </div>
            </div>
        )
    }

    // Render native video player for direct MP4 links
    return (
        <div className="video-player-wrapper">
            <div className="video-player-container">
                <video
                    ref={videoRef}
                    className="video-element"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    poster="/images/roofman-poster.jpg"
                >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Play Overlay */}
                {!isPlaying && (
                    <div className="play-overlay" onClick={togglePlay}>
                        <button className="play-button-large">
                            <Play className="play-icon-large" fill="white" />
                        </button>
                    </div>
                )}

                {/* Controls */}
                <div className="video-controls">
                    <div className="progress-bar-container">
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="progress-bar"
                        />
                    </div>

                    <div className="controls-bottom">
                        {/* Left Controls */}
                        <div className="controls-left">
                            <button onClick={togglePlay} className="control-btn">
                                {isPlaying ? <Pause className="control-icon" /> : <Play className="control-icon" />}
                            </button>
                            <button onClick={toggleMute} className="control-btn">
                                {isMuted ? <VolumeX className="control-icon" /> : <Volume2 className="control-icon" />}
                            </button>
                            <span className="time-display">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                        </div>

                        {/* Right Controls */}
                        <div className="controls-right">
                            <button onClick={() => skip(-10)} className="control-btn">
                                <RotateCcw className="control-icon" />
                                <span className="skip-text">10</span>
                            </button>
                            <button onClick={() => skip(10)} className="control-btn">
                                <RotateCw className="control-icon" />
                                <span className="skip-text">10</span>
                            </button>
                            <button className="control-btn">
                                <Settings className="control-icon" />
                            </button>
                            <button onClick={toggleFullscreen} className="control-btn">
                                <Maximize className="control-icon" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer