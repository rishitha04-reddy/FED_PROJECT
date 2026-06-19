import { PhoneCall } from 'lucide-react';

function Airlines() {
  const airlines = [
    {
      name: "Lufthansa",
      code: "LH",
      speed: "Fast (2-3 weeks)",
      rating: "4.8/5",
      policy: "Strong compliance with EU261. Usually pays compensation directly upon operational verification of technical fault delays.",
      contact: "customer.relations@lufthansa.com | +49 (69) 86 799 799"
    },
    {
      name: "Air France",
      code: "AF",
      speed: "Moderate (3-5 weeks)",
      rating: "4.5/5",
      policy: "Requires formal flight log audits. Complies fully but can sometimes experience administrative backlog.",
      contact: "mail.disputes@airfrance.fr | +33 (0) 9 69 39 36 54"
    },
    {
      name: "British Airways",
      code: "BA",
      speed: "Fast (2-4 weeks)",
      rating: "4.7/5",
      policy: "Applies UK passenger rights (which mirror EU261). Processes claims through a structured portal with low rejection rates for genuine delays.",
      contact: "claims@britishairways.com | +44 344 493 0787"
    },
    {
      name: "Ryanair",
      code: "FR",
      speed: "Slow (6-8 weeks)",
      rating: "3.2/5",
      policy: "Known to vigorously dispute claims citing weather/ATC. Often requires legal escalation through mediation bodies to trigger payout.",
      contact: "refunds@ryanair.ie | +353 1 945 1818"
    },
    {
      name: "Delta Air Lines",
      code: "DL",
      speed: "Fast (1-2 weeks)",
      rating: "4.9/5",
      policy: "Applies US DOT rules for cancellations. Outstanding customer care. Proactively provides flight vouchers and ticket refunds.",
      contact: "us.refunds@delta.com | +1 (800) 221-1212"
    }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Airline Compensation Policies</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Browse the processing speed, contact details, and compliance records of major international carriers.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {airlines.map((a, idx) => (
          <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="gradient-bg" style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '10px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-title)',
                  fontWeight: 800,
                  fontSize: '1.25rem'
                }}>
                  {a.code}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{a.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Carrier Code: {a.code}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>{a.rating}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Compliance Rating</span>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }}></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div>
                <strong style={{ color: 'var(--text-secondary)' }}>Avg. Processing Speed: </strong>
                <span style={{ fontWeight: 600 }}>{a.speed}</span>
              </div>
              <div>
                <strong style={{ color: 'var(--text-secondary)' }}>Regulation Stance: </strong>
                <p style={{ marginTop: '0.25rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{a.policy}</p>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-tertiary)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <PhoneCall size={14} style={{ flexShrink: 0 }} />
              <span className="truncate">{a.contact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Airlines;
