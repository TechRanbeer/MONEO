import React, { useState, useEffect } from 'react';
import { AppView, User } from './types';
import { api } from './services/api';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import TransactionsView from './components/TransactionsView';
import SubscriptionsView from './components/SubscriptionsView';
import HistoryView from './components/HistoryView';
import AICoach from './components/AICoach';
import { dataStore } from './services/dataStore';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await dataStore.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          if (!currentUser.onboarding_completed) {
            setCurrentView(AppView.ONBOARDING);
          } else {
            setCurrentView(AppView.DASHBOARD);
          }
        }
      } catch (err) {
        console.error("Auth check failed", err);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    if (!userData.onboarding_completed) {
      setCurrentView(AppView.ONBOARDING);
    } else {
      setCurrentView(AppView.DASHBOARD);
    }
  };

  const handleLogout = () => {
    dataStore.logout();
    setUser(null);
    setCurrentView(AppView.LANDING);
  };

  if (checkingAuth) {
    return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white">Loading MONEO...</div>;
  }

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-blue-500/30">
      <Navbar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isLoggedIn={!!user}
        onLogout={handleLogout}
      />
      
      <main>
        {currentView === AppView.LANDING && (
          <LandingPage setView={setCurrentView} />
        )}
        
        {(currentView === AppView.LOGIN || currentView === AppView.REGISTER) && (
          <Auth view={currentView} setView={setCurrentView} onLoginSuccess={handleLoginSuccess} />
        )}

        {/* Protected Routes */}
        {user && (
          <>
            {currentView === AppView.ONBOARDING && (
              <Onboarding setView={setCurrentView} />
            )}
            
            {currentView === AppView.DASHBOARD && (
              <Dashboard user={user} setView={setCurrentView} />
            )}

            {currentView === AppView.TRANSACTIONS && (
               <TransactionsView />
            )}

            {currentView === AppView.SUBSCRIPTIONS && (
               <SubscriptionsView />
            )}

            {currentView === AppView.HISTORY && (
               <HistoryView />
            )}

            {currentView === AppView.COACH && (
               <AICoach />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;