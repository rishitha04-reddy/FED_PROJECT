import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

function ContactUs() {
  const { addToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      addToast('Please fill in all fields before submitting.', 'warning');
      return;
    }

    // Simulate form submission
    addToast('Message sent! Our customer relations team will contact you shortly.', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }} className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Contact Our Support Team</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Have questions about a claim or passenger regulations? Send us a message and we'll reply within 24 hours.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2.5rem',
      }} className="contact-layout">
        
        {/* Contact Info Card */}
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-title)' }}>Get in Touch</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="gradient-bg" style={{ padding: '0.6rem', borderRadius: '8px', color: 'white', display: 'flex' }}>
                <Mail size={18} />
              </div>
              <div>
                <h5 style={{ fontWeight: 600, fontSize: '1rem' }}>Email Support</h5>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>support@refundflight.mock</p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>Direct claims handling team.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="gradient-bg" style={{ padding: '0.6rem', borderRadius: '8px', color: 'white', display: 'flex' }}>
                <Phone size={18} />
              </div>
              <div>
                <h5 style={{ fontWeight: 600, fontSize: '1rem' }}>Phone Lines</h5>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>+1 (800) 555-CLAIM</p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>Mon-Fri, 9:00 AM - 5:00 PM CET.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div className="gradient-bg" style={{ padding: '0.6rem', borderRadius: '8px', color: 'white', display: 'flex' }}>
                <MapPin size={18} />
              </div>
              <div>
                <h5 style={{ fontWeight: 600, fontSize: '1rem' }}>European Headquarters</h5>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Flight Compensation Plaza, Brussels, Belgium</p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>Close to the European Commission.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-title)', marginBottom: '1.5rem' }}>Send Message</h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Claim Inquiry / Regulatory Question"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="form-input form-textarea"
                placeholder="Write your message details..."
                rows="4"
                style={{ resize: 'vertical' }}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Send size={16} /> Send Message
            </button>
          </form>
        </div>

      </div>
      
      <style>{`
        @media (min-width: 768px) {
          .contact-layout {
            grid-template-columns: 0.9fr 1.1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default ContactUs;
