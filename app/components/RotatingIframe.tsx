'use client';

import { useState, useEffect } from 'react';

interface RotatingIframeProps {
  urls: string[];
  rotationInterval?: number; // in milliseconds
}

export default function RotatingIframe({ urls, rotationInterval = 10000 }: RotatingIframeProps) {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);

  useEffect(() => {
    if (urls.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentUrlIndex((prevIndex) => (prevIndex + 1) % urls.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [urls, rotationInterval]);

  if (!urls.length) return null;

  return (
    <div className="w-full h-full overflow-hidden">
      <iframe
        src={urls[currentUrlIndex]}
        className="w-full h-full border-0"
        style={{
          overflow: 'hidden',
          width: '100%',
          height: '100%'
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        scrolling="no"
      />
    </div>
  );
}
