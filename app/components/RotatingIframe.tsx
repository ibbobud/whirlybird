'use client';

import { useState, useEffect } from 'react';

interface RotatingIframeProps {
  urls: string[];
  rotationInterval?: number;
}

export default function RotatingIframe({ urls, rotationInterval: defaultInterval = 10000 }: RotatingIframeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [interval, setInterval] = useState(defaultInterval);

  useEffect(() => {
    // Fetch the current settings
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const settings = await response.json();
          setInterval(settings.rotationInterval);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    if (urls.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % urls.length);
    }, interval);

    return () => clearInterval(timer);
  }, [urls, interval]);

  if (!urls.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl">No URLs configured</p>
      </div>
    );
  }

  return (
    <iframe
      src={urls[currentIndex]}
      className="w-full h-full border-none"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}
