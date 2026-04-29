import React, { useState } from 'react';
import LandingScreen from './components/LandingScreen';
import InspireSystem from './components/InspireSystem';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'system'>('landing');

  return (
    <>
      {currentView === 'landing' ? (
        <LandingScreen onNavigate={() => setCurrentView('system')} />
      ) : (
        <InspireSystem />
      )}
    </>
  );
}

export default App;
