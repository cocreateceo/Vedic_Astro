interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <div className={`glass-card p-6 ${hover ? 'hover:border-sign-primary/30 hover:shadow-[0_0_20px_rgba(var(--sign-glow-rgb),0.1)]' : ''} ${className}`}>
      {children}
    </div>
  );
}
