'use client';

import { useEffect, useRef } from 'react';

export default function OmSound() {
  const played = useRef(false);

  useEffect(() => {
    // Only play once per session
    if (sessionStorage.getItem('om-played')) return;

    function playOm() {
      if (played.current) return;
      played.current = true;

      const audio = new Audio('/audio/om.mp3');
      audio.volume = 0;
      audio.play().then(() => {
        // Gentle fade in to 15% volume over 1 second
        let vol = 0;
        const fade = setInterval(() => {
          vol += 0.01;
          if (vol >= 0.15) {
            vol = 0.15;
            clearInterval(fade);
          }
          audio.volume = vol;
        }, 70);

        sessionStorage.setItem('om-played', '1');
      }).catch(() => {
        // Browser blocked autoplay — that's fine, we tried
        played.current = false;
      });

      // Remove listeners after first play
      cleanup();
    }

    function cleanup() {
      window.removeEventListener('click', playOm);
      window.removeEventListener('scroll', playOm);
      window.removeEventListener('keydown', playOm);
      window.removeEventListener('touchstart', playOm);
    }

    window.addEventListener('click', playOm, { once: true });
    window.addEventListener('scroll', playOm, { once: true });
    window.addEventListener('keydown', playOm, { once: true });
    window.addEventListener('touchstart', playOm, { once: true });

    return cleanup;
  }, []);

  return null;
}
