import { useState } from 'react';
import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { airports, calculateEligibility } from '../utils/eligibilityHelper';

function EligibilityChecker({ navigate }) {
  const { addToast } = useApp();
  const [formData, setFormData] = useState({
    flightNumber: '',
    departure: '',
    arrival: '',
    flightDate: '',
    delayDuration: '',
    delayReason: '',
    travelClass: 'Economy',
    ticketPrice: ''
  });
  const [errors, setErrors] = useState({});

  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const checkEligibility = (e) => {
    e.preventDefault();
    
    // Validation Pipeline mapping to CO5: Form engineering
    const newErrors = {};
    if (!formData.flightNumber) newErrors.flightNumber = 'Flight number is required.';
    if (!formData.departure) newErrors.departure = 'Departure airport is required.';
    if (!formData.arrival) newErrors.arrival = 'Arrival airport is required.';
    if (formData.departure && formData.arrival && formData.departure === formData.arrival) {
      newErrors.arrival = 'Departure and arrival airports cannot be the same.';
    }
    if (!formData.flightDate) newErrors.flightDate = 'Flight date is required.';
    if (!formData.delayDuration) newErrors.delayDuration = 'Delay duration is required.';
    if (!formData.delayReason) newErrors.delayReason = 'Delay reason is required.';
    if (!formData.travelClass) newErrors.travelClass = 'Travel class is required.';
    if (formData.ticketPrice === undefined || formData.ticketPrice === '') {
      newErrors.ticketPrice = 'Ticket price is required.';
    } else if (isNaN(formData.ticketPrice) || parseFloat(formData.ticketPrice) < 0) {
      newErrors.ticketPrice = 'Ticket price must be a non-negative number.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast('Please resolve the highlighted errors before verifying.', 'warning');
      return;
    }

    setErrors({});

    const res = calculateEligibility(formData);
    setResult(res);
  };

  const handleClaimProceed = () => {
    localStorage.setItem('prefilledChecker', JSON.stringify({
      ...formData,
      compensationAmount: result.amount
    }));
    navigate('submit');
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }} className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Check Flight Compensation Eligibility</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Find out if the airline owes you money. Verify in real-time under EU261 and DOT guidelines.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2rem',
      }} className="form-result-layout">
        
        {/* Form panel */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <form onSubmit={checkEligibility} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="flightNumber">Flight Number</label>
                <input
                  type="text"
                  id="flightNumber"
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. AI101"
                  className="form-input"
                  style={{ textTransform: 'uppercase' }}
                  aria-required="true"
                  aria-invalid={!!errors.flightNumber}
                  aria-describedby={errors.flightNumber ? "flightNumber-error" : undefined}
                  required
                />
                {errors.flightNumber && (
                  <span id="flightNumber-error" role="alert" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                    {errors.flightNumber}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="flightDate">Flight Date</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="date"
                    id="flightDate"
                    name="flightDate"
                    value={formData.flightDate}
                    onChange={handleInputChange}
                    className="form-input"
                    aria-required="true"
                    aria-invalid={!!errors.flightDate}
                    aria-describedby={errors.flightDate ? "flightDate-error" : undefined}
                    required
                  />
                  {errors.flightDate && (
                    <span id="flightDate-error" role="alert" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                      {errors.flightDate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="departure">Departure Airport</label>
                <select
                  id="departure"
                  name="departure"
                  value={formData.departure}
                  onChange={handleInputChange}
                  className="form-select"
                  aria-required="true"
                  aria-invalid={!!errors.departure}
                  aria-describedby={errors.departure ? "departure-error" : undefined}
                  required
                >
                  <option value="">Select departure airport</option>
                  {airports.map(a => <option key={a.code} value={a.name}>{a.name}</option>)}
                </select>
                {errors.departure && (
                  <span id="departure-error" role="alert" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                    {errors.departure}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="arrival">Arrival Airport</label>
                <select
                  id="arrival"
                  name="arrival"
                  value={formData.arrival}
                  onChange={handleInputChange}
                  className="form-select"
                  aria-required="true"
                  aria-invalid={!!errors.arrival}
                  aria-describedby={errors.arrival ? "arrival-error" : undefined}
                  required
                >
                  <option value="">Select arrival airport</option>
                  {airports.map(a => <option key={a.code} value={a.name}>{a.name}</option>)}
                </select>
                {errors.arrival && (
                  <span id="arrival-error" role="alert" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                    {errors.arrival}
                  </span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="delayDuration">Delay Duration</label>
                <select
                  id="delayDuration"
                  name="delayDuration"
                  value={formData.delayDuration}
                  onChange={handleInputChange}
                  className="form-select"
                  aria-required="true"
                  aria-invalid={!!errors.delayDuration}
                  aria-describedby={errors.delayDuration ? "delayDuration-error" : undefined}
                  required
                >
                  <option value="">Select delay duration</option>
                  <option value="Less than 2 hours">Less than 2 hours</option>
                  <option value="2-3 hours">2 to 3 hours</option>
                  <option value="3-4 hours">3 to 4 hours</option>
                  <option value="More than 4 hours">More than 4 hours</option>
                  <option value="Cancelled">Flight was Cancelled</option>
                  <option value="Overbooked">Denied Boarding (Overbooked)</option>
                </select>
                {errors.delayDuration && (
                  <span id="delayDuration-error" role="alert" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                    {errors.delayDuration}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="delayReason">Reason for Delay</label>
                <select
                  id="delayReason"
                  name="delayReason"
                  value={formData.delayReason}
                  onChange={handleInputChange}
                  className="form-select"
                  aria-required="true"
                  aria-invalid={!!errors.delayReason}
                  aria-describedby={errors.delayReason ? "delayReason-error" : undefined}
                  required
                >
                  <option value="">Select delay reason</option>
                  <option value="Technical failure">Technical failure / Maintenance</option>
                  <option value="Crew schedule/strike">Airline staff strike / Crew shortage</option>
                  <option value="Airline administrative issues">Operational difficulties</option>
                  <option value="Extreme weather">Severe weather conditions</option>
                  <option value="Air Traffic Control (ATC) restrictions">ATC delay / Airport congestion</option>
                  <option value="Airport strike">General airport strike / Baggage handlers</option>
                </select>
                {errors.delayReason && (
                  <span id="delayReason-error" role="alert" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                    {errors.delayReason}
                  </span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="travelClass">Travel Class</label>
                <select
                  id="travelClass"
                  name="travelClass"
                  value={formData.travelClass}
                  onChange={handleInputChange}
                  className="form-select"
                  aria-required="true"
                  aria-invalid={!!errors.travelClass}
                  aria-describedby={errors.travelClass ? "travelClass-error" : undefined}
                  required
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business</option>
                  <option value="First">First</option>
                </select>
                {errors.travelClass && (
                  <span id="travelClass-error" role="alert" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                    {errors.travelClass}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="ticketPrice">Ticket Price (INR)</label>
                <input
                  type="number"
                  id="ticketPrice"
                  name="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={handleInputChange}
                  placeholder="e.g. 15000"
                  className="form-input"
                  min="0"
                  aria-required="true"
                  aria-invalid={!!errors.ticketPrice}
                  aria-describedby={errors.ticketPrice ? "ticketPrice-error" : undefined}
                  required
                />
                {errors.ticketPrice && (
                  <span id="ticketPrice-error" role="alert" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                    {errors.ticketPrice}
                  </span>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.9rem' }}>
              Verify Compensation Status
            </button>
          </form>
        </div>

        {/* Result panel */}
        {result && (
          <div className="glass-card animate-fade-in" style={{
            padding: '2.5rem',
            border: `2px solid ${result.eligible ? 'var(--success)' : 'var(--danger)'}`,
            backgroundColor: result.eligible ? 'rgba(16, 185, 129, 0.02)' : 'rgba(239, 68, 68, 0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {result.eligible ? (
                <CheckCircle2 size={32} style={{ color: 'var(--success)' }} />
              ) : (
                <AlertCircle size={32} style={{ color: 'var(--danger)' }} />
              )}
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                {result.eligible ? 'Flight Eligible' : 'Not Eligible'}
              </h2>
            </div>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
              {result.reason}
            </p>

            {result.eligible ? (
              <div style={{
                backgroundColor: 'var(--bg-tertiary)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      Estimated Compensation
                    </span>
                    <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--success)', lineHeight: 1.1, marginTop: '0.25rem' }}>
                      ₹{(result.amount * 90).toLocaleString('en-IN')}
                    </h1>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      (€{result.amount} equivalent) • {result.distanceCategory}
                    </span>
                  </div>
                  
                  <button className="btn btn-primary" onClick={handleClaimProceed} style={{ padding: '0.9rem 1.8rem' }}>
                    File Claim Now
                  </button>
                </div>

                {/* Calculation Breakdown Section */}
                <div style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Base Regulation Payout:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>₹{(result.baseAmount * 90).toLocaleString('en-IN')} (€{result.baseAmount})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Travel Class Multiplier:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{result.classMultiplier}x ({formData.travelClass})</strong>
                  </div>
                  {result.ticketPriceBonus > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Ticket Price Bonus ({result.pricePercentage * 100}% of Ticket):</span>
                      <strong style={{ color: 'var(--success)' }}>+₹{(result.ticketPriceBonus * 90).toLocaleString('en-IN')} (€{result.ticketPriceBonus})</strong>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: 'var(--bg-tertiary)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)'
              }}>
                <HelpCircle size={20} />
                <span>Need help? Check our <span onClick={() => navigate('faq')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>FAQ</span> or contact support in the chat widget.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EligibilityChecker;
