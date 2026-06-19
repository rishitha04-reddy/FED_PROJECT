import { useState } from 'react';
import { Plane, Sun, Moon, Menu, X, User, ShieldAlert } from 'lucide-react';

function Navbar({ currentPage, navigate, theme, toggleTheme, userRole, setUserRole }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'checker', label: 'Eligibility Checker' },
    { id: 'calculator', label: 'Calculator' },
    { id: 'submit', label: 'Submit Claim' },
    { id: 'track', label: 'Track Claim' },
    { id: 'airlines', label: 'Airlines' },
    { id: 'faq', label: 'FAQ' },
  ];

  const handleNav = (pageId) => {
    navigate(pageId);
    setMobileOpen(false);
  };

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      padding: '1rem 2rem',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Logo */}
        <div 
          onClick={() => handleNav('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          <div className="gradient-bg" style={{
            padding: '0.5rem',
            borderRadius: '10px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Plane size={24} style={{ transform: 'rotate(45deg)' }} />
          </div>
          <span style={{ 
            fontFamily: 'var(--font-title)', 
            fontWeight: 800, 
            fontSize: '1.4rem',
            letterSpacing: '-0.03em'
          }}>
            Refund<span className="gradient-text">Flight</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-menu-container">
          <ul style={{ display: 'flex', listStyle: 'none', gap: '1rem', alignItems: 'center' }}>
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNav(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: currentPage === item.id ? 'var(--primary)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-title)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'all 0.2s',
                    backgroundColor: currentPage === item.id ? 'var(--primary-light)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== item.id) e.target.style.color = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== item.id) e.target.style.color = 'var(--text-secondary)';
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-color)' }}></div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="btn-secondary"
            style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Dev/Role Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
            <button
              onClick={() => {
                setUserRole('passenger');
                handleNav('dashboard');
              }}
              style={{
                border: 'none',
                background: userRole === 'passenger' ? 'var(--bg-secondary)' : 'transparent',
                color: userRole === 'passenger' ? 'var(--primary)' : 'var(--text-secondary)',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                fontFamily: 'var(--font-title)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: userRole === 'passenger' ? 'var(--shadow-sm)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <User size={12} /> Passenger
            </button>
            <button
              onClick={() => {
                setUserRole('admin');
                handleNav('admin');
              }}
              style={{
                border: 'none',
                background: userRole === 'admin' ? 'var(--bg-secondary)' : 'transparent',
                color: userRole === 'admin' ? 'var(--danger)' : 'var(--text-secondary)',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                fontFamily: 'var(--font-title)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: userRole === 'admin' ? 'var(--shadow-sm)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <ShieldAlert size={12} /> Admin Panel
            </button>
          </div>
        </div>

        {/* Mobile menu trigger */}
        <div style={{ display: 'none', gap: '0.5rem', alignItems: 'center' }} className="mobile-menu-trigger">
          <button 
            onClick={toggleTheme}
            className="btn-secondary"
            style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="btn-secondary"
            style={{ padding: '0.5rem' }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="glass-panel" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          borderTop: '1px solid var(--border-color)',
          borderLeft: 'none',
          borderRight: 'none',
          padding: '1rem',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
        }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                padding: '0.75rem 1rem',
                color: currentPage === item.id ? 'var(--primary)' : 'var(--text-primary)',
                fontFamily: 'var(--font-title)',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: currentPage === item.id ? 'var(--primary-light)' : 'transparent',
              }}
            >
              {item.label}
            </button>
          ))}
          <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.5rem 0' }}></div>
          
          {/* Mobile Role Switcher */}
          <div style={{ display: 'flex', width: '100%', gap: '0.5rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
            <button
              onClick={() => {
                setUserRole('passenger');
                handleNav('dashboard');
              }}
              style={{
                flex: 1,
                border: 'none',
                background: userRole === 'passenger' ? 'var(--bg-secondary)' : 'transparent',
                color: userRole === 'passenger' ? 'var(--primary)' : 'var(--text-secondary)',
                padding: '0.6rem',
                borderRadius: '8px',
                fontFamily: 'var(--font-title)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Passenger View
            </button>
            <button
              onClick={() => {
                setUserRole('admin');
                handleNav('admin');
              }}
              style={{
                flex: 1,
                border: 'none',
                background: userRole === 'admin' ? 'var(--bg-secondary)' : 'transparent',
                color: userRole === 'admin' ? 'var(--danger)' : 'var(--text-secondary)',
                padding: '0.6rem',
                borderRadius: '8px',
                fontFamily: 'var(--font-title)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      )}
      
      {/* Dynamic CSS injection to show/hide menus based on screen width */}
      <style>{`
        @media (max-width: 992px) {
          .desktop-menu-container {
            display: none !important;
          }
          .mobile-menu-trigger {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
