// Bảng Huyết tự mở bằng nút "Huyết tự": bản gốc hoặc bản méo, không có dấu hiệu phân biệt.
import { useEffect, useRef } from 'react';
import type { BloodtextView } from '../engine/index.ts';
import { BloodLines } from './channels/Bloodtext.tsx';
import { strings } from './strings.ts';

export function BloodtextPanel({ lines, onClose }: { lines: BloodtextView[]; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={strings.bloodtext} onClick={(e) => e.stopPropagation()}>
        <h2>{strings.bloodtext}</h2>
        {lines.length ? <BloodLines lines={lines} /> : <p className="hint">{strings.bloodtextLocked}.</p>}
        <button ref={closeRef} type="button" className="btn" onClick={onClose}>
          {strings.close}
        </button>
      </div>
    </div>
  );
}
