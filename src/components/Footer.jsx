import { Plane, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

function Footer({ navigate }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-panel" style={{
      borderRadius: 0,
      borderBottom: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderTop: '1px solid var(--border-color)',
      padding: '4rem 2rem 2rem 2rem',
      backgroundColor: 'var(--bg-secondary)',
      marginTop: '4rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2.5rem',
        marginBottom: '3rem'
      }}>
        {/* Company Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => navigate('home')}>
            <div className="gradient-bg" style={{
              padding: '0.4rem',
              borderRadius: '8px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Plane size={20} style={{ transform: 'rotate(45deg)' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: '1.2rem' }}>
              Refund<span className="gradient-text">Flight</span>
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Helping airline passengers claim their rightful compensation for delayed, cancelled, or overbooked flights under EU Regulation 261/2004 and DOT guidelines.
          </p>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ fontFamily: 'var(--font-title)', fontSize: '1rem', fontWeight: 700 }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <li>
              <button onClick={() => navigate('checker')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Check Eligibility</button>
            </li>
            <li>
              <button onClick={() => navigate('calculator')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Compensation Calculator</button>
            </li>
            <li>
              <button onClick={() => navigate('submit')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Submit Claim</button>
            </li>
            <li>
              <button onClick={() => navigate('track')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Track Claim</button>
            </li>
          </ul>
        </div>

        {/* Legal & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ fontFamily: 'var(--font-title)', fontSize: '1rem', fontWeight: 700 }}>Info & Support</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <li>
              <button onClick={() => navigate('airlines')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Airlines Info</button>
            </li>
            <li>
              <button onClick={() => navigate('faq')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>FAQ Section</button>
            </li>
            <li>
              <button onClick={() => navigate('contact')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Contact Us</button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <h4 style={{ fontFamily: 'var(--font-title)', fontSize: '1rem', fontWeight: 700 }}>Get In Touch</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} /> support@refundflight.mock
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} /> +1 (800) 555-CLAIM
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} /> Flight Compensation Plaza, Brussels, EU
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--border-color)', marginBottom: '1.5rem' }}></div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '0.8rem',
        color: 'var(--text-tertiary)'
      }}>
        <span>&copy; {currentYear} RefundFlight. All rights reserved. developed for academic project demonstration.</span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>EU261 Rights <ExternalLink size={12} /></a>
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>DOT Rules <ExternalLink size={12} /></a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
