import { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import { User, FileText, FileDown, Eye, LogOut, ArrowRight, MailOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';

function UserDashboard({ navigate }) {
  const { claims, currentUser, login, logout, addToast } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [passport, setPassport] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please fill in email and password.', 'warning');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = (e) => {
    // Note: Simulated registration writes directly to state
    e.preventDefault();
    if (!name || !email || !phone || !passport || !password) {
      addToast('Please fill in all registration fields.', 'warning');
      return;
    }

    const userObj = { name, email, phone, passport };
    localStorage.setItem('currentUser', JSON.stringify(userObj));
    window.location.reload(); // Re-fetch through provider initializer
    addToast('Account registered and logged in!', 'success');
  };

  const handleLogout = () => {
    logout();
  };

  // Memoized user claims mapping to CO5: Memoization & CO4: Derived state
  const userClaims = useMemo(() => {
    if (!currentUser) return [];
    return claims.filter(c => c.passengerEmail.toLowerCase() === currentUser.email.toLowerCase());
  }, [claims, currentUser]);

  // Derived dashboard metrics mapping to CO4: Derived state
  const stats = useMemo(() => {
    const approved = userClaims.filter(c => c.status === 'Approved');
    const pending = userClaims.filter(c => c.status === 'Submitted' || c.status === 'Processing');
    const totalPayout = approved.reduce((acc, c) => acc + c.compensationAmount * 90, 0);

    return {
      approvedCount: approved.length,
      pendingCount: pending.length,
      totalPayout
    };
  }, [userClaims]);

  const handleExportPDF = (claim) => {
    try {
      const doc = new jsPDF();
      
      doc.setFillColor(79, 70, 229); 
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text("RefundFlight claim receipt", 20, 26);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(224, 231, 255);
      doc.text(`Official Dispute Summary • Claim ID: ${claim.id}`, 20, 34);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Receipt Date: ${new Date().toLocaleDateString()}`, 140, 26);
      doc.text(`Regulation Jurisdiction: EU261 / DOT`, 140, 32);
      
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text("Claim Summary", 20, 60);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Claim ID: ${claim.id}`, 20, 70);
      doc.text(`Filing Status: ${claim.status}`, 20, 78);
      doc.text(`Filing Date: ${new Date(claim.submittedAt).toLocaleDateString()}`, 20, 86);
      
      doc.setFont("Helvetica", "bold");
      doc.text(`Approved Payout Compensation: INR ${(claim.compensationAmount * 90).toLocaleString('en-IN')} (EUR ${claim.compensationAmount})`, 20, 94);
      
      doc.setDrawColor(226, 232, 240);
      doc.line(20, 102, 190, 102);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Passenger Details", 20, 115);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Passenger Name: ${claim.passengerName}`, 20, 125);
      doc.text(`Email Address: ${claim.passengerEmail}`, 20, 133);
      doc.text(`Phone Number: ${claim.passengerPhone}`, 20, 141);
      doc.text(`Passport / ID: ${claim.passportNumber}`, 20, 149);

      doc.line(20, 157, 190, 157);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Flight Disruption Details", 20, 170);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Flight Number: ${claim.flightNumber}`, 20, 180);
      doc.text(`Route: ${claim.departureAirport} to ${claim.arrivalAirport}`, 20, 188);
      doc.text(`Date of Flight: ${claim.flightDate}`, 20, 196);
      doc.text(`Disruption Duration: ${claim.delayHours} hours`, 20, 204);
      doc.text(`Disruption Cause: ${claim.delayReason}`, 20, 212);

      doc.setDrawColor(226, 232, 240);
      doc.line(20, 260, 190, 260);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("This is a simulated document generated for academic presentation purposes. No real transaction took place.", 20, 270);
      doc.text("RefundFlight Passenger Disputes, Flight Compensation Plaza, Brussels, Belgium.", 20, 275);
      
      doc.save(`RefundFlight_Receipt_${claim.id}.pdf`);
      addToast(`PDF Receipt for ${claim.id} downloaded!`, 'success');
    } catch (err) {
      console.error("PDF generation failed:", err);
      addToast("Failed to generate PDF.", "danger");
    }
  };

  if (!currentUser) {
    return (
      <div style={{ maxWidth: '480px', margin: '4rem auto' }} className="glass-card animate-fade-in">
        <div className="tabs">
          <button className={`tab-btn ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>
            Sign In
          </button>
          <button className={`tab-btn ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>
            Register Account
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="jane.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem' }}>
              Sign In
            </button>
            
            <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
              <strong>Demo Hint:</strong> Use <code>jane.doe@example.com</code> or <code>john.smith@example.com</code> with any password to load existing claims!
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="alex.m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-row" style={{ gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Passport / ID</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. PP12345"
                  value={passport}
                  onChange={(e) => setPassport(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem' }}>
              Create Account
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div className="gradient-bg" style={{ width: '64px', height: '64px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome back, {currentUser.name}!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Passenger Account • {currentUser.email}
            </p>
          </div>
        </div>

        <button className="btn btn-secondary" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Metrics Row mapping to CO4: Derived state & CO5: Performance metrics visualizer */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
      }}>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'left', borderLeft: '4px solid var(--success)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Total Approved Payout</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>
            ₹{stats.totalPayout.toLocaleString('en-IN')}
          </h2>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'left', borderLeft: '4px solid var(--primary)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Approved Claims</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
            {stats.approvedCount}
          </h2>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'left', borderLeft: '4px solid var(--warning)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Pending Review</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.25rem' }}>
            {stats.pendingCount}
          </h2>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2rem',
      }} className="dashboard-grid">
        
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-title)' }}>Your Compensation Claims</h3>
            <button className="btn btn-primary" onClick={() => navigate('checker')} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              Check New Flight <ArrowRight size={14} />
            </button>
          </div>

          {userClaims.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {userClaims.map(claim => (
                <div key={claim.id} style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-primary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, fontFamily: 'var(--font-title)', fontSize: '1.05rem', color: 'var(--primary)' }}>
                        {claim.id}
                      </span>
                      <span className={`badge badge-${claim.status.toLowerCase()}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                        {claim.status}
                      </span>
                    </div>
                    
                    <h4 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.15rem' }}>
                      {claim.flightNumber}: {claim.departureAirport} to {claim.arrivalAirport}
                    </h4>
                    
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Flight Date: {claim.flightDate} • Delay: {claim.delayHours} hrs • Compensation: <strong>₹{(claim.compensationAmount * 90).toLocaleString('en-IN')}</strong>
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => navigate(`track`)} 
                      className="btn btn-secondary" 
                      style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      title="Track Claim Journey"
                    >
                      <Eye size={14} /> Track
                    </button>
                    <button 
                      onClick={() => handleExportPDF(claim)} 
                      className="btn btn-outline" 
                      style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      title="Export Claim as PDF Receipt"
                    >
                      <FileDown size={14} /> PDF Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '1.5px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
              <FileText size={40} style={{ color: 'var(--text-tertiary)', marginBottom: '1rem' }} />
              <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>No Claims Found</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '350px', margin: '0 auto 1.25rem auto' }}>
                We couldn't find any claims associated with your email address. Make a check to submit your first claim.
              </p>
              <button className="btn btn-secondary" onClick={() => navigate('checker')} style={{ fontSize: '0.85rem' }}>
                Check Flight Eligibility
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MailOpen size={18} /> Communication Log
            </h3>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Real-time audit log of email updates sent to you by our claims reviewers:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
              {userClaims.length > 0 ? (
                userClaims.flatMap(c => c.comments.filter(cm => cm.sender === 'Admin' || cm.sender === 'System').map((cm, idx) => (
                  <div key={`${c.id}-${idx}`} style={{
                    backgroundColor: 'var(--bg-primary)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: '2.5px solid var(--success)',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600 }}>Simulated Email Notification: {c.id}</span>
                      <span>{new Date(cm.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                      "Subject: Claim status update - {cm.text}"
                    </p>
                  </div>
                )))
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>No notifications sent yet.</p>
              )}
            </div>
          </div>
          
        </div>
      </div>
      
      <style>{`
        @media (min-width: 992px) {
          .dashboard-grid {
            grid-template-columns: 1.3fr 0.7fr;
          }
        }
      `}</style>
    </div>
  );
}

export default UserDashboard;
