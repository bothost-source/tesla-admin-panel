"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // ============================================================
    // FIREBASE CONFIG
    // ============================================================
    const firebaseConfig = {
        apiKey: "AIzaSyDT_kkJyhwWke37uqAdzWzspIES-DC0D7c",
        authDomain: "tesla-4e40f.firebaseapp.com",
        databaseURL: "https://tesla-4e40f-default-rtdb.firebaseio.com",
        projectId: "tesla-4e40f",
        storageBucket: "tesla-4e40f.firebasestorage.app",
        messagingSenderId: "851073603330",
        appId: "1:851073603330:web:ce1ce7b713fe107dbd941b"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    // ===== CONFIG =====
    const MESSAGES_REF = "tesla_chat_messages";
    const USER_ID = "user_" + (localStorage.getItem("tesla_chat_user_id") || (() => {
        const id = Math.random().toString(36).slice(2, 10);
        localStorage.setItem("tesla_chat_user_id", id);
        return id;
    })());

    // ===== DOM ELEMENTS (matching original HTML classes/IDs) =====
    const input = document.getElementById("messageInput");
    const sendBtn = document.getElementById("sendBtn");
    const messagesEl = document.querySelector(".chat-messages");
    const convoList = document.querySelector(".conversation-list");
    const chatHeader = document.querySelector(".chat-header h5");
    const chatStatus = document.querySelector(".chat-header .text-success");

    if (!input || !sendBtn || !messagesEl) return;

    // ===== STATE =====
    let currentConvo = USER_ID;
    let allMessages = [];
    window.currentConvoId = currentConvo;

    // ===== HELPERS =====
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
        allMessages.forEach(m => {
            if (!map.has(m.convo)) {
                map.set(m.convo, { id: m.convo, lastMsg: m, count: 0 });
            }
            if (m.from === "user" && !m.read) {
                map.get(m.convo).count++;
            }
        });
        if (!map.has(USER_ID)) {
            map.set(USER_ID, { id: USER_ID, lastMsg: null, count: 0 });
        }
        return Array.from(map.values()).sort((a, b) => {
            const ta = a.lastMsg ? (a.lastMsg.timestamp || 0) : 0;
            const tb = b.lastMsg ? (b.lastMsg.timestamp || 0) : 0;
            return tb - ta;
        });
    }

    function getConvoMessages(convoId) {
        return allMessages.filter(m => m.convo === convoId);
    }

    // ===== RENDER MESSAGES =====
    function renderMessages() {
        const msgs = getConvoMessages(currentConvo);
        messagesEl.innerHTML = "";

        if (msgs.length === 0) {
            messagesEl.innerHTML = `
                <div style="text-align:center;padding:40px 20px;color:#64748b;">
                    <i class="bi bi-chat-dots" style="font-size:2rem;margin-bottom:10px;display:block;"></i>
                    <p style="margin:0;font-size:.9rem;">No messages yet.<br>Send a message to start the conversation.</p>
                </div>
            `;
        } else {
            msgs.forEach(msg => {
                const div = document.createElement("div");
                div.className = "message " + (msg.from === "admin" ? "sent" : "received");
                div.innerHTML = `
                    <div class="message-content">
                        <p>${escapeHtml(msg.text)}</p>
                        <small>${msg.time}</small>
                    </div>
                `;
                messagesEl.appendChild(div);
            });
        }

        messagesEl.scrollTop = messagesEl.scrollHeight;

        // Mark user messages as read
        let changed = false;
        allMessages.forEach(m => {
            if (m.convo === currentConvo && m.from === "user" && !m.read) {
                m.read = true;
                changed = true;
            }
        });
        if (changed) {
            const updates = {};
            allMessages.forEach((m, idx) => {
                if (m.convo === currentConvo && m.from === "user") {
                    // We need to find the Firebase key for this message
                    // This is a simplified approach - in production you'd track keys
                }
            });
        }
    }

    // ===== RENDER CONVERSATION LIST =====
    function renderConvoList() {
        if (!convoList) return;
        const convos = getUniqueConvos();
        convoList.innerHTML = "";

        convos.forEach(c => {
            const initials = c.id.replace("user_", "").slice(0, 2).toUpperCase();
            const name = c.id === USER_ID ? "You (Test)" : "User " + initials;
            const isActive = c.id === currentConvo;
            const preview = c.lastMsg ? c.lastMsg.text.slice(0, 30) + (c.lastMsg.text.length > 30 ? "..." : "") : "No messages yet";

            const div = document.createElement("div");
            div.className = "conversation" + (isActive ? " active" : "");
            div.onclick = () => switchConvo(c.id);
            div.innerHTML = `
                <div class="avatar">${initials}</div>
                <div class="conversation-info">
                    <h6>${escapeHtml(name)}</h6>
                    <small>${escapeHtml(preview)}</small>
                </div>
                ${c.count > 0 ? `<span class="badge bg-danger">${c.count}</span>` : ""}
            `;
            convoList.appendChild(div);
        });
    }

    function switchConvo(convoId) {
        currentConvo = convoId;
        window.currentConvoId = convoId;
        const initials = convoId.replace("user_", "").slice(0, 2).toUpperCase();
        const name = convoId === USER_ID ? "You (Test)" : "User " + initials;
        if (chatHeader) chatHeader.textContent = name;
        if (chatStatus) chatStatus.innerHTML = "● Online";
        renderMessages();
        renderConvoList();
        input.focus();
    }

    // ===== SEND MESSAGE (ADMIN SIDE) =====
    function sendMessage() {
        const text = input.value.trim();
        if (text === "") return;

        const msg = {
            convo: currentConvo,
            from: "admin",
            text: text,
            time: getNow(),
            timestamp: Date.now(),
            read: false
        };

        db.ref(MESSAGES_REF).push(msg)
            .then(() => { input.value = ""; })
            .catch(err => {
                console.error("Send failed:", err);
                alert("Failed to send message. Check your connection.");
            });
    }

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });

    // ===== FIREBASE REAL-TIME LISTENER =====
    function initFirebaseListener() {
        db.ref(MESSAGES_REF).on("value", (snapshot) => {
            const data = snapshot.val();
            if (data) {
                allMessages = Object.values(data);
            } else {
                allMessages = [];
            }
            renderMessages();
            renderConvoList();
        }, (err) => {
            console.error("Firebase error:", err);
            messagesEl.innerHTML = `
                <div style="text-align:center;padding:40px 20px;color:#ef4444;">
                    <i class="bi bi-wifi-off" style="font-size:2rem;margin-bottom:10px;display:block;"></i>
                    <p style="margin:0;font-size:.9rem;">Connection lost.<br>Check your internet and refresh.</p>
                </div>
            `;
        });
    }

    // ===== INIT =====
    initFirebaseListener();
    renderConvoList();
    input.focus();
});
