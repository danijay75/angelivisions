export type AudioTrack = {
  id: string
  title: string
  artist?: string
  src: string // data URL or remote URL
  format: "mp3" | "unknown" // Suppression du format "aaf"
  cover?: string // optional image for the track
  duration?: number // seconds, optional hint
}

export const AUDIO_STORAGE_KEY = "av_audio_tracks_v1"

export const defaultTracks: AudioTrack[] = [
  // Laissez vide par défaut. Vous pouvez ajouter des pistes depuis l’admin.
  // Exemple de structure:
  // {
  //   id: "midnight-vibes",
  //   title: "Midnight Vibes",
  //   artist: "EventPro Productions",
  //   src: "https://cdn.example.com/audio/midnight-vibes.mp3",
  //   format: "mp3",
  //   cover: "/abstract-soundscape.png",
  // }
]
