import { useState, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SupportChat from './components/SupportChat';
import NotificationCenter from './components/NotificationCenter';
import { useApp } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import SkeletonLoader from './components/SkeletonLoader';

// Lazy load components mapping to CO5: SPA routing & Rendering boundaries
const Home = lazy(() => import('./pages/Home'));
const EligibilityChecker = lazy(() => import('./pages/EligibilityChecker'));
const CompensationCalculator = lazy(() => import('./pages/CompensationCalculator'));
const SubmitClaim = lazy(() => import('./pages/SubmitClaim'));
const TrackClaim = lazy(() => import('./pages/TrackClaim'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const Airlines = lazy(() => import('./pages/Airlines'));
const FAQ = lazy(() => import('./pages/FAQ'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));



function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userRole, setUserRole] = useState('passenger'); // 'passenger' | 'admin'

  const {
    toasts,
    setToasts,
    theme,
    currentUser,
    toggleTheme
  } = useApp();

  // Handle Page navigation
  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render proper page component
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home navigate={navigate} />;
      case 'checker':
        return <EligibilityChecker navigate={navigate} />;
      case 'calculator':
        return <CompensationCalculator navigate={navigate} />;
      case 'submit':
        return <SubmitClaim navigate={navigate} />;
      case 'track':
        return <TrackClaim />;
      case 'airlines':
        return <Airlines />;
      case 'faq':
        return <FAQ />;
      case 'contact':
        return <ContactUs />;
      case 'dashboard':
        return <UserDashboard navigate={navigate} />;
      case 'admin':
        // Protected Route mapping to CO5: Protected Routes
        if (userRole !== 'admin') {
          return (
            <div className="glass-card animate-fade-in text-center" style={{ maxWidth: '500px', margin: '4rem auto', padding: '3.5rem 2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--danger)', marginBottom: '1rem' }}>
                Access Denied
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                You must toggle your role to **Admin** in the navigation header to view this page.
              </p>
              <button className="btn btn-primary" onClick={() => navigate('home')}>
                Return to Home
              </button>
            </div>
          );
        }
        return <AdminDashboard />;
      default:
        return <Home navigate={navigate} />;
    }
  };

  return (
    <div className="app-container">
      <Navbar 
        currentPage={currentPage} 
        navigate={navigate} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        userRole={userRole} 
        setUserRole={setUserRole} 
        currentUser={currentUser}
      />
      
      <main className="main-content">
        <ErrorBoundary>
          <Suspense fallback={<div style={{ padding: '4rem 0' }}><SkeletonLoader type="card" /></div>}>
            {renderPage()}
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer navigate={navigate} />
      
      <SupportChat />
      <NotificationCenter toasts={toasts} setToasts={setToasts} />
    </div>
  );
}

export default App;
