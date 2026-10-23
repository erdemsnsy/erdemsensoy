'use client';
import Image from 'next/image';
import { useState } from 'react';

// Prototipteki <image-slot> yerine: /public/images/<id>.jpg varsa görseli gösterir (object-fit: cover),
// yoksa prototipteki boş yer tutucuyu (kesik çizgili çerçeve + açıklama) çizer.
export default function ImageSlot({ id, placeholder, sizes = '(max-width: 760px) 100vw, 50vw' }: { id: string; placeholder: string; sizes?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div style={{ display: 'block', position: 'absolute', inset: 0, width: '100%', height: '100%', font: '13px/1.3 system-ui,-apple-system,sans-serif' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'rgba(127,127,127,.08)' }}>
        {!failed && (
          <Image src={`/images/${id}.jpg`} alt={placeholder} fill sizes={sizes} onError={() => setFailed(true)} style={{ objectFit: 'cover' }} />
        )}
      </div>
      {failed && (
        <>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, textAlign: 'center', padding: 12, boxSizing: 'border-box', userSelect: 'none' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.45 }}>
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="1.6" /><path d="m21 15-5-5L5 21" />
            </svg>
            <span style={{ maxWidth: '90%', fontWeight: 500, letterSpacing: '.01em', opacity: 0.75 }}>{placeholder}</span>
          </div>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', border: '1.5px dashed currentColor', opacity: 0.35 }} />
        </>
      )}
    </div>
  );
}
