import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('vitalis_user');
    return savedUser ? JSON.parse(savedUser) : { name: "", goal: "Biological Immortality" };
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'chat'
  const [suffering, setSuffering] = useState(() => Number(localStorage.getItem('suffering_level')) || 0);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('su_history')) || []);
  
  // Chat States
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Awaiting instructions, Scientist Sadaf. How can I assist with your research today?" }
  ]);

  useEffect(() => {
    localStorage.setItem('vitalis_user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('suffering_level', suffering);
    localStorage.setItem('su_history', JSON.stringify(history));
  }, [user, isLoggedIn, suffering, history]);

  // AI Chat Simulation Logic
  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput("");

    // AI thinking effect
    setTimeout(() => {
      let aiResponse = "Analyzing neural patterns... As a scientist, your focus on " + user.goal + " is fascinating. Please provide more data.";
      
      if(input.toLowerCase().includes("dark matter")) aiResponse = "Dark Matter accounts for 85% of matter in the universe. To understand it, we must look beyond baryonic interactions.";
      if(input.toLowerCase().includes("immortality")) aiResponse = "Biological Immortality requires solving the telomere shortening problem. Your current $S^u$ level is being monitored for this.";
      if(input.toLowerCase().includes("hello")) aiResponse = "Greetings, Scientist Sadaf. System is ready for consciousness mapping.";

      setMessages([...newMessages, { role: 'ai', text: aiResponse }]);
    }, 1000);
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
        <h1 className="neon-title">VITALIS AI</h1>
        
        {/* Navigation Bar */}
        <div className="nav-bar">
          <button className={`nav-btn ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>DASHBOARD</button>
          <button className={`nav-btn ${view === 'chat' ? 'active' : ''}`} onClick={() => setView('chat')}>NEURAL CHAT</button>
          <button className="nav-btn logout" onClick={() => {localStorage.clear(); window.location.reload();}}>LOGOUT</button>
        </div>

        {view === 'dashboard' ? (
          <div className="dashboard-content fade-in">
            <div className="ai-insight-card">
              <p className="ai-tagline">SYSTEM ANALYST</p>
              <p className="ai-insight-text">Welcome back, Scientist {user.name}. Neural Link is Stable.</p>
            </div>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>$S^u$ Monitor</h3>
                <p className="su-value">{suffering}</p>
                <input type="range" min="0" max="100" value={suffering} onChange={(e) => setSuffering(Number(e.target.value))} className="neon-slider" />
                <button className="neon-button small" onClick={() => setHistory([...history.slice(-9), {time: new Date().toLocaleTimeString(), level: suffering}])}>CAPTURE DATA</button>
              </div>
              <div className="dashboard-card graph-card">
                <h3>Neural Trend</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="time" hide />
                    <YAxis stroke="#00ffcc" fontSize={12} />
                    <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #00ffcc'}} />
                    <Line type="monotone" dataKey="level" stroke="#ff00ff" strokeWidth={4} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
                <p className="goal-progress">Progress: {100 - suffering}%</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="chat-content fade-in">
            <div className="chat-window">
              <div className="messages-container">
                {messages.map((m, i) => (
                  <div key={i} className={`message ${m.role}`}>
                    <span className="sender">{m.role === 'ai' ? 'VITALIS' : 'SADAF'}:</span>
                    <p>{m.text}</p>
                  </div>
                ))}
              </div>
              <div className="chat-input-row">
                <input 
                  type="text" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask the Neural Network..." 
                  className="chat-input"
                />
                <button className="send-btn" onClick={handleSendMessage}>SEND</button>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;