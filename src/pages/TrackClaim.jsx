import { useState, useEffect, useCallback } from 'react';
import { Search, CheckCircle, Clock, AlertCircle, FileText, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SkeletonLoader from '../components/SkeletonLoader';

function TrackClaim() {
  const { claims, loadingClaims } = useApp();
  const [searchId, setSearchId] = useState(() => {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('id') || '';
  });
  const [searchedClaim, setSearchedClaim] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = useCallback((id) => {
    if (!id) {
      setErrorMsg('Please enter a valid Claim ID.');
      setSearchedClaim(null);
      return;
    }

    const found = claims.find(c => c.id.toLowerCase() === id.toLowerCase());
    if (found) {
      setSearchedClaim(found);
      setErrorMsg('');
    } else {
      setSearchedClaim(null);
      setErrorMsg(`No claim found with ID "${id}". Make sure you entered it correctly (e.g., CLM-983172).`);
    }
  }, [claims]);

  // Auto-search if a pre-filled ID or hash exists (e.g., from submission or dashboard)
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const trackingId = queryParams.get('id');
    if (trackingId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleSearch(trackingId);
    }
  }, [claims, handleSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchId.trim());
  };

  // Get status steps and active levels
  const getSteps = (status) => {
    const stepsList = [
      { key: 'Submitted', title: 'Claim Submitted', desc: 'Your claim form and supporting documents have been registered successfully.' },
      { key: 'Processing', title: 'Legal Review in Progress', desc: 'Our flight analysts are verifying weather data and air traffic control logs.' },
      { key: 'Decision', title: 'Airline Decision', desc: 'The airline reviews the claim. This usually results in approval or rejection.' },
      { key: 'Paid', title: 'Compensation Paid', desc: 'The funds are securely transferred to your verified bank account.' }
    ];

    let activeIndex = 0;
    if (status === 'Submitted') activeIndex = 0;
    else if (status === 'Processing') activeIndex = 1;
    else if (status === 'Approved' || status === 'Rejected') activeIndex = 2;
    else if (status === 'Paid') activeIndex = 3;

    return { stepsList, activeIndex };
  };

  const { stepsList, activeIndex } = searchedClaim ? getSteps(searchedClaim.status) : { stepsList: [], activeIndex: 0 };

  if (loadingClaims) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 0' }}>
        <SkeletonLoader type="card" count={1} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }} className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Track Your Claim Status</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Enter your unique 9-digit Claim Tracking ID to view the live progress of your compensation dispute.</p>
      </div>

      {/* Search Input bar */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Enter Claim ID (e.g. CLM-983172)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.75rem', height: '48px', fontSize: '1.05rem', letterSpacing: '0.02em' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '48px', padding: '0 2rem' }}>
            Track Status
          </button>
        </form>
        
        {errorMsg && (
          <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--danger)', fontSize: '0.9rem', marginTop: '0.75rem', alignItems: 'center', textAlign: 'left' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Claim Progress Visualizer */}
      {searchedClaim && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Brief Details Header */}
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
                Tracking Details • {searchedClaim.id}
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.25rem 0' }}>
                {searchedClaim.flightNumber}: {searchedClaim.departureAirport} to {searchedClaim.arrivalAirport}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Passenger: {searchedClaim.passengerName} • Date: {searchedClaim.flightDate}
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
                Status
              </span>
              <div style={{ marginTop: '0.25rem' }}>
                <span className={`badge badge-${searchedClaim.status.toLowerCase()}`}>
                  {searchedClaim.status}
                </span>
              </div>
              {searchedClaim.status === 'Approved' && (
                <span style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: 700, marginTop: '0.25rem' }}>
                  Eligible for €{searchedClaim.compensationAmount}
                </span>
              )}
            </div>
          </div>

          {/* Vertical Progress Tracker */}
          <div className="glass-card" style={{ padding: '3rem 2.5rem', textAlign: 'left' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '2.5rem', fontFamily: 'var(--font-title)' }}>
              Claim Journey Progress
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0rem', position: 'relative' }}>
              {stepsList.map((step, idx) => {
                const isCompleted = idx < activeIndex || (searchedClaim.status === 'Paid' && idx === activeIndex) || (searchedClaim.status === 'Approved' && idx === 2);
                const isActive = idx === activeIndex && searchedClaim.status !== 'Paid' && searchedClaim.status !== 'Approved' && searchedClaim.status !== 'Rejected';
                const isRejectedStep = idx === 2 && searchedClaim.status === 'Rejected';

                let stepColor = 'var(--text-tertiary)';
                let iconElement = <Clock size={16} />;

                if (isCompleted) {
                  stepColor = 'var(--success)';
                  iconElement = <CheckCircle size={16} />;
                } else if (isRejectedStep) {
                  stepColor = 'var(--danger)';
                  iconElement = <AlertCircle size={16} />;
                } else if (isActive) {
                  stepColor = 'var(--primary)';
                  iconElement = <FileText size={16} />;
                }

                return (
                  <div key={idx} style={{ display: 'flex', gap: '1.5rem', position: 'relative', paddingBottom: idx === stepsList.length - 1 ? '0' : '2.5rem' }}>
                    {/* Line connecting nodes */}
                    {idx < stepsList.length - 1 && (
                      <div style={{
                        position: 'absolute',
                        left: '17px',
                        top: '36px',
                        bottom: 0,
                        width: '2px',
                        backgroundColor: idx < activeIndex ? 'var(--success)' : 'var(--border-color)',
                        zIndex: 1
                      }}></div>
                    )}

                    {/* Timeline Node Icon */}
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? 'var(--success-light)' : isRejectedStep ? 'var(--danger-light)' : isActive ? 'var(--primary-light)' : 'var(--bg-tertiary)',
                      color: stepColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                      flexShrink: 0,
                      border: `1.5px solid ${isCompleted ? 'var(--success)' : isRejectedStep ? 'var(--danger)' : isActive ? 'var(--primary)' : 'var(--border-color)'}`,
                      animation: isActive ? 'pulse-slow 2s infinite' : 'none'
                    }}>
                      {iconElement}
                    </div>

                    {/* Step Descriptions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingTop: '0.25rem' }}>
                      <h5 style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: isCompleted || isActive || isRejectedStep ? 'var(--text-primary)' : 'var(--text-secondary)'
                      }}>
                        {idx === 2 && searchedClaim.status === 'Rejected' ? 'Claim Rejected' : idx === 2 && searchedClaim.status === 'Approved' ? 'Claim Approved' : step.title}
                      </h5>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {idx === 2 && searchedClaim.status === 'Rejected'
                          ? "The airline declined compensation quoting extraordinary weather conditions. You can appeal using our support team."
                          : idx === 2 && searchedClaim.status === 'Approved'
                          ? `Compensation of €${searchedClaim.compensationAmount} approved. Finance department is processing payout.`
                          : step.desc
                        }
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Logs & Messages */}
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'left' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', fontFamily: 'var(--font-title)' }}>
              Case Activity & Remarks
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {searchedClaim.comments.map((c, idx) => (
                <div key={idx} style={{
                  backgroundColor: c.sender === 'Admin' ? 'var(--primary-light)' : 'var(--bg-tertiary)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: `3px solid ${c.sender === 'Admin' ? 'var(--primary)' : 'var(--text-secondary)'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>{c.sender}</span>
                    <span>{new Date(c.timestamp).toLocaleString()}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{c.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Helper when not searched */}
      {!searchedClaim && !errorMsg && (
        <div className="glass-card text-center" style={{ padding: '3rem', color: 'var(--text-secondary)' }}>
          <HelpCircle size={48} style={{ color: 'var(--text-tertiary)', margin: '0 auto 1.5rem auto' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Need a Test ID?</h3>
          <p style={{ maxWidth: '400px', margin: '0 auto 1.5rem auto', fontSize: '0.95rem' }}>
            You can test the tracker using our pre-seeded claims:
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={() => { setSearchId('CLM-983172'); handleSearch('CLM-983172'); }} style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>CLM-983172 (Approved)</button>
            <button className="btn btn-secondary" onClick={() => { setSearchId('CLM-124095'); handleSearch('CLM-124095'); }} style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>CLM-124095 (Processing)</button>
            <button className="btn btn-secondary" onClick={() => { setSearchId('CLM-503921'); handleSearch('CLM-503921'); }} style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>CLM-503921 (Rejected)</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackClaim;
