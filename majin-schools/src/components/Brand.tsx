import { Link } from 'react-router-dom';

export function Brand({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link className={`brand ${light ? 'brand-light' : ''} ${compact ? 'brand-compact' : ''}`} to="/" aria-label="Majin Schools home">
      <span className="brand-mark" aria-hidden="true"><span>M</span><i /></span>
      <span className="brand-copy"><strong>MAJIN</strong><small>SCHOOLS</small></span>
    </Link>
  );
}
