document.addEventListener('DOMContentLoaded', () => {
    const startChatBtn = document.getElementById('start-chat-btn');
    const chatContainer = document.getElementById('chat-container');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.getElementById('typing-indicator');
    const topicButtons = document.querySelectorAll('.topic-btn');
    const sendSound = document.getElementById('send-sound');
    const receiveSound = document.getElementById('receive-sound');

    // Particle background
    const particleContainer = document.getElementById('particle-container');
    for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        p.style.animationDelay = `${Math.random() * 20}s`;
        p.style.animationDuration = `${10 + Math.random() * 10}s`;
        p.style.width = `${2 + Math.random() * 4}px`;
        p.style.height = p.style.width;
        particleContainer.appendChild(p);
    }

    startChatBtn.onclick = () => chatContainer.classList.remove('hidden');
    chatContainer.onclick = e => { if (e.target === chatContainer) chatContainer.classList.add('hidden'); };

    sendBtn.onclick = sendMessage;
    userInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

    topicButtons.forEach(btn => {
        btn.onclick = () => {
            if (chatContainer.classList.contains('hidden')) chatContainer.classList.remove('hidden');
            userInput.value = btn.textContent;
            sendMessage();
        };
    });

    function sendMessage() {
        const msg = userInput.value.trim();
        if (!msg) return;
        addMessage(msg, 'user');
        userInput.value = '';
        sendSound.play();

        typingIndicator.style.display = 'block';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        const apiKey = 'AIzaSyA8YuKcyGsbaoqFvKfM7YYVSCpvzqEXBPY';
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `You are a Minecraft server expert. ${msg}` }] }]
            })
        })
        .then(r => r.json())
        .then(d => {
            const reply = d?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response.";
            typingIndicator.style.display = 'none';
            addMessage(reply, 'ai');
            receiveSound.play();
        })
        .catch(() => {
            typingIndicator.style.display = 'none';
            addMessage("Error connecting to API.", 'ai');
        });
    }

    function addMessage(text, sender) {
        const msgEl = document.createElement('div');
        msgEl.classList.add('message', sender);
        const content = document.createElement('div');
        content.classList.add('content');
        content.textContent = text;
        msgEl.appendChild(content);
        chatMessages.appendChild(msgEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
