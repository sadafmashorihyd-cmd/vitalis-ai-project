import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 1. Data Load karna (Browser memory se)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('vitalis_user');
    return savedUser ? JSON.parse(savedUser) : { name: "", goal: "Biological Immortality" };
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [suffering, setSuffering] = useState(() => {
    const savedSu = localStorage.getItem('suffering_level');
    return savedSu ? Number(savedSu) : 0;
  });

  const [status, setStatus] = useState("System Balanced");

  // 2. Data Save karna (Jab bhi level ya naam badle)
  useEffect(() => {
    localStorage.setItem('vitalis_user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('suffering_level', suffering);
  }, [user, isLoggedIn, suffering]);

  const handleResync = () => {
    setSuffering(0);
    alert("Neural Link Re-Synced! Data Updated for Scientist " + user.name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear(); // Sab clear karne ke liye
    window.location.reload();
  };

  if (!isLoggedIn) {
    return (
      <div className="App login-screen">
        <div className="login-card">
          <h1 className="neon-title">VITALIS AI</h1>
          <p>Researcher Identification Required</p>
          <input 
            type="text" 
            placeholder="Enter Your Name" 
            value={user.name}
            onChange={(e) => setUser({...user, name: e.target.value})} 
            className="neon-input"
          />
          <button className="neon-button" onClick={() => setIsLoggedIn(true)}>
            ACCESS SYSTEM
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`App ${suffering > 80 ? 'emergency' : ''}`}>
      <header className="App-header">
        <div className="top-nav">
           <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
        </div>
        <h1 className="neon-title">VITALIS AI</h1>
        <p className="welcome-text">Welcome, Scientist {user.name}</p>
        
        <div className="dashboard-card">
          <h3>Status: <span className="active">Neural Link Active</span></h3>
          <div className="suffering-box">
            <p>$S^u$ Level: <span className="su-value">{suffering}</span></p>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={suffering} 
              onChange={(e) => setSuffering(Number(e.target.value))} 
              className="neon-slider" 
            />
          </div>
          <p className="feedback-text">{suffering > 80 ? "WARNING: Neural Strain!" : status}</p>
          <div className="immortality-meter">
             <p>{user.goal} Progress: {100 - suffering}%</p>
             <div className="progress-bar-bg">
               <div className="progress-bar-fill" style={{width: `${100 - suffering}%`}}></div>
             </div>
          </div>
        </div>
        
        <button className="neon-button" onClick={handleResync}>
          RE-SYNC DATA
        </button>
      </header>
    </div>
  );
}

export default App;