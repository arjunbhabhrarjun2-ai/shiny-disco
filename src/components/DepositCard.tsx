interface CardProps {
  title: string;
  amount: number;
}

export default function Card({ title, amount }: CardProps) {
  return (
    <div
      className="rounded-2xl p-4 text-center"
      style={{
        background: '#0D1421',
        border: '1px solid rgba(59,130,246,0.2)',
        boxShadow: '0 0 12px rgba(59,130,246,0.06)',
      }}
    >
      <h2 className="text-sm font-medium mb-1" style={{ color: '#9CA3AF' }}>{title}</h2>
      <p
        className="text-2xl font-bold"
        style={{ color: '#3B82F6', fontFamily: 'var(--font-space-grotesk, system-ui)' }}
      >
        ${amount.toFixed(2)}
      </p>
    </div>
  );
}
