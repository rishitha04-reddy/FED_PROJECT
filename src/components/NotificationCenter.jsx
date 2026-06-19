import { Mail, CheckCircle, AlertCircle, X, Bell } from 'lucide-react';

function NotificationCenter({ toasts, setToasts }) {
  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      left: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      zIndex: 1001,
      maxWidth: '380px',
      width: 'calc(100% - 4rem)'
    }}>
      {toasts.map((t) => {
        let cardBorderColor = 'var(--primary)';
        let cardBgColor = 'var(--bg-secondary)';
        let iconElement = <Bell size={18} className="gradient-text" />;

        if (t.type === 'success') {
          cardBorderColor = 'var(--success)';
          iconElement = <CheckCircle size={18} style={{ color: 'var(--success)' }} />;
        } else if (t.type === 'danger') {
          cardBorderColor = 'var(--danger)';
          iconElement = <AlertCircle size={18} style={{ color: 'var(--danger)' }} />;
        } else if (t.type === 'warning') {
          cardBorderColor = 'var(--warning)';
          iconElement = <AlertCircle size={18} style={{ color: 'var(--warning)' }} />;
        } else if (t.type === 'info') {
          cardBorderColor = 'var(--secondary)';
          iconElement = <Mail size={18} style={{ color: 'var(--secondary)' }} />;
        }

        return (
          <div
            key={t.id}
            className="glass-panel animate-fade-in"
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              borderLeft: `4px solid ${cardBorderColor}`,
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
              position: 'relative',
              animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              backgroundColor: cardBgColor
            }}
          >
            {/* Icon */}
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              {iconElement}
            </div>

            {/* Content */}
            <div style={{ flexGrow: 1, textAlign: 'left', paddingRight: '1rem' }}>
              {t.type === 'info' && (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.15rem' }}>
                  Simulated Notification Dispatch
                </span>
              )}
              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                {t.message}
              </p>
            </div>

            {/* Dismiss */}
            <button
              onClick={() => removeToast(t.id)}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-tertiary)'
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default NotificationCenter;
