import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';

function VitalisSocial() {
    const [view, setView] = useState('reels'); 
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeCommentPost, setActiveCommentPost] = useState(null);
    const [commentText, setCommentText] = useState("");
    const currentUser = "Sadaf"; 

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        onSnapshot(q, (snap) => setPosts(snap.docs.map(d => ({id: d.id, ...d.data()}))));
        onSnapshot(collection(db, "users"), (snap) => setUsers(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    }, []);

    const handleDelete = async (id) => {
        if(window.confirm("Delete this scientific post?")) await deleteDoc(doc(db, "posts", id));
    };

    const handleLike = async (postId, currentLikes) => {
        const safeLikes = Array.isArray(currentLikes) ? currentLikes : [];
        const postRef = doc(db, "posts", postId);
        if (safeLikes.includes(currentUser)) {
            await updateDoc(postRef, { likes: arrayRemove(currentUser) });
        } else {
            await updateDoc(postRef, { likes: arrayUnion(currentUser) });
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        await addDoc(collection(db, "posts"), {
            url: url,
            type: file.type.includes('video') ? 'video' : 'image',
            userName: currentUser,
            likes: [],
            comments: [],
            createdAt: serverTimestamp()
        });
    };

    return (
        <div style={mobileCanvas}>
            {/* 1. TOP NAVIGATION (Stories & Tabs) */}
            <div style={headerContainer}>
                <div style={storyLine}>
                    {users.map(u => (
                        <div key={u.id} style={storyItem} onClick={() => alert(`${u.name}'s research profile`)}>
                            <div style={storyCircle}><img src={u.avatar || 'https://via.placeholder.com/50'} style={storyImg} /></div>
                            <span style={storyName}>{u.name}</span>
                        </div>
                    ))}
                </div>
                <div style={tabSystem}>
                    <span onClick={() => setView('reels')} style={{color: view==='reels'?'#06b6d4':'#555'}}>REELS</span>
                    <span onClick={() => setView('posts')} style={{color: view==='posts'?'#06b6d4':'#555'}}>FEED</span>
                </div>
            </div>

            {/* 2. MAIN CONTENT AREA */}
            <div style={contentFlow}>
                {posts.filter(p => view === 'reels' ? p.type === 'video' : p.type === 'image').map(p => (
                    <div key={p.id} style={view==='reels'?reelCard:feedCard}>
                        {p.type === 'video' ? 
                            <video src={p.url} autoPlay loop style={videoStyle} controls /> : 
                            <img src={p.url} style={feedImgStyle} />
                        }

                        {/* SIDEBAR TOOLS */}
                        <div style={sideTools}>
                            <div onClick={() => handleDelete(p.id)}>🗑️</div>
                            <div onClick={() => handleLike(p.id, p.likes)}>
                                {Array.isArray(p.likes) && p.likes.includes(currentUser) ? '❤️' : '🤍'}
                                <span style={{fontSize:'10px'}}>{p.likes?.length || 0}</span>
                            </div>
                            <div onClick={() => setActiveCommentPost(p.id)}>💬</div>
                        </div>

                        {/* OVERLAY INFO */}
                        <div style={userInfo}>
                            <div style={{fontWeight:'bold'}}>@{p.userName}</div>
                            <div style={{fontSize:'12px'}}>Vitalis Scientist Portal 🧪</div>
                        </div>

                        {/* COMMENT DRAWER */}
                        {activeCommentPost === p.id && (
                            <div style={commentPop}>
                                <div style={{display:'flex', justifyContent:'space-between'}}><b>Comments</b><span onClick={()=>setActiveCommentPost(null)}>✖</span></div>
                                <div style={commentBox}>
                                    {p.comments?.map((c,i) => <div key={i} style={{fontSize:'11px', margin:'5px 0'}}><b>{c.user}:</b> {c.text}</div>)}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 3. FLOATING PLUS BUTTON */}
            <label style={addBtn}>
                + <input type="file" onChange={handleUpload} style={{display:'none'}} accept="image/*,video/*" />
            </label>
        </div>
    );
}

// CSS OBJECTS FOR CLEAN LOOK
const mobileCanvas = { background: '#000', color: '#fff', height: '100vh', width: '100%', overflow: 'hidden', position: 'relative' };
const headerContainer = { position: 'absolute', top: 0, width: '100%', zIndex: 100, background: 'linear-gradient(rgba(0,0,0,0.9), transparent)' };
const storyLine = { display: 'flex', gap: '15px', padding: '15px', overflowX: 'auto' };
const storyItem = { display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' };
const storyCircle = { width: '55px', height: '55px', borderRadius: '50%', border: '2px solid #06b6d4', padding: '2px' };
const storyImg = { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' };
const storyName = { fontSize: '10px', marginTop: '4px' };
const tabSystem = { display: 'flex', justifyContent: 'center', gap: '40px', paddingBottom: '10px', fontSize: '12px', fontWeight: 'bold' };

const contentFlow = { height: '100vh', overflowY: 'scroll', scrollSnapType: 'y mandatory' };
const reelCard = { height: '100vh', scrollSnapAlign: 'start', position: 'relative' };
const feedCard = { padding: '80px 0 20px', scrollSnapAlign: 'start', position: 'relative' };
const videoStyle = { width: '100%', height: '100%', objectFit: 'contain' };
const feedImgStyle = { width: '90%', margin: '0 auto', display: 'block', borderRadius: '10px' };

const sideTools = { position: 'absolute', bottom: '150px', right: '15px', display: 'flex', flexDirection: 'column', gap: '25px', fontSize: '24px', zIndex: 10 };
const userInfo = { position: 'absolute', bottom: '100px', left: '20px', zIndex: 10 };

const commentPop = { position: 'absolute', bottom: 0, width: '100%', height: '40%', background: '#111', borderRadius: '20px 20px 0 0', padding: '20px', zIndex: 200 };
const commentBox = { height: '80%', overflowY: 'auto', marginTop: '10px' };

const addBtn = { position: 'fixed', bottom: '30px', right: '30px', width: '55px', height: '55px', borderRadius: '50%', background: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '35px', cursor: 'pointer', zIndex: 300, boxShadow: '0 0 15px #06b6d4' };

export default VitalisSocial;