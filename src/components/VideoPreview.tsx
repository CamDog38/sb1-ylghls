import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';

interface VideoPreviewProps {
  url: string;
}

export function VideoPreview({ url }: VideoPreviewProps) {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const urlObj = new URL(url);
      let id = null;
      if (urlObj.hostname.includes('youtube.com')) {
        id = urlObj.searchParams.get('v');
      } else if (urlObj.hostname.includes('youtu.be')) {
        id = urlObj.pathname.slice(1);
      }
      if (id) {
        setVideoId(id);
      } else {
        setError('Invalid YouTube video URL');
      }
    } catch (e) {
      setError('Invalid video URL');
    }
  }, [url]);

  if (error) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px]">
        <div className="text-gray-500">{error}</div>
      </div>
    );
  }

  if (!videoId) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px]">
        <Play className="w-12 h-12 text-gray-400" />
        <div className="text-gray-500 mt-2">Loading video...</div>
      </div>
    );
  }

  return (
    <div className="relative pb-[56.25%] h-0">
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
