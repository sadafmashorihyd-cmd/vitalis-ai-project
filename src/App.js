import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

function App() {
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

  useEffect(() => {
    localStorage.setItem('vitalis_user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('suffering_level', suffering);
    localStorage.setItem('su_history', JSON.stringify(history));
  }, [user, isLoggedIn, suffering, history]);

  // AI Analyst Logic
  const getAIInsight = () => {
    if (suffering > 85) return "⚠️ CRITICAL: Neural Strain detected. Break required for Biological Immortality.";
    if (suffering > 60) return "⚡ ALERT: High activity. Monitoring Consciousness fluctuations.";
    if (suffering > 30) return "🧠 OPTIMAL: Peak state for Dark Matter & Energy calculations.";
    return "🧘 DEEP CALM: Neural Link stable. Consciousness expanded.";
  };

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
          <input type="text" placeholder="Scientist Name" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} className="neon-input" />
          <button className="neon-button" onClick={() => setIsLoggedIn(true)}>ACCESS SYSTEM</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`App ${suffering > 85 ? 'emergency' : ''}`}>
      <header className="App-header">
        <div className="top-nav">
          <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
        </div>
        
        <h1 className="neon-title">VITALIS AI</h1>
        <p className="welcome-text">Researcher: {user.name}</p>

        {/* AI INSIGHT SECTION */}
        <div className="ai-insight-card">
          <p className="ai-tagline">NEURAL ANALYST ACTIVE</p>
          <p className="ai-insight-text">{getAIInsight()}</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>$S^u$ Monitor</h3>
            <p className="su-value">{suffering}</p>
            <input type="range" min="0" max="100" value={suffering} onChange={(e) => setSuffering(Number(e.target.value))} className="neon-slider" />
            <button className="neon-button capture-btn" onClick={handleCapture}>CAPTURE DATA</button>
          </div>

          <div className="dashboard-card graph-card">
            <h3>Neural Trend</h3>
            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" hide />
                  <YAxis stroke="#00ffcc" fontSize={12} />
                  <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #00ffcc', borderRadius: '10px'}} />
                  <Line type="monotone" dataKey="level" stroke="#ff00ff" strokeWidth={4} dot={{ r: 5, fill: '#ff00ff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="goal-progress">Immortality Progress: {100 - suffering}%</p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;