import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Who is eligible for compensation under EU261 regulations?",
      a: "You are eligible if your flight departed from any airport in the European Union (on any airline) OR arrived in the EU on an EU-based airline. The flight must have arrived at your destination with a delay of 3 hours or more, and the disruption must be due to factors within the airline's control (operational issues, crew shortages, technical faults)."
    },
    {
      q: "How much compensation can I legally claim?",
      a: "Compensation is calculated based on flight distance: \n• Short-haul (under 1,500 km): €250 per passenger.\n• Medium-haul (1,500 km to 3,500 km): €400 per passenger.\n• Long-haul (over 3,500 km): €600 per passenger (reduced by 50% if the delay at the final destination is between 3 and 4 hours)."
    },
    {
      q: "What is classified as an 'extraordinary circumstance'?",
      a: "These are situations where the airline is not held responsible for the delay because it was outside their control. Examples include severe weather conditions (thunderstorms, volcanic ash), air traffic control restrictions, political instability, airport baggage strikes, and security issues. Technical faults with the aircraft and staff/crew shortages are NOT extraordinary circumstances."
    },
    {
      q: "How far back can I claim compensation for a flight?",
      a: "Under EU law, the statute of limitations depends on the country of the airline's headquarters or the flight route. In Germany, France, and the UK, you can claim for flights up to 3 years old. In some jurisdictions like Spain, you have up to 5 years."
    },
    {
      q: "How long does the refund or payout process take?",
      a: "If the airline accepts the claim immediately, payouts can take 2 to 4 weeks. If the airline disputes the claim or experiences backlogs, it can take 6 to 12 weeks. If the claim has to be sent to a regulatory body or court, it may take several months."
    },
    {
      q: "Does the US DOT mandate monetary delay compensation?",
      a: "Unlike Europe, US Federal DOT regulations do not require airlines to pay cash compensation for delayed flights. However, DOT rules require airlines to provide a full refund of your ticket if your flight is cancelled or significantly changed, and you choose not to travel."
    }
  ];

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }} className="animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Frequently Asked Questions</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Clear answers regarding passenger rights under EU261, UK law, and US DOT regulations.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="accordion-item" style={{
              border: isOpen ? '1px solid var(--primary)' : '1px solid var(--border-color)',
              boxShadow: isOpen ? '0 4px 15px rgba(99, 102, 241, 0.05)' : 'none'
            }}>
              <button
                className="accordion-header"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                style={{
                  color: isOpen ? 'var(--primary)' : 'var(--text-primary)',
                  backgroundColor: isOpen ? 'var(--primary-light)' : 'transparent',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HelpCircle size={18} style={{ color: isOpen ? 'var(--primary)' : 'var(--text-tertiary)' }} />
                  {faq.q}
                </span>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              {isOpen && (
                <div className="accordion-content" style={{
                  paddingTop: '1.25rem',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.5,
                  textAlign: 'left'
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FAQ;
