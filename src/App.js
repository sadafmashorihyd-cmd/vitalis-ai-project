import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

function App() {
  // 1. Data Load karna
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('vitalis_user');
    return savedUser ? JSON.parse(savedUser) : { name: "", goal: "Biological Immortality" };
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [suffering, setSuffering] = useState(() => Number(localStorage.getItem('suffering_level')) || 0);
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('su_history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [status, setStatus] = useState("System Balanced");

  // 2. Data Save karna
  useEffect(() => {
    localStorage.setItem('vitalis_user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('suffering_level', suffering);
    localStorage.setItem('su_history', JSON.stringify(history));
  }, [user, isLoggedIn, suffering, history]);

  // 3. Actions
  const handleCapture = () => {
    const newEntry = { time: new Date().toLocaleTimeString(), level: suffering };
    setHistory([...history.slice(-9), newEntry]); 
    alert("Data Point Captured for Scientist " + user.name);
  };

  const handleLogout = () => {
    localStorage.clear();
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
        
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>$S^u$ Monitor</h3>
            <p className="su-value">{suffering}</p>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={suffering} 
              onChange={(e) => setSuffering(Number(e.target.value))} 
              className="neon-slider" 
            />
            <p className="feedback-text">{suffering > 80 ? "WARNING: Neural Strain!" : status}</p>
            <button className="neon-button small" onClick={handleCapture}>CAPTURE DATA</button>
          </div>

          <div className="dashboard-card graph-card">
            <h3>Neural Suffering Trend</h3>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="time" hide />
                  <YAxis stroke="#00ffcc" />
                  <Tooltip contentStyle={{backgroundColor: '#111', border: '1px solid #00ffcc'}} />
                  <Line type="monotone" dataKey="level" stroke="#ff00ff" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="goal-text">{user.goal} Progress: {100 - suffering}%</p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
// ... baqi imports wahi rahenge, bas App function ke andar ye tabdeeli karein ...

function App() {
  // ... purana state wahi rahega ...
  const [suffering, setSuffering] = useState(() => Number(localStorage.getItem('suffering_level')) || 0);
  
  // --- NAYA AI LOGIC ---
  const getAIInsight = () => {
    if (suffering > 80) return "⚠️ HIGH NEURAL STRAIN: Critical levels detected. Suggesting immediate rest for Biological Immortality.";
    if (suffering > 50) return "⚡ MODERATE ACTIVITY: Brain is active. Good time for Psychology research.";
    if (suffering > 20) return "🧠 OPTIMAL FOCUS: Perfect state for Dark Matter & Dark Energy calculations.";
    return "🧘 DEEP CALM: Consciousness is expanded. Neural Link is stable.";
  };

  // ... handleCapture aur handleLogout wahi rahenge ...

  return (
    <div className={`App ${suffering > 80 ? 'emergency' : ''}`}>
      <header className="App-header">
        <div className="top-nav">
           <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
        </div>
        <h1 className="neon-title">VITALIS AI</h1>
        
        {/* NAYA AI INSIGHT BOX */}
        <div className="ai-insight-box">
          <p className="ai-label">NEURAL ANALYST (AI):</p>
          <p className="ai-message">{getAIInsight()}</p>
        </div>

        <div className="dashboard-grid">
          {/* Dashboard Control Box */}
          <div className="dashboard-card">
            <h3>$S^u$ Monitor</h3>
            <p className="su-value">{suffering}</p>
            <input type="range" min="0" max="100" value={suffering} onChange={(e) => setSuffering(Number(e.target.value))} className="neon-slider" />
            <button className="neon-button small" onClick={handleCapture}>CAPTURE DATA</button>
          </div>

          {/* Neural Graph Box */}
          <div className="dashboard-card graph-card">
            <h3>Neural Suffering Trend</h3>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="time" hide />
                  <YAxis stroke="#00ffcc" />
                  <Tooltip contentStyle={{backgroundColor: '#111', border: '1px solid #00ffcc'}} />
                  <Line type="monotone" dataKey="level" stroke="#ff00ff" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="goal-text">Biological Immortality Progress: {100 - suffering}%</p>
          </div>
        </div>
      </header>
    </div>
  );
}