'use client';

// Mobil menü düğmesi (yalnızca < 760px'te kullanılır)
export default function Burger({ open, onClick, label, color, border }: { open: boolean; onClick: () => void; label: string; color: string; border: string }) {
  const bar = (rot: number, y: number, hide?: boolean): React.CSSProperties => ({
    position: 'absolute', left: 10, top: 17 + y, width: 16, height: 2, borderRadius: 2, background: color,
    transition: 'transform .25s, opacity .2s', transform: open ? `translateY(${-y}px) rotate(${rot}deg)` : 'none', opacity: hide && open ? 0 : 1
  });
  return (
    <button onClick={onClick} aria-label={label} aria-expanded={open} style={{ all: 'unset', cursor: 'pointer', position: 'relative', width: 36, height: 36, flex: 'none', border: `1px solid ${border}`, borderRadius: '50%', boxSizing: 'border-box' }}>
      <span style={bar(45, -5)} /><span style={bar(0, 0, true)} /><span style={bar(-45, 5)} />
    </button>
  );
}
