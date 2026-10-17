import { useSyncExternalStore } from 'react';

const REDUCED = '(prefers-reduced-motion: reduce)';

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

/** true khi người dùng bật giảm chuyển động: tắt gõ chữ, ánh sáng đứng yên. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

function subscribeResize(cb: () => void) {
  window.addEventListener('resize', cb);
  return () => window.removeEventListener('resize', cb);
}

/** Kích thước cửa sổ dạng "rộngxcao" (chuỗi để so sánh ổn định). */
export function useViewport(): { width: number; height: number } {
  const key = useSyncExternalStore(
    subscribeResize,
    () => `${window.innerWidth}x${window.innerHeight}`,
    () => '360x640',
  );
  const [width, height] = key.split('x').map(Number) as [number, number];
  return { width, height };
}
