import React, { useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState({ name: "", goal: "Biological Immortality" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [status, setStatus] = useState("System Ready");
  const [suffering, setSuffering] = useState(0);

  if (!isLoggedIn) {
    return (
      <div className="App login-screen">
        <div className="login-card">
          <h1 className="neon-title">VITALIS AI</h1>
          <p>Researcher Identification Required</p>
          <input 
            type="text" 
            placeholder="Enter Your Name" 
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
        <h1 className="neon-title">VITALIS AI</h1>
        <p className="welcome-text">Welcome, Scientist {user.name}</p>
        
        <div className="dashboard-card">
          <h3>Status: <span className="active">Neural Link Active</span></h3>
          <div className="suffering-box">
            <p>$S^u$ Level: <span className="su-value">{suffering}</span></p>
            <input type="range" min="0" max="100" value={suffering} onChange={(e) => setSuffering(Number(e.target.value))} className="neon-slider" />
          </div>
          <p className="feedback-text">{suffering > 80 ? "WARNING: Neural Strain!" : "System Balanced"}</p>
          <div className="immortality-meter">
             <p>{user.goal} Progress: {100 - suffering}%</p>
             <div className="progress-bar-bg"><div className="progress-bar-fill" style={{width: `${100 - suffering}%`}}></div></div>
          </div>
        </div>
        <button className="neon-button" onClick={() => setStatus("Re-Syncing...")}>RE-SYNC DATA</button>
      </header>
    </div>
  );
}

export default App;