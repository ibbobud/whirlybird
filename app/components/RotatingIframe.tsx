'use client';

import { useState, useEffect, useRef } from 'react';

interface RotatingIframeProps {
  urls: string[];
  rotationInterval?: number;
}

export default function RotatingIframe({ urls, rotationInterval: defaultInterval = 10000 }: RotatingIframeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalTime, setIntervalTime] = useState(defaultInterval);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    // Fetch the current settings
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const settings = await response.json();
          if (settings.rotationInterval) {
            setIntervalTime(settings.rotationInterval);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    if (urls.length <= 1) return;

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Set up new timer with current interval
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % urls.length);
    }, intervalTime);

    timerRef.current = timer;

    // Cleanup on unmount or when interval/urls change
    return () => {
      clearInterval(timer);
    };
  }, [urls, intervalTime]);

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
