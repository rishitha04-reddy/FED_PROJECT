import { useState, useMemo } from 'react';
import { Search, Eye, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

function AdminDashboard() {
  const { claims, updateClaimStatus, addToast } = useApp();
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClaim, setSelectedClaim] = useState(null);
  
  const [newStatus, setNewStatus] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  const handleOpenReview = (claim) => {
    setSelectedClaim(claim);
    setNewStatus(claim.status);
    setReviewComment('');
  };

  const handleSaveReview = (e) => {
    e.preventDefault();
    if (!newStatus) {
      addToast('Please select a valid status.', 'warning');
      return;
    }

    updateClaimStatus(selectedClaim.id, newStatus, reviewComment);
    addToast(`Claim ${selectedClaim.id} updated to ${newStatus} successfully!`, 'success');
    setSelectedClaim(null);
  };

  // Memoized filter calculation mapping to CO5: Memoization & CO4: Derived state
  const filteredClaims = useMemo(() => {
    return claims.filter(c => {
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesSearch = 
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.flightNumber.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [claims, statusFilter, searchQuery]);

  // Derived stats counters mapping to CO4: Derived state
  const stats = useMemo(() => {
    const pending = claims.filter(c => c.status === 'Submitted' || c.status === 'Processing').length;
    const approved = claims.filter(c => c.status === 'Approved' || c.status === 'Paid').length;
    return { pending, approved };
  }, [claims]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin Review Panel</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review compensation claims, verify boarding passes, update case status, and message passengers.</p>
      </div>

      {/* Stats Counter Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1rem'
      }}>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Total Claims</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{claims.length}</h2>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Pending Review</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)' }}>
            {stats.pending}
          </h2>
        </div>
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>Approved Claims</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>
            {stats.approved}
          </h2>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {['All', 'Submitted', 'Processing', 'Approved', 'Rejected', 'Paid'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className="btn"
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: statusFilter === st ? 'var(--primary-light)' : 'transparent',
                color: statusFilter === st ? 'var(--primary)' : 'var(--text-secondary)',
                border: 'none',
                boxShadow: 'none',
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search ID, passenger, flight..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.25rem', paddingRight: '1rem', height: '38px', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      {/* Datatable */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Passenger</th>
              <th>Flight details</th>
              <th>Delay hrs</th>
              <th>Compensation</th>
              <th>Status</th>
              <th>Filing Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClaims.length > 0 ? (
              filteredClaims.map((claim) => (
                <tr key={claim.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-title)' }}>
                    {claim.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{claim.passengerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{claim.passengerEmail}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{claim.flightNumber}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{claim.departureAirport} &rarr; {claim.arrivalAirport}</div>
                    {claim.travelClass && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                        Class: {claim.travelClass}
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{claim.delayHours}h</td>
                  <td style={{ fontWeight: 700 }}>
                    ₹{(claim.compensationAmount * 90).toLocaleString('en-IN')}
                  </td>
                  <td>
                    <span className={`badge badge-${claim.status.toLowerCase()}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td>
                    {new Date(claim.submittedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      onClick={() => handleOpenReview(claim)}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <Eye size={12} /> Review
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
                  No claims found matching the selection criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal Detail View */}
      {selectedClaim && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="glass-panel animate-fade-in" style={{
            width: '100%',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-secondary)',
            padding: '2.5rem',
            textAlign: 'left',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedClaim(null)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <X size={24} />
            </button>

            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>DISPUTE AUDIT REPORT</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Review Claim {selectedClaim.id}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Filing Date: {new Date(selectedClaim.submittedAt).toLocaleString()}</p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '2rem',
            }} className="review-modal-layout">
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)' }}>Case Information</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                    <div>
                      <strong style={{ color: 'var(--text-secondary)' }}>Passenger:</strong>
                      <div>{selectedClaim.passengerName}</div>
                      <div style={{ color: 'var(--text-tertiary)' }}>{selectedClaim.passengerPhone}</div>
                      <div style={{ color: 'var(--text-tertiary)' }}>Passport: {selectedClaim.passportNumber}</div>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-secondary)' }}>Flight Route:</strong>
                      <div>{selectedClaim.flightNumber} ({selectedClaim.flightDate})</div>
                      <div>{selectedClaim.departureAirport} &rarr; {selectedClaim.arrivalAirport}</div>
                      <div style={{ color: 'var(--text-tertiary)' }}>Delay: {selectedClaim.delayHours} hrs ({selectedClaim.delayReason})</div>
                      {selectedClaim.travelClass && (
                        <div style={{ color: 'var(--text-tertiary)' }}>
                          Class: {selectedClaim.travelClass} {selectedClaim.ticketPrice ? `• Ticket Price: ₹${parseFloat(selectedClaim.ticketPrice).toLocaleString('en-IN')}` : ''}
                        </div>
                      )}
                      <div style={{ fontWeight: 600 }}>Approved Payout: ₹{(selectedClaim.compensationAmount * 90).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)' }}>Uploaded Files Verification</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="review-docs-grid">
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.25rem' }}>Boarding Pass / Ticket:</span>
                      {selectedClaim.boardingPassDoc ? (
                        <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', backgroundColor: 'var(--bg-primary)' }}>
                          <img src={selectedClaim.boardingPassDoc} alt="Boarding Pass" style={{ width: '100%', maxHeight: '180px', objectFit: 'contain' }} />
                        </div>
                      ) : (
                        <div style={{ border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>No document</div>
                      )}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.25rem' }}>ID Proof / Passport:</span>
                      {selectedClaim.idProofDoc ? (
                        <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', backgroundColor: 'var(--bg-primary)' }}>
                          <img src={selectedClaim.idProofDoc} alt="Passport Proof" style={{ width: '100%', maxHeight: '180px', objectFit: 'contain' }} />
                        </div>
                      ) : (
                        <div style={{ border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>No document</div>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              <div className="glass-card" style={{ padding: '1.5rem', height: 'fit-content' }}>
                <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', fontFamily: 'var(--font-title)' }}>Decision Control Panel</h4>
                
                <form onSubmit={handleSaveReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Review Status Decision</label>
                    <select
                      className="form-select"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      required
                    >
                      <option value="Submitted">Submitted (Pending Review)</option>
                      <option value="Processing">Processing (Under Investigation)</option>
                      <option value="Approved">Approved (Payout Entitled)</option>
                      <option value="Rejected">Rejected (Disputed/Extraordinary)</option>
                      <option value="Paid">Paid (Compensation Complete)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Review Verdict Comment</label>
                    <textarea
                      className="form-input form-textarea"
                      placeholder="Add official reviewer remarks, reason for rejection or payout details..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows="4"
                      style={{ fontSize: '0.9rem' }}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', width: '100%' }}>
                    Save Review Verdict
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @media (min-width: 768px) {
          .review-modal-layout {
            grid-template-columns: 1.1fr 0.9fr;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
