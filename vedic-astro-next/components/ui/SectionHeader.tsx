import SanskritTypewriter from './SanskritTypewriter';
import Kalash from './Kalash';

interface SectionHeaderProps {
  sanskrit?: string;
  title: string;
  description?: string;
  emoji?: string;
  /** Enable typewriter effect for Sanskrit text */
  typewriter?: boolean;
  /** Show Kalash (sacred pot) icon above the header */
  kalash?: boolean;
}

export default function SectionHeader({ sanskrit, title, description, emoji, typewriter = false, kalash = false }: SectionHeaderProps) {
  return (
    <div className="text-center mb-12">
      {kalash && (
        <div className="flex justify-center mb-3 text-sign-primary">
          <Kalash size={40} />
        </div>
      )}
      {sanskrit && (
        <p className="font-devanagari text-sign-primary/80 text-lg mb-2 devanagari-glow">
          {emoji && <span className="mr-1 notranslate" translate="no">{emoji}</span>}
          {typewriter ? <SanskritTypewriter text={sanskrit} speed={100} /> : sanskrit}
          {emoji && <span className="ml-1 notranslate" translate="no">{emoji}</span>}
        </p>
      )}
      <h2 className="font-heading text-3xl md:text-4xl mb-4 temple-gradient drop-shadow-[0_0_20px_rgba(var(--sign-glow-rgb),0.3)]">
        {!sanskrit && emoji && <span className="mr-2 notranslate" translate="no">{emoji}</span>}
        {title}
        {!sanskrit && emoji && <span className="ml-2 notranslate" translate="no">{emoji}</span>}
      </h2>
      {description && (
        <p className="text-text-muted max-w-[600px] mx-auto">{description}</p>
      )}
    </div>
  );
}
