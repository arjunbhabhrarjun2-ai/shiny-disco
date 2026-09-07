'use client';

import { useEffect } from 'react';

/**
 * Marks the document as successfully hydrated once React mounts.
 *
 * An inline <head> script in the root layout starts a failsafe timer: if this
 * class is not present shortly after load (i.e. client JS failed to run — old
 * Safari, corrupted/hung JS download, a hydration crash), it adds
 * `anim-dead` to <html>, and a global CSS rule then force-reveals every
 * element that framer-motion left at opacity:0 in the server HTML.
 *
 * Keeping the marker in its own tiny component means the layout itself needs
 * no effects — if ANY part of the React tree mounts, content is un-hidden.
 */
export default function AppBootMarker() {
  useEffect(() => {
    document.documentElement.classList.add('app-hydrated');
    // Cancel the head-script failsafe timer once we know hydration happened.
    const cancel = (window as any).__cancelBootFailsafe;
    if (typeof cancel === 'function') cancel();
  }, []);
  return null;
}
