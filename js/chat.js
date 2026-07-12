"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // Firebase Config
    const firebaseConfig = {
        apiKey: "AIzaSyDT_kkJyhwWke37uqAdzWzspIES-DC0D7c",
        authDomain: "tesla-4e40f.firebaseapp.com",
        databaseURL: "https://tesla-4e40f-default-rtdb.firebaseio.com",
        projectId: "tesla-4e40f",
        storageBucket: "tesla-4e40f.firebasestorage.app",
        messagingSenderId: "851073603330",
        appId: "1:851073603330:web:ce1ce7b713fe107dbd941b"
    };

    try {
        firebase.initializeApp(firebaseConfig);
    } catch (e) {
        console.log("Firebase already initialized");
    }
    const db = firebase.database();

    const MESSAGES_REF = "tesla_chat_messages";
    const USER_ID = "user_" + (localStorage.getItem("tesla_chat_user_id") || (() => {
        const id = Math.random().toString(36).slice(2, 10);
        localStorage.setItem("tesla_chat_user_id", id);
        return id;
    })());

    // State
    let allMessages = [];
    let messageKeys = {};
    let currentConvo = null;
    window.currentConvoId = null;

    // DOM refs
    const chatListItems = document.getElementById("chatListItems");
    const chatListScreen = document.getElementById("chatListScreen");
    const chatScreen = document.getElementById("chatScreen");
    const chatScreenMessages = document.getElementById("chatScreenMessages");
    const chatScreenName = document.getElementById("chatScreenName");
    const chatScreenAvatar = document.getElementById("chatScreenAvatar");
    const chatScreenInput = document.getElementById("chatScreenInput");

    function getNow() {
        return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    function getUniqueConvos() {
        const map = new Map();
        allMessages.forEach((m, idx) => {
            if (!map.has(m.convo)) {
                map.set(m.convo, { id: m.convo, lastMsg: m, count: 0 });
            }
            if (m.from === "user" && !m.read) {
                map.get(m.convo).count++;
            }
        });
        return Array.from(map.values()).sort((a, b) => {
            const ta = a.lastMsg ? (a.lastMsg.timestamp || 0) : 0;
            const tb = b.lastMsg ? (b.lastMsg.timestamp || 0) : 0;
            return tb - ta;
        });
    }

    function getConvoMessages(convoId) {
        return allMessages.filter(m => m.convo === convoId);
    }

    // ===== SCREEN 1: Render Conversation List =====
    function renderChatList() {
        if (!chatListItems) return;
        const convos = getUniqueConvos();
        const searchTerm = document.getElementById("convoSearch")?.value.toLowerCase() || "";

        if (convos.length === 0) {
            chatListItems.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-inbox"></i>
                    <p>No messages yet.<br>Users will appear here when they message.</p>
                </div>
            `;
            return;
        }

        chatListItems.innerHTML = "";
        convos.forEach(c => {
            const initials = c.id.replace("user_", "").slice(0, 2).toUpperCase();
            const name = c.id === USER_ID ? "You (Test)" : "User " + initials;

            if (searchTerm && !name.toLowerCase().includes(searchTerm)) return;

            const preview = c.lastMsg ? c.lastMsg.text.slice(0, 35) + (c.lastMsg.text.length > 35 ? "..." : "") : "No messages";
            const time = c.lastMsg ? c.lastMsg.time : "";
            const isUnread = c.count > 0;

            const div = document.createElement("div");
            div.className = "chat-item" + (isUnread ? " unread" : "");
            div.onclick = () => openChatScreen(c.id);
            div.innerHTML = `
                <div class="chat-item-avatar">${initials}</div>
                <div class="chat-item-info">
                    <h6>${escapeHtml(name)} ${isUnread ? '<span style="color:var(--tesla-red);font-size:.6rem;">●</span>' : ''}</h6>
                    <p>${escapeHtml(preview)}</p>
                </div>
                <div style="text-align:right;flex-shrink:0;">
                    <div class="chat-item-time">${time}</div>
                    ${c.count > 0 ? `<div class="chat-item-badge">${c.count}</div>` : ""}
                </div>
            `;
            chatListItems.appendChild(div);
        });
    }

    window.filterConversations = function() {
        renderChatList();
    };

    // ===== SCREEN 2: Open Individual Chat =====
    window.openChatScreen = function(convoId) {
        currentConvo = convoId;
        window.currentConvoId = convoId;

        const initials = convoId.replace("user_", "").slice(0, 2).toUpperCase();
        const name = convoId === USER_ID ? "You (Test)" : "User " + initials;

        if (chatScreenName) chatScreenName.textContent = name;
        if (chatScreenAvatar) chatScreenAvatar.textContent = initials;

        // Show chat screen
        if (chatScreen) chatScreen.classList.add("active");
        if (chatListScreen) chatListScreen.style.display = "none";

        renderChatScreenMessages();
        markConvoAsRead(convoId);

        // Focus input
        setTimeout(() => {
            if (chatScreenInput) chatScreenInput.focus();
        }, 300);
    };

    window.closeChatScreen = function() {
        if (chatScreen) chatScreen.classList.remove("active");
        if (chatListScreen) chatListScreen.style.display = "flex";
        currentConvo = null;
        window.currentConvoId = null;
    };

    function renderChatScreenMessages() {
        if (!chatScreenMessages || !currentConvo) return;
        const msgs = getConvoMessages(currentConvo);
        chatScreenMessages.innerHTML = "";

        if (msgs.length === 0) {
            chatScreenMessages.innerHTML = `
                <div style="text-align:center;padding:40px 20px;color:#64748b;">
                    <i class="bi bi-chat-dots" style="font-size:2rem;display:block;margin-bottom:10px;"></i>
                    <p style="margin:0;font-size:.9rem;">No messages yet.<br>Type below to start chatting.</p>
                </div>
            `;
        } else {
            msgs.forEach(msg => {
                const div = document.createElement("div");
                div.className = "msg-row " + (msg.from === "admin" ? "sent" : "received");
                div.innerHTML = `
                    <div class="msg-bubble">
                        ${escapeHtml(msg.text).replace(/\n/g, "<br>")}
                        <span class="msg-time">${msg.time}</span>
                    </div>
                `;
                chatScreenMessages.appendChild(div);
            });
        }
        chatScreenMessages.scrollTop = chatScreenMessages.scrollHeight;
    }

    function markConvoAsRead(convoId) {
        db.ref(MESSAGES_REF).once("value", (snap) => {
            const data = snap.val();
            if (!data) return;
            const updates = {};
            Object.entries(data).forEach(([key, msg]) => {
                if (msg.convo === convoId && msg.from === "user" && !msg.read) {
                    updates[`${MESSAGES_REF}/${key}/read`] = true;
                }
            });
            if (Object.keys(updates).length > 0) {
                db.ref().update(updates).catch(() => {});
            }
        });
    }

    // ===== SEND MESSAGE =====
    window.sendChatScreenMessage = function() {
        if (!chatScreenInput || !currentConvo) return;
        const text = chatScreenInput.value.trim();
        if (!text) return;

        const msg = {
            convo: currentConvo,
            from: "admin",
            text: text,
            time: getNow(),
            timestamp: Date.now(),
            read: false
        };

        db.ref(MESSAGES_REF).push(msg)
            .then(() => { chatScreenInput.value = ""; })
            .catch(err => {
                console.error("Send failed:", err);
                alert("Failed to send. Check connection.");
            });
    };

    // ===== CLEAR FUNCTIONS =====
    window.clearCurrentChat = function() {
        if (!confirm("Clear this conversation?")) return;
        if (!currentConvo) return;
        db.ref(MESSAGES_REF).once("value", (snap) => {
            const data = snap.val();
            if (!data) return;
            const updates = {};
            Object.entries(data).forEach(([key, msg]) => {
                if (msg.convo === currentConvo) {
                    updates[`${MESSAGES_REF}/${key}`] = null;
                }
            });
            db.ref().update(updates).then(() => {
                closeChatScreen();
            });
        });
    };

    window.clearAllChats = function() {
        if (!confirm("Clear ALL conversations?")) return;
        db.ref(MESSAGES_REF).remove();
    };

    // ===== FIREBASE LISTENER =====
    function initFirebase() {
        db.ref(MESSAGES_REF).on("value", (snapshot) => {
            const data = snapshot.val();
            messageKeys = {};
            if (data) {
                allMessages = Object.entries(data).map(([key, val], idx) => {
                    messageKeys[idx] = key;
                    return val;
                });
            } else {
                allMessages = [];
            }
            renderChatList();
            if (currentConvo) {
                renderChatScreenMessages();
            }
        }, (err) => {
            console.error("Firebase error:", err);
            if (chatListItems) {
                chatListItems.innerHTML = `
                    <div class="empty-state">
                        <i class="bi bi-wifi-off" style="color:#ef4444;"></i>
                        <p>Connection lost.<br>Check your internet and refresh.</p>
                    </div>
                `;
            }
        });
    }

    initFirebase();
});

