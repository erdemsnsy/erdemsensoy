import { ICONS } from '@/lib/icons';

export function Brand({ name, size }: { name: keyof typeof ICONS; size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#fff" role="img" aria-hidden="true" style={{ width: size, height: size, display: 'block', flex: 'none' }}>
      <path d={ICONS[name]} />
    </svg>
  );
}

