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
    <iframe
      src={urls[currentUrlIndex]}
      className="w-full h-[calc(100vh-4rem)] mt-16 border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}
