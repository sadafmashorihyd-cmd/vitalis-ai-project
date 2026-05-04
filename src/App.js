import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VitalisChat from './VitalisChat'; 
import VitalisSocial from './VitalisSocial';
import Auth from './auth'; 

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('vitalis_v3')) || {
    name: 'User',
    theme: '#06b6d4',
    streak: 5,
    disease: 'None',
    organ: 'None'
  });

  // Health Tips Logic
  const getHealthTips = (disease) => {
    const tips = {
      "None": ["Drink 8 glasses of water", "Walk 30 mins daily", "Sleep 8 hours", "Eat green vegetables", "Avoid excess sugar", "Practice deep breathing", "Keep a positive mindset", "Stretch every morning", "Limit screen time", "Maintain good posture"],
      "Back Pain": ["Avoid sitting for too long", "Use lumbar support", "Do cat-cow stretches", "Avoid heavy lifting", "Keep your back straight", "Use a firm mattress", "Walk slowly and daily", "Apply warm compress", "Check your posture", "Do core exercises"],
      "Migraine": ["Stay in a dark room", "Hydrate immediately", "Avoid loud noises", "Track trigger foods", "Maintain sleep cycle", "Apply cold pack", "Practice meditation", "Limit caffeine", "Avoid strong smells", "Keep a headache diary"],
      "Hypertension": ["Reduce salt intake", "Daily brisk walking", "Manage stress level", "Eat potassium-rich food", "Avoid oily snacks", "Monitor BP daily", "Stay hydrated", "Avoid smoking/alcohol", "Take deep breaths", "Maintain healthy weight"]
    };
    return tips[disease] || ["Consult a specialist", "Take prescribed meds", "Stay hydrated", "Monitor symptoms daily", "Avoid stress", "Eat light meals", "Rest properly", "Avoid triggers", "Keep a health journal", "Follow doctor's advice"];
  };

  const handleLoginSuccess = (data) => {
    // Agar data object hai toh pura set karein, warna sirf naam
    if (typeof data === 'object') {
      setUserData({ ...userData, ...data });
    } else {
      setUserData({ ...userData, name: data });
    }
    setIsLoggedIn(true);
  };

  useEffect(() => {
    localStorage.setItem('vitalis_v3', JSON.stringify(userData));
  }, [userData]);

  const theme = {
    p: userData.theme || '#06b6d4',
    bg: '#000000',
    border: '1px solid #1a1a1a',
    card: { background: '#0a0a0a', borderRadius: '25px', padding: '25px', border: '1px solid #1a1a1a' }
  };

  if (!isLoggedIn) {
    return <Auth onLogin={handleLoginSuccess} />;
  }

  return (
    <div style={{ background: theme.bg, color: 'white', minHeight: '100vh', paddingBottom: '120px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ padding: '20px', borderBottom: theme.border, display: 'flex', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', zIndex: 1000 }}>
        <div>
          <h1 style={{ color: theme.p, fontSize: '20px', margin: 0, letterSpacing: '2px' }}>VITALIS OS</h1>
          <span style={{ fontSize: '10px', color: '#666' }}>CREATED BY SADAF | SCIENTIST INTERFACE</span>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>🔥 {userData.streak} Days</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '15px', background: theme.p, border: '2px solid #fff' }}></div>
        </div>
      </header>

      <main style={{ padding: '15px' }}>
        <AnimatePresence mode="wait">

          {/* HOME TAB (WELCOME & TIPS) */}
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div style={theme.card}>
                <h2 style={{ marginBottom: '5px' }}>Welcome, <span style={{color: theme.p}}>{userData.name}</span></h2>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Current Target: <b style={{color: '#fff'}}>{userData.disease || "General Health"}</b></p>
                
                <div style={{ background: '#111', padding: '20px', borderRadius: '20px', border: '1px solid #222' }}>
                  <h4 style={{ color: theme.p, marginBottom: '15px', fontSize: '14px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                    DAILY HEALTH PROTOCOLS (10 TIPS)
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {getHealthTips(userData.disease).map((tip, index) => (
                      <li key={index} style={{ marginBottom: '12px', fontSize: '14px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span style={{ color: theme.p }}>🔹</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* SOCIAL & CHAT TAB */}
          {activeTab === 'social' && (
            <motion.div key="social" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ height: '400px', border: theme.border, borderRadius: '20px', overflow: 'hidden', marginBottom: '20px' }}>
                 <VitalisChat />
              </div>
              <VitalisSocial />
            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={theme.card}>
                <h2>Profile Settings</h2>
                <div style={{ marginBottom: '20px' }}>
                  <p><b>Name:</b> {userData.name}</p>
                  <p><b>Organ:</b> {userData.organ}</p>
                </div>
                <button onClick={() => setIsLoggedIn(false)} style={{ background: '#ff4444', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Logout Profile
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* NAV BAR */}
      <nav style={{ position: 'fixed', bottom: '25px', left: '50%', transform: 'translateX(-50%)', width: '85%', background: 'rgba(15,15,15,0.9)', backdropFilter: 'blur(20px)', borderRadius: '35px', display: 'flex', justifyContent: 'space-around', padding: '20px', border: '1px solid #222' }}>
        <div style={{ cursor: 'pointer', fontSize: '24px' }} onClick={() => setActiveTab('home')}>🏠</div>
        <div style={{ cursor: 'pointer', fontSize: '24px' }} onClick={() => setActiveTab('social')}>🌎</div>
        <div style={{ cursor: 'pointer', fontSize: '24px' }} onClick={() => setActiveTab('settings')}>⚙️</div>
      </nav>
    </div>
  );
}

export default App;