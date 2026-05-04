import React, { useState } from 'react';
import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function Auth({ onLogin }) {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [bio, setBio] = useState(""); // Insta Bio ke liye
    const [avatar, setAvatar] = useState(""); // Profile Picture link
    const [selectedOrgan, setSelectedOrgan] = useState("None");
    const [selectedDisease, setSelectedDisease] = useState("None");
    const [agreed, setAgreed] = useState(false); // Terms & Policy check

    const healthData = {
        "None": ["None"],
        "Brain": ["Anxiety", "Migraine", "Insomnia", "Memory Loss"],
        "Heart": ["Hypertension", "Palpitations", "High Cholesterol"],
        "Lungs": ["Asthma", "Shortness of Breath", "Chronic Cough"],
        "Stomach": ["Acidity", "Gastric Pain", "Indigestion"],
        "Bones": ["Back Pain", "Joint Pain", "Arthritis"]
    };

    const handleSubmit = async () => {
        // Validation for Sign Up
        if (!isLoginMode) {
            if (!name || !age || !bio) { alert("Please fill all profile fields!"); return; }
            if (!agreed) { alert("Please agree to the Terms & Privacy Policy."); return; }
        }

        try {
            if (isLoginMode) {
                const res = await signInWithEmailAndPassword(auth, email, password);
                const userDoc = await getDoc(doc(db, "users", res.user.uid));
                onLogin(userDoc.data());
            } else {
                const res = await createUserWithEmailAndPassword(auth, email, password);
                const userData = {
                    uid: res.user.uid,
                    name: name,
                    email: email,
                    age: age,
                    bio: bio,
                    avatar: avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                    organ: selectedOrgan,
                    disease: selectedDisease,
                    role: "Researcher",
                    joinedAt: new Date().toISOString()
                };
                await setDoc(doc(db, "users", res.user.uid), userData);
                onLogin(userData);
            }
        } catch (err) { alert(err.message); }
    };

    return (
        <div style={{ padding: '30px', background: '#000', minHeight: '100vh', color: 'white', textAlign: 'center' }}>
            <h2 style={{ color: '#06b6d4', letterSpacing: '2px' }}>{isLoginMode ? "VITALIS LOGIN" : "CREATE SCIENTIST PROFILE"}</h2>
            <p style={{fontSize: '11px', color: '#444', marginBottom: '20px'}}>Created by Sadaf | Vitalis AI System</p>
            
            <div style={{ maxWidth: '350px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {!isLoginMode && (
                    <>
                        <input placeholder="Full Name *" onChange={(e) => setName(e.target.value)} style={inputStyle} />
                        <input placeholder="Age *" type="number" onChange={(e) => setAge(e.target.value)} style={inputStyle} />
                        <textarea placeholder="Scientific Bio (e.g. Psychology Enthusiast) *" onChange={(e) => setBio(e.target.value)} style={{...inputStyle, height: '60px', resize: 'none'}} />
                        <input placeholder="Profile Image URL (Optional)" onChange={(e) => setAvatar(e.target.value)} style={inputStyle} />
                        
                        <div style={{textAlign: 'left', fontSize: '12px', color: '#666', marginTop: '10px'}}>Focus Area & Health Status:</div>
                        <select onChange={(e) => {setSelectedOrgan(e.target.value); setSelectedDisease("None");}} style={inputStyle}>
                            <option value="None">Select Target Organ</option>
                            {Object.keys(healthData).map(organ => <option key={organ} value={organ}>{organ}</option>)}
                        </select>

                        <select onChange={(e) => setSelectedDisease(e.target.value)} style={inputStyle}>
                            <option value="None">Select Medical Condition</option>
                            {healthData[selectedOrgan].map(d => <option key={d} value={d}>{d}</option>)}
                        </select>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                            <label style={{ fontSize: '10px', color: '#888', textAlign: 'left' }}>
                                I agree to the Vitalis Terms of Research and Privacy Policy.
                            </label>
                        </div>
                    </>
                )}
                
                <input placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                <input type="password" placeholder="Secure Access Key" onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

                <button onClick={handleSubmit} style={btnStyle}>
                    {isLoginMode ? "ACCESS INTERFACE" : "INITIALIZE ACCOUNT"}
                </button>
                
                <p style={{ cursor: 'pointer', color: '#666', fontSize: '12px' }} onClick={() => setIsLoginMode(!isLoginMode)}>
                    {isLoginMode ? "Don't have a profile? Register here" : "Already a member? Secure Login"}
                </p>
            </div>
        </div>
    );
}

const inputStyle = { background: '#0a0a0a', border: '1px solid #222', padding: '12px', borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none' };
const btnStyle = { background: '#06b6d4', color: 'white', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };

export default Auth;