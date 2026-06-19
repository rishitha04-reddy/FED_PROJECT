import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hello! I'm the RefundFlight Assistant. Ask me anything about EU261 passenger rights, compensation payouts, or how to file a claim!", timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newMsg = { sender: 'user', text: userText, timestamp: new Date() };
    
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot reply after typing lag
    setTimeout(() => {
      let replyText = "That's a great question! I suggest using our 'Eligibility Checker' page or visiting the 'FAQ' section for deep regulatory answers. If you want direct help, you can submit a contact ticket.";
      
      const query = userText.toLowerCase();

      if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
        replyText = "Hello! Hope your day is going well. How can I assist you with your flight disruption compensation today?";
      } else if (query.includes('eligib') || query.includes('qualify') || query.includes('check')) {
        replyText = "To check your flight eligibility under EU261: Your delay must be 3+ hours at final destination, departing from the EU (or arriving in the EU on an EU airline). Weather or strikes are usually excluded. Check out our 'Eligibility Checker' tab to test your route!";
      } else if (query.includes('how much') || query.includes('payout') || query.includes('compens') || query.includes('money')) {
        replyText = "Under EC 261/2004, compensation ranges from €250 (short-haul <1500km), €400 (medium-haul 1500-3500km), to €600 (long-haul >3500km). Open our 'Calculator' slider page to visualize your payout!";
      } else if (query.includes('track') || query.includes('status') || query.includes('clm')) {
        replyText = "You can track your claim anytime by entering your unique Claim ID (e.g. CLM-983172) in the 'Track Claim' page. Registered users can also see summaries in their dashboard.";
      } else if (query.includes('weather') || query.includes('strike') || query.includes('extraordinary')) {
        replyText = "Delays caused by extreme weather, airport strikes, or air traffic control limits are classified as 'extraordinary circumstances' and are not eligible for cash compensation. Technical faults or staff sickness ARE eligible.";
      } else if (query.includes('upload') || query.includes('document') || query.includes('passport') || query.includes('pass')) {
        replyText = "To file a claim, you must upload clear photos of your Boarding Pass / Ticket and ID Proof (Passport or national ID). This helps us legally verify details with the airline.";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: replyText, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="support-chat-trigger gradient-bg"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          boxShadow: 'var(--shadow-xl)',
          cursor: 'pointer'
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </div>

      {/* Chat Window Box */}
      {isOpen && (
        <div className="support-chat-box glass-panel" style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
        }}>
          {/* Header */}
          <div className="gradient-bg" style={{
            padding: '1.25rem',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}>
                RF
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>RefundFlight Bot</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', opacity: 0.9 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                  Online Support Assistant
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flexGrow: 1,
            padding: '1.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: 'var(--bg-primary)'
          }}>
            {messages.map((m, idx) => {
              const isBot = m.sender === 'bot';
              return (
                <div 
                  key={idx} 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isBot ? 'flex-start' : 'flex-end',
                    maxWidth: '85%',
                    alignSelf: isBot ? 'flex-start' : 'flex-end',
                    textAlign: 'left'
                  }}
                >
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '16px',
                    borderBottomLeftRadius: isBot ? '4px' : '16px',
                    borderBottomRightRadius: !isBot ? '4px' : '16px',
                    backgroundColor: isBot ? 'var(--bg-secondary)' : 'var(--primary)',
                    color: isBot ? 'var(--text-primary)' : 'white',
                    fontSize: '0.9rem',
                    border: isBot ? '1px solid var(--border-color)' : 'none',
                    boxShadow: 'var(--shadow-sm)',
                    whiteSpace: 'pre-line'
                  }}>
                    {m.text}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '0.25rem', padding: '0 0.25rem' }}>
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '0.25rem', backgroundColor: 'var(--bg-secondary)', padding: '0.6rem 1rem', borderRadius: '16px', borderBottomLeftRadius: '4px', border: '1px solid var(--border-color)' }}>
                <span className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-tertiary)', borderRadius: '50%', display: 'inline-block', animation: 'pulse-slow 1s infinite' }}></span>
                <span className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-tertiary)', borderRadius: '50%', display: 'inline-block', animation: 'pulse-slow 1s infinite 0.2s' }}></span>
                <span className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-tertiary)', borderRadius: '50%', display: 'inline-block', animation: 'pulse-slow 1s infinite 0.4s' }}></span>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Input Footer Form */}
          <form 
            onSubmit={handleSend}
            style={{
              padding: '0.75rem 1rem',
              display: 'flex',
              gap: '0.5rem',
              borderTop: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)'
            }}
          >
            <input
              type="text"
              placeholder="Ask a question..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="form-input"
              style={{ height: '38px', borderRadius: 'var(--radius-full)', fontSize: '0.9rem' }}
              disabled={isTyping}
            />
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
              disabled={isTyping}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default SupportChat;
