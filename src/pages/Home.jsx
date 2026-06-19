import { ShieldCheck, Hourglass, Euro, ArrowRight, Star, CheckCircle, RefreshCw } from 'lucide-react';

function Home({ navigate }) {
  const benefits = [
    {
      icon: <ShieldCheck size={32} className="gradient-text" />,
      title: "No Win, No Fee",
      desc: "Checking is completely free. We only charge a success fee if your compensation is successfully paid."
    },
    {
      icon: <Hourglass size={32} className="gradient-text" />,
      title: "3-Minute Check",
      desc: "Our automated eligibility checker cross-references EU261 & DOT regulations in seconds."
    },
    {
      icon: <Euro size={32} className="gradient-text" />,
      title: "Up to €600 Payout",
      desc: "You are legally entitled to compensation ranging from €250 to €600 per passenger depending on your flight."
    }
  ];

  const steps = [
    {
      num: "1",
      title: "Check Eligibility",
      desc: "Enter your flight number and details into our smart checker."
    },
    {
      num: "2",
      title: "Submit Claim",
      desc: "Upload photos of your boarding pass and passport securely."
    },
    {
      num: "3",
      title: "We Handle the Rest",
      desc: "Our legal experts negotiate directly with the airline and its lawyers."
    },
    {
      num: "4",
      title: "Get Paid",
      desc: "Receive your cash compensation directly in your bank account."
    }
  ];

  const testimonials = [
    {
      name: "Marcus Vance",
      role: "Delayed 4.5h on London to Berlin flight",
      quote: "I had no idea I was entitled to €400! The process took 3 minutes and in two weeks the money was in my bank. Incredible service!",
      rating: 5
    },
    {
      name: "Sarah Jenkins",
      role: "Cancelled flight Paris to New York",
      quote: "Lufthansa rejected my initial email, claiming weather. RefundFlight investigated, proved crew shortage, and got me my €600!",
      rating: 5
    }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
      
      {/* Hero Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2.5rem',
        alignItems: 'center',
        padding: '3rem 0',
      }} className="hero-section">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--primary-light)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', width: 'fit-content' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-title)' }}>
              EU261 & DOT REGULATION COMPLIANT
            </span>
          </div>
          
          <h1 style={{
            fontSize: '3.5rem',
            lineHeight: 1.1,
            fontWeight: 800,
            fontFamily: 'var(--font-title)',
          }} className="hero-title">
            Flight Delayed? Get Up to <span className="gradient-text">€600 Compensation</span>.
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            maxWidth: '550px'
          }}>
            Don't let airlines take your time. Claim compensation for flights delayed by 3+ hours, cancelled, or overbooked. Check your eligibility risk-free in 3 minutes.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('checker')} style={{ padding: '1rem 2rem', fontSize: '1.05rem' }}>
              Check Flight Eligibility <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('calculator')} style={{ padding: '1rem 2rem', fontSize: '1.05rem' }}>
              Calculate Payout
            </button>
          </div>
        </div>
        
        {/* Visual / Badge Grid */}
        <div className="glass-card" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          padding: '2.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="gradient-bg" style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            filter: 'blur(50px)',
            opacity: 0.3
          }}></div>
          
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Fast Claim Verification</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ color: 'var(--success)' }}><CheckCircle size={24} /></div>
              <div style={{ textAlign: 'left' }}>
                <h5 style={{ fontWeight: 600 }}>98% Win Success Rate</h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Based on thousands of legal claims processed successfully.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ color: 'var(--secondary)' }}><RefreshCw size={24} className="shimmer-bg" style={{ animation: 'pulse-slow 2s infinite' }} /></div>
              <div style={{ textAlign: 'left' }}>
                <h5 style={{ fontWeight: 600 }}>Quick Automated Status</h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Track claim progress in real-time on our dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '2.5rem' }}>Why Claim With Us?</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>We take the hassle and stress out of flight claims. Our team handles the entire process, including legal disputes, with no financial risk to you.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {benefits.map((b, idx) => (
            <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
              <div style={{ width: 'fit-content', backgroundColor: 'var(--primary-light)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                {b.icon}
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{b.title}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="glass-panel" style={{
        padding: '4rem 3rem',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '3.5rem'
      }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '2.5rem' }}>How the Process Works</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>Submit your claim in just four easy steps. We handle the paperwork, airline calls, and legal arguments.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem'
        }} className="steps-grid">
          {steps.map((s, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', position: 'relative' }}>
              <div className="gradient-bg" style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-title)',
                fontWeight: 800,
                fontSize: '1.2rem',
                boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
              }}>
                {s.num}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem' }}>{s.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '2.5rem' }}>What Passengers Say</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>Join over 10,000 satisfied passengers who successfully received compensation using RefundFlight.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {testimonials.map((t, idx) => (
            <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', gap: '0.2rem', color: '#fbbf24' }}>
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <p style={{ fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                "{t.quote}"
              </p>
              <div>
                <h5 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{t.name}</h5>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg" style={{
        padding: '5rem 3rem',
        borderRadius: 'var(--radius-lg)',
        color: 'white',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        boxShadow: '0 10px 30px rgba(99, 102, 241, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }}></div>
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }}></div>
        
        <h2 style={{ fontSize: '3rem', fontWeight: 800, maxWidth: '700px', lineHeight: 1.1 }}>
          Check Your Flight for Compensation Today
        </h2>
        <p style={{ maxWidth: '500px', opacity: 0.9, fontSize: '1.1rem' }}>
          Flights up to 3 years old are eligible. Check now – it only takes 3 minutes and is completely risk-free.
        </p>
        <button className="btn btn-secondary" onClick={() => navigate('checker')} style={{
          backgroundColor: 'white',
          color: 'var(--primary)',
          fontSize: '1.1rem',
          padding: '1.1rem 2.5rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          Start Free Check <ArrowRight size={20} />
        </button>
      </section>

      {/* Hero media query styling */}
      <style>{`
        @media (min-width: 768px) {
          .hero-section {
            grid-template-columns: 1.2fr 0.8fr;
          }
        }
        @media (max-width: 576px) {
          .hero-title {
            font-size: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
