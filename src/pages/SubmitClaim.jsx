import { useState, useEffect, useMemo } from 'react';
import { Upload, CheckCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateEligibility } from '../utils/eligibilityHelper';

function SubmitClaim({ navigate }) {
  const { submitClaim, currentUser } = useApp();
  const [formData, setFormData] = useState({
    passengerName: '',
    passengerEmail: '',
    passengerPhone: '',
    passportNumber: '',
    flightNumber: '',
    departureAirport: '',
    arrivalAirport: '',
    flightDate: '',
    delayHours: '',
    delayReason: '',
    compensationAmount: 0,
    travelClass: 'Economy',
    ticketPrice: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [boardingPass, setBoardingPass] = useState(null); // base64 string
  const [idProof, setIdProof] = useState(null); // base64 string
  const [boardingPassName, setBoardingPassName] = useState('');
  const [idProofName, setIdProofName] = useState('');

  const [submittedId, setSubmittedId] = useState(null);

  // Check if there is prefilled data from the checker
  useEffect(() => {
    if (currentUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => ({
        ...prev,
        passengerName: currentUser.name || '',
        passengerEmail: currentUser.email || '',
        passengerPhone: currentUser.phone || '',
        passportNumber: currentUser.passport || ''
      }));
    }

    const prefilled = localStorage.getItem('prefilledChecker');
    if (prefilled) {
      try {
        const data = JSON.parse(prefilled);
        
        let delayHrVal = 3;
        if (data.delayDuration === 'More than 4 hours') delayHrVal = 5;
        else if (data.delayDuration === '2-3 hours') delayHrVal = 2.5;
        else if (data.delayDuration === 'Cancelled') delayHrVal = 4;
        
        setFormData(prev => ({
          ...prev,
          flightNumber: data.flightNumber || '',
          departureAirport: data.departure || '',
          arrivalAirport: data.arrival || '',
          flightDate: data.flightDate || '',
          delayHours: delayHrVal,
          delayReason: data.delayReason || '',
          compensationAmount: data.compensationAmount || 0,
          travelClass: data.travelClass || 'Economy',
          ticketPrice: data.ticketPrice || ''
        }));
        
        localStorage.removeItem('prefilledChecker');
      } catch (e) {
        console.error("Prefill error:", e);
      }
    }
  }, [currentUser]);

  // Derived state mapping to CO4: Derived state & CO5: Memoization
  const compensationBreakdown = useMemo(() => {
    const defaultVal = { amount: 0, baseAmount: 0, classMultiplier: 1.0, pricePercentage: 0.0, ticketPriceBonus: 0, eligible: false };
    if (!formData.departureAirport || !formData.arrivalAirport) return defaultVal;

    const getDelayDurationFromHours = (hours, reason) => {
      if (reason === 'Overbooked') return 'Overbooked';
      const h = parseFloat(hours);
      if (isNaN(h)) return 'Less than 2 hours';
      if (h >= 4) return 'More than 4 hours';
      if (h >= 3) return '3-4 hours';
      if (h >= 2) return '2-3 hours';
      return 'Less than 2 hours';
    };

    const duration = getDelayDurationFromHours(formData.delayHours, formData.delayReason);
    const mappedData = {
      departure: formData.departureAirport,
      arrival: formData.arrivalAirport,
      delayDuration: duration,
      delayReason: formData.delayReason,
      travelClass: formData.travelClass || 'Economy',
      ticketPrice: formData.ticketPrice || 0
    };

    const res = calculateEligibility(mappedData);
    return res.eligible ? res : defaultVal;
  }, [
    formData.departureAirport,
    formData.arrivalAirport,
    formData.delayHours,
    formData.delayReason,
    formData.travelClass,
    formData.ticketPrice
  ]);

  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large! Maximum file size is 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (fileType === 'boardingPass') {
        setBoardingPass(reader.result);
        setBoardingPassName(file.name);
      } else if (fileType === 'idProof') {
        setIdProof(reader.result);
        setIdProofName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form Validation Pipeline mapping to CO5: Form engineering
    const newErrors = {};
    if (!formData.passengerName.trim()) newErrors.passengerName = 'Passenger name is required.';
    if (!formData.passengerEmail.trim() || !/\S+@\S+\.\S+/.test(formData.passengerEmail)) {
      newErrors.passengerEmail = 'A valid email address is required.';
    }
    if (!formData.passengerPhone.trim()) newErrors.passengerPhone = 'Phone number is required.';
    if (!formData.passportNumber.trim()) newErrors.passportNumber = 'Passport / ID number is required.';
    if (!formData.flightNumber.trim()) newErrors.flightNumber = 'Flight number is required.';
    if (!formData.departureAirport.trim()) newErrors.departureAirport = 'Departure airport is required.';
    if (!formData.arrivalAirport.trim()) newErrors.arrivalAirport = 'Arrival airport is required.';
    if (formData.departureAirport && formData.arrivalAirport && formData.departureAirport === formData.arrivalAirport) {
      newErrors.arrivalAirport = 'Departure and arrival airports cannot be the same.';
    }
    if (!formData.flightDate) newErrors.flightDate = 'Flight date is required.';
    if (!formData.delayHours || isNaN(formData.delayHours) || parseFloat(formData.delayHours) <= 0) {
      newErrors.delayHours = 'Delay duration must be a positive number.';
    }
    if (!formData.delayReason) newErrors.delayReason = 'Please select a reason for delay.';
    if (!formData.travelClass) newErrors.travelClass = 'Travel class is required.';
    if (formData.ticketPrice === undefined || formData.ticketPrice === '') {
      newErrors.ticketPrice = 'Ticket price is required.';
    } else if (isNaN(formData.ticketPrice) || parseFloat(formData.ticketPrice) < 0) {
      newErrors.ticketPrice = 'Ticket price must be a non-negative number.';
    }
    
    if (!boardingPass) newErrors.boardingPass = 'Boarding pass image is required.';
    if (!idProof) newErrors.idProof = 'ID proof image is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Please fix validation errors before submitting.");
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const claimId = await submitClaim({
        ...formData,
        compensationAmount: compensationBreakdown.amount,
        boardingPassDoc: boardingPass,
        idProofDoc: idProof,
      });
      setSubmittedId(claimId);
    } catch (err) {
      console.error("Submit claim error:", err);
      alert("An error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto' }} className="glass-card animate-fade-in text-center">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '1rem' }}>
          <div style={{ color: 'var(--success)' }}><CheckCircle size={64} /></div>
          
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Claim Submitted Successfully</h1>
            <p style={{ color: 'var(--text-secondary)' }}>We have received your claim and initiated the review process.</p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-tertiary)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            width: '100%',
            margin: '1rem 0'
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
              Your Claim Tracking ID
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em', margin: '0.25rem 0' }}>
              {submittedId}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Write this down or save it. You can use it to track your claim status at any time.
            </p>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            We've sent a confirmation email to <strong>{formData.passengerEmail}</strong>. We'll update you as soon as our legal department verifies your flight details.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%' }}>
            <button className="btn btn-primary" onClick={() => navigate('track')} style={{ flex: 1 }}>
              Track Status
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('dashboard')} style={{ flex: 1 }}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }} className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>File Flight Delay Compensation Claim</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Fill out passenger and flight details and upload your documents securely. The claim will be reviewed within 24 hours.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Step 1: Passenger Information */}
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="gradient-bg" style={{ width: '24px', height: '24px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>1</span>
            Passenger Information
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="passengerName">Full Name (as on ticket)</label>
              <input
                type="text"
                id="passengerName"
                name="passengerName"
                value={formData.passengerName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Jane Doe"
                aria-required="true"
                aria-invalid={!!errors.passengerName}
                aria-describedby={errors.passengerName ? "passengerName-error" : undefined}
                required
              />
              {errors.passengerName && (
                <span id="passengerName-error" role="alert" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.passengerName}
                </span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="passportNumber">Passport / ID Number</label>
              <input
                type="text"
                id="passportNumber"
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. A9988776"
                aria-required="true"
                aria-invalid={!!errors.passportNumber}
                aria-describedby={errors.passportNumber ? "passportNumber-error" : undefined}
                required
              />
              {errors.passportNumber && (
                <span id="passportNumber-error" role="alert" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.passportNumber}
                </span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="passengerEmail">Email Address</label>
              <input
                type="email"
                id="passengerEmail"
                name="passengerEmail"
                value={formData.passengerEmail}
                onChange={handleInputChange}
                className="form-input"
                placeholder="jane.doe@example.com"
                aria-required="true"
                aria-invalid={!!errors.passengerEmail}
                aria-describedby={errors.passengerEmail ? "passengerEmail-error" : undefined}
                required
              />
              {errors.passengerEmail && (
                <span id="passengerEmail-error" role="alert" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.passengerEmail}
                </span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="passengerPhone">Phone Number</label>
              <input
                type="tel"
                id="passengerPhone"
                name="passengerPhone"
                value={formData.passengerPhone}
                onChange={handleInputChange}
                className="form-input"
                placeholder="+91 98765 43210"
                aria-required="true"
                aria-invalid={!!errors.passengerPhone}
                aria-describedby={errors.passengerPhone ? "passengerPhone-error" : undefined}
                required
              />
              {errors.passengerPhone && (
                <span id="passengerPhone-error" role="alert" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.passengerPhone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Flight Details */}
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="gradient-bg" style={{ width: '24px', height: '24px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>2</span>
            Flight Details
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="flightNumber">Flight Number</label>
              <input
                type="text"
                id="flightNumber"
                name="flightNumber"
                value={formData.flightNumber}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. AI101"
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

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="departureAirport">Departure Airport</label>
              <input
                type="text"
                id="departureAirport"
                name="departureAirport"
                value={formData.departureAirport}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. Delhi (DEL)"
                aria-required="true"
                aria-invalid={!!errors.departureAirport}
                aria-describedby={errors.departureAirport ? "departureAirport-error" : undefined}
                required
              />
              {errors.departureAirport && (
                <span id="departureAirport-error" role="alert" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.departureAirport}
                </span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="arrivalAirport">Arrival Airport</label>
              <input
                type="text"
                id="arrivalAirport"
                name="arrivalAirport"
                value={formData.arrivalAirport}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. London (LHR)"
                aria-required="true"
                aria-invalid={!!errors.arrivalAirport}
                aria-describedby={errors.arrivalAirport ? "arrivalAirport-error" : undefined}
                required
              />
              {errors.arrivalAirport && (
                <span id="arrivalAirport-error" role="alert" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.arrivalAirport}
                </span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="delayHours">Delay Duration (hours)</label>
              <input
                type="number"
                id="delayHours"
                name="delayHours"
                value={formData.delayHours}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g. 4.5"
                step="0.1"
                min="0"
                aria-required="true"
                aria-invalid={!!errors.delayHours}
                aria-describedby={errors.delayHours ? "delayHours-error" : undefined}
                required
              />
              {errors.delayHours && (
                <span id="delayHours-error" role="alert" style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.delayHours}
                </span>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="delayReason">Delay Reason</label>
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
                <option value="">Select reason</option>
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

          {compensationBreakdown.amount > 0 && (
            <div style={{
              backgroundColor: 'var(--primary-light)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              marginTop: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Pre-verified Compensation Amount:</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ₹{(compensationBreakdown.amount * 90).toLocaleString('en-IN')}
                </span>
              </div>
              
              <div style={{
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(99, 102, 241, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Base Regulation Payout:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{(compensationBreakdown.baseAmount * 90).toLocaleString('en-IN')} (€{compensationBreakdown.baseAmount})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Travel Class Multiplier:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{compensationBreakdown.classMultiplier}x ({formData.travelClass})</span>
                </div>
                {compensationBreakdown.ticketPriceBonus > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Ticket Price Bonus ({compensationBreakdown.pricePercentage * 100}%):</span>
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>+₹{(compensationBreakdown.ticketPriceBonus * 90).toLocaleString('en-IN')} (€{compensationBreakdown.ticketPriceBonus})</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Supporting Documents */}
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="gradient-bg" style={{ width: '24px', height: '24px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>3</span>
            Supporting Documents
          </h3>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Regulations require boarding passes and ID verification to validate payouts. Upload pictures of your boarding pass and passport (Max 2MB each).
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1.5rem'
          }} className="upload-grid">
            
            {/* Boarding Pass Upload */}
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              position: 'relative',
              backgroundColor: boardingPass ? 'var(--bg-tertiary)' : 'transparent'
            }}>
              {boardingPass ? (
                <>
                  <button 
                    type="button"
                    onClick={() => { setBoardingPass(null); setBoardingPassName(''); }}
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                  >
                    <X size={20} />
                  </button>
                  <img src={boardingPass} alt="Boarding Pass Preview" style={{ maxHeight: '120px', borderRadius: 'var(--radius-sm)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }} className="truncate">{boardingPassName}</span>
                </>
              ) : (
                <>
                  <Upload size={32} style={{ color: 'var(--text-tertiary)' }} />
                  <div>
                    <h5 style={{ fontWeight: 600 }}>Boarding Pass / Ticket</h5>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>PNG, JPG or JPEG up to 2MB</p>
                  </div>
                  <label className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                    Select Image
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'boardingPass')} style={{ display: 'none' }} required />
                  </label>
                </>
              )}
            </div>

            {/* ID Proof Upload */}
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              position: 'relative',
              backgroundColor: idProof ? 'var(--bg-tertiary)' : 'transparent'
            }}>
              {idProof ? (
                <>
                  <button 
                    type="button"
                    onClick={() => { setIdProof(null); setIdProofName(''); }}
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                  >
                    <X size={20} />
                  </button>
                  <img src={idProof} alt="Passport Preview" style={{ maxHeight: '120px', borderRadius: 'var(--radius-sm)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }} className="truncate">{idProofName}</span>
                </>
              ) : (
                <>
                  <Upload size={32} style={{ color: 'var(--text-tertiary)' }} />
                  <div>
                    <h5 style={{ fontWeight: 600 }}>Passport or Government ID Proof</h5>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>PNG, JPG or JPEG up to 2MB</p>
                  </div>
                  <label className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                    Select Image
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'idProof')} style={{ display: 'none' }} required />
                  </label>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Submit Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('home')} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 2.5rem' }} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting Claim...' : 'Submit Claim'}
          </button>
        </div>

      </form>
      
      <style>{`
        @media (min-width: 640px) {
          .upload-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

export default SubmitClaim;
