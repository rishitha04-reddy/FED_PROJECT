import { useState, useMemo } from 'react';
import { MapPin, Clock, ArrowRight, Info, Award, IndianRupee } from 'lucide-react';

function CompensationCalculator({ navigate }) {
  const [distance, setDistance] = useState(1200); // default 1200 km
  const [delayHours, setDelayHours] = useState(3.5); // default 3.5 hours
  const [travelClass, setTravelClass] = useState('Economy');
  const [ticketPrice, setTicketPrice] = useState(15000); // default 15,000 INR

  // Derived state mapping to CO4: Derived state & CO5: Memoization
  const { payout, baseAmount, classMultiplier, pricePercentage, ticketPriceBonus, category } = useMemo(() => {
    if (delayHours < 3) {
      return { payout: 0, baseAmount: 0, classMultiplier: 1.0, pricePercentage: 0.0, ticketPriceBonus: 0, category: 'Not eligible (< 3 hours)' };
    }

    let baseAmount;
    let distanceCategory;

    if (distance <= 1500) {
      baseAmount = 250;
      distanceCategory = 'Short-haul (≤ 1,500 km)';
    } else if (distance > 1500 && distance <= 3500) {
      baseAmount = 400;
      distanceCategory = 'Medium-haul (1,500 km - 3,500 km)';
    } else {
      if (delayHours >= 3 && delayHours < 4) {
        baseAmount = 300;
        distanceCategory = 'Long-haul (> 3,500 km) - Delay under 4 hours (50% reduction applies)';
      } else {
        baseAmount = 600;
        distanceCategory = 'Long-haul (> 3,500 km)';
      }
    }

    // Travel Class multiplier: Premium Economy = 1.25x, Business = 1.5x, First = 2.0x
    let classMultiplier = 1.0;
    if (travelClass === 'Premium Economy') classMultiplier = 1.25;
    else if (travelClass === 'Business') classMultiplier = 1.5;
    else if (travelClass === 'First') classMultiplier = 2.0;

    // Ticket price contribution based on delay duration
    let pricePercentage = 0.0;
    if (delayHours >= 3 && delayHours < 4) {
      pricePercentage = 0.10;
    } else if (delayHours >= 4) {
      pricePercentage = 0.15;
    }

    const ticketPriceEUR = ticketPrice / 90;
    const finalAmount = (baseAmount * classMultiplier) + (ticketPriceEUR * pricePercentage);

    return {
      payout: parseFloat(finalAmount.toFixed(2)),
      baseAmount,
      classMultiplier,
      pricePercentage,
      ticketPriceBonus: parseFloat((ticketPriceEUR * pricePercentage).toFixed(2)),
      category: `${distanceCategory} • Class: ${travelClass}`
    };
  }, [distance, delayHours, travelClass, ticketPrice]);

  const handleProceedToClaim = () => {
    let duration;
    if (delayHours >= 4) duration = 'More than 4 hours';
    else if (delayHours >= 3) duration = '3-4 hours';
    else if (delayHours >= 2) duration = '2-3 hours';
    else duration = 'Less than 2 hours';

    let dep = 'Frankfurt (FRA)';
    let arr = 'Paris (CDG)';
    if (distance > 1500 && distance <= 3500) {
      dep = 'Rome (FCO)';
      arr = 'Frankfurt (FRA)';
    } else if (distance > 3500) {
      dep = 'Frankfurt (FRA)';
      arr = 'Delhi (DEL)';
    }

    localStorage.setItem('prefilledChecker', JSON.stringify({
      departure: dep,
      arrival: arr,
      delayDuration: duration,
      delayReason: 'Technical failure',
      travelClass: travelClass,
      ticketPrice: ticketPrice,
      compensationAmount: payout
    }));
    navigate('submit');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }} className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Flight Compensation Calculator</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Drag the sliders below to estimate your potential cash payout in Indian Rupees (INR) under EC 261/2004 guidelines.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2.5rem',
      }} className="calculator-layout">
        
        {/* Sliders Card */}
        <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Distance Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1.1rem', fontFamily: 'var(--font-title)' }}>
                <MapPin size={20} className="gradient-text" /> Flight Distance:
              </label>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                {distance.toLocaleString()} km
              </span>
            </div>
            
            <input
              type="range"
              min="100"
              max="7000"
              step="50"
              value={distance}
              onChange={(e) => setDistance(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '5px',
                outline: 'none',
                accentColor: 'var(--primary)',
                cursor: 'pointer'
              }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              <span>Short-haul (≤ 1,500 km)</span>
              <span>Medium-haul (1,500 - 3,500 km)</span>
              <span>Long-haul (&gt; 3,500 km)</span>
            </div>
          </div>

          {/* Delay Hours Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1.1rem', fontFamily: 'var(--font-title)' }}>
                <Clock size={20} className="gradient-text" /> Delay at Destination:
              </label>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                {delayHours} {delayHours === 1 ? 'hour' : 'hours'}
              </span>
            </div>
            
            <input
              type="range"
              min="1"
              max="12"
              step="0.5"
              value={delayHours}
              onChange={(e) => setDelayHours(parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '5px',
                outline: 'none',
                accentColor: 'var(--primary)',
                cursor: 'pointer'
              }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              <span>1 hr (No payout)</span>
              <span>3 hrs (Min. eligible)</span>
              <span>4+ hrs (Max. payout)</span>
              <span>12 hrs</span>
            </div>
          </div>

          {/* Travel Class Select */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1.1rem', fontFamily: 'var(--font-title)' }}>
              <Award size={20} className="gradient-text" /> Travel Class:
            </label>
            <select
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value)}
              className="form-select"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="Economy">Economy (1.0x multiplier)</option>
              <option value="Premium Economy">Premium Economy (1.25x multiplier)</option>
              <option value="Business">Business (1.5x multiplier)</option>
              <option value="First">First (2.0x multiplier)</option>
            </select>
          </div>

          {/* Ticket Price Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1.1rem', fontFamily: 'var(--font-title)' }}>
                <IndianRupee size={20} className="gradient-text" /> Ticket Price (INR):
              </label>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                ₹{ticketPrice.toLocaleString('en-IN')}
              </span>
            </div>
            
            <input
              type="range"
              min="2000"
              max="100000"
              step="1000"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '5px',
                outline: 'none',
                accentColor: 'var(--primary)',
                cursor: 'pointer'
              }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              <span>Min: ₹2,000</span>
              <span>Mid: ₹50,000</span>
              <span>Max: ₹100,000</span>
            </div>
          </div>
        </div>
        
        {/* Results Card */}
        <div className="glass-card" style={{
          padding: '2.5rem',
          backgroundColor: payout > 0 ? 'var(--primary-light)' : 'var(--bg-secondary)',
          border: payout > 0 ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border-color)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          {payout > 0 ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Estimated Claim Payout
                </span>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', lineHeight: 1.1 }}>
                  ₹{(payout * 90).toLocaleString('en-IN')}
                </h1>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Category: {category}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                  Equivalent to €{payout} EUR
                </span>
              </div>

              {/* Calculation Breakdown Section */}
              <div style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Base Regulation Payout:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>₹{(baseAmount * 90).toLocaleString('en-IN')} (€{baseAmount})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Travel Class Multiplier:</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{classMultiplier}x ({travelClass})</strong>
                </div>
                {ticketPriceBonus > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Ticket Price Bonus ({pricePercentage * 100}% of Ticket):</span>
                    <strong style={{ color: 'var(--success)' }}>+₹{(ticketPriceBonus * 90).toLocaleString('en-IN')} (€{ticketPriceBonus})</strong>
                  </div>
                )}
              </div>
              
              <div style={{ height: '1px', backgroundColor: 'var(--border-color)', width: '100%' }}></div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Info size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--primary)' }} />
                <p>
                  This calculation converts EUR compensation payouts to Indian Rupees (INR) at an exchange rate of ₹90/Euro. The final payout is subject to airline approval.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                <button className="btn btn-primary" onClick={handleProceedToClaim} style={{ padding: '0.85rem 2rem', flex: 1, minWidth: '200px' }}>
                  Claim Payout Now <ArrowRight size={18} />
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('checker')} style={{ padding: '0.85rem 1.5rem' }}>
                  Check Specific Flight
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <div className="badge badge-submitted" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Not Yet Eligible</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Under 3 Hours Delay</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '450px' }}>
                Under EU law, monetary payouts are only triggered for delays of 3 hours or more at the final destination. However, if your flight is cancelled, you may still be eligible for a ticket refund or re-routing.
              </p>
              <button className="btn btn-secondary" onClick={() => navigate('checker')} style={{ marginTop: '0.5rem' }}>
                Verify Flight Details
              </button>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @media (min-width: 768px) {
          .calculator-layout {
            grid-template-columns: 1.1fr 0.9fr;
          }
        }
      `}</style>
    </div>
  );
}

export default CompensationCalculator;
