// Skeleton UI Loader mapping to CO4: Async Data Engineering (Skeleton UIs)
// Renders responsive placeholder boxes with a keyframe shimmer animation.

export function SkeletonLoader({ type = 'list', count = 3 }) {
  const renderListSkeleton = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="glass-card shimmer-box" style={{
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          minHeight: '80px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
            <div style={{ width: '80px', height: '14px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}></div>
            <div style={{ width: '60%', height: '18px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}></div>
            <div style={{ width: '40%', height: '12px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}></div>
          </div>
          <div style={{ width: '120px', height: '36px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-sm)' }}></div>
        </div>
      ))}
    </div>
  );

  const renderCardSkeleton = () => (
    <div className="glass-card shimmer-box" style={{
      padding: '2.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--border-color)' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
          <div style={{ width: '40%', height: '16px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}></div>
          <div style={{ width: '25%', height: '12px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}></div>
        </div>
      </div>
      <div style={{ height: '1px', backgroundColor: 'var(--border-color)', width: '100%' }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ width: '90%', height: '14px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}></div>
        <div style={{ width: '85%', height: '14px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}></div>
        <div style={{ width: '70%', height: '14px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }}></div>
      </div>
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .shimmer-box {
          position: relative;
          overflow: hidden;
        }
        .shimmer-box div {
          background: linear-gradient(90deg, 
            var(--bg-secondary) 25%, 
            var(--bg-tertiary) 50%, 
            var(--bg-secondary) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>
      {type === 'card' ? renderCardSkeleton() : renderListSkeleton()}
    </div>
  );
}

export default SkeletonLoader;
