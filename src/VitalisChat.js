import React, { useState, useEffect } from 'react';
import { db, auth } from './firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

function VitalisChat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const q = query(collection(db, "messages"), orderBy("createdAt"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return unsubscribe;
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === "") return;

        await addDoc(collection(db, "messages"), {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: "Scientist_SE" 
        });
        setNewMessage("");
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#000' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{ textAlign: 'right', marginBottom: '10px' }}>
                        <div style={{ background: '#06b6d4', padding: '10px', borderRadius: '15px', display: 'inline-block', maxWidth: '80%' }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} style={{ display: 'flex', padding: '10px', borderTop: '1px solid #222' }}>
                <input 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none' }}
                />
                <button type="submit" style={{ background: '#06b6d4', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '10px' }}>SEND</button>
            </form>
        </div>
    );
}

export default VitalisChat;