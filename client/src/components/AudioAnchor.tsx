import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioAnchorProps {
  src: string;
  volume?: number; // 0.0 to 1.0
  loop?: boolean;
  autoPlay?: boolean;
  className?: string;
}

export const AudioAnchor: React.FC<AudioAnchorProps> = ({
  src,
  volume = 0.3,
  loop = true,
  autoPlay = true,
  className = "fixed top-4 right-4 z-50"
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = 0; // Start at 0 for fade in
    audioRef.current = audio;

    if (autoPlay) {
      audio.play().then(() => {
        setIsPlaying(true);
        // Fade in
        const fadeInterval = setInterval(() => {
          if (audio.volume < volume) {
            audio.volume = Math.min(audio.volume + 0.05, volume);
          } else {
            clearInterval(fadeInterval);
          }
        }, 200);
      }).catch(err => {
        console.log("Audio autoplay blocked:", err);
      });
    }

    return () => {
      // Fade out on unmount
      const fadeOutInterval = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume = Math.max(audio.volume - 0.05, 0);
        } else {
          audio.pause();
          audio.remove();
          clearInterval(fadeOutInterval);
        }
      }, 100);
    };
  }, [src, volume, loop, autoPlay]);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  return (
    <button 
      onClick={toggleMute}
      className={`p-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 text-white/60 hover:bg-black/40 hover:text-white transition-all ${className}`}
    >
      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  );
};
