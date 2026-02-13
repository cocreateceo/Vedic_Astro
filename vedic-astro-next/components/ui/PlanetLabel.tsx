import { getPlanetEmoji } from '@/lib/navagraha';

interface PlanetLabelProps {
  name: string;
  /** Show Sanskrit name in parentheses */
  sanskrit?: boolean;
  className?: string;
}

/** Renders a planet name with its Navagraha emoji */
export default function PlanetLabel({ name, sanskrit = false, className = '' }: PlanetLabelProps) {
  const emoji = getPlanetEmoji(name);
  return (
    <span className={className}>
      <span className="mr-1 notranslate" translate="no">{emoji}</span>
      {name}
    </span>
  );
}
