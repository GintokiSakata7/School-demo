import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

export function SectionHeading({ eyebrow, title, description, align = 'left', dark = false }: { eyebrow: ReactNode; title: ReactNode; description?: ReactNode; align?: 'left' | 'center'; dark?: boolean }) {
  return <Reveal className={`section-heading ${align === 'center' ? 'section-heading-center' : ''} ${dark ? 'section-heading-dark' : ''}`}>
    <span className="eyebrow"><i />{eyebrow}</span>
    <h2>{title}</h2>
    {description && <p>{description}</p>}
  </Reveal>;
}

