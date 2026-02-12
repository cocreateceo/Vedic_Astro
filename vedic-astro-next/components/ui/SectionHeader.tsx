interface SectionHeaderProps {
  sanskrit?: string;
  title: string;
  description?: string;
}

export default function SectionHeader({ sanskrit, title, description }: SectionHeaderProps) {
  return (
    <div className="text-center mb-12">
      {sanskrit && (
        <p className="font-devanagari text-sign-primary/80 text-lg mb-2">{sanskrit}</p>
      )}
      <h2 className="font-heading text-3xl md:text-4xl text-sign-primary mb-4 drop-shadow-[0_0_20px_rgba(var(--sign-glow-rgb),0.3)]">
        {title}
      </h2>
      {description && (
        <p className="text-text-muted max-w-[600px] mx-auto">{description}</p>
      )}
    </div>
  );
}
