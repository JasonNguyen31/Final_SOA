import '@/styles/EpisodeList.css'

interface Episode {
    number: number
    title: string
    duration: string
}

interface EpisodeListProps {
    episodes: Episode[]
    currentEpisode: number
    onEpisodeChange: (episode: number) => void
}

export const EpisodeList = ({ episodes, currentEpisode, onEpisodeChange }: EpisodeListProps) => {
    return (
        <div className="episode-list-section">
            <h3 className="episode-list-title">Episodes List</h3>
            <div className="episode-list">
                {episodes.map((episode) => (
                    <button
                        key={episode.number}
                        onClick={() => onEpisodeChange(episode.number)}
                        className={`episode-item ${currentEpisode === episode.number ? 'active' : ''}`}
                    >
                        <span className="episode-number">{episode.title}</span>
                        <span className="episode-duration">{episode.duration}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default EpisodeList