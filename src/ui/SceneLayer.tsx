// Ảnh nền pixel và lớp ánh sáng (docs/dac-ta-kich-ban.md mục 5).
// Phóng theo bội số nguyên với image-rendering: pixelated. `dark` không vẽ ảnh.
import type { Asset, Light } from '../content/types.ts';
import { BG_HEIGHT, BG_WIDTH } from '../content/palette.ts';
import { useReducedMotion, useViewport } from './hooks.ts';

type Props = { scene: { bg: string | null; light: Light }; assets: Map<string, Asset> };

export function SceneLayer({ scene, assets }: Props) {
  const reduced = useReducedMotion();
  const { width, height } = useViewport();
  const scale = Math.max(1, Math.floor(Math.min(width / BG_WIDTH, (height * 0.45) / BG_HEIGHT)));
  const asset = scene.bg ? assets.get(scene.bg) : undefined;
  const size = { width: BG_WIDTH * scale, height: BG_HEIGHT * scale };

  let picture = null;
  if (scene.light !== 'dark' && asset) {
    picture = asset.placeholder ? (
      <div className="bg-placeholder" role="img" aria-label={asset.alt}>
        <span>{asset.id}</span>
      </div>
    ) : (
      <img className="bg-image" src={`${import.meta.env.BASE_URL}${asset.file}`} alt={asset.alt} width={size.width} height={size.height} />
    );
  }

  return (
    <div className="scene" style={size} data-light={scene.light}>
      {picture}
      {scene.light === 'flicker' && <div className={`overlay flicker${reduced ? ' still' : ''}`} />}
      {scene.light === 'dawn' && <div className="overlay dawn" />}
      {scene.light === 'candle' && <div className={`overlay candle${reduced ? ' still' : ''}`} />}
    </div>
  );
}
