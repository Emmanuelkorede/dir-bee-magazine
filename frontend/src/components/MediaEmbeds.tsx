import React from 'react';

interface EmbedProps {
  rawUrl: string;
}

export const VideoEmbed: React.FC<EmbedProps> = ({ rawUrl }) => {
  if (!rawUrl) return null;

  const parseVideoUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      const videoId = match && match[2].length === 11 ? match[2] : null;
      return {
        type: 'youtube',
        embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : null,
      };
    }

    if (url.includes('tiktok.com')) {
      const match = url.match(/\/video\/(\d+)/);
      const videoId = match ? match[1] : null;
      return {
        type: 'tiktok',
        embedUrl: videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : null,
      };
    }

    if (url.includes('instagram.com')) {
      const cleanUrl = url.split('?')[0];
      const embedUrl = cleanUrl.endsWith('/') ? `${cleanUrl}embed` : `${cleanUrl}/embed`;
      return {
        type: 'instagram',
        embedUrl: embedUrl,
      };
    }

    return { type: 'unknown', embedUrl: url };
  };

  const videoInfo = parseVideoUrl(rawUrl);

  if (!videoInfo || !videoInfo.embedUrl) {
    return (
      <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs font-sans rounded-sm">
        Invalid or unsupported video link structure.
      </div>
    );
  }

  switch (videoInfo.type) {
    case 'youtube':
      return (
        <div className="aspect-video w-full border border-gray-200 bg-black shadow-xs">
          <iframe
            className="w-full h-full"
            src={videoInfo.embedUrl}
            title="YouTube video player"
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );

    case 'tiktok':
      return (
        <div className="flex justify-center w-full bg-black/5 py-2 border border-gray-100 shadow-xs">
          <iframe
            src={videoInfo.embedUrl}
            className="w-[325px] h-[580px]"
            style={{ border: 'none' }}
            allowFullScreen
            title="TikTok video player"
          ></iframe>
        </div>
      );

    case 'instagram':
      return (
        <div className="flex justify-center w-full shadow-xs">
          <iframe
            src={videoInfo.embedUrl}
            className="w-full max-w-[500px] h-[600px]"
            title="Instagram post embed"
            style={{ border: 0 }}
            scrolling="no"
            allowTransparency
          ></iframe>
        </div>
      );

    default:
      return (
        <a
          href={rawUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center text-xs font-sans font-bold tracking-wider uppercase text-burnt-brown hover:underline"
        >
          Watch External Media Link ↗
        </a>
      );
  }
};

export const MusicEmbed: React.FC<EmbedProps> = ({ rawUrl }) => {
  if (!rawUrl) return null;

  let embedUrl = '';
  let platform = '';

  if (rawUrl.includes('spotify.com')) {
    platform = 'spotify';
    if (rawUrl.includes('open.spotify.com')) {
      embedUrl = rawUrl.replace('open.spotify.com/', 'open.spotify.com/embed/');
    } else {
      embedUrl = rawUrl.replace('spotify.com/4', 'spotify.com/5');
    }
  } else if (rawUrl.includes('audiomack.com')) {
    platform = 'audiomack';
    embedUrl = rawUrl.includes('audiomack.com/embed/') ? rawUrl : rawUrl.replace('audiomack.com/', 'audiomack.com/embed/');
  } else if (rawUrl.includes('music.apple.com')) {
    platform = 'apple';
    embedUrl = rawUrl.replace('music.apple.com', 'embed.music.apple.com');
  }

  if (!platform) {
    return (
      <a
        href={rawUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center text-xs font-sans font-bold tracking-wider uppercase text-burnt-brown hover:underline py-1"
      >
        Listen on External Audio Platform ↗
      </a>
    );
  }

  return (
    <div className="w-full shadow-xs">
      <iframe
        src={embedUrl}
        width="100%"
        height={platform === 'spotify' ? '152' : platform === 'audiomack' ? '252' : '175'}
        style={{ border: 0 }}
        allowTransparency
        allow="encrypted-media; clipboard-write; picture-in-picture"
        title={`${platform} music player`}
        loading="lazy"
      ></iframe>
    </div>
  );
};