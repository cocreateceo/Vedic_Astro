'use client';

/**
 * G6 — Temple Gopuram Page Frame
 * Subtle ornamental side borders and corner pieces that frame the entire page,
 * inspired by temple gopuram pillar carvings.
 */
export default function TempleGopuramFrame() {
  const cornerSvg = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0 L24 0 L24 4 C18 4 8 4 4 8 C4 14 4 18 4 24 L0 24 Z" fill="rgba(var(--sign-glow-rgb), 0.15)" />
      <path d="M0 0 L20 0 C14 2 6 6 2 14 L0 20 Z" fill="rgba(var(--sign-glow-rgb), 0.08)" />
      <circle cx="6" cy="6" r="2" fill="rgba(var(--sign-glow-rgb), 0.3)" />
    </svg>
  );

  return (
    <>
      <div className="gopuram-frame" aria-hidden="true" />
      <div className="gopuram-top" aria-hidden="true" />
      <div className="gopuram-corner gopuram-corner-tl">{cornerSvg}</div>
      <div className="gopuram-corner gopuram-corner-tr">{cornerSvg}</div>
      <div className="gopuram-corner gopuram-corner-bl">{cornerSvg}</div>
      <div className="gopuram-corner gopuram-corner-br">{cornerSvg}</div>
    </>
  );
}
