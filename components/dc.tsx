'use client';
import React, { CSSProperties, createElement, forwardRef, useMemo, useState } from 'react';

// Prototipteki inline `style` dizgelerini değiştirmeden React style nesnesine çevirir.
const cache = new Map<string, CSSProperties>();
export function css(s?: string): CSSProperties {
  if (!s) return {};
  const hit = cache.get(s);
  if (hit) return hit;
  const out: Record<string, string> = {};
  let depth = 0, cur = '';
  const parts: string[] = [];
  for (const ch of s) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (ch === ';' && depth === 0) { parts.push(cur); cur = ''; } else cur += ch;
  }
  parts.push(cur);
  for (const p of parts) {
    const i = p.indexOf(':');
    if (i < 0) continue;
    const k = p.slice(0, i).trim(), v = p.slice(i + 1).trim();
    if (!k) continue;
    const key = k.startsWith('--') ? k : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[key] = v;
  }
  cache.set(s, out as CSSProperties);
  return out as CSSProperties;
}

type EProps = {
  as?: string;
  st?: string;   // inline style
  hv?: string;   // style-hover
  fc?: string;   // style-focus
  [k: string]: any;
};

// `style` / `style-hover` / `style-focus` üçlüsünü taşıyan genel eleman.
export const E = forwardRef<any, EProps>(function E(
  { as = 'div', st, hv, fc, style, onMouseEnter, onMouseLeave, onFocus, onBlur, children, ...rest },
  ref
) {
  const [h, setH] = useState(false);
  const [f, setF] = useState(false);
  const base = useMemo(() => css(st), [st]);
  const merged = { ...base, ...(h && hv ? css(hv) : null), ...(f && fc ? css(fc) : null), ...style };
  const props: Record<string, any> = { ...rest, ref, style: merged };
  if (hv) {
    props.onMouseEnter = (e: any) => { setH(true); onMouseEnter && onMouseEnter(e); };
    props.onMouseLeave = (e: any) => { setH(false); onMouseLeave && onMouseLeave(e); };
  } else { props.onMouseEnter = onMouseEnter; props.onMouseLeave = onMouseLeave; }
  if (fc) {
    props.onFocus = (e: any) => { setF(true); onFocus && onFocus(e); };
    props.onBlur = (e: any) => { setF(false); onBlur && onBlur(e); };
  } else { props.onFocus = onFocus; props.onBlur = onBlur; }
  return createElement(as, props, children);
});
